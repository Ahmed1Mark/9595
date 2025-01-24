const { Modal, MessageActionRow, TextInputComponent, MessageEmbed, MessageButton } = require('discord.js');
const { TicketReportChannelId } = require('../config.json');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'accept_sug22') {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
          return interaction.reply({ content: 'ليس لديك الصلاحية لفعل ذلك.', ephemeral: true });
        }

        const memberMention = interaction.member.toString();
        const embed = interaction.message.embeds[0];
        const statusField = embed.fields.find(field => field.name.includes('الحالة'));
        if (statusField) {
          statusField.name = `الحالة | ✅`;
          statusField.value = `${memberMention}`;
        }
        interaction.component.setDisabled(true);
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }

      if (interaction.customId === 'unaccept_sug22') {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
          return interaction.reply({ content: 'ليس لديك الصلاحية لفعل ذلك.', ephemeral: true });
        }

        const memberMention = interaction.member.toString();
        const embed = interaction.message.embeds[0];
        const statusField = embed.fields.find(field => field.name.includes('الحالة'));
        if (statusField) {
          statusField.name = `الحالة | ❌`;
          statusField.value = `${memberMention}`;
        }
        interaction.component.setDisabled(true);
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }

      if (interaction.customId === 'ticket_rep') {
        const modal = new Modal()
          .setCustomId('ticket_rep')
          .setTitle('تقديم بلاغ إلى الإداريين')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('report-input')
                .setLabel('عنوان البلاغ')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(200)
                .setPlaceholder('اكتب سبب البلاغ هنا')
                .setRequired(true),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('2report-input')
                .setLabel('يرجى شرح البلاغ')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('اكتب تفاصيل البلاغ هنا')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'ticket_rep') {
        const response = interaction.fields.getTextInputValue('report-input');
        const response2 = interaction.fields.getTextInputValue('2report-input');
        const startTimestamp = Math.floor(Date.now() / 1000) - 27;
        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const userId = interaction.user.id;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });
        
        const embed2 = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> 📝 بلاغ جديد')
          .addFields(
              { name: 'سبب البلاغ', value: `\`\`\`${response}\`\`\``, inline: false },
              { name: 'تفاصيل البلاغ', value: `\`\`\`${response2}\`\`\``, inline: false },
              { name: 'الحالة', value: `قيد المراجعة ⏳`, inline: true },
              { name: 'مصدر البلاغ', value: `[${interaction.channel.name}](${interaction.message.url})`, inline: true },
              { name: 'تم تقديم البلاغ بواسطة', value: `<@${userId}>`, inline: true },
              { name: 'تم تقديم البلاغ منذ', value: `┕<t:${startTimestamp}:R>`, inline: true },
              { name: 'تاريخ تقديم البلاغ', value: `┕\`${egyptianDate2},${egyptianDate}\``, inline: true },
              { name: 'معرف الشخص', value: `┕\`${userId}\``, inline: true },
          );
        
        const accept_sug = new MessageButton()
            .setCustomId('accept_sug22')
            .setEmoji('<:859388130411282442:1219455979972984842>')
            .setLabel('موافقة')
            .setStyle('SUCCESS');

        const unaccept_sug = new MessageButton()
            .setCustomId('unaccept_sug22')
            .setEmoji('<:859388130636988436:1219455995667939391>') 
            .setLabel('رفض')  
            .setStyle('DANGER');
        
        const row1 = new MessageActionRow()
        .addComponents(accept_sug, unaccept_sug);

        const embed = new MessageEmbed()
          .setColor('#2c2c34')
          .setTitle('> تم إرسال بلاغك بنجاح')
          .setDescription('تم تقديم بلاغك بنجاح إلى الإداريين\n بلاغك قيد المراجعة');

        interaction.reply({ embeds: [embed], ephemeral: true })
          .then(() => {
            const channel = interaction.client.channels.cache.get(TicketReportChannelId);
            if (channel && channel.isText()) {
              channel.send({ embeds: [embed2], components: [row1] });
            } else {
              console.error('القناة غير موجودة أو غير صالحة.');
            }
          })
          .catch(error => console.error('حدث خطأ في الرد:', error));
      }
    }
  });
};


