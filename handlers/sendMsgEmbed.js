const { Modal, MessageActionRow, TextInputComponent, MessageEmbed } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'sendmsgembed') {
        const modal = new Modal()
          .setCustomId('send-msg-modal')
          .setTitle('إرسال رسالة مُضمنة')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('send-msg-input')
                .setLabel('إضافة عنوان / غير مطلوب')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(200)
                .setPlaceholder('أدخل العنوان هنا')
                .setRequired(false),
            ),
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('2send-msg-input')
                .setLabel('إضافة وصف / مطلوب')
                .setStyle('PARAGRAPH')
                .setMinLength(1)
                .setMaxLength(4000)
                .setPlaceholder('أدخل الوصف هنا')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-msg-modal') {
        const response = interaction.fields.getTextInputValue('send-msg-input');
        const response2 = interaction.fields.getTextInputValue('2send-msg-input');

        interaction.reply({ content: `تم إرسال الرسالة بنجاح`, ephemeral: true })
          .then(() => {
            const embed = new MessageEmbed()
              .setColor('#2c2c34')
              .setTitle(`${response}`)
              .setDescription(`${response2}`);

            interaction.channel.send({ embeds: [embed] });
          })
          .catch(error => console.error('حدث خطأ في الرد:', error));
      }
    }
  });
};

