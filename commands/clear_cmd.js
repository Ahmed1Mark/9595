const { MessageEmbed } = require('discord.js');
const moment = require('moment');

// تعريف مخزن لتتبع آخر وقت تم فيه استخدام الأمر لكل عضو
const lastCommandTimes = new Map();

module.exports = {
    name: 'clear',
    aliases: ['c', 'cl'], // إضافة الأوامر المختصرة هنا
    description: 'مسح عدد معين من الرسائل.',
    async execute(message, args) {
        // التحقق من مرور 10 ثوانٍ من آخر استخدام
        const lastCommandTime = lastCommandTimes.get(message.author.id) || 0;
        const currentTime = Date.now();
        const difference = currentTime - lastCommandTime;

        if (difference < 10000) { // إذا مضت أقل من 10 ثوانٍ
            const remainingTime = Math.ceil((10000 - difference) / 1000); // تحديد الوقت المتبقي بالثواني
            const seconds = remainingTime % 60;

            // تنسيق الثواني بالصيغة المطلوبة
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

            const embed = new MessageEmbed()
                .setDescription(`\`\`\`1c
🔴 يرجى الانتظار ${remainingTime}.${formattedSeconds} ثانية لاستخدام الأمر مرة أخرى.
\`\`\``);

            const replyMessage = await message.reply({ embeds: [embed], ephemeral: true });

            // حذف الرد بعد 5 ثوانٍ
            setTimeout(() => {
                replyMessage.delete().catch(console.error);
            }, 5000);

            return;
        }

        // تحديث الوقت الأخير لاستخدام الأمر
        lastCommandTimes.set(message.author.id, currentTime);

        // التحقق مما إذا كان لدى المستخدم صلاحية إدارة الرسائل
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            const replyMessage = await message.reply({ content: 'ليس لديك الصلاحية لاستخدام هذا الأمر.', ephemeral: true });

            // حذف الرد بعد 5 ثوانٍ
            setTimeout(() => {
                replyMessage.delete().catch(console.error);
            }, 3000);

            return;
        }

        // الحصول على عدد الرسائل المطلوب حذفها من المدخلات
        let amount = parseInt(args[0]);

        // إذا لم يتم تحديد العدد أو إذا كان أكبر من 100، تحديده بـ 100
        if (!amount || amount > 100) {
            amount = 100;
        }

        try {
            // حذف رسالة الأمر نفسها
            await message.delete();

            // جلب الرسائل من القناة
            const fetchedMessages = await message.channel.messages.fetch({ limit: amount });
            
            // حذف الرسائل
            const deletedMessages = await message.channel.bulkDelete(fetchedMessages, true); // 'true' هنا لحذف الرسائل التي لا يزيد عمرها عن 14 يومًا

            const embed = new MessageEmbed()
                .setDescription(`\`\`\`c++
🟢 تم مسح ${deletedMessages.size} رسالة بنجاح.
\`\`\``);

            const replyMessage = await message.channel.send({ embeds: [embed], ephemeral: true });

            // حذف الرد بعد 5 ثوانٍ
            setTimeout(() => {
                replyMessage.delete().catch(console.error);
            }, 3000);
        } catch (error) {
            console.error('خطأ في مسح الرسائل:', error);
            const replyMessage = await message.reply({ content: 'حدث خطأ أثناء مسح الرسائل.', ephemeral: true });

            // حذف الرد بعد 5 ثوانٍ
            setTimeout(() => {
                replyMessage.delete().catch(console.error);
            }, 3000);
        }
    },
};
