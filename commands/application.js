const fs = require("fs");
module.exports = {
  name : 'application',
  description : 'to accept/reject an application',

  async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder){
    let embed = new Discord.MessageEmbed()
      .setColor("YELLOW")
      .setTimestamp();
    if(!isAdmin(message.member)){
      return;
    }
    if(!isAdmin(message.guild.me)){
      embed.setDescription("I don't have the **__`ADMINISTRATOR`__** permission.")
        .setColor("RED");
      await message.channel.send(embed);
      return;
    }
    if((!args[0]) || args[0] == "help"){
      embed.setDescription(`**Application Command Help**-\n
        **01** ~~»~~ __\`${prefix}application reject <user> <reason>\`__- *To reject an application*.
        **02** ~~»~~ __\`${prefix}application accept <user> <message>\`__- *To accept an application*.
        **03** ~~»~~ __\`${prefix}application ignore <user> <reason>\`__- *To ignore an application*.
        **04** ~~»~~ __\`${prefix}application blacklist <userID>\`__- *To add/remove a user's ID from the blacklist*`);
      await message.channel.send(embed).catch(console.error());
    }
    if(args[0] == "reject" || args[0] == "accept" || args[0] == "ignore"){
      if(!args[1]){
        embed.setDescription("Please provide a user")
          .setColor("RED");
        await message.channel.send(embed);
        return;
      }
      let applicant = personFinder(message, args[1]);
      if(applicant === "not found"){
        embed.setDescription("Wrong user provided or user doesn't exist in this server.")
          .setColor("RED");
        await message.channel.send(embed);
        return;  
      }
      let reason = args.slice(2).join(" ");
      if(!reason){
        reason = "Not Provided."
      }
      const checkFile = fs.statSync(`./applications/${applicant.id}.txt`);
      if(checkFile){
        fs.unlink(`./applications/${applicant.id}.txt`, (err) => {
          if (err) throw err;
          console.log(`./applications/${applicant.id}.txt was deleted`);
        });
        if(args[0] == "reject"){
          embed.setDescription(`Your application got rejected.\nReason- \`${reason}\``)
            .setColor("RED")
          await applicant.send(embed).catch(console.error());
          embed.setDescription(`Sucessfully rejected the application of ${applicant.user.tag}[${applicant.id}]\nReason-${reason}`)
            .setColor("GREEN");
          await message.channel.send(embed).catch(console.error()); 
        }
        else if(args[0] == "accept"){
          embed.setDescription(`Your application was accepted.🥳\nMessage from staff- \`${reason}\``)
            .setColor("GREEN")
          await applicant.send(embed).catch(console.error());
          embed.setDescription(`Sucessfully accepted the application of ${applicant.user.tag}[${applicant.id}]\nMessage from staff-${reason}`)
            .setColor("GREEN");
          await message.channel.send(embed).catch(console.error());
        }
        else if(args[0] == "ignore"){
          embed.setDescription(`Sucessfully ignored the application of ${applicant.user.tag}[${applicant.id}]\nReason-${reason}`)
            .setColor("GREEN");
          await message.channel.send(embed).catch(console.error());
        }
      }
    }
    else if(args[0] == "blacklist"){
      let blackList = await database.get("applicationBlackList");
      let blackListIDs;
      if(!blackList){
        blackList = " ";
        await database.set("applicationBlackList", blackList);
      }
      blackListIDs = blackList.split(" ");
      if(args[1] == "remove"){
        for(let i=0; i<=blackListIDs.length-1; i++){
          if(args[2] == blackListIDs[i]){
            if(blackListIDs.length > 1){
              for(let j=i; j<=blackListIDs.length-2; j++){
                blackListIDs[j] = blackListIDs[j+1];
              }
            }
            let t = blackListIDs.pop();
            blackList = blackListIDs.join(" ");
            await database.set("applicationBlackList", blackList);
            embed.setDescription(`Successfully removed ${args[2]} from the application blacklist.`)
              .setColor("GREEN");
            await message.channel.send(embed);
            return;
          }
        }
        embed.setDescription(`That ID (${args[2]}) is not blacklisted.`)
          .setColor("RED");
        await message.channel.send(embed);
      }
      else if(args[1] == "add"){
        for(let i=0; i<=blackListIDs.length-1; i++){
          if(args[2] == blackListIDs[i]){
            embed.setDescription(`ID (${args[2]}) is already blacklisted.`)
              .setColor("RED");
            await message.channel.send(embed);
            return;
          }
        }
        blackListIDs[blackListIDs.length] = args[2];
        blackList = blackListIDs.join(" ");
        await database.set("applicationBlackList", blackList);
        embed.setDescription(`Successfully added ${args[2]} to the application blacklist.`)
          .setColor("GREEN");
        await message.channel.send(embed);
      }
    }
  }
}