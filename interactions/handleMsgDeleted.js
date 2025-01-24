// interactions/msg_deleted.js

// دالة لمعالجة التفاعل msgdeleted
async function handleMsgDeleted(interaction, hasClaimPermission) {
    // التحقق من صلاحيات المستخدم
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة لاتخاذ هذا الإجراء', ephemeral: true });
        return;
    }

    // قم بتنفيذ الإجراء المرتبط بحذف الرسالة
    await interaction.reply({ content: 'أدخل رقم الرسالة التي ترغب في حذفها', ephemeral: true });

    // استجابة للرسالة القادمة من المستخدم
    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    collector.on('collect', async m => {
        const messageId = m.content.trim(); // استخراج رقم الرسالة المدخل من المستخدم
        try {
            const channel = interaction.channel;
            const message = await channel.messages.fetch(messageId);
            await message.delete(); // حذف الرسالة بعد جلبها
            await interaction.followUp({ content: 'تم حذف الرسالة بنجاح', ephemeral: true });
        } catch (error) {
            console.error('حدث خطأ أثناء محاولة حذف الرسالة:', error);
            await interaction.followUp({ content: 'حدث خطأ أثناء محاولة حذف الرسالة', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp({ content: 'لم يتم تقديم رقم الرسالة لحذفها في الوقت المناسب', ephemeral: true });
        }
    });
}

// تصدير الدالة لمعالجة التفاعل msgdeleted
module.exports = {
    handleMsgDeleted
};
