const axios = require('axios');
const {headers} = require('./helpers');

async function printTable() {
  const year = new Date().getFullYear();
  const url = `http://api.football-data.org/v2/competitions/${year}/standings`;
  try {
    const res = await axios.get(url, headers);
    const table = res.data.standings[0].table.map(club => ({
      position: club.position,
      name: club.team.name,
      mp: club.playedGames,
      w: club.won,
      d: club.draw,
      l: club.lost,
      pts: club.points
    }));
    console.table(table);
  } catch (e) {
    console.log(error);
  }
}

module.exports = printTable;
