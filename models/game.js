const mongoose = require("mongoose");

const { Schema } = mongoose;

const gameSchema = new Schema({
  playerOneName: String,
  playerTwoName: String,
  playerOneScore: Number,
  playerTwoScore: Number,
  gameDate: Date,
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
