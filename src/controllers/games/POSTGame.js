const { response } = require("express");
const fs = require("fs");
const uniqid = require("uniqid");
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
const Game = require("../../models/game");
const Player = require("../../models/player");
const Challenge = require("../../models/challenge");

async function addGame(req, res) {
  try {
    const { playerOneName, playerTwoName, playerOneScore, playerTwoScore, tournamentCode } = req.body;

    // console.log(req.body);

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
      tournamentCode,
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

    const playerOneDetails = await Player.find({
      name: playerOneName,
    });
    const playerTwoDetails = await Player.find({
      name: playerTwoName,
    });

    const playerOneTiMetric = playerOneDetails[0].tiMetric;
    const playerTwoTiMetric = playerTwoDetails[0].tiMetric;

    let playerOneNewTiMetric = 0;
    let playerTwoNewTiMetric = 0;

    // the winner takes from the losers tiMetric, equal to the score diff multiplied by loser tiMetric
    if (parseInt(playerOneScore) > parseInt(playerTwoScore)) {
      console.log("p1 wins");
      // (11 - 1) * 1
      const diff = Math.ceil((playerOneScore - playerTwoScore) * (playerTwoTiMetric / 100));
      console.log("diff", diff);
      playerOneNewTiMetric = playerOneTiMetric + diff;
      playerTwoNewTiMetric = playerTwoTiMetric - diff;
    } else {
      console.log("p2 wins");
      const diff = Math.ceil((playerTwoScore - playerOneScore) * (playerOneTiMetric / 100));
      playerOneNewTiMetric = playerOneTiMetric - diff;
      playerTwoNewTiMetric = playerTwoTiMetric + diff;
    }

    // give the winner the golden monkey if the loser had it
    let playerOneGM = playerOneDetails[0].hasGoldenMonkey;
    let playerTwoGM = playerTwoDetails[0].hasGoldenMonkey;
    let newPlayerOneGM = playerOneGM;
    let newPlayerTwoGM = playerTwoGM;
    // increase players kingpongCount AFTER passing the crown (if it needed passing at all)
    let playerOneKPCount = playerOneDetails[0].kingpongCount;
    let playerTwoKPCount = playerTwoDetails[0].kingpongCount;
    let newPlayerOneKPCount = playerOneKPCount;
    let newPlayerTwoKPCount = playerTwoKPCount;
    // if either player has the crown
    if (playerOneGM == 1 || playerTwoGM == 1) {
      // pass the crown
      if (playerOneScore > playerTwoScore && playerTwoGM == 1) {
        // p1 wins and p2 had the crown
        // p2 has golden monkey
        newPlayerOneGM = 1;
        newPlayerTwoGM = 0;
      }
      if (playerTwoScore > playerOneScore && playerOneGM == 1) {
        // p2 wins and p1 had the crown
        // p2 has golden monkey
        newPlayerOneGM = 0;
        newPlayerTwoGM = 1;
      }

      console.log(newPlayerOneKPCount);
      // p1 wins with the crown
      if (playerOneScore > playerTwoScore && newPlayerOneGM == 1) {
        newPlayerOneKPCount = newPlayerOneKPCount + 1;
      }
      // p2 wins with the crown
      if (playerTwoScore > playerOneScore && newPlayerTwoGM == 1) {
        newPlayerTwoKPCount = newPlayerTwoKPCount + 1;
      }
    }

    // current streak
    const playerOneCurrentStreak = playerOneDetails[0].currentStreak;
    const playerTwoCurrentStreak = playerTwoDetails[0].currentStreak;
    let playerOneNewCurrentStreak = playerOneCurrentStreak;
    let playerTwoNewCurrentStreak = playerTwoCurrentStreak;

    //player one wins
    if (playerOneScore > playerTwoScore) {
      playerOneNewCurrentStreak = playerOneNewCurrentStreak + 1;
      playerTwoNewCurrentStreak = 0;
    } else {
      playerTwoNewCurrentStreak = playerTwoNewCurrentStreak + 1;
      playerOneNewCurrentStreak = 0;
    }

    // highest streak
    const playerOneHighestStreak = playerOneDetails[0].highestStreak;
    const playerTwoHighestStreak = playerTwoDetails[0].highestStreak;
    let playerOneNewHighestStreak = playerOneHighestStreak;
    let playerTwoNewHighestStreak = playerTwoHighestStreak;

    if (playerOneNewCurrentStreak > playerOneHighestStreak) {
      playerOneNewHighestStreak = playerOneNewCurrentStreak;
    }

    if (playerTwoNewCurrentStreak > playerTwoHighestStreak) {
      playerTwoNewHighestStreak = playerTwoNewCurrentStreak;
    }

    // highestTIM
    const playerOneHighestTIM = playerOneDetails[0].highestTIM;
    const playerTwoHighestTIM = playerTwoDetails[0].highestTIM;
    let playerOneNewHighestTIM = playerOneHighestTIM;
    let playerTwoNewHighestTIM = playerTwoHighestTIM;

    if (playerOneNewTiMetric > playerOneDetails[0].highestTIM) {
      playerOneNewHighestTIM = playerOneNewTiMetric;
    }
    if (playerTwoNewTiMetric > playerTwoDetails[0].highestTIM) {
      playerTwoNewHighestTIM = playerTwoNewTiMetric;
    }

    const playerOneNew = {
      name: playerOneName,
      tiMetric: playerOneNewTiMetric,
      wins: playerOneWins,
      losses: playerOneLosses,
      perfectGames: playerOnePerfectGames,
      avgScore: playerOneAvgScore,
      avgOpScore: playerOneAvgOpScore,
      mostWinsAgainst: "-", //playerOneMostWinsAgainst,
      mostLossesAgainst: "-", //playerOneMostLossesAgainst,
      hasGoldenMonkey: newPlayerOneGM,
      kingpongCount: newPlayerOneKPCount,
      currentStreak: playerOneNewCurrentStreak,
      highestStreak: playerOneNewHighestStreak,
      highestTIM: playerOneNewHighestTIM,
    };

    const playerTwoNew = {
      name: playerTwoName,
      tiMetric: playerTwoNewTiMetric,
      wins: playerTwoWins,
      losses: playerTwoLosses,
      perfectGames: playerTwoPerfectGames,
      avgScore: playerTwoAvgScore,
      avgOpScore: playerTwoAvgOpScore,
      mostWinsAgainst: "-", //playerTwoMostWinsAgainst,
      mostLossesAgainst: "-", //playerTwoMostLossesAgainst,
      hasGoldenMonkey: newPlayerTwoGM,
      kingpongCount: newPlayerTwoKPCount,
      currentStreak: playerTwoNewCurrentStreak,
      highestStreak: playerTwoNewHighestStreak,
      highestTIM: playerTwoNewHighestTIM,
    };

    console.log(playerOneNew);
    console.log(playerTwoNew);
    // update players
    // console.log(playerOneNew);
    // console.log(playerTwoNew);
    const playerOneFilter = { name: playerOneName };
    const playerTwoFilter = { name: playerTwoName };
    await Player.findOneAndUpdate(playerOneFilter, playerOneNew);
    await Player.findOneAndUpdate(playerTwoFilter, playerTwoNew);
    console.log("this far");

    // check for and remove any challenges that have these two players
    await Challenge.findOneAndDelete({
      $or: [
        { playerOneName: playerOneName, playerTwoName: playerTwoName },
        { playerOneName: playerTwoName, playerTwoName: playerOneName },
      ],
    });

    //return the two players, for the call to then run 2 more axios calls to update them
    return res.status(201).json({ success: true });
  } catch (err) {
    console.log("BROKEN");
    return res.status(500).json({ message: "No game data found", error: err.message });
  }
}

module.exports = addGame;
