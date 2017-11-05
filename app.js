var express = require("express");
var http = require("http");

let app = express();
app.set("port", (process.env.PORT || 4000));

app.use("/", express.static("./bld"));

let server = http.createServer(app);

server.listen(app.get("port"), () => {
    console.info("Express server listening", {port: app.get("port")});
});
