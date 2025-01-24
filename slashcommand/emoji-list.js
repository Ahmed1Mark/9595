const { MessageEmbed } = require('discord.js');

const commandCooldown = new Map();
const cooldownDuration = 10000; // 10 ثوانٍ

module.exports = {
    name: 'emoji-list',
    description: 'قم بإدراج جميع الرموز التعبيرية الثابتة والمتحركة في الخادم',
    options: [], // Add options if needed

    execute: async (interaction) => {
        const now = Date.now();
        if (commandCooldown.has(interaction.user.id)) {
            const expirationTime = commandCooldown.get(interaction.user.id) + cooldownDuration;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000; // الوقت المتبقي بالثواني
                await interaction.reply({ content: `يرجى الانتظار ${timeLeft.toFixed(1)} ثانية قبل استخدام هذا الأمر مرة أخرى.`, ephemeral: true });
                return;
            }
        }

        // إضافة المستخدم إلى مجموعة التبريد
        commandCooldown.set(interaction.user.id, now);
        setTimeout(() => commandCooldown.delete(interaction.user.id), cooldownDuration); // إزالة المستخدم بعد 10 ثوانٍ

        const emojis = interaction.guild.emojis.cache;

        // تقسيم الرموز التعبيرية إلى عادية ومتحركة
        const staticEmojis = emojis.filter(emoji => !emoji.animated);
        const animatedEmojis = emojis.filter(emoji => emoji.animated);

        const staticEmojisCount = staticEmojis.size;
        const animatedEmojisCount = animatedEmojis.size;
        const totalEmojisCount = staticEmojisCount + animatedEmojisCount;

        const emojisPerEmbed = 20; // عدد الرموز التعبيرية لكل Embed

        const staticEmojiChunks = chunkArray(Array.from(staticEmojis.values()), emojisPerEmbed);
        const animatedEmojiChunks = chunkArray(Array.from(animatedEmojis.values()), emojisPerEmbed);

        let isFirstOverallEmbed = true;
        let embeds = [];

        // إنشاء الـ embeds للرموز التعبيرية العادية
        for (const chunk of staticEmojiChunks) {
            const embed = new MessageEmbed()
                .setTitle('الرموز التعبيرية الثابتة');

            if (isFirstOverallEmbed) {
                embed.setFooter({ text: `الإيموجيات الثابتة: ${staticEmojisCount}, الإيموجيات المتحركة: ${animatedEmojisCount}, الإجمالي: ${totalEmojisCount}` })
                     .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(emoji => {
                description += `${emoji.toString()} - CODE : \`${emoji.toString()}\`\n`;
            });

            embed.setDescription(description);
            embeds.push(embed);
        }

        // إنشاء الـ embeds للرموز التعبيرية المتحركة
        for (const chunk of animatedEmojiChunks) {
            const embed = new MessageEmbed()
                .setTitle('الرموز التعبيرية المتحركة');

            if (isFirstOverallEmbed) {
                embed.setFooter({ text: `الإيموجيات الثابتة: ${staticEmojisCount}, الإيموجيات المتحركة: ${animatedEmojisCount}, الإجمالي: ${totalEmojisCount}` })
                     .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) });
                isFirstOverallEmbed = false;
            }

            let description = '';
            chunk.forEach(emoji => {
                description += `${emoji.toString()} - CODE : \`${emoji.toString()}\`\n`;
            });

            embed.setDescription(description);
            embeds.push(embed);
        }

        // تأجيل الرد
        await interaction.deferReply({ ephemeral: true });

        // إرسال الـ embeds كـ ephemeral
        for (const embed of embeds) {
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    }
};

// وظيفة لتقسيم مصفوفة إلى مجموعات
function chunkArray(array, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
}
