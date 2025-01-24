const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tax',
    description: 'حساب الضريبة الخاصة بالـ ProBot',
    options: [
        {
            name: 'amount',
            type: 'STRING',
            description: 'أدخل المبلغ لحساب الضريبة عليه، [ 1K أو 1 M1 Bأو 1 Tأو 1 Q1]',
            required: true,
        },
    ],
    async execute(interaction) {
        const amountString = interaction.options.getString('amount');
        const amount = parseInt(amountString.replace(/[^0-9]/g, ''), 10);

        // تحويل الأرقام الكبيرة إلى أرقام
        const args2 = amountString.toLowerCase().replace(/k/g, "000").replace(/m/g, "000000").replace(/b/g, "000000000").replace(/t/g, "000000000000").replace(/q/g, "000000000000000");
        const tax = Math.floor(args2 * (20 / 19) + 1); // حساب الضريبة
        const tax2 = Math.floor(tax - args2); // حساب الضريبة فقط
        const tax3 = Math.floor(tax2 * (20 / 19) + 1); // حساب الضريبة
        const tax4 = Math.floor(tax2 + tax3 + args2); // حساب الضريبة الكاملة

        // التحقق من صحة الإدخال
        if (!amount || isNaN(amount) || amount < 1) {
            const errorEmbed = new MessageEmbed()
                .setColor("#FF0000")
                .setAuthor({ name: `❌ حدث خطأ`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`\`\`\`الرجاء إدخال مبلغ صالح\`\`\``);
            return interaction.reply({ embeds: [errorEmbed] });
        }

        // إنشاء رسالة الـ embed لعرض نتائج الضريبة
        const taxEmbed = new MessageEmbed()
            .setColor("#00FF00")
            .setAuthor({ name: `✅ تم حساب المبلغ`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTimestamp()
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .addFields(
                { name: "المبلغ المطلوب", value: `\`\`\`${args2}\`\`\``, inline: true },
                { name: "ضريبة المبلغ فقط", value: `\`\`\`${tax2}\`\`\``, inline: true },
                { name: "المبلغ الإجمالي بما فيه الضريبة", value: `\`\`\`yaml\n${tax}\n\`\`\``, inline: false }
            );

        // إرسال رسالة الـ embed
        return interaction.reply({ embeds: [taxEmbed] });
    },
};
