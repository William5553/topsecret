const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
  const serverQueue = client.queue.get(message.guild.id);
  if (!serverQueue) return message.channel.send('❌ **Nothing playing in this server**');
  try {
    let currentPage = 0;
    const embeds = generateQueueEmbed(message, serverQueue.songs);
    const queueEmbed = await message.channel.send(
      `**Current Page - ${currentPage + 1}/${embeds.length}**`,
      embeds[currentPage]
    );
    await queueEmbed.react('⬅️');
    await queueEmbed.react('⏹');
    await queueEmbed.react('➡️');

    const filter = (reaction, user) => ['⬅️', '⏹', '➡️'].includes(reaction.emoji.name) && message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter, {
      time: 60000
    });

    collector.on('collect', async reaction => {
      try {
        if (reaction.emoji.name === '➡️') {
          if (currentPage < embeds.length - 1) {
            currentPage++;
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else if (reaction.emoji.name === '⬅️') {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
          }
        } else {
          collector.stop();
          reaction.message.reactions.removeAll();
        }
        await reaction.users.remove(message.author.id);
      } catch {
        return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
      }
    });
  } catch {
    return message.channel.send('**Missing Permissions - [ADD_REACTIONS, MANAGE_MESSAGES]!**');
  }
};

function generateQueueEmbed(message, queue) {
  const embeds = [];
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, i*10+10);
    let j = i;
    const embed = new MessageEmbed()
      .setTitle('Song Queue\n')
      .setThumbnail(message.guild.iconURL())
      .setColor('#F8AA2A')
      .setDescription(`**Current Song - [${queue[0].title}](${queue[0].url})**\n\n${current.map(track => `${++j} - [${track.title}](${track.url})`).join('\n')}`)
      .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'queue',
  description: 'Show the music queue and now playing',
  usage: 'queue'
};
