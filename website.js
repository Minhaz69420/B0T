const http = require("http");
const fs = require("fs");
const config = require("./config.json");

const PORT = config.webPort;

module.exports = () =>{
  fs.readFile('./website/index.html', function (err, html) {
    if (err) throw err;    
  
    var webServer = http.createServer(function(request, response) {  
      response.writeHeader(200, {"Content-Type": "text/html"});  
      response.write(html);  
      response.end();  
    });
    webServer.listen(PORT);
  });
  console.log(`\nWebsite running on Port: ${PORT}`);
}