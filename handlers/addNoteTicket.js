{const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isButton()) {
        if (interaction.customId === 'addnote-ticket-button') {
          // التحقق من صلاحية المستخدم
          if (!hasClaimPermission(interaction.member)) {
            await interaction.followUp({ content: 'ليس لديك السلطة لأداء هذا الإجراء' });
            return;
          }

          // عرض نافذة الإدخال
          const modal = new Modal()
            .setCustomId('addnote-ticket-modal')
            .setTitle('إضافة مذكرة')
            .addComponents([
              new MessageActionRow().addComponents(
                new TextInputComponent()
                  .setCustomId('addnote-ticket-input')
                  .setLabel('الرجاء إدخال مذكرتك')
                  .setStyle('PARAGRAPH')
                  .setMinLength(1)
                  .setMaxLength(900)
                  .setPlaceholder('اكتب المذكرة هنا')
                  .setRequired(true),
              ),
            ]);

          await interaction.showModal(modal);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'addnote-ticket-modal') {
          const response = interaction.fields.getTextInputValue('addnote-ticket-input');

          // التحقق من صلاحيات العضو
          if (interaction.member.permissions.has('MANAGE_CHANNELS')) {
            // إنشاء Embed وإضافة المذكرة
            const embed = interaction.message.embeds[0]; // باستخدام Embed الحالي
            const startTimestamp = Math.floor(Date.now() / 1000) - 88;
            embed.addFields({ name: `تم إضافة ملاحظة`, value: `**┕[ <@${interaction.member.id}> ] - [ <t:${startTimestamp}:R> ]┓**\n\`\`\`${response}\`\`\`` });

            await interaction.update({ embeds: [embed] }); // تحديث الرسالة بالـ Embed الجديد فقط
            await interaction.followUp({ content: 'تمت إضافة المذكرة بنجاح', ephemeral: true }); // استخدام followUp بدلاً من reply
          } else {
            await interaction.followUp({ content: "لا أمتلك الصلاحية لإضافة مذكرة!", ephemeral: true }); // استخدام followUp بدلاً من reply
          }
        }
      }
    } catch (error) {
      console.error('حدث خطأ:', error);

      // التحقق مما إذا كانت الاستجابة تمت أو لا
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.', ephemeral: true }); // استخدام followUp بدلاً من reply
      } else {
        await interaction.reply({ content: 'حدث خطأ أثناء معالجة طلبك. ليس لديك السلطة لأداء هذا الإجراء.', ephemeral: true }); // استخدام reply بدلاً من followUp
      }
    }
  });
};


function hasClaimPermission(member) {
  // Implement your logic to check if the member has claim permission
  // For now, it returns true for testing purposes
  return true; 
}
}