const axios = require('axios');
const Table = require('easy-table');
const chalk = require('chalk');

const { headers } = require('../utils/helpers');

function formatScorers(scorers) {
  return scorers.map((scorer, index) => ({
    name: scorer.player.name.split(' ').slice(-1)[0], // last name of player
    club: scorer.team.name,
    goals: scorer.numberOfGoals,
    position: index + 1
  }));
}

async function printTopScorers() {
  const url = `https://api.football-data.org/v2/competitions/SA/scorers`;
  try {
    const res = await axios.get(url, headers);
    const topScorers = formatScorers(res.data.scorers);
    let table = new Table();
    topScorers.forEach(row => {
      table.cell('#', chalk.bold.yellow(row.position));
      table.cell('Name', chalk.bold.white(row.name));
      table.cell('Goals', chalk.bold.green(row.goals));
      table.newRow();
    });
    console.log(table.toString());
  } catch (error) {
    console.log(error);
  }
}

module.exports = printTopScorers;
