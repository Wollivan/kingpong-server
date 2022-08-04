const fs = require("fs");
const uniqid = require("uniqid");
const Player = require("../../models/player");

// Function to ADD a player

async function addPlayer(req, res) {
  try {
    const { playerName } = req.body;
    console.log(req.body);
    console.log(playerName);

    const newPlayer = {
      // id: uniqid(),
      name: playerName,
      elo: 1000,
      wins: "-",
      losses: "-",
      perfectGames: "-",
      avgScore: 0,
      avgOpScore: 0,
      mostWinsAgainst: "-",
      mostLossesAgainst: "-",
    };

    await Player.create(newPlayer);

    // playerData.push(newPlayer);
    // fs.writeFileSync("./data/players.json", JSON.stringify(playerData));
    return res.status(201).json(newPlayer);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "No player data found", error: err.message });
  }
}

module.exports = addPlayer;
