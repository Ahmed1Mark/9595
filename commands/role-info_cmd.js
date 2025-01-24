const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role-info',
    aliases: ['r-info'],
    description: 'عرض معلومات عن رتبة محددة.',
    async execute(message, args) {
        try {
            let role;
            const roleId = args[0] ? args[0].replace(/[\\<>@&]/g, '') : null; // إزالة الأحرف الزائدة من الـ Mention للرتبة

            // التحقق ما إذا كان المدخل هو Mention للرتبة أو ID للرتبة
            if (message.mentions.roles.size > 0) {
                role = message.mentions.roles.first();
            } else if (roleId) {
                role = message.guild.roles.cache.get(roleId);
            } else {
                return await message.reply('من فضلك حدد الرتبة لعرض معلوماتها.');
            }

            if (!role) {
                return await message.reply('لا يمكن العثور على تلك الرتبة!');
            }

            const roleEmbed = new MessageEmbed()
                .setTitle('معلومات الرتبة')
                .addFields(
                    { name: 'معرف الرتبة', value: `\`${role.id}\``, inline: true },
                    { name: 'اسم الرتبة', value: role.name, inline: true },
                    { name: 'لون الرتبة', value: role.color ? `#${role.color.toString(16).toUpperCase()}` : 'لا يوجد', inline: true },
                    { name: 'قابلية الإشارة للرتبة', value: role.mentionable ? 'نعم' : 'لا', inline: true },
                    { name: 'إدارة الرتبة', value: role.managed ? 'نعم' : 'لا', inline: true },
                    { name: 'تم إنشاء الرتبة في', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: true },
                )
                .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }) // تحديث الدعوة للـ setFooter
                .setTimestamp();

            if (role.color) {
                roleEmbed.setColor(role.color);
            }

            await message.reply({ embeds: [roleEmbed] });
        } catch (error) {
            console.error('حدث خطأ أثناء عرض معلومات الرتبة:', error);
        }
    },
};
