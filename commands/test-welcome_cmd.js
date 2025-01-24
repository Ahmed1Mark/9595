module.exports = {
    name: 'test-welcome',
    description: 'تحاكي انضمام عضو جديد إلى السيرفر.',
    async execute(message, args) {
        // التحقق مما إذا كان لدى المستخدم صلاحية ADMINISTRATOR
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply({ content: 'ليس لديك صلاحية استخدام هذا الأمر!', ephemeral: true });
        }

        // إرسال حدث guildMemberAdd مع عضو التفاعل
        message.client.emit('guildMemberAdd', message.member);

        message.reply({ content: 'تم تحاكي انضمام عضو جديد إلى السيرفر!', ephemeral: true });
    },
};
