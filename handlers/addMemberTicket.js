const { Modal, MessageActionRow, TextInputComponent, MessageEmbed, Permissions } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    try {
      if (interaction.isButton()) {
        if (interaction.customId === 'add_member') {
          const modal = new Modal()
            .setCustomId('add-modal')
            .setTitle('إضافة عضو في التذكرة')
            .addComponents([
              new MessageActionRow().addComponents(
                new TextInputComponent()
                  .setCustomId('add-input1')
                  .setLabel('أدخل الرقم التعريفي لإضافة عضو إلى التذكرة')
                  .setStyle('SHORT')
                  .setMinLength(4)
                  .setMaxLength(30)
                  .setPlaceholder('أدخل رقم العضو هنا')
                  .setRequired(true),
              )
            ]);

          await interaction.showModal(modal);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'add-modal') {
          const memberId = interaction.fields.getTextInputValue('add-input1');
          
          const ticketChannel = interaction.channel;

          // التحقق مما إذا كان العضو موجودًا في القناة
          const memberExists = ticketChannel.members.some(member => member.id === memberId);

          if (memberExists) {
            const embed = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle('> خطأ')
              .addFields(
                 { name: 'هذا العضو موجود بالفعل في التذكرة', value: `**┕\`\`${memberId}\`\`**`, inline: true },
                 { name: 'العضو', value: `**┕<@${memberId}>**`, inline: true }
              );

            interaction.reply({ embeds: [embed], ephemeral: true });
            return;
          }

          // الحصول على معلومات العضو في السيرفر
          const member = await interaction.guild.members.fetch(memberId);
          
          const startTimestamp = Math.floor(Date.now() / 1000) - 87;
          
          const egyptianDate = new Date().toLocaleDateString('en-EG', { timeZone: 'Africa/Cairo' });
          const egyptianTime = new Date().toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo' });
      
          // التحقق من وجود العضو
          if (member) {
            // منح الصلاحيات للعضو
            await ticketChannel.permissionOverwrites.edit(member, { 
              VIEW_CHANNEL: true,
              SEND_MESSAGES: true,
              ADD_REACTIONS: true
            });
            
            const ticketName = ticketChannel.name;
      
            // إنشاء رسالة مضمنة جديدة
            const embed = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle('> تمت إضافة العضو بنجاح إلى التذكرة')
              .addFields(
                  { name: 'العضو المضاف', value: `<@${memberId}>`, inline: true },
                  { name: 'معرف العضو المضاف', value: `\`${memberId}\``, inline: true },
                  { name: 'تمت الإضافة بواسطة', value: `<@${interaction.user.id}>`, inline: true },
                  { name: 'أسم التذكرة', value: `\`\`${ticketName}\`\``, inline: true },
                  { name: 'تاريخ إضافة العضو', value: `\`\`${egyptianTime},${egyptianDate}\`\``, inline: true },
                  { name: 'تم إضافة العضو منذ', value: `<t:${startTimestamp}:R>`, inline: true }
                );
      
            // الرد بالرسالة المضمنة
            interaction.reply({ content: `||<@${memberId}> - <@${interaction.user.id}>||`, embeds: [embed] });

            // إخفاء النموذج
            await interaction.update({
              components: [],
            });
          } else {
            interaction.reply({ content: "الشخص غير موجود", ephemeral: true });
          }
        }
      }
    } catch (error) {
      const memberId = interaction.fields.getTextInputValue('add-input1');
    
      // إنشاء رسالة مضمنة لإرسال رسالة الخطأ
      const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> هناك خطأ في تعريف العضو')
        .addFields(
          { name: 'خطأ في الرقم التعريفي - هذا العضو غير موجود', value: `\`\`\`diff\n- ${memberId}\`\`\``, inline: true }
        );
    
      // الرد بالرسالة المضمنة
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  });
};

