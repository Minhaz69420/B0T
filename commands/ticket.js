module.exports = {
  name: "ticket",
  description: "To create a ticket",

  async run (Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react) {
    const create = require('./create.js');
    create.run(Discord, client, prefix, message, args, database, isAdmin, personFinder, messageEmojiFinder, react, "ticket");
  }
}