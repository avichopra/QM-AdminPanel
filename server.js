const config = require("./src/config");
const express = require("express");

const PORT = config.PORT;
const path = require("path");

// initialize the application and create the routes
const app = express();

// other static resources should just be served as they are

app.use(express.static(path.resolve(__dirname, "build"), { maxAge: "30d" }));

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// start the app
app.listen(PORT, error => {
  if (error) {
    return console.log("something bad happened", error);
  }

  console.log("listening on " + PORT + "...");
});
