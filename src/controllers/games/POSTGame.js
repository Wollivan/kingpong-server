const { response } = require("express");
const fs = require("fs");
const uniqid = require("uniqid");
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const Game = require("../../models/game");
const Player = require("../../models/player");

async function addGame(req, res) {
  try {
    const { playerOneName, playerTwoName, playerOneScore, playerTwoScore } =
      req.body;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    today = dd + "/" + mm + "/" + yyyy;

    // add new entry for the game
    const newGame = {
      // gameId: uniqid(),
      playerOneName,
      playerTwoName,
      playerOneScore,
      playerTwoScore,
      gameDate: today,
    };

    // add the game to the database
    await Game.create(newGame);

    // get data to update player stats
    const allPlayerOneGames = await Game.find({
      $or: [{ playerOneName: playerOneName }, { playerTwoName: playerOneName }],
    });

    const allPlayerTwoGames = await Game.find({
      $or: [{ playerOneName: playerTwoName }, { playerTwoName: playerTwoName }],
    });

    // change the arrays so player one and two are always the same name
    allPlayerOneGames.forEach((game) => {
      // only change when player one is not player one
      if (game.playerOneName !== playerOneName) {
        const newP1 = game.playerTwoName;
        const newP2 = game.playerOneName;
        const newP1Score = game.playerTwoScore;
        const newP2Score = game.playerOneScore;

        game.playerOneName = newP1;
        game.playerTwoName = newP2;
        game.playerOneScore = newP1Score;
        game.playerTwoScore = newP2Score;
      }
    });
    allPlayerTwoGames.forEach((game) => {
      // only change when player one is not player one
      if (game.playerOneName !== playerOneName) {
        const newP1 = game.playerTwoName;
        const newP2 = game.playerOneName;
        const newP1Score = game.playerTwoScore;
        const newP2Score = game.playerOneScore;

        game.playerOneName = newP1;
        game.playerTwoName = newP2;
        game.playerOneScore = newP1Score;
        game.playerTwoScore = newP2Score;
      }
    });
    // When adding a game update both player
    // get a list of games where either player played

    // total games
    const playerOneGameCount = allPlayerOneGames.length;
    const playerTwoGameCount = allPlayerTwoGames.length;

    // avg score
    const playerOneAvgScore =
      allPlayerOneGames.reduce((total, next) => {
        return total + parseInt(next.playerOneScore);
      }, 0) / playerOneGameCount;

    const playerTwoAvgScore =
      allPlayerTwoGames.reduce((total, next) => {
        return total + parseInt(next.playerTwoScore);
      }, 0) / playerTwoGameCount;

    // avg op score
    const playerOneAvgOpScore =
      allPlayerOneGames.reduce((total, next) => {
        return total + parseInt(next.playerTwoScore);
      }, 0) / playerOneGameCount;

    const playerTwoAvgOpScore =
      allPlayerTwoGames.reduce((total, next) => {
        return total + parseInt(next.playerOneScore);
      }, 0) / playerTwoGameCount;

    // perfect game count
    const playerOnePerfectGames = allPlayerOneGames.filter((game) => {
      return parseInt(game.playerTwoScore) === 0;
    }).length;
    const playerTwoPerfectGames = allPlayerTwoGames.filter((game) => {
      return parseInt(game.playerOneScore) === 0;
    }).length;

    // wins
    const playerOneWins = allPlayerOneGames.filter((game) => {
      return parseInt(game.playerOneScore) > parseInt(game.playerTwoScore);
    }).length;

    const playerTwoWins = allPlayerTwoGames.filter((game) => {
      return parseInt(game.playerOneScore) < parseInt(game.playerTwoScore);
    }).length;

    // losses
    const playerOneLosses = allPlayerOneGames.filter((game) => {
      return parseInt(game.playerOneScore) < parseInt(game.playerTwoScore);
    }).length;

    const playerTwoLosses = allPlayerTwoGames.filter((game) => {
      return parseInt(game.playerOneScore) > parseInt(game.playerTwoScore);
    }).length;

    // TODO most wins and losses against

    const playerOneNew = {
      name: playerOneName,
      wins: playerOneWins,
      losses: playerOneLosses,
      perfectGames: playerOnePerfectGames,
      avgScore: playerOneAvgScore,
      avgOpScore: playerOneAvgOpScore,
      mostWinsAgainst: "-", //playerOneMostWinsAgainst,
      mostLossesAgainst: "-", //playerOneMostLossesAgainst,
    };

    const playerTwoNew = {
      name: playerTwoName,
      wins: playerTwoWins,
      losses: playerTwoLosses,
      perfectGames: playerTwoPerfectGames,
      avgScore: playerTwoAvgScore,
      avgOpScore: playerTwoAvgOpScore,
      mostWinsAgainst: "-", //playerTwoMostWinsAgainst,
      mostLossesAgainst: "-", //playerTwoMostLossesAgainst,
    };

    // update players
    console.log(playerOneNew);
    console.log(playerTwoNew);
    const playerOneFilter = { name: playerOneName };
    const playerTwoFilter = { name: playerTwoName };
    await Player.findOneAndUpdate(playerOneFilter, playerOneNew);
    await Player.findOneAndUpdate(playerTwoFilter, playerTwoNew);
    console.log("this far");
    //return the two players, for the call to then run 2 more axios calls to update them
    return res.status(201).json({ success: true });
  } catch (err) {
    console.log("BROKEN");
    return res
      .status(500)
      .json({ message: "No game data found", error: err.message });
  }
}

module.exports = addGame;
