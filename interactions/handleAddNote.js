const { MessageEmbed } = require('discord.js');

// Function to handle the add_note interaction
async function handleAddNote(interaction, hasClaimPermission) {
    // Check for the required permission to use the command
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة لاتخاذ هذا الإجراء', ephemeral: true });
        return;
    }
    try {
        // Defer the response until the interaction is handled
        await interaction.deferReply({ ephemeral: true });

        const filter = m => m.author.id === interaction.user.id;
        const addNotePrompt = await interaction.followUp({ content: 'يرجى كتابة ملاحظتك', ephemeral: true });
        const collectedMessages = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] });

        const note = collectedMessages.first().content.trim();

        // تحقق من وجود التضمين وإضافة الملاحظة إليه
        let embed = interaction.message.embeds[0];
        if (!embed) {
            embed = new MessageEmbed();
        }
        embed.addField(`ملاحظة (بواسطة ${interaction.user.username})`, `\`\`\`${note}\`\`\``); // إضافة اسم الشخص

        // تحديث الرسالة بالتضمين الجديد
        await interaction.editReply({ embeds: [embed] });

        await collectedMessages.first().delete();
        await addNotePrompt.delete();
    } catch (error) {
        // هنا، نحن نستخدم editReply بدلاً من reply لأن التفاعل قد تم تأجيله بالفعل
        await interaction.editReply({ content: 'فشلت إضافة ملاحظة. حاول مرة اخرى.', ephemeral: true });
    }
}

// Export the function to handle the add_note interaction
module.exports = {
    handleAddNote
};
