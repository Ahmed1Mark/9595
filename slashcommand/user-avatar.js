const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'user-avatar',
    description: 'عرض صورة الملف الشخصي الخاصة بالعضو.',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'حدد العضو الذي ترغب في عرض صورته الشخصية.',
            required: false,
            // أضف USER_PERMISSION هنا إذا لزم الأمر
            // USER_PERMISSION: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
        },
    ],
    async execute(interaction) {
        const userOption = interaction.options.get('user');
        const user = userOption ? userOption.user : interaction.user;

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor("#2c2c34")
                    .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setDescription(`**رابط الصورة : [ [GIF](${user.displayAvatarURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${user.displayAvatarURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${user.displayAvatarURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${user.displayAvatarURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                    .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 }))
                    .setTimestamp()
            ]
        });
    },
};
