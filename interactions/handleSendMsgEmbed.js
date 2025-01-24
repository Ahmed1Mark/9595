// interactions/send_msg_embed.js

// دالة لمعالجة التفاعل sendmsgembed
async function handleSendMsgEmbed(interaction, hasClaimPermission) {
    // التحقق من صلاحيات المستخدم
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة للقيام بهذا الإجراء', ephemeral: true });
        return;
    }
    
    // قم بتنفيذ الإجراء المرتبط بإرسال رسالة بـ Embed
    const msg = await interaction.reply({ content: 'أدخل النص لإرسال الرسالة باستخدام Embed', ephemeral: true });

    // استجابة للرسالة القادمة من المستخدم
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    collector.on('collect', async m => {
        const content = m.content.trim(); // استخراج النص المدخل من المستخدم
        try {
            await sendEmbedMessage(interaction, content); // استدعاء دالة لإرسال الرسالة بـ Embed
            await interaction.deleteReply(); // حذف رسالة الرد الأصلية
            await m.delete(); // حذف رسالة المستخدم
        } catch (error) {
            console.error('حدث خطأ أثناء محاولة إرسال الرسالة بـ Embed:', error);
            await interaction.followUp({ content: 'حدث خطأ أثناء محاولة إرسال الرسالة بـ Embed', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp({ content: 'لم يتم توفير النص لإرسال الرسالة بـ Embed في الوقت المحدد', ephemeral: true });
            msg.delete(); // حذف رسالة الطلب الأصلية
        }
    });
}

// دالة لإرسال رسالة بـ Embed
async function sendEmbedMessage(interaction, content) {
    // هنا يمكنك تنسيق الرسالة كما تريد
    const embed = {
        description: content,
        color: '#2c2c34',
    };

    await interaction.channel.send({ embeds: [embed] });
}


// تصدير الدالة لمعالجة التفاعل sendmsgembed
module.exports = {
    handleSendMsgEmbed
};
