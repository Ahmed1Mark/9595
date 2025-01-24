const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tax',
    aliases: ['t'],
    description: 'حساب ضريبة الائتمان في ProBot',
    async execute(message, args) {
        if (args.length === 0) {
            const errorEmbed = new MessageEmbed()
                .setTitle('> **❌ حدث خطأ**')
                .setDescription('```\nالرجاء إدخال مبلغ صالح\n```');
            const replyMessage = await message.reply({ embeds: [errorEmbed] });
            setTimeout(() => replyMessage.delete().catch(console.error), 5000);
            return;
        }

        const amountString = args[0];
        const amount = parseInt(amountString.replace(/[^0-9]/g, ''), 10);
        const args2 = amountString.toLowerCase()
            .replace(/k/g, '000')
            .replace(/m/g, '000000')
            .replace(/b/g, '000000000')
            .replace(/t/g, '000000000000')
            .replace(/q/g, '000000000000000');

        if (!amount || isNaN(amount) || amount < 1) {
            const errorEmbed = new MessageEmbed()
                .setTitle('> **❌ حدث خطأ**')
                .setDescription('```\nالرجاء إدخال مبلغ صالح\n```');
            const replyMessage = await message.reply({ embeds: [errorEmbed] });
            setTimeout(() => replyMessage.delete().catch(console.error), 5000);
            return;
        }

        const loadingEmbed = new MessageEmbed()
            .setDescription('> <a:ejgif1004:1241743499678973952> **جارٍ التحميل...**');

        const loadingMessage = await message.reply({ embeds: [loadingEmbed] });

        setTimeout(async () => {
            const tax = Math.floor(args2 * (20 / 19) + 1);
            const tax2 = Math.floor(tax - args2);
            const tax3 = Math.floor(tax2 * (20 / 19) + 1);
            const tax4 = Math.floor(tax2 + tax3 + args2);

            const taxEmbed = new MessageEmbed()
                .setTitle('> **✅ تحليل مالي شامل للائتمانات** 💰')
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: "ㅤㅤ المبلغ المطلوبㅤㅤ", value: `\`\`\`${args2}\`\`\``, inline: true },
                    { name: "ㅤㅤ ضريبة المبلغ فقطㅤㅤ", value: `\`\`\`${tax2}\`\`\``, inline: true },
                    { name: " المبلغ الإجمالي بما فيه الضريبة", value: `\`\`\`${tax}\`\`\``, inline: false }
                );


            await loadingMessage.edit({ embeds: [taxEmbed] });
        }, 1000);
    },
};
