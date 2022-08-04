const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
require("dotenv").config();
const gamesRouter = require("./routes/games/index");
const playersRouter = require("./routes/players/index");

app.use(express.json());
app.use(cors());

// mongoose test
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const Game = require("./models/game");

app.get("/test", async (request, response) => {
  const games = await Game.find(); // mongoose
  response.send(games);
});

//mongoose test

app.use("/", gamesRouter);
app.use("/", playersRouter);

app.use(express.static("public"));

app.listen(process.env.PORT || PORT, () => {
  console.log(`Express server listening on ${PORT} :-) !`);
});
