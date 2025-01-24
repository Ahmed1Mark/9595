const { MessageAttachment, MessageEmbed } = require('discord.js');

// دالة لمعالجة التفاعل transcript
async function handleTranscript(interaction) {
    if (interaction.customId === 'transscript') {
        const ticketChannel = interaction.channel;
        try {
            const transcript = await createTranscript(ticketChannel);
            const textBuffer = Buffer.from(transcript, 'utf-8');
          
          

            // Get the user who clicked the button
            const claimTicket = interaction.user;
            const startTimestamp = Math.floor(Date.now() / 1000) - 87;

            const embed = interaction.message.embeds[0];
            const ticketOwnerField = embed.fields.find(field => field.name === 'منشئ التذكرة');
            const ticketOwnerValue = ticketOwnerField ? ticketOwnerField.value : 'غير معروف';
            const ticketOwnerField2 = embed.fields.find(field => field.name === 'تاريخ التذكرة');
            const ticketOwnerValue2 = ticketOwnerField2 ? ticketOwnerField2.value : 'غير معروف';
            const ticketOwnerField3 = embed.fields.find(field => field.name === 'تم إستلام التذكرة بواسطة');
            const ticketOwnerValue3 = ticketOwnerField3 ? ticketOwnerField3.value : '\`لا يوجد أحد\`';
            const ticketOwnerField4 = embed.fields.find(field => field.name === 'قسم التذكرة');
            const ticketOwnerValue4 = ticketOwnerField4 ? ticketOwnerField4.value : 'غير معروف';
          
            // استخراج اسم التذكرة من اسم القناة
            const ticketName = ticketChannel.name;
          
            // إنشاء الرسالة المتضمنة
            const embed2 = new MessageEmbed()
                .setTitle('> ✅ تم حفظ التذكرة بنجاح')
                .addFields(
                    { name: '\u2003', value: `\u2003`, inline: false },
                    { name: 'منشئ التذكرة', value: `${ticketOwnerValue}`, inline: true },
                    { name: 'تاريخ إنشاء التذكرة', value: `\`${ticketOwnerValue2}\``, inline: true },
                    { name: 'قسم التذكرة', value: `\`${ticketOwnerValue4}\``, inline: true },
                    { name: 'تم إستلام التذكرة بواسطة', value: `${ticketOwnerValue3}`, inline: true },
                    { name: 'أسم التذكرة', value: `\`${ticketName}\``, inline: true },
                    { name: 'تم حفظ التذكرة منذ', value: `<t:${startTimestamp}:R>`, inline: true }
                )
                .setColor('#2c2c34'); // يمكنك تغيير اللون حسب رغبتك

            // إرسال الملف برسالة خاصة إلى الشخص الذي قام بالتفاعل
            const attachment = new MessageAttachment(textBuffer, 'transcript.txt');
            await interaction.user.send({ files: [attachment], embeds: [embed2] });

            await interaction.reply({ content: 'تم إنشاء النص وإرساله إليك.', ephemeral: true });
        } catch (error) {
            console.error('Error creating or sending transcript:', error.message);
            await interaction.reply({ content: 'فشل إنشاء النص أو إرساله.', ephemeral: true });
        }
    }
}

// دالة لإنشاء سجل المحادثة
async function createTranscript(channel) {
    try {
        let transcript = '';

        // جمع المحادثة من الرسائل في التذكرة
        const messages = await channel.messages.fetch({ limit: 100 }); // يمكن تعديل الحد الأقصى لعدد الرسائل هنا
        messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        messages.forEach(message => {
            const timestamp = new Date(message.createdTimestamp).toLocaleString('en-US', { timeZone: 'Africa/Cairo' });
            transcript += `[${timestamp}] ${message.author.tag}: ${message.content}\n`;
        });

        return transcript;
    } catch (error) {
        console.error('Error creating ticket transcript:', error.message);
        throw error;
    }
}

// تصدير الدالة لمعالجة التفاعل transcript
module.exports = {
    handleTranscript
};
