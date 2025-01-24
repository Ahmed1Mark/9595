const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'react-message',
    description: 'إضافة ردود فعل إلى رسالة معينة.',
    options: [
        {
            name: 'emojis',
            description: 'الرموز التعبيرية للرد عليها (مفصولة بفاصلة). يمكنك إضافة رمز تعبيري واحد أو أكثر، مثل 😊, 👍, 🎉',
            type: 'STRING',
            required: true,
        },
        {
            name: 'message_id',
            description: 'معرف الرسالة التي تريد ردود الفعل عليها.',
            type: 'STRING',
            required: true,
        },
    ],
    async execute(interaction) {
        // التحقق مما إذا كان لدى المستخدم صلاحية "ADMINISTRATOR"
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'لا تمتلك الصلاحية لاستخدام هذا الأمر.', ephemeral: true });
        }

        const emojis = interaction.options.getString('emojis').split(',');
        const messageId = interaction.options.getString('message_id');
        const channel = interaction.channel;

        try {
            const message = await channel.messages.fetch(messageId);
            
            // إضافة ردود الفعل لكل رمز تعبيري في القائمة
            for (const emoji of emojis) {
                await message.react(emoji.trim());
            }
            
            const embed = new MessageEmbed()
                .setColor('#00FF00')
                .setDescription(`تم إضافة ردود الفعل بنجاح (${emojis.join(', ')}) إلى الرسالة.`);
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('حدث خطأ أثناء تنفيذ /react-message:', error);

            let errorMessage = 'حدث خطأ أثناء محاولة إضافة ردود الفعل.';

            // التحقق من أنواع الأخطاء المحددة والتعامل معها بشكل مناسب
            if (error.code === 50035) {
                errorMessage = 'تم تقديم معرف الرسالة غير الصالح. يرجى التأكد من تقديم معرف رسالة صالح.';
            } else {
                errorMessage += ' يرجى التأكد من صحة معرف الرسالة وأن لدي الصلاحيات اللازمة.';
            }

            const errorEmbed = new MessageEmbed()
                .setColor('#FF0000')
                .setDescription(errorMessage);
            
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
