const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-banner',
    aliases: ['s-banner'],
    description: 'عرض صورة البانر للسيرفر إذا كانت متاحة.',
    async execute(message, args) {
        try {
            const serverBanner = message.guild.bannerURL({ dynamic: true, format: 'png', size: 4096 });

            if (serverBanner) {
                await message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#2c2c34")
                            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`**رابط بانر السيرفر: [ [GIF](${message.guild.bannerURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${message.guild.bannerURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${message.guild.bannerURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${message.guild.bannerURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${message.guild.bannerURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                            .setImage(serverBanner)
                            .setTimestamp()
                    ]
                });
            } else {
                await message.reply("هذا السيرفر لا يحتوي على بانر.");
            }
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
