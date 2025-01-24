const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'message-info',
    description: 'عرض معلومات حول رسالة محددة.',
    options: [
        {
            name: 'message_id',
            description: 'أدخل معرف الرسالة لعرض معلوماتها',
            type: 'STRING',
            required: true
        }
    ],
    async execute(interaction) {
        try {
            const messageId = interaction.options.getString('message_id');
            const channel = interaction.channel;

            // جلب الرسالة بواسطة معرفها
            const message = await channel.messages.fetch(messageId);

            const messageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('معلومات الرسالة')
                .setDescription(`**المحتوى:**\n${message.content}`)
                .addFields(
                    { name: 'معرف الرسالة', value: `\`${message.id}\``, inline: true },
                    { name: 'المرسل', value: `<@${message.author.id}>`, inline: true },
                    { name: 'القناة', value: `<#${message.channel.id}>`, inline: true },
                    { name: 'تم الإرسال في', value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: 'تم التعديل في', value: message.editedTimestamp ? `<t:${Math.floor(message.editedTimestamp / 1000)}:F>` : 'لم يتم التعديل', inline: true },
                )
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [messageEmbed] });
        } catch (error) {
            console.error('خطأ في عرض معلومات الرسالة:', error);
        }
    },
};
