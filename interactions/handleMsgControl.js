// interactions/msg_control.js

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

// Function to handle the msg_control interaction
async function handleMsgControl(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة لاتخاذ هذا الإجراء', ephemeral: true });
        return;
    }

    // Create the embed message
    const embed = new MessageEmbed()
        .setColor('#2c2c34')
        .setTitle('> اختر الإجراء المطلوب')
        .setDescription('- \`إرسال رسالة منشئ التذكرة\` - يقوم بإرسالة رسالة للعضو اللذي قام بإنشاء التذكرة\n- \`أرسال رسالة لعضو معين\` - يقوم بإرسالة رسالة لعضو معين عن طريق معرف الشخص\n\n- \`أرسال رسالة عادية\` - يقوم بإرسال رسالة عادية في التذكرة عن طريق البوت\n- \`أرسال رسالة مع تضمين\` - يقوم بإرسال رسالة مع تضمين في التذكرة عن طريق البوت\n\n- \`حذف رسالة\` - يقوم بحذف رسالة معينه عن طريق معرف الرسالة\n- \`تعطيل الرسائل\` - يقوم بتعطيل صحلية إرسال الرسائل في التذكرة');

    // إرسال رسالة لتحديد الإجراء المطلوب
    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
        components: [
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('sendowntick').setLabel('إرسال رسالة لمنشئ التذكرة').setStyle('SECONDARY').setEmoji('📩'),
                new MessageButton().setCustomId('sendmemberid').setLabel('إرسال رسالة لعضو معين').setStyle('SECONDARY').setEmoji('📝')
            ),
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('sendmsgpost').setLabel('إرسال رسالة عادية').setStyle('SECONDARY').setEmoji('📨'),
                new MessageButton().setCustomId('sendmsgembed').setLabel('إرسال رسالة مع تضمين').setStyle('SECONDARY').setEmoji('📋')
            ),
            new MessageActionRow().addComponents(
                new MessageButton().setCustomId('msgdeleted').setLabel('حذف الرسالة').setStyle('DANGER').setEmoji('🗑️'),
                new MessageButton().setCustomId('sendmsgdisabled').setLabel('حظر المستخدم من نظام فتح التذاكر').setStyle('DANGER').setEmoji('<:ejpic1026:1254328498668044331>')
            )
        ]
    });
}

// Export the function to handle the msg_control interaction
module.exports = {
    handleMsgControl
};
