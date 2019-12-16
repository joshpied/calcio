const axios = require('axios');
const Table = require('easy-table');
const chalk = require('chalk');

const {headers} = require('../utils/helpers');

async function printTable() {
  const year = new Date().getFullYear();
  const url = `http://api.football-data.org/v2/competitions/${year}/standings`;
  try {
    const res = await axios.get(url, headers);
    const standings = formatStandings(res);
    let table = new Table;
    standings.forEach(row => {
      table.cell('Position', chalk.yellow(row.position));
      table.cell('Name', chalk.green(row.name));
      table.cell('MP', row.mp);
      table.cell('W', row.w);
      table.cell('D', row.d);
      table.cell('L', row.l);
      table.cell('PTS', chalk.yellow(row.pts));
      table.newRow();
    });
    console.log(table.toString());

  } catch (e) {
    console.log(e);
  }
}

function formatStandings(response) {
  return response.data.standings[0].table.map(club => ({
    position: club.position,
    name: club.team.name,
    mp: club.playedGames,
    w: club.won,
    d: club.draw,
    l: club.lost,
    pts: club.points
  }));
}

module.exports = printTable;
