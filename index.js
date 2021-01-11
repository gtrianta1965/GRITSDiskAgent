const http = require("http");
const os = require("os");
var propertiesReader = require("properties-reader");
const PROPERTIES_FILE = "init.properties";

let options = {};

try {
  var properties = propertiesReader(PROPERTIES_FILE);
  options.port = properties.get("port");
  options.host = properties.get("host");
  options.site = properties.get("site");
  options.exclude = properties.get("exclude");

  console.log(`Read from properties file. (${PROPERTIES_FILE})`);
} catch (e) {}

const getDisks = require("./diskcheck");

const host = options.host || "localhost";
const port = options.port || 8000;
const site = options.site || os.hostname();
console.log(os.hostname());
const exclude = options.exclude || "$$$";

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.write(JSON.stringify(getDisks(site, exclude)));
  res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
