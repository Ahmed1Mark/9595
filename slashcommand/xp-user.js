const { MessageEmbed } = require('discord.js');
const moment = require('moment-timezone');
const fs = require('fs'); // استيراد وحدة fs للتعامل مع الملفات

const xpPerLevel = 1111;
const levelUpFilePath = './levelup.json';

function getUserData(userId) {
    try {
        const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
        return userData[userId];
    } catch (err) {
        console.error('حدث خطأ أثناء قراءة الملف:', err);
        return null;
    }
}

function getUserLevelAndXP(userData) {
    const level = Math.floor(userData / xpPerLevel);
    const xp = userData % xpPerLevel;
    return { level, xp };
}

function getLeaderboardPosition(userId) {
    const userData = JSON.parse(fs.readFileSync(levelUpFilePath, 'utf8'));
    const userXP = userData[userId] || 0;
    let position = 1;

    for (const id in userData) {
        if (userData[id] > userXP) {
            position++;
        }
    }

    return position;
}

module.exports = {
    name: 'xp-user',
    description: 'عرض معلومات الخبرة والمستوى لمستخدم معين.',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'المستخدم الذي ترغب في عرض معلومات الخبرة له',
            required: false,
        },
    ],
    async execute(interaction) {
        console.log('تنفيذ أمر xp-user...');

        const userId = interaction.options.getUser('user')?.id || interaction.user.id;
        console.log('معرف المستخدم المستهدف:', userId);

        const userData = getUserData(userId);
        console.log('استرجاع بيانات المستخدم:', userData);

        if (!userData) {
            console.log('لم يتم العثور على بيانات المستخدم.');
            return await interaction.reply('المستخدم غير موجود في نظام التسوية.');
        }

        const { level, xp } = getUserLevelAndXP(userData);
        const leaderboardPosition = getLeaderboardPosition(userId);
        const user = await interaction.client.users.fetch(userId);

        // التحقق من وجود joinedAt قبل استخدامه
        const joinedAtDate = user.joinedAt ? moment(user.joinedAt).format('YYYY/MM/DD') : 'غير معروف';

        const userAvatarURL = user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 });
        const username = user.username;
        const id = user.id;

        const embed = new MessageEmbed()
            .setColor("#2c2c34")
            .setAuthor({ name: `معلومات حول مستوي العضو`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(userAvatarURL)
            .addFields(
                { name: 'المستوى', value: `\`\`\`${level.toString()}\`\`\``, inline: true },
                { name: 'الترتيب', value: `\`\`\`#${leaderboardPosition}\`\`\``, inline: true },
                { name: 'إجمالي نقاط الخبرة', value: `\`\`\`${level * xpPerLevel + xp}\`\`\``, inline: true },
                { name: 'نقاط الخبرة الحاليه', value: `\`\`\`${xp}/${xpPerLevel}\`\`\``, inline: true },
                { name: 'اسم المستخدم', value: `\`\`\`${username}\`\`\``, inline: true },
                { name: 'مُعرف الشخص', value: `\`\`\`${id}\`\`\``, inline: true }
            )
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        console.log('إرسال الـ embed...');
        await interaction.reply({ embeds: [embed] });
        console.log('تم تنفيذ الأمر بنجاح.');
    },
};
