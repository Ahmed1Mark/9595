const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'user-banner',
    aliases: ['banner', 'b'],
    description: 'عرض صورة الغلاف لمستخدم معين.',
    async execute(message, args) {
        try {
            let user = message.author;
            const mention = message.mentions.users.first();
            const userID = args[0];

            if (mention) {
                user = mention;
            } else if (userID) {
                user = await message.client.users.fetch(userID);
            }

            const userBanner = await user.fetch().then(fetchedUser => fetchedUser.bannerURL({ dynamic: true, size: 4096 }));

            if (userBanner) {
                await message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor("#2c2c34")
                            .setFooter(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`**رابط الغلاف: [ [GIF](${user.bannerURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${user.bannerURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${user.bannerURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${user.bannerURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${user.bannerURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                            .setImage(userBanner)
                            .setTimestamp()
                    ]
                });
            } else {
                await message.reply("هذا المستخدم لا يملك غلافًا.");
            }
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
