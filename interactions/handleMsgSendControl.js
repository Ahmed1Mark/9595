// interactions/msg_sendcontrol.js

// Import necessary libraries
const { MessageActionRow, MessageButton } = require('discord.js');

// Function to handle the msg_sendcontrol interaction
async function handleMsgSendControl(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة لاتخاذ هذا الإجراء', ephemeral: true });
        return;
    }
    // إرسال رسالة لتحديد الإجراء المطلوب
    await interaction.reply({
        content: 'اختر الإجراء المطلوب', ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('sendowntick').setLabel('إرسال رسالة إلى صاحب التذكرة').setStyle('SECONDARY'),
                new MessageButton().setCustomId('sendmemberid').setLabel('إرسال رسالة إلى مستخدم معين').setStyle('SECONDARY')
            )
        ]
    });
}


// Export the function to handle the msg_sendcontrol interaction
module.exports = {
    handleMsgSendControl
};
