const { MessageEmbed } = require('discord.js'); 

exports.run = async (client, message, args) => {
  try {
    if (isNaN(args[0])) return message.reply('please provide a valid guild ID.');
    const guild = client.guilds.resolve(args[0]);
    if (!guild) return message.channel.send('Unable to find server, please check the provided ID');
    message.channel.send(new MessageEmbed()
      .setAuthor(guild.name, guild.iconURL())
      .setTimestamp()
      .setDescription(guild.channels.cache.map(c => `${c.name} - ${c.type}`).join('\n'))
      .setColor('BLURPLE')
    );
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
  guildOnly: false,
  aliases: ['getchan'],
  permLevel: 10
};
  
exports.help = {
  name: 'getchannels',
  description: 'Gets a list of channels for the specified guild ID',
  usage: 'getchannels [guild id]'
};