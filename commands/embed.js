module.exports = {
  name : 'embed',
  description : 'to make the bot say mesage as an embed',

  async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react){
    let embed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL())
      .setColor("RANDOM")
      .setTimestamp();
    let errorEmbed = new Discord.MessageEmbed()
      .setColor("RED")
      .setTimestamp(); 
    if(!isAdmin(message.member)){
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    let msg;
    let textChannel = message.mentions.channels.first()
    if(textChannel){
      msg = messageEmojiFinder(client, message, args.slice(1));
      if(!msg){
        errorEmbed.setDescription("Write something bruh.");
        await message.channel.send(errorEmbed).catch(error => {/*nothing*/});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      embed.setDescription(`${msg}`);
      await textChannel.send(embed).catch(error => {/*nothing*/});
    }
    else{
      msg = messageEmojiFinder(client, message, args);
      if(!msg){
        errorEmbed.setDescription("Write something bruh.");
        await message.channel.send(errorEmbed).catch(error => {/*nothing*/});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      embed.setDescription(`${msg}`);
      await message.channel.send(embed).catch(error => {/*nothing*/});
    }  
    await message.delete().catch(error => {/*nothing*/});
  }
}