const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'remove-mem-button') {
        const modal = new Modal()
          .setCustomId('remove-mem-modal')
          .setTitle('إزالة عضو من التذكرة')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('remove-mem-input')
                .setLabel('أدخل الرقم التعريفي لإزالة العضو من التذكرة')
                .setStyle('SHORT')
                .setMinLength(4)
                .setMaxLength(30)
                .setPlaceholder('أدخل الرقم التعريفي هنا')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'remove-mem-modal') {
        const memberId = interaction.fields.getTextInputValue('remove-mem-input');
        
        const ticketChannel = interaction.channel;

        try {
          await ticketChannel.permissionOverwrites.delete(memberId);

          const member = await interaction.guild.members.fetch(memberId);

          const startTimestamp = Math.floor(Date.now() / 1000) - 87;
          const egyptianDate = new Date().toLocaleDateString('en-EG', { timeZone: 'Africa/Cairo' });
          const egyptianTime = new Date().toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo' });
          
          const ticketName = ticketChannel.name;

          // إنشاء Embed
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> تم إزالة العضو من التذكرة بنجاح.')
            .addFields(
              { name: 'العضو المزال', value: `<@${memberId}>`, inline: true },
              { name: 'معرف العضو المزال', value: `\`${memberId}\``, inline: true },
              { name: 'تمت الإزالة بواسطة', value: `<@${interaction.user.id}>`, inline: true },
              { name: 'أسم التذكرة', value: `\`\`${ticketName}\`\``, inline: true },
              { name: 'تاريخ إزالة العضو', value: `\`\`${egyptianTime},${egyptianDate}\`\``, inline: true },
              { name: 'تم إزالة العضو منذ', value: `<t:${startTimestamp}:R>`, inline: true }
            )

          // الرد بالـ Embed
          interaction.reply({ content: `||<@${memberId}> - <@${interaction.user.id}>||`, embeds: [embed] });
        } catch (error) {
          const memberId = interaction.fields.getTextInputValue('remove-mem-input');
          
          // إنشاء Embed لإرسال رسالة الخطأ
          const embed = new MessageEmbed()
            .setColor('#2c2c34')
            .setTitle('> هناك خطأ في رقم العضو')
            .addFields(
              { name: 'خطأ في الرقم التعريفي - هذه العضو غير موجود', value: `\`\`\`diff\n- ${memberId}\`\`\``, inline: true }
            );
          
          // الرد بالـ Embed
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }
    }
  });
};
