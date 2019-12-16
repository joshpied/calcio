const axios = require('axios');
const {headers, getCurrentDate, getFutureDate, formatDate} = require('./helpers');
const chalk = require('chalk');

async function printMilan() {
  const today = getCurrentDate(),
    future = getFutureDate(30);
  const url = `https://api.football-data.org/v2/teams/98/matches?dateFrom=${today}&dateTo=${future}`;
  try {
    const res = await axios.get(url, headers);
    const matches = res.data.matches.map(match => ({
      time: formatDate(new Date(match.utcDate)),
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name
    }));
    console.log(`${chalk.green.bold('Upcoming Milan Matches:\n')}`);
    matches.forEach(match => {
      console.log(`${
        match.homeTeam === 'AC Milan'
          ? chalk.red.bold(match.homeTeam)
          : chalk.cyan.bold(match.homeTeam)
      } v ${
        match.awayTeam === 'AC Milan'
          ? chalk.red.bold(match.awayTeam)
          : chalk.cyan.bold(match.awayTeam)
      }
@ ${chalk.white.bold(match.time)} \n`);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = printMilan;
