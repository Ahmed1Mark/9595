const { MessageEmbed } = require('discord.js');
const moment = require('moment');

// تعريف مخزن لتتبع آخر وقت تم فيه استخدام الأمر لكل عضو
const lastCommandTimes = new Map();

module.exports = {
    name: 'clear',
    description: 'مسح عدد معين من الرسائل.',
    options: [
        {
            name: 'number_of_messages',
            description: 'عدد الرسائل التي سيتم حذفها.',
            type: 'INTEGER',
            required: true
        }
    ],
    async execute(interaction) {
        // التحقق من مرور 10 ثوانٍ من آخر استخدام
        const lastCommandTime = lastCommandTimes.get(interaction.user.id) || 0;
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
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // تحديث الوقت الأخير لاستخدام الأمر
        lastCommandTimes.set(interaction.user.id, currentTime);

        // التحقق مما إذا كان لدى المستخدم إذن إدارة الرسائل
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'ليس لديك إذن لاستخدام هذا الأمر.', ephemeral: true });
        }

        // الحصول على عدد الرسائل المراد حذفها من إدخال المستخدم
        let amount = interaction.options.getInteger('عدد_الرسائل');

        // إذا لم يتم توفير أي عدد أو إذا كان أكبر من 100، فتعيينه إلى 100
        if (!amount || amount > 100) {
            amount = 100;
        }

        try {
            // حذف عدد معين من الرسائل
            interaction.channel.bulkDelete(amount, true) // 'true' هنا لحذف الرسائل التي ليست أقدم من 14 يومًا فقط
                .then(messages => {
                    const embed = new MessageEmbed()
                        .setDescription(`\`\`\`c++
🟢 تم حذف ${messages.size} رسالة بنجاح.
\`\`\``)

                    interaction.reply({ embeds: [embed], ephemeral: true });

                    // حذف الرد بعد 5 ثوانٍ
                    setTimeout(() => {
                        interaction.deleteReply().catch(console.error);
                    }, 5000);
                })
                .catch(error => {
                    console.error('خطأ في حذف الرسائل:', error);
                    interaction.reply({ content: 'حدث خطأ أثناء حذف الرسائل.', ephemeral: true });
                });
        } catch (error) {
            console.error('خطأ في حذف الرسائل:', error);
            interaction.reply({ content: 'حدث خطأ أثناء حذف الرسائل.', ephemeral: true });
        }
    },
};

