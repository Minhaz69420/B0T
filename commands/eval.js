const config = require("../config.json");
const authorID = config.authorID;

const clean = text => {
  if (typeof(text) === "string"){
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  }
  else{
    return text;
  }
}

module.exports = {
  name : 'eval',
  description : 'to run commands',

  async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react){
    if(!(message.author.id == authorID)) return;
    let embed = new Discord.MessageEmbed()
      .setTimestamp();
    try {
      const code = args.join(" ");
      let evaled = eval(code);
  
      if (typeof evaled !== "string"){
        evaled = require("util").inspect(evaled);
      }
      embed.setDescription('**__OUTPUT__**\n```\n' + clean(evaled) + '\n```')
      await message.channel.send(embed).catch(error => {/*nothing*/});
      } catch (err){
        embed.setDescription("**__ERROR__**\n```\n" + clean(err) + '\n```');
        await message.reactions.removeAll();
        react(message, '❌');
        await message.channel.send(embed).catch(error => {/*nothing*/});
      }
    }
}