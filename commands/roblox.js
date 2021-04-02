const fetch = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLowerCase()) || message.guild.members.cache.find(r => r.displayName.toLowerCase() === args.join(' ').toLowerCase()) || message.member;
  user = user.user;
  if (!user) return message.channel.send(`Usage: ${client.getPrefix(message)}${exports.help.usage}`);
  const m = await message.channel.send('Getting...');
  let data;
  try {
    data = await fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
    message.channel.send('Roblox account found on Eryn', new MessageEmbed()
      .setTitle(`Username: ${data.body.robloxUsername} | User ID: ${data.body.robloxId}`)
      .setDescription(`https://roblox.com/users/${data.body.robloxId}/profile`)
      .setColor(0x00ae86)
    );
  } catch {
    message.channel.send('No account found for Eryn');
  }
  try {
    data = await fetch.get(`https://api.blox.link/v1/user/${user.id}`);
    if (!data.body.error) {
      message.channel.send('Roblox account found on Bloxlink', new MessageEmbed()
        .setTitle(`User ID: ${data.body.primaryAccount}`)
        .setDescription(`https://roblox.com/users/${data.body.primaryAccount}/profile`)
        .setColor(0x00ae86)
      );
    } else return message.channel.send(data.body.error);
  } catch {
    message.channel.send('No account found for Bloxlink');
  }
  m.delete();
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['rbx', 'rblx'],
  permLevel: 0,
  cooldown: 3000
};

exports.help = {
  name: 'roblox',
  description: "Attempts to get a discord user's roblox username",
  usage: 'roblox [discord user]'
};
