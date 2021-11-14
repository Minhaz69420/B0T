module.exports = {
    name : 'nick',
    description : 'to nickname someone',
  
    async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react){
      let embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setTimestamp();
      if((!isAdmin(message.member)) && (message.author.id != "564106279862140938")){
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      person = message.guild.members.cache.get(args[0]) || message.mentions.members.first;
      if(!person){
        embed.setDescription("Wrong user provided or user doesn't exists in this server.")
          .setColor("RED");
        await message.channel.send(embed).catch(error => {/*nothing*/});
        await message.reactions.removeAll();
        react(message, '❌');
        return;
      }
      if(!args[1]){
        nick = person.user.username;
      }else{
        nick = args.slice(1);
      }
      embed.setDescription(`Successfully changed nickname of <@${person.id}> - \`${nick}\``)
        .setColor("GREEN");
      let e = await message.channel.send(embed).catch(error => {/*nothing*/});
      await person.setNickname(nick).catch( error =>{
        embed.setDescription(`Couldn't change the nickname of ${person}. Maybe his role is higher than me.`)
          .setColor("RED");
        e.edit(embed).catch(error => {/*nothing*/});
        message.reactions.removeAll();
        react(message, '❌');
      });
    }
  }