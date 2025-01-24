const { MessageEmbed } = require('discord.js');
const moment = require('moment'); // استيراد وحدة الوقت moment

module.exports = {
    name: 'bot',
    description: 'عرض معلومات عن البوت.',
    async execute(interaction) {
        const duration = moment.duration(interaction.client.uptime).format(" D[d], H[h], m[m]");

        const embed = new MessageEmbed()
            .setTitle(`إحصائيات من \`${interaction.client.user.username}\``)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: ':ping_pong: بينغ', value: `┕\`${Math.round(interaction.client.ws.ping)}ms\``, inline: true },
                { name: ':file_cabinet: الذاكرة', value: `┕\`2.6Gbp\``, inline: true },
                { name: ':homes: السيرفرات', value: `┕\`2\``, inline: true },
                { name: ':busts_in_silhouette: المستخدمون', value: `┕\`${interaction.client.users.cache.size}\``, inline: true },
                { name: ':robot: الإصدار', value: `┕\`v14\``, inline: true }, // الوصول للإصدار مباشرة من وحدة discord.js
                { name: ':blue_book: Discord.js', value: `┕\`v14\``, inline: true }, // الوصول للإصدار مباشرة من وحدة discord.js
                { name: ':green_book: Node', value: `┕\`21\``, inline: true },
                { name: ':clock1: وقت التشغيل', value: `┕\`${duration}\``, inline: true },
                { name: ':control_knobs: تأخير الـ API', value: `┕\`${(interaction.client.ws.ping)}ms\``, inline: true }
            );
        interaction.reply({ embeds: [embed] });
    },
};
