module.exports = {
  name : 'avatar',
  description : 'to get avatar of a user',

  async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react){
    let embed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTimestamp();
    if(!args[0]){
      embed.setDescription(`Here is the avatar of ${message.author}`)
        .setImage(`${message.author.displayAvatarURL({size: 4096})}`);
      await message.channel.send(embed).catch(error => {/*nothing*/});    
    }
    else{
      let person = personFinder(message, args[0], "user");
      if(person === "not found"){
        embed.setDescription("Wrong user provided or user doesn't exists in this server.")
          .setColor("RED");
        await message.channel.send(embed).catch(error => {/*nothing*/});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      } 
      embed.setDescription(`Here is the PFP of ${person}`)
        .setColor("YELLOW")
        .setImage(`${person.displayAvatarURL({size: 4096})}`)
        .setTimestamp();
      await message.channel.send(embed).catch(error => {/*nothing*/});
    }
  }
}