const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-banner',
    description: 'عرض صورة رئيسية للسيرفر.',
    async execute(interaction) {
        try {
            const server = interaction.guild;
            const serverBanner = server.bannerURL({ size: 4096, dynamic: true });
            const serverBannerEmbed = new MessageEmbed();

            if (serverBanner) {
                serverBannerEmbed.setImage(serverBanner);
                serverBannerEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            } else {
                serverBannerEmbed.setDescription('هذا السيرفر لا يحتوي على صورة رئيسية.');
                serverBannerEmbed.setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
            }
            
            interaction.reply({ embeds: [serverBannerEmbed] });
        } catch (error) {
            console.error('خطأ:', error);
            interaction.reply({ content: 'حدث خطأ أثناء جلب صورة البانر للسيرفر.', ephemeral: true });
        }
    },
};
