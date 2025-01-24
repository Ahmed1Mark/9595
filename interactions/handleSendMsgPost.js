const { Interaction, EmbedBuilder } = require("discord.js");

async function handleSendMsgPost(interaction, hasClaimPermission) {
    if (!hasClaimPermission(interaction.member)) {
        await interaction.reply({ content: 'ليس لديك السلطة للقيام بهذا الإجراء', ephemeral: true });
        return;
    }

    const modalContent = 'أدخل النص لإرسال الرسالة';
    const modal = new EmbedBuilder()
        .setTitle('إرسال رسالة')
        .setDescription(modalContent)
        .setColor('BLUE')
        .setFooter('الرجاء إدخال رسالتك');

    const msg = await interaction.reply({ embeds: [modal], ephemeral: true });

    const filter = m => m.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    collector.on('collect', async m => {
        const content = m.content.trim();
        try {
            await interaction.channel.send({ content: content });
            await m.delete();
            await msg.delete();
        } catch (error) {
            console.error('حدث خطأ أثناء محاولة إرسال الرسالة:', error);
            await interaction.followUp({ content: 'حدث خطأ أثناء محاولة إرسال الرسالة', ephemeral: true });
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.followUp({ content: 'لم يتم توفير النص لإرسال الرسالة في الوقت المناسب', ephemeral: true });
            msg.delete();
        }
    });
}


module.exports = {
    handleSendMsgPost
};
