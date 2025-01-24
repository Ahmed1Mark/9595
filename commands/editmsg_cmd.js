const {
    prefix,
} = require('../config.json');

module.exports = {
    name: 'edit-message',
    aliases: ['edit', 'edit-msg', 'e-msg', 'e-message'],
    description: 'تعديل رسالة بواسطة معرفها.',
    async execute(message, args) {
        // التحقق مما إذا كانت الرسالة تبدأ بالبادئة وتكون "edit"
        if (message.content.startsWith(prefix + "edit")) {
            // تقسيم المحتوى إلى عناصر
            const args = message.content.slice(prefix.length + "edit".length).trim().split(' ');
            // استخراج معرف الرسالة من العناصر
            const messageId = args.shift();
            // دمج العناصر المتبقية للحصول على المحتوى الجديد
            const newContent = args.join(' ');

            // التحقق مما إذا كان كل من معرف الرسالة والمحتوى الجديد مقدمين
            if (!messageId || !newContent) {
                const errorMessage = await message.reply("يرجى تقديم معرف الرسالة والمحتوى الجديد للتعديل! ⚠️");
                // حذف رسالة الخطأ بعد 5 ثوانٍ
                setTimeout(() => {
                    errorMessage.delete().catch(console.error);
                }, 5000);
                return;
            }

            try {
                // جلب الرسالة بواسطة معرفها
                const fetchedMessage = await message.channel.messages.fetch(messageId);

                // التحقق مما إذا تم جلب الرسالة بنجاح
                if (fetchedMessage) {
                    // تعديل الرسالة بالمحتوى الجديد
                    await fetchedMessage.edit(newContent);
                    const successMessage = await message.reply("تم تعديل الرسالة بنجاح! ✅");
                    // حذف رسالة النجاح بعد 5 ثوانٍ
                    setTimeout(() => {
                        successMessage.delete().catch(console.error);
                    }, 5000);
                } else {
                    const notFoundMessage = await message.reply("الرسالة غير موجودة أو تعذر تعديلها! ⚠️");
                    // حذف رسالة عدم العثور بعد 5 ثوانٍ
                    setTimeout(() => {
                        notFoundMessage.delete().catch(console.error);
                    }, 5000);
                }
            } catch (error) {
                console.error("خطأ في تعديل الرسالة:", error);
                const errorMessage = await message.reply("حدث خطأ أثناء تعديل الرسالة! ⚠️");
                // حذف رسالة الخطأ بعد 5 ثوانٍ
                setTimeout(() => {
                    errorMessage.delete().catch(console.error);
                }, 5000);
            }
        }
    },
};
