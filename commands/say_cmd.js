module.exports = {
    name: 'say',
    description: 'جعل البوت يقول شيئًا ما.',
    async execute(message, args) {
        // التحقق مما إذا كان هناك رسالة مقدمة
        if (!args.length) {
            return message.reply("من فضلك قدم لي رسالة! ⚠️");
        }

        // دمج الargumentات في سلسلة واحدة
        const content = args.join(" ");

        // إرسال الرسالة المقدمة في نفس القناة
        message.channel.send(content);
    },
};
