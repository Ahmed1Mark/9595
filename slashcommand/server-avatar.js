const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-image',
    description: 'عرض صورة السيرفر.',
    async execute(interaction) {
        try {
            const server = interaction.guild;
            const serverImage = server.iconURL({ size: 4096, dynamic: true });
            const serverImageEmbed = new MessageEmbed()
                .setTimestamp();

            if (serverImage) {
                serverImageEmbed.setImage(serverImage);
                serverImageEmbed.setDescription(`**رابط الصورة: [ [GIF](${server.iconURL({ dynamic: true, format: 'gif', size: 4096 })}) ・ [PNG](${server.iconURL({ dynamic: true, format: 'png', size: 4096 })}) ・ [JPG](${server.iconURL({ dynamic: true, format: 'jpg', size: 4096 })}) ・ [WEBP](${server.iconURL({ dynamic: true, format: 'webp', size: 4096 })}) ・ [JPEG](${server.iconURL({ dynamic: true, format: 'jpeg', size: 4096 })}) ]**`);
                serverImageEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            } else {
                serverImageEmbed.setDescription('هذا السيرفر لا يحتوي على صورة.');
                serverImageEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            }

            interaction.reply({ embeds: [serverImageEmbed] });
        } catch (error) {
            console.error('خطأ:', error);
            interaction.reply({ content: 'حدث خطأ أثناء جلب صورة السيرفر.', ephemeral: true });
        }
    },
};
