const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channel-info',
    description: 'عرض معلومات عن القناة الحالية.',
    options: [
        {
            name: 'channel',
            description: 'حدد القناة لعرض معلوماتها',
            type: 'CHANNEL',
            required: true
        }
    ],
    async execute(interaction) {
        try {
            const channel = interaction.options.getChannel('قناة');
            const author = channel.owner;

            const channelEmbed = new MessageEmbed()
                .setTitle('معلومات القناة')
                .addFields(
                    { name: 'معرف القناة', value: `\`${channel.id}\``, inline: true },
                    { name: 'نوع القناة', value: channel.type, inline: true },
                    { name: `\u2003`, value: `\u2003`, inline: false },
                    { name: 'اسم القناة', value: channel.name, inline: true },
                    { name: 'تم إنشاؤها في', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`, inline: true },
                )
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            await interaction.reply({ embeds: [channelEmbed] });
        } catch (error) {
            console.error('خطأ في عرض معلومات القناة:', error);
        }
    },
};
