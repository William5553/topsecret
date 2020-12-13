const texts = require('../assets/shutdown.json');

exports.run = async (client, message) => {
  const games = client.games.size;
  let areIs = 'are';
  if (games > 0) {
    const currentString = `${games} game${games > 1 ? 's' : ''}`;
    if (games === 1) areIs = 'is';
			
    await message.reply(`there ${areIs} currently **${currentString}**. Are you sure?`);
    const verification = await client.verify(message.channel, message.author);
    if (!verification) return message.channel.send('Aborted restart.');
  }
  await msg.channel.send(texts.random());
  client.logger.log(`${msg.author.tag} is restarting the bot`);
  client.destroy();
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['die', 'kys', 'shutdown', 'restart', 'reboot'],
  permLevel: 10
};

exports.help = {
  name: 'disconnect',
  description: 'Kills the bot',
  usage: 'disconnect'
};
