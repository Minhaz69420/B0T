module.exports = async(message, args, database, prefix, isAdmin, errorMessageBuilder) =>{
  if(message.guild){
    const countingChannelID = await database.get("countingChannelID");
    if(!countingChannelID){
      return;
    }
    const countingChannel = message.guild.channels.cache.get(countingChannelID);
    if(!countingChannel){
      return;
    }
    if(message.author.bot){
	  if((message.channel.id == countingChannel.id) && isNaN(message.content)){
	    await message.delete().catch(error => {});
	  }
	  return;
	}
    if(isAdmin(message.member)){
      if(args[0] == `${prefix}setCount`){
        if((!args[1]) || (isNaN(args[1])))
          await message.author.send("Provide a count number bruh.").catch(error => {/*nothing*/});
        else{  
          let n = args[1] *1;
          await database.set("num", n);
          await database.set("lastSender", null);
          await message.author.send(`Count set to ${args[1]}`).catch(error => {/*nothing*/});
        }
      }
      if(args[0] == `${prefix}resetCount`){
        await database.set("num", 0);
        await database.set("lastSender", null);
        await message.author.send("Count resetted to 0").catch(error => {/*nothing*/});
      }
    }
    if(message.channel.id != countingChannelID){
      return;
    }
    let checknum = await database.get("num");
    if(!checknum){
      checknum = 0;
      await database.set("num", 0);
    }
    let lastSender = await database.get("lastSender");
    if((message.author.id === lastSender) || (args[1]) || (args[0] != checknum+1)){
      message.delete().catch(error => {/*nothing*/});
      return;   
    }
    await database.set("lastSender", message.author.id);
    checknum++;
    await database.set("num", checknum);
    
    let ws, w;
    ws = await message.channel.fetchWebhooks();
    w = ws.first();
    if(!w){
      await message.channel.createWebhook(message.author.username, {
        avatar: message.author.displayAvatarURL({dynamic: true}),
      });
    }
    try {
      const webhooks = await message.channel.fetchWebhooks();
      const webhook = webhooks.first();
      await webhook.send(args[0], {
        username: message.author.username,
        avatarURL: message.author.displayAvatarURL(),
      });
    }catch (error) {
      console.log(`Webhook creation error in Guild- ${message.guild}, ${message.guild.id} Channel- ${message.channel.id}`);
    }
    let coins = await database.get(`${message.author.id} coins`) * 1;
    if((checknum % 2 != 0) && (checknum % 3 != 0) && (checknum % 5 != 0) && (checknum % 2 != 0)){
      coins += 20;
      await database.set(`${message.author.id} coins`, coins);
    }
    await message.delete().catch(error => {/*nothing*/});
  }
}