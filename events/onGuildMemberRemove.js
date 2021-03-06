module.exports = async(Discord, member, Canvas, path, database) =>{
  const type = "Good Bye";  
  const serverStatusUpdater = require('../updater/serverStatusUpdater.js');
  serverStatusUpdater(member, database);  
  const wlCanvasBuilder = require('../builders/wlCanvasBuilder.js');
  wlCanvasBuilder(Discord, member, Canvas, path, database, type);
}