const axios = require('axios');
const cheerio = require('cheerio');
const Table = require('easy-table');
const chalk = require('chalk');

function formatTransfers(data) {
  const $ = cheerio.load(data);
  const div = $('div.grid-view table.items').html();
  const rows = [];
  $('tr', div).each(function (index, value) {
    if (index !== 0) {
      let row = {};
      $('td', this).each(function (index, value) {
        switch (index) {
          case 2:
            row['player'] = $(value).text();
            break;
          case 3:
            row['position'] = $(value).text();
            break;
          case 4:
            row['age'] = $(value).text();
            break;
          case 5:
            row['from'] = $(value).text();
            break;
          case 8:
            row['to'] = $(value).text();
            break;
          case 11:
            row['fee'] = $('i', value).text() || $(value).text();
            break;
        }
      });
      if (Object.keys(row).length !== 0)
        rows.push(row);
    }
  });
  return rows;
}

async function getTransfers() {
  const url = `https://www.transfermarkt.com/serie-a/letztetransfers/wettbewerb/IT1`;
  try {
    const res = await axios.get(url);
    return formatTransfers(res.data);
  } catch (e) {
    console.log(e);
  }
}

async function printTransfers() {
  const transfers = await getTransfers(); // await getSoccerNewsTransfers();
  let table = new Table;
  transfers.forEach(row => {
    table.cell('Player', row.player);
    table.cell('Age', chalk.yellow(row.age));
    table.cell('From', chalk.red(row.from));
    table.cell('To', chalk.green(row.to));
    table.cell('Fee', row.fee);
    table.newRow();
  });
  console.log(table.toString());
}

module.exports = printTransfers;
