const { Modal, MessageActionRow, TextInputComponent } = require('discord.js');

module.exports = (client) => {
  client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === 'sendmsgpost') {
        const modal = new Modal()
          .setCustomId('send-msg-modal')
          .setTitle('إرسال رسالة بوست')
          .addComponents([
            new MessageActionRow().addComponents(
              new TextInputComponent()
                .setCustomId('send-msg-input')
                .setLabel('الإجابة')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(2000)
                .setPlaceholder('أدخل الرسالة هنا')
                .setRequired(true),
            ),
          ]);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'send-msg-modal') {
        const response = interaction.fields.getTextInputValue('send-msg-input');

        // الرد بطريقة مؤقتة
        interaction.reply({ content: `تم إرسال الرسالة بنجاح`, ephemeral: true })
          .then(() => {
            // إرسال رسالة إلى القناة
            interaction.channel.send(`${response}`);
          })
          .catch(error => console.error('حدث خطأ في الرد:', error));
      }
    }
  });
};

