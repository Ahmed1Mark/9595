const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'تكرار النص الذي تكتبه.',
    options: [
        {
            name: 'text',
            description: 'النص الذي ترغب في إرساله عبر البوت.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'format',
            description: 'اختياري: حدد صيغة الرسالة.',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'Embed', value: 'embed' },
                { name: 'Text', value: 'text' },
            ],
        },
        {
            name: 'channel',
            description: 'اختياري: حدد القناة التي ترغب في إرسال الرسالة إليها.',
            type: 'CHANNEL',
            required: false,
        },
    ],
    async execute(interaction) {
        // التحقق من أن المستخدم لديه صلاحيات "ADMINISTRATOR"
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'ليس لديك صلاحية استخدام هذا الأمر!', ephemeral: true });
        }

        const text = interaction.options.getString('text');
        const channelOption = interaction.options.getChannel('channel');
        const format = interaction.options.getString('format');

        if (channelOption && channelOption.isText()) {
            if (format === 'embed') {
                const embed = new MessageEmbed()
                    .setDescription(text);
                channelOption.send({ embeds: [embed] });
                interaction.reply({ content: `تم إرسال الرسالة إلى ${channelOption} كـ Embed.`, ephemeral: true });
            } else {
                channelOption.send(text);
                interaction.reply({ content: `تم إرسال الرسالة إلى ${channelOption} كرسالة عادية.`, ephemeral: true });
            }
        } else {
            if (format === 'embed') {
                const embed = new MessageEmbed()
                    .setDescription(text);
                interaction.channel.send({ embeds: [embed] });
                interaction.reply({ content: 'تم إرسال الرسالة في هذه القناة كـ Embed.', ephemeral: true });
            } else {
                interaction.channel.send(text);
                interaction.reply({ content: 'تم إرسال الرسالة في هذه القناة كرسالة عادية.', ephemeral: true });
            }
        }
    },
};
