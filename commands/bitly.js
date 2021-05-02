const request = require('node-superfetch');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!process.env.bitly_key) return message.reply('the bot owner has not set up this command yet');
  if (!args) return message.reply(`usage: ${client.getPrefix(message)}${exports.help.usage}`);
  const url = args.join(' ');
  if (encodeURI(url).length > 2083) return message.reply('your URL is too long');
  try {
    const { body } = await request
      .post('https://api-ssl.bitly.com/v4/shorten')
      .send({ long_url: url })
      .set({ Authorization: `Bearer ${process.env.bitly_key}` });
    return message.channel.send(body.link);
  } catch (err) {
    if (err.status === 400) return message.reply('You provided an invalid URL. Please try again.');
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
  aliases: ['urlshorten', 'bit.ly', 'shortenurl'],
  permLevel: 0,
  cooldown: 10000
};
  
exports.help = {
  name: 'bitly',
  description: 'Shortens a URL using bit.ly',
  usage: 'bitly [url]',
  example: 'bitly https://github.com/william5553/triv'
};
  
