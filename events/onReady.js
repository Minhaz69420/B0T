//response.host, response.port, response.version

module.exports = async (client, Keyv, util, prefix, errorMessageBuilder) =>{
  const guildsCount = client.guilds.cache.size;
  const usersCount = client.users.cache.size;
  const channelsCount = client.channels.cache.size;

  let guildText = "server";
  let userText = "user";
  let channelText = "channel";

  if(guildsCount > 1) guildText = guildText + 's';
  if(usersCount > 1) userText = userText + 's';
  if(channelsCount > 1) channelText = channelText + 's';

  let index = 0;
  
  let val1 = Math.floor((Math.random() * 300));
  let val2 = Math.floor((Math.random() * 200));
  let temp;
  if(val1 < val2){
    temp = val1;
    val1 = val2;
    val2 = temp;
  }

  const activitiesList = [
    `Over ${guildsCount} ${guildText}`,
    `Over ${usersCount} ${userText}`,
    `Over ${channelsCount} ${channelText}`,
    `For ${prefix}help`,
    "Shreshth Tiwari",
    "Some Memes.",
    "The World's End.",
    "Doraemon In Youtube.",
    "Anime.",
    "You.",
    "A Movie.",
    `Maths.`,
    `${val1} + ${val2} = ${(val1+val2)}`,
    `${val1} - ${val2} = ${(val1-val2)}`,
    `${val1} * ${val2} = ${(val1*val2)}`,
    `${val1} ÷ ${val2} = ${(val1/val2).toFixed(2)}`,
    "With ShreshthTiwari"
  ];  
  
  console.log(`-------------------------------------\n${client.user.tag} is online!\n-------------------------------------`);
  
  setInterval(async () => {
    if(index>=11)
      await client.user.setActivity(activitiesList[index], {type: "PLAYING"})
        .catch(console.error);
    else
      await client.user.setActivity(activitiesList[index], {type: "WATCHING"})
        .catch(console.error);
    index++;
    if(index >= activitiesList.length) index = 0;
  }, 10000);
  
  //---------------------------MINECRAFT SERVER PLAYING STATUS UPDATER-------------------------------
  const guildsMap = client.guilds.cache
    .sort((guild1, guild2) => guild1.position - guild2.position)
    .map(guild => guild.id);  
  setInterval(async () => {
    for(let i=0; i<=guildsMap.length-1; i++){
      let guild = client.guilds.cache.get(guildsMap[i]);
      if(guild){
        let database = new Keyv('sqlite://./databases/database.sqlite', {
          table: `${guild.id}`
        });
        database.on('error', err => console.log('Connection Error', err));
        let guildsDB = new Keyv('sqlite://./databases/database.sqlite', {
          table: `${guild.id}`
        });
        guildsDB.on('error', err => console.log('Connection Error', err));

        let guildIDsList = await guildsDB.get("guildsIDs");
        let guildIDsArray;
        let found = false;
        if(guildIDsList){
          guildIDsArray = guildIDsList.split(" ");
          for(let i=0; i<=guildIDsArray.length-1; i++){
            if(guild.id == guildIDsArray[i])
              found = true;
          }
          if(!found){
            guild.leave;
            continue;
          }
        }
  
        let playingStatusChannelID = await database.get('playingStatusChannelID');
        if(playingStatusChannelID){
          let playingStatusChannel = guild.channels.cache.get(playingStatusChannelID);
          let numericIP = await database.get("numericIP");
          let port = await database.get("port") * 1;
  
          if(!port) port = 25565;
  
          if(numericIP && port){
            util.status(numericIP, { port: port, enableSRV: true, timeout: 5000, protocolVersion: 47 })
              .then(async (response) => {
                if(response)
                  await playingStatusChannel.setName(`Playing » ${response.onlinePlayers}/${response.maxPlayers}`);
                else
                  await playingStatusChannel.setName(`OFFLINE`);  
              })
              .catch((error) => {
                console.log(errorMessageBuilder(`Error fethcing the info of ip- "${numericIP}" and port "${port}"`));
                console.log(`For the guild- ${guild.name}, ${guild.id}`);
              });
          }
        }
      }
    }
  }, 600000);
}