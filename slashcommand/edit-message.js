const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'edit-message',
    description: 'تحرير الرسالة بواسطة معرف الرسالة.',
    options: [
        {
            name: 'message_id',
            description: 'تعديل رسالة بواسطة معرف الرسالة.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'format',
            description: 'تنسيق الرسالة للتعديل عليها.',
            type: 'STRING',
            required: true,
            choices: [
                { name: 'Embed', value: 'embed' },
                { name: 'Text', value: 'text' },
            ],
        },
        {
            name: 'new_text',
            description: 'النص الجديد الذي ترغب في تعيينه للرسالة.',
            type: 'STRING',
            required: true,
        },
    ],
    async execute(interaction) {
        // التحقق مما إذا كان لدى المستخدم إذن إدارة الرسائل
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'ليس لديك إذن لاستخدام هذا الأمر!', ephemeral: true });
        }

        const messageId = interaction.options.getString('message_id');
        const newText = interaction.options.getString('new_text');
        const format = interaction.options.getString('format');

        try {
            const message = await interaction.channel.messages.fetch(messageId);
            if (!message) {
                return interaction.reply({ content: 'الرسالة غير موجودة!', ephemeral: true });
            }

            if (format === 'embed') {
                const embed = new MessageEmbed()
                    .setDescription(newText);
                await message.edit({ embeds: [embed] });
                interaction.reply({ content: 'تم تعديل الرسالة بنجاح!', ephemeral: true });
            } else {
                await message.edit(newText);
                interaction.reply({ content: 'تم تعديل الرسالة بنجاح!', ephemeral: true });
            }
        } catch (error) {
            console.error('خطأ في تعديل الرسالة:', error);
            interaction.reply({ content: 'حدث خطأ أثناء تعديل الرسالة.', ephemeral: true });
        }
    },
};