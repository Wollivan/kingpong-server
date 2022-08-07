const mongoose = require("mongoose");

const { Schema } = mongoose;

const playerSchema = new Schema({
  name: String,
  elo: Number,
  wins: String,
  losses: String,
  perfectGames: String,
  avgScore: Number,
  avgOpScore: Number,
  mostWinsAgainst: String,
  mostLossesAgainst: String,
  tournamentCode: String,
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
