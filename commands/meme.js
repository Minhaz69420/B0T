const https = require('https');
let subReddits = ["savagememes", "OSHA", "BikiniBottomTwitter", "fakehistoryporn", "ScottishPeopleTwitter", "me_irl", "skyrimskills_irl", "wellthatsucks", "funny", "youdontsurf", "prequelmemes", "thatHappened", "ATBGE", "WeWantPlates", "thecanopener", "JustRolledIntoTheSea", "AnimatedStarWarsMemes", "MildlyVandalised", "misleadingthumbnails", "BlackPeopleTwitter", "notmyjob", "whatcouldgowrong", "crappydesign", "youtubehaiku", "BigBrother", "Archer"];
let url = `https://www.reddit.com/r/memes/hot/.json?limit=100`;
module.exports = {
  name : 'meme',
  description : 'for memes xD',
  
  async run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react){
    let embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTimestamp();
    const memeChannelID = await database.get("memeChannelID");
    const botChannelID = await database.get("botChannelID");
    if(args[0] && (!isNaN(args[0]))){
      if(args[0] >=1 && args[0] <= subReddits.length){
        url = `https://www.reddit.com/r/${subReddits[args[0]-1]}/hot/.json?limit=100`;
      }
    }
    if(!memeChannelID){
      embed.setDescription('The meme channel is not setup. Kindly ask the staff to setup is first.')
        .setColor("RED");
      await message.channel.send(embed).catch(error => {/*nothing*/});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    const memeChannel = message.guild.channels.cache.get(memeChannelID);
    if((!memeChannel) && (message.channel.id != botChannelID)){
      embed.setDescription('The meme channel is not setup. Kindly ask the staff to setup is first.')
        .setColor("RED");
      await message.channel.send(embed).catch(error => {/*nothing*/});
      await message.reactions.removeAll();
      react(message, '❌');
      return;
    }
    https.get(url, (result) => {
      let body = '';
      result.on('data', (chunk) =>{
        body += chunk;
      });
      result.on('end', async() => {
        let response = JSON.parse(body);
        let index = response.data.children[Math.floor(Math.random() * 99) + 1].data;
        if(index.post_hint == "image"){
          let image = index.preview.images[0].source.url.replace('&amp;', '&');
          let title = index.title;
          let link = 'https://reddit.com' + index.permalink;
          let subRedditName = index.subreddit_name_prefixed;
          embed.setTitle(subRedditName)
            .setImage(image)
            .setColor(0xFFFF00)
            .setDescription(`[${title}](${link})`)
            .setURL(`https://reddit.com/${subRedditName}`);
          await message.channel.send(embed).catch(error => {/*nothing*/});
        }else{
          let memeFile = require("./meme.js");
          memeFile.run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react);
        }
      });
    });
  }
}