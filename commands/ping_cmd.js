const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'التحقق من تأخر البوت',
    async execute(message) {
        if (message.author.bot) return;

        let msg = await message.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription("> <a:ejgif1004:1241743499678973952> **يرجى الانتظار...**")
            ],
        });

        let zap = "⚡";
        let green = "🟢";
        let red = "🔴";
        let yellow = "🟡";

        var botState = zap;
        var apiState = zap;
        var timediff = zap;

        let apiPing = message.client.ws.ping;
        let botPing = Math.floor(msg.createdAt - message.createdAt);

        if (apiPing >= 40 && apiPing < 200) {
            apiState = green;
        } else if (apiPing >= 200 && apiPing < 400) {
            apiState = yellow;
        } else if (apiPing >= 400) {
            apiState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            botState = green;
        } else if (botPing >= 200 && botPing < 400) {
            botState = yellow;
        } else if (botPing >= 400) {
            botState = red;
        }

        if (botPing >= 40 && botPing < 200) {
            timediff = green;
        } else if (botPing >= 200 && botPing < 400) {
            timediff = yellow;
        } else if (botPing >= 400) {
            timediff = red;
        }

        setTimeout(() => {
            msg.edit({
                embeds: [
                    new MessageEmbed()
                        .setTitle("📊 | حالة البوت")
                        .setTimestamp()
                        .setFooter({ text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            {
                                name: "تأخر الـ API",
                                value: `**\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\`**`,
                                inline: true,
                            },
                            {
                                name: "تأخر البوت",
                                value: `**\`\`\`yml\n${botState} | ${botPing}ms\`\`\`**`,
                                inline: true,
                            },
                            {
                                name: "فرق الوقت",
                                value: `**\`\`\`yml\n${timediff} | ${(Date.now() - message.createdTimestamp)}ms\`\`\`**`,
                                inline: true,
                            }
                        )
                ],
            });
        }, 1000); // تأخير العملية لثانية واحدة (1000 مللي ثانية)
    },
};
