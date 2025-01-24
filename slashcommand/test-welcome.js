module.exports = {
    name: 'test-welcome',
    description: 'محاكاة انضمام عضو جديد إلى السيرفر.',
    async execute(interaction) {
        // التحقق مما إذا كان لدى المستخدم صلاحية ADMINISTRATOR
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'ليس لديك إذن لاستخدام هذا الأمر!', ephemeral: true });
        }

        // إرسال حدث guildMemberAdd باستخدام عضوية الـ interaction
        interaction.client.emit('guildMemberAdd', interaction.member);

        interaction.reply({ content: 'تم محاكاة انضمام عضو جديد إلى السيرفر!', ephemeral: true });
    },
};
