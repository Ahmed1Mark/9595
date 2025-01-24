const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { TicketClaimChannelId } = require('../config.json');

// Function to handle the claim_ticket interaction
async function handleClaimTicket(interaction, hasClaimPermission) {
    try {
        // Check if the member has permission to claim
        const member = interaction.member;
        if (!hasClaimPermission(member)) {
            await interaction.reply({ content: 'ليس لديك السلطة لاتخاذ هذا الإجراء', ephemeral: true });
            return;
        }

        let currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);

        const claimTicket = interaction.user;
        const startTimestamp = Math.floor(Date.now() / 1000) - 87;
        const egyptianDate = new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Cairo' });
        const egyptianDate2 = currentTime.toLocaleTimeString('en-EG', { timeZone: 'Africa/Cairo', hour12: true, hour: 'numeric', minute: 'numeric' });

        // Send a confirmation message in the chat with embed
        const embed = interaction.message.embeds[0];
        const ticketOwnerField = embed.fields.find(field => field.name === 'منشئ التذكرة');
        const ticketOwnerValue = ticketOwnerField ? ticketOwnerField.value : 'غير معروف';
        const ticketOwnerField2 = embed.fields.find(field => field.name === 'قسم التذكرة');
        const ticketOwnerValue2 = ticketOwnerField2 ? ticketOwnerField2.value : 'غير معروف';
        const ticketOwnerField3 = embed.fields.find(field => field.name === 'الدعم المطلوب');
        const ticketOwnerValue3 = ticketOwnerField3 ? ticketOwnerField3.value : 'غير معروف';

        const customEmbed = new MessageEmbed()
            .setTitle("> ✅ الدعم متاح الآن")
            .setColor('#2c2c34')
            .setThumbnail(claimTicket.displayAvatarURL({ dynamic: true, size: 4096 }))
            .addFields(
                { name: '\u2003', value: '\u2003', inline: false },
                { name: 'معرّف الشخص', value: `\`${claimTicket.id}\``, inline: true },
                { name: 'تاريخ استلام التذكرة', value: `\`${egyptianDate2},${egyptianDate}\``, inline: true },
                { name: 'الدعم المطلوب', value: `${ticketOwnerValue3}`, inline: true },
                { name: 'تم استلام التذكرة بواسطة', value: `${claimTicket}`, inline: true },
                { name: 'قسم التذكرة', value: `\`${ticketOwnerValue2}\``, inline: true },
                { name: 'تم استلام التذكرة منذ', value: `<t:${startTimestamp}:R>`, inline: true }
            );

        await interaction.channel.send({ content: `||${claimTicket} - ${ticketOwnerValue}||`, embeds: [customEmbed] });

        // Defer the interaction to prevent timeout
        await interaction.deferUpdate();

        // Send a confirmation message and edit the existing embed
        const fieldToUpdate = embed.fields.find(field => field.name === 'إستلام التذكرة');
        if (fieldToUpdate) {
            fieldToUpdate.name = 'تم إستلام التذكرة بواسطة'; // Update the name of the field
            fieldToUpdate.value = `${claimTicket}`; // Update the value of the field
        }

        await interaction.editReply({ embeds: [embed], ephemeral: true });

        // Disable the claim button to prevent further claims
        const components = interaction.message.components; // Get existing components
        const rowIdx = components.findIndex(row => row.components.some(component => component.customId === 'claim_ticket')); // Find the row index containing the claim button
        if (rowIdx !== -1) {
            const row = components[rowIdx];
            const buttons = row.components.map(component => { // Map over components to update claim button
                if (component.customId === 'claim_ticket') {
                    return new MessageButton()
                        .setCustomId('claim_ticket')
                        .setLabel('تم إستلام التذكرة')
                        .setEmoji('🛡️')
                        .setStyle('SUCCESS') // Change button style to secondary (greyed out)
                        .setDisabled(true); // Disable the button
                } else {
                    return component;
                }
            });
            components[rowIdx] = new MessageActionRow().addComponents(...buttons); // Create a new row with updated buttons
            await interaction.editReply({ components });
        }

        // Prepare data to write to claim-data.json
        const claimData = {
            room_id: interaction.channelId,
            claim_user_id: claimTicket.id,
            claim_user_name: claimTicket.username,
            claim_date: `${egyptianDate2},${egyptianDate}`,
            ticket_name: ticketOwnerValue2 // Assuming ticketOwnerValue2 is the name of the ticket
        };

        // Write claimData to claim-data.json
        const claimDataPath = path.join(__dirname, '..', 'claim-data.json'); // Adjust the path as per your project structure
        fs.writeFileSync(claimDataPath, JSON.stringify(claimData, null, 2));

        console.log('Claim data saved successfully.');

        // Read claim-data.json and send Embed to a specific channel
        const claimDataContent = JSON.parse(fs.readFileSync(claimDataPath, 'utf8'));

        const notificationEmbed = new MessageEmbed()
            .setTitle('📩 بيانات استلام التذكرة')
            .addFields(
                { name: 'الذكرة', value: `<#${claimDataContent.room_id}>`, inline: true },
                { name: 'اسم الشخص', value: `\`${claimDataContent.claim_user_name}\``, inline: true },
                { name: 'تم إستلام التذكرة بواسطة', value: `<@${claimDataContent.claim_user_id}>`, inline: true },
                { name: 'منشئ التذكره', value: `\`قيد الصيانه والتطوير\``, inline: true },
                { name: 'تاريخ الاستلام', value: `${claimDataContent.claim_date}`, inline: true },
                { name: 'اسم التذكرة', value: `${claimDataContent.ticket_name}`, inline: true }
            );

        const targetChannel = interaction.client.channels.cache.get(TicketClaimChannelId);
        if (targetChannel) {
            await targetChannel.send({ embeds: [notificationEmbed] });
        } else {
            console.error('Unable to find the target channel.');
        }

    } catch (error) {
        console.error("Error handling claim ticket interaction: ", error);
    }
}

// Export the function to handle claim_ticket interaction
module.exports = {
    handleClaimTicket
};
