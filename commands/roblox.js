const fetch = require('node-superfetch'),
  { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const user = message.mentions.users.first();
  if (!user) return message.channel.send(`Usage: ${client.settings.prefix}${exports.help.usage}`);
  let data;
  try {
    data = await fetch.get(`https://verify.eryn.io/api/user/${user.id}`);
  } catch (e) {
    message.channel.send('I was unable to find a Roblox account linked with that user');
  }
  message.channel.send(new MessageEmbed()
    .setDescription(`[${data.body.robloxUsername}](https://roblox.com/users/${data.body.robloxId}/profile)`)
  );
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'roblox',
  description: "Attempts to get a discord user's roblox username",
  usage: 'roblox [discord user]'
};
