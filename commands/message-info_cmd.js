const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'message-info',
    aliases: ['message', 'm-info'],
    description: 'عرض معلومات عن رسالة محددة.',
    async execute(message, args) {
        try {
            // الحصول على معرف الرسالة من وسائط الأمر
            const messageId = args[0];
            if (!messageId) {
                return message.reply('يرجى تقديم معرف الرسالة.');
            }

            const channel = message.channel;

            // جلب الرسالة بواسطة معرفها
            const fetchedMessage = await channel.messages.fetch(messageId);

            const messageEmbed = new MessageEmbed()
                .setTitle('معلومات الرسالة')
                .setDescription(`**المحتوى:**\n${fetchedMessage.content}`)
                .addFields(
                    { name: 'معرف الرسالة', value: `\`${fetchedMessage.id}\``, inline: true },
                    { name: 'المرسل', value: `<@${fetchedMessage.author.id}>`, inline: true },
                    { name: 'القناة', value: `<#${fetchedMessage.channel.id}>`, inline: true },
                    { name: 'تم الإرسال في', value: `<t:${Math.floor(fetchedMessage.createdTimestamp / 1000)}:F>`, inline: true },
                    { name: 'تم التعديل في', value: fetchedMessage.editedTimestamp ? `<t:${Math.floor(fetchedMessage.editedTimestamp / 1000)}:F>` : 'لم يتم التعديل', inline: true },
                )
                .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await message.reply({ embeds: [messageEmbed] });
        } catch (error) {
            console.error('حدث خطأ في عرض معلومات الرسالة:', error);
            await message.reply('حدث خطأ أثناء جلب معلومات الرسالة.');
        }
    },
};
