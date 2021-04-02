const { MessageEmbed } = require('discord.js');
const { parseUser, caseNumber } = require('../util/Util');

exports.run = async (client, message, args) => {
  try {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args[0].toLowerCase());
    if (!member) return message.reply('you must mention someone to mute them').catch(client.logger.error);
    if (parseUser(message, member) !== true) return;
  
    let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted') || message.guild.roles.resolve(client.settings.get(message.guild.id).muteRoleID);

    if (!message.guild.me.hasPermission('MANAGE_ROLES'))
      return message.reply('I do not have the **MANAGE_ROLES** permission').catch(client.logger.error);

    if (message.guild.me.roles.highest.comparePositionTo(muteRole) < 1) return message.reply("I don't have control over the muted role, move my role above the muted role.");

    if (!muteRole) {
      muteRole = await message.guild.roles
        .create({
          data: {
            name: 'muted',
            color: [255, 0, 0]
          }
        })
        .catch(client.logger.error);
      client.settings.set(message.guild.id, muteRole.id, 'muteRoleID');
    }

    if (!client.settings.get(message.guild.id).muteRoleID) 
      client.settings.set(message.guild.id, muteRole.id, 'muteRoleID');

    const reason = args.splice(1).join(' ');

    message.guild.channels.cache.forEach(chan => {
      chan.updateOverwrite(muteRole, {
        SEND_MESSAGES: false
      });
    });
 
    if (member.roles.cache.has(muteRole.id)) {
      member.roles
        .remove(muteRole.id, reason)
        .then(async () => {
          message.channel.send(`Unmuted ${member.user}`);
          if (client.settings.get(message.guild.id).logsID) {
            const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
            const caseNum = await caseNumber(client, botlog);
            botlog.send(new MessageEmbed()
              .setColor(0x00ae86)
              .setTimestamp()
              .setDescription(`**Action:** Unmute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**User ID:** ${member.user.tag}`)
              .setFooter(`ID ${caseNum}`)
            );
          }
        });
    } else {
      member.roles
        .add(muteRole.id, reason)
        .then(async () => {
          message.channel.send(`Muted ${member.user}`);
          if (client.settings.get(message.guild.id).logsID) {
            const botlog = message.guild.channels.resolve(client.settings.get(message.guild.id).logsID);
            const caseNum = await caseNumber(client, botlog);
            botlog.send(new MessageEmbed()
              .setColor(0x00ae86)
              .setTimestamp()
              .setDescription(`**Action:** Mute\n**Target:** ${member.user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}\n**User ID:** ${member.user.tag}`)
              .setFooter(`ID ${caseNum}`)
            );
          }
        });
    }
  } catch (err) {
    return message.channel.send(new MessageEmbed()
      .setColor('#FF0000')
      .setTimestamp()
      .setTitle('Please report this on GitHub')
      .setURL('https://github.com/william5553/triv/issues')
      .setDescription(`**Stack Trace:**\n\`\`\`${err.stack}\`\`\``)
      .addField('**Command:**', `${message.content}`)
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unmute'],
  permLevel: 2
};

exports.help = {
  name: 'mute',
  description: 'Toggles the mute of a member',
  usage: 'mute [user] [reason] OR unmute [user] [reason]'
};
