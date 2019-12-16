const axios = require('axios');
const {headers} = require('../utils/helpers');
const chalk = require('chalk');

/**
 * TODO update to get scores for the entire weekend to show score of games that have and havent happened, write live next to games that are ongoing
 */
// http://api.football-data.org/v2/competitions/2019/matches?status=LIVE OR IN_PLAY
// LIVE | IN_PLAY
async function printScores() {
  const url = `http://api.football-data.org/v2/competitions/2019/matches?status=LIVE`;
  try {
    const res = await axios.get(url, headers);
    const matches = res.data.matches.map(match => ({
      homeTeam: chalk.cyan.bold(match.homeTeam.name),
      awayTeam: chalk.cyan.bold(match.awayTeam.name),
      score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
    }));
    matches.forEach(match => {
      console.log(`${chalk.green.bold('Current Scores:')}`);
      console.log(`${match.homeTeam} ${match.score} ${match.awayTeam}`);
    });
  } catch (e) {
    console.log(e);
  }
}

module.exports = printScores;
