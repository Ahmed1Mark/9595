const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'user-banner',
    description: 'عرض خلفية الملف الشخصي الخاصة بالعضو.',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'حدد العضو الذي ترغب في عرض الخلفية الخاصة به.',
            required: false,
        },
    ],
    async execute(interaction) {
        const userOption = interaction.options.get('user');
        const user = userOption ? userOption.user : interaction.user;

        // احصل على معلومات العضو الكاملة لتتمكن من الوصول إلى البانر
        const userFetch = await interaction.client.users.fetch(user.id, { force: true });
        const bannerURL = userFetch.bannerURL({ dynamic: true, size: 4096 });

        if (bannerURL) {
            // إذا كان لدى العضو بنر، قم بعرضه
            const embed = new MessageEmbed()
                .setColor("#2c2c34")
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**رابط البنر : [ [GIF](${user.bannerURL({ dynamic: true, format: 'gif', size: 4096 })})・[PNG](${user.bannerURL({ dynamic: true, format: 'png', size: 4096 })})・[JPG](${user.bannerURL({ dynamic: true, format: 'jpg', size: 4096 })})・[WEBP](${user.bannerURL({ dynamic: true, format: 'webp', size: 4096 })})・[JPEG](${user.bannerURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`)
                .setImage(bannerURL)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } else {
            // إذا لم يكن لدى العضو بنر، قم بإرسال رسالة مختلفة
            const embed = new MessageEmbed()
                .setColor("#2c2c34")
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription("هذا الشخص ليس لديه بنر.")
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    },
};
