// interactions/sendmsgdisabled.js
async function handleSendMsgDisabled(interaction) {
    try {
        await interaction.reply({
            content: `تحت الصيانة والاختبار`, ephemeral: true
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'حدث خطأ أثناء معالجة طلبك. الرجاء معاودة المحاولة في وقت لاحق.', ephemeral: true
        });
    }
}

// Export the function to handle the sendmsgdisabled interaction
module.exports = {
    handleSendMsgDisabled
};
