// interactions/send_owntick.js
/*
// Function to handle the sendowntick interaction
async function handleSendOwnTick(interaction, hasClaimPermission) {
    // Check for the required permission to use the command
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة للقيام بهذا الإجراء', ephemeral: true });
        return;
    }

    // Send a message to request the text to be sent to the user
    await interaction.reply({ 
        content: 'Please enter the text you want to send to the user:', 
        ephemeral: true 
    });

    // Listen for the message containing the text from the user
    const filter = m => m.author.id === interaction.user.id;
    const collected = await interaction.channel.awaitMessages({
        filter,
        max: 1,
        time: 60000, // Wait for 60 seconds
        errors: ['time']
    });

    // Get the content of the collected message
    const messageContent = collected.first().content;

    // Delete the collected message from the user
    collected.first().delete();

    // Send the collected text to the user who opened the ticket
    try {
        await interaction.user.send(`The following notification has been sent to you: ${messageContent}`);
        // Reply with success message
        await interaction.followUp({ content: 'Message sent successfully.', ephemeral: true });
    } catch (error) {
        console.error('Error sending message to user:', error.message);
    }
}
*/
// interactions/sendmsgdisabled.js
async function handleSendOwnTick(interaction) {
    try {
        await interaction.reply({
            content: `تحت الصيانة والاختبار`, ephemeral: true
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'حدث خطأ أثناء تعطيل إرسال الرسائل.', ephemeral: true
        });
    }
}


// Export the function to handle the sendowntick interaction
module.exports = {
    handleSendOwnTick
};
