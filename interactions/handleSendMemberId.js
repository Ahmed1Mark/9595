// interactions/send_member_id.js

const { MessageCollector } = require('discord.js');

// دالة لمعالجة التفاعل sendmemberid
async function handleSendMemberId(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة للقيام بهذا الإجراء', ephemeral: true });
        return;
    }
    
    // طلب إدخال ID الشخص
    await interaction.reply({ content: 'تحت الصيانة والاختبار', ephemeral: true });

    const filter = (response) => response.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 }); // المستخدم لديه دقيقة واحدة للرد

    collector.on('collect', async (msg) => {
        const recipientId = msg.content;

        // طلب إدخال نص الرسالة
        await interaction.followUp({ content: 'أدخل النص الذي ترغب في إرساله للشخص', ephemeral: true });

        const messageCollector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

        messageCollector.on('collect', async (message) => {
            const textToSend = message.content;

            // هنا يمكنك إجراء أي إجراء آخر مثل إرسال الرسالة للمستخدم المحدد
            await interaction.followUp({ content: `ستقوم بإرسال الرسالة "${textToSend}" للمستخدم بالرقم ${recipientId}`, ephemeral: true });
        });

        messageCollector.on('end', async (collected) => {
            if (collected.size === 0) {
                await interaction.followUp({ content: 'لم يتم تقديم استجابة في الوقت المحدد.', ephemeral: true });
            }
        });
    });

    collector.on('end', async (collected) => {
        if (collected.size === 0) {
            await interaction.followUp({ content: 'لم يتم تقديم استجابة في الوقت المحدد.', ephemeral: true });
        }
    });
}


// تصدير الدالة لمعالجة التفاعل sendmemberid
module.exports = {
    handleSendMemberId
};
