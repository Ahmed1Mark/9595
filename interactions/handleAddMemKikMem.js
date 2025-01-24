// interactions/addmem_kikmem.js

// Import necessary libraries
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// Function to handle the addmem_kikmem interaction
async function handleAddMemKikMem(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة لاتخاذ هذا الإجراء', ephemeral: true });
        return;
    }

    // Create the embed message
    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> اختر الإجراء المطلوب')
        .setDescription("- \`إضافة عضو\` - يقوم بإضافة عضو معين في التذكرة عن طريق معرف الشخص\n- \`إزالة عضو\` - يقوم بإزالة عضو معين في التذكرة عن طريق معرف الشخص");

    // إرسال رسالة لتحديد الإجراء المطلوب
    await interaction.reply({
        embeds: [embed], ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('remove-mem-button').setLabel('إزالة عضو').setStyle('DANGER').setEmoji('<:ejpic1026:1254328498668044331>'),
                new MessageButton().setCustomId('add_member').setLabel('إضافة عضو').setStyle('SUCCESS').setEmoji('<:ejpic1029:1254328507799179305>')
            )
        ]
    });
}

// Export the function to handle the addmem_kikmem interaction
module.exports = {
    handleAddMemKikMem
};
