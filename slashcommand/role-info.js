const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role-info',
    description: 'عرض معلومات عن الرتبة معين.',
    options: [
        {
            name: 'role',
            description: 'اختر الرتبة لعرض معلوماته',
            type: 'ROLE',
            required: true
        }
    ],
    async execute(interaction) {
        try {
            const role = interaction.options.getRole('role');

            const roleEmbed = new MessageEmbed()
                .setTitle('معلومات الدور')
                .addFields(
                    { name: 'معرف الرتبة', value: `\`${role.id}\``, inline: true },
                    { name: 'اسم الرتبة', value: role.name, inline: true },
                    { name: 'لون الرتبة', value: role.color ? `#${role.color.toString(16).toUpperCase()}` : 'لا يوجد', inline: true },
                    { name: 'يمكن الإشارة إليه', value: role.mentionable ? 'نعم' : 'لا', inline: true },
                    { name: 'مُدار من قبل النظام', value: role.managed ? 'نعم' : 'لا', inline: true },
                    { name: 'تاريخ إنشاء الرتبة', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: true },
                )
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            if (role.color) {
                roleEmbed.setColor(role.color);
            }

            await interaction.reply({ embeds: [roleEmbed] });
        } catch (error) {
            console.error('حدث خطأ أثناء عرض معلومات الرتبة:', error);
        }
    },
};
