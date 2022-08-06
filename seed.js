const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

//import our game data model
const Game = require("./src/models/game");
const Player = require("./src/models/player");

async function seed() {
  let today = new Date();
  // const dd = String(today.getDate()).padStart(2, "0");
  // const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  // const yyyy = today.getFullYear();

  // today = mm + "/" + dd + "/" + yyyy;

  // await Game.create({
  //   playerOneName: "Tim",
  //   playerTwoName: "James",
  //   playerOneScore: 11,
  //   playerTwoScore: 4,
  //   gameDate: today,
  // });

  // await Game.create({
  //   playerOneName: "James",
  //   playerTwoName: "Tim",
  //   playerOneScore: 11,
  //   playerTwoScore: 2,
  //   gameDate: today,
  // });

  // await Game.create({
  //   playerOneName: "Tim",
  //   playerTwoName: "James",
  //   playerOneScore: 11,
  //   playerTwoScore: 5,
  //   gameDate: today,
  // });
  // console.log("first game created");

  await Player.create({
    name: "James Ford",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Tim Smith",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Matt Hood",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "James Adams",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Mehdi Khiabani",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "JJ Waters",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Luca Feser",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "V",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Fred Hoffman",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Kane St Quintin",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Brad Day",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Bas de Boer",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  await Player.create({
    name: "Nick Lewis",
    elo: 1000,
    wins: "-",
    losses: "-",
    perfectGames: "-",
    avgScore: 0,
    avgOpScore: 0,
    mostWinsAgainst: "-",
    mostLossesAgainst: "-",
  });
  console.log("players created");

  // const filter = { name: "Tim" };
  // const update = { wins: 2 };

  // // `doc` is the document _after_ `update` was applied because of
  // // `new: true`
  // await Player.findOneAndUpdate(filter, update);
}

seed();
