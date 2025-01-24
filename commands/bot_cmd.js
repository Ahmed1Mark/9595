const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'bot',
    description: 'عرض معلومات عن البوت.',
    async execute(message, args) {
        const duration = moment.duration(message.client.uptime).format(" D[d], H[h], m[m]");

        const embed = new MessageEmbed()
            .setTitle(`إحصائيات بوت \`${message.client.user.username}\``)
            .setTimestamp()
            .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: ':ping_pong: بينغ', value: `┕\`${Math.round(message.client.ws.ping)}ms\``, inline: true },
                { name: ':file_cabinet: الذاكرة', value: `┕\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\``, inline: true },
                { name: ':homes: السيرفرات', value: `┕\`2\``, inline: true },
                { name: ':busts_in_silhouette: المستخدمين', value: `┕\`${message.client.users.cache.size}\``, inline: true },
                { name: ':robot: الإصدار', value: `┕\`v14\``, inline: true },
                { name: ':blue_book: Discord.js', value: `┕\`v14\``, inline: true },
                { name: ':green_book: Node', value: `┕\`19\``, inline: true },
                { name: ':clock1: وقت التشغيل', value: `┕\`${duration}\``, inline: true },
                { name: ':control_knobs: تأخير الAPI', value: `┕\`${(message.client.ws.ping)}ms\``, inline: true }
            );
        message.reply({ embeds: [embed] });
    },
};
