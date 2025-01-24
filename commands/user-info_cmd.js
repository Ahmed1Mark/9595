// command/user.js
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'user-info',
    aliases: ['info','user', 'i', 'u'],
    description: 'عرض معلومات حول المستخدم.',
    execute: async (message, args, prefix) => {
        try {
            const command = 'user'; // اسم الأمر

            // إضافة السطر التالي لبدء الرمز "الكتابة"
            await message.channel.sendTyping();

            // التحقق مباشرةً من الأمر
            if (command === 'user') {
                if (!message.guild) return;

                const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
                const user = member.user;
                const joinedDiscord = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
                const joinedServer = `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`;

                const embed = new MessageEmbed()
                    .setColor('#2c2c34')
                    .setTitle('> معلومات المستخدم')
                    .setTimestamp()
                    .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 4096 })) // حجم الصورة: 4096x4096
                    .addFields(
                        { name: 'انضم لديسكورد', value: `\`\`\`${moment(user.createdAt).format('YYYY/M/D hh:mm')}\`\`\`\n**┕** **${joinedDiscord}**`, inline: true },
                        { name: 'انضم للسيرفر', value: `\`\`\`${moment(member.joinedAt).format('YYYY/M/D hh:mm')}\`\`\` \n**┕** **${joinedServer}**`, inline: true }
                    );

                message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
