module.exports = {
  name : 'invite',
  description : 'discord invite link',

  async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react){
    let embed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTimestamp();
    let invite = await database.get(`customCommand_invite`);
    if(!invite){
      invite = await message.channel.createInvite({
        maxAge: 86400,
        maxUses: 1
      }).catch(console.log);
      await message.channel.send(`${invite}`).catch(async err =>{
        embed.setDescription("There has been an error during the creation of the invite.")
          .setColor("RED");
        await message.channel.send(embed).then((msg) => setTimeout(function(){msg.delete().catch(error => {/*nothing*/});}, 10000)).catch(error => {/*nothing*/});
        await message.reactions.removeAll();
        react(message, '❌');
        return;  
      });
    }
  }
}