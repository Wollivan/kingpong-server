const fs = require("fs");
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const Player = require("../../models/player");

// Function to GET inventory list

async function getPlayerList(req, res) {
  try {
    const players = await Player.find();
    // make sure you close the connection when you are done
    mongoose.connection.close();
    return res.send(players);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "No data found", error: err.message });
  }
}

module.exports = getPlayerList;
