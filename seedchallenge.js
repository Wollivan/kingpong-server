const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

//import our game data model
const Challenge = require("./src/models/challenge");

async function seed() {
  await Challenge.create({
    playerOneName: "Tim",
    playerTwoName: "James",
  });
  console.log("challenge created");
}

seed();
