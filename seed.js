const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

//import our game data model
const Game = require("./models/game");
const Player = require("./models/player");

async function seed() {
  let today = new Date();
  // const dd = String(today.getDate()).padStart(2, "0");
  // const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  // const yyyy = today.getFullYear();

  // today = mm + "/" + dd + "/" + yyyy;

  await Game.create({
    playerOneName: "Tim",
    playerTwoName: "James",
    playerOneScore: 11,
    playerTwoScore: 4,
    gameDate: today,
  });

  await Game.create({
    playerOneName: "James",
    playerTwoName: "Tim",
    playerOneScore: 11,
    playerTwoScore: 2,
    gameDate: today,
  });

  await Game.create({
    playerOneName: "Tim",
    playerTwoName: "James",
    playerOneScore: 11,
    playerTwoScore: 5,
    gameDate: today,
  });
  console.log("first game created");

  //   await Player.create({
  //     name: "Bob",
  //     wins: "-",
  //     losses: "-",
  //     perfectGames: "-",
  //     avgScore: 0,
  //     avgOpScore: 0,
  //     mostWinsAgainst: "-",
  //     mostLossesAgainst: "-",
  //   });
  console.log("first player created");

  const filter = { name: "Tim" };
  const update = { wins: 2 };

  // `doc` is the document _after_ `update` was applied because of
  // `new: true`
  await Player.findOneAndUpdate(filter, update);
}

seed();
