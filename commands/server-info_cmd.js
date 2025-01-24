const { MessageEmbed } = require('discord.js');
const {
    prefix,
    member_list_id,
    emoji_list_id,
    role_list_id,
    developerbot,
    ruleschannelid,
} = require('../config.json');


module.exports = {
    name: 'server-info',
    aliases: ['s-info','server'],
    description: 'عرض معلومات عن السيرفر.',
    async execute(message, args) {
        try {
            const guild = message.guild;

            // الحصول على عدد الأعضاء المتصلين
            const onlineMembers = guild.members.cache.filter(m => m.presence?.status === 'online').size;
            const idleMembers = guild.members.cache.filter(m => m.presence?.status === 'idle').size;
            const dndMembers = guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
            const offlineMembers = guild.members.cache.filter(m => !m.presence || m.presence.status === 'offline').size;

            // الحصول على عدد الأعضاء البشريين والبوتات
            const botCount = guild.members.cache.filter(m => m.user.bot).size;
            const humanCount = guild.memberCount - botCount;

            // الحصول على عدد القنوات النصية والصوتية
            const textChannels = guild.channels.cache.filter(ch => ch.type === 'GUILD_TEXT').size;
            const voiceChannels = guild.channels.cache.filter(ch => ch.type === 'GUILD_VOICE').size;
            const totalChannels = textChannels + voiceChannels;
            const owner = await guild.fetchOwner();

            // الحصول على الطابع الزمني لتاريخ إنشاء السيرفر
            const createdAtTimestamp = Math.floor(guild.createdAt.getTime() / 1000);

            // تحويل مستوى التحقق إلى نص
            const verificationLevels = {
                NONE: '0',
                LOW: '1',
                MEDIUM: '2',
                HIGH: '3',
                VERY_HIGH: '4'
            };
            const verificationLevel = verificationLevels[guild.verificationLevel] || 'Unknown';

            // الحصول على عدد الإيموجيات الثابتة والمتحركة في السيرفر
            const staticEmojiCount = guild.emojis.cache.filter(e => !e.animated).size;
            const animatedEmojiCount = guild.emojis.cache.filter(e => e.animated).size;
            const totalEmojiCount = staticEmojiCount + animatedEmojiCount;

            // إنشاء رسالة الـ embed
            const serverEmbed = new MessageEmbed()
                .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
                .setColor("2c2c34")
                .setTimestamp()
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: '<a:ejgif1039:1255827224804982824> بوستات السيرفر', value: `عدد البوستات:\`${guild.premiumSubscriptionCount}\``, inline: true },
                    { name: '📆 تم الإنشاء في', value: `<t:${createdAtTimestamp}:R>`, inline: true },
                    { name: '<a:ejgif1016:1241777039564996640> صاحب السيرفر', value: `<@${owner.id}>`, inline: true },
                    { 
                        name: `👤 الأعضاء (${guild.memberCount})`, 
                        value: `<:ejpic1029:1254328507799179305>:\`${onlineMembers}\` | <:ejpic1027:1254328501436420127>:\`${idleMembers}\`\n<:ejpic1026:1254328498668044331>:\`${dndMembers}\` | <:ejpic1028:1254328504703651850>:\`${offlineMembers}\``,
                        inline: true 
                    },
                    { name: `💬 القنوات (${totalChannels})`, value: `<:ejpic1031:1254330725067657216>:\`${textChannels}\`|<:ejpic1032:1254330763286024285>:\`${voiceChannels}\``, inline: true },
                    { name: '🆔 معرف السيرفر', value: `\`${guild.id}\``, inline: true },
                    { name: '<a:ejgif1038:1255826722633416704> أخرى', value: `اللغة: \`${guild.preferredLocale}\`\nمستوى التحقق: \`${verificationLevel}\``, inline: true },
                    { name: '📜 قواعد القناة', value: `<#${ruleschannelid}>`, inline: true },
                    { name: '<a:ejgif1033:1242349759298015334> المطور', value: `<@${developerbot}>`, inline: true },
                    { name: `<a:ejgif1029:1241784810104684717> الإيموجيات (${totalEmojiCount})`, value: `</emojilist:1242761880817369118>`, inline: true },
                    { name: `🔐 الرتب (${guild.roles.cache.size})`, value: '</rolelist:1244221039106461717>', inline: true },
                    { name: `👤 الأعضاء (${guild.memberCount})`, value: '</memberlist:1244222856166903931>', inline: true }
                )
                .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }));

            // إرسال رسالة الـ embed
            message.reply({ embeds: [serverEmbed] });
        } catch (error) {
            console.error('حدث خطأ:', error);
        }
    },
};
