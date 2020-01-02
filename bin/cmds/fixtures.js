const axios = require('axios');
const Table = require('easy-table');
const chalk = require('chalk');

const {headers, getCurrentDate, getFutureDate, formatDate} = require('../utils/helpers');

async function printFixtures() {
  const today = getCurrentDate();
  const futureDay = getFutureDate(7);
  const url = `http://api.football-data.org/v2/competitions/SA/matches?dateFrom=${today}&dateTo=${futureDay}`;

  try {
    const res = await axios.get(url, headers);
    if (res.data.count === 0) {
      console.log(`${chalk.red('No upcoming fixtures!')}`);
      return;
    }
    const matches = formatMatches(res);
    let table = new Table;
    matches.forEach(row => {
      table.cell('Time', chalk.yellow(row.time));
      table.cell('Home', chalk.green(row.home));
      table.cell('Away', chalk.green(row.away));
      table.newRow();
    });
    console.log(table.toString());
  } catch (e) {
    console.log(e);
  }
}

function formatMatches(response) {
  return response.data.matches.map(match => ({
    time: formatDate(new Date(match.utcDate)),
    home: match.homeTeam.name,
    away: match.awayTeam.name
  }));
}

module.exports = printFixtures;
