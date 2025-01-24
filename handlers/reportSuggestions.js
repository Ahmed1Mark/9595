const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');
const { suggestionsreport } = require('../config.json');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'accept_sug') {
        // التحقق مما إذا كان المستخدم لديه الدور المطلوب
        if (!interaction.member.roles.cache.has('1218308274852728932')) {
          return interaction.reply({ content: 'ليس لديك الصلاحية للقيام بذلك.', ephemeral: true });
        }

        // تعديل الـ Embed
        const embed = interaction.message.embeds[0];
        embed.fields.find(field => field.name === 'الحالة').value = '✅ تم قبولها';
        
        // تعطيل الزر بعد النقر عليه
        interaction.component.setDisabled(true);

        // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }
      
      if (interaction.customId === 'unaccept_sug') {
        // التحقق مما إذا كان المستخدم لديه الدور المطلوب
        if (!interaction.member.roles.cache.has('1218308274852728932')) {
          return interaction.reply({ content: 'ليس لديك الصلاحية للقيام بذلك.', ephemeral: true });
        }

        // تعديل الـ Embed
        const embed = interaction.message.embeds[0];
        embed.fields.find(field => field.name === 'الحالة').value = '❌ رفض';
        
        // تعطيل الزر بعد النقر عليه
        interaction.component.setDisabled(true);

        // إعادة إرسال الرسالة مع التعديلات وتحديث الزر
        await interaction.update({ embeds: [embed], components: [interaction.message.components[0]] });
      }

      // التحقق مما إذا كان الزر جزءًا من نظام التصويت
      if (interaction.customId === 'report-modal22') {
        const modal = new Modal()
          .setCustomId('report-modal22')
          .setTitle('الإبلاغ عن اقتراح')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('report-input')
                .setLabel('لماذا تقوم بالإبلاغ عن هذا الاقتراح بإيجاز؟')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(200)
                .setPlaceholder('أدخل السبب بإيجاز')
                .setRequired(true),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('2report-input')
                .setLabel('ما هو السبب بالتفصيل؟')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('اكتب بالتفصيل')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'report-modal22') {
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
          .setTitle('> 📝 تقرير جديد')
          .setDescription(`**عنوان التقرير** \`\`\`${response}\`\`\` \n**سبب الإبلاغ** \`\`\`${response2}\`\`\``)
          .addFields(
              { name: `\u2003`, value: `\u2003`, inline: false },
              { name: 'تاريخ التقرير', value: `\` ${egyptianDate2},${egyptianDate}\``, inline: true },
              { name: 'تم الإبلاغ بواسطة', value: `<@${userId}>`, inline: true },
              { name: `\u2003`, value: `\u2003`, inline: false },
              { name: 'التقرير منذ', value: `<t:${startTimestamp}:R>`, inline: true },
              { name: 'الاقتراح المبلغ عنه', value: `[الرابط هنا](${interaction.message.url})`, inline: true },
          );

        // إرسال رسالة بتنسيق Embed
        const embed = new MessageEmbed()
          .setColor('#2c2c34')
          .setDescription('> **تم إرسال تقريرك إلى المسؤولين ويتم مراجعته حاليًا**')

        await interaction.reply({ embeds: [embed], ephemeral: true })
          .then(() => {
            // إرسال رسالة إلى القناة المحددة بتنسيق Embed
            const channel = interaction.client.channels.cache.get(suggestionsreport);
            if (channel && channel.isText()) {
              channel.send({ embeds: [embed2] });
            } else {
              console.error('القناة غير موجودة أو غير صالحة.');
            }
          })
          .catch(error => console.error('حدث خطأ في الاستجابة:', error));
      }
    }
  });
};

