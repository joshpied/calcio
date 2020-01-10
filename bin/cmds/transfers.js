const axios = require('axios');
const cheerio = require('cheerio');
const Table = require('easy-table');
const chalk = require('chalk');

async function printTransfers() {
  const transfers = await getTransfers();
  let table = new Table;
  transfers.slice(0, 25).forEach(row => {
    table.cell('Date', chalk.yellow(row.date));
    table.cell('Player', row.player);
    table.cell('From', chalk.red(row.from));
    table.cell('To', chalk.green(row.to));
    table.cell('Price', row.price);
    table.newRow();
  });
  console.log(table.toString());
}

async function getTransfers() {
  const url = `https://www.soccernews.com/soccer-transfers/italian-serie-a-transfers/`;
  try {
    const res = await axios.get(url);
    return formatTransfers(res.data);
  } catch (e) {
    console.log(e);
  }
}

function formatTransfers(data) {
  const $ = cheerio.load(data);
  const rows = [];
  // first get container div that holds table we want
  const div = $('div table').attr('class', 'transfer-zone-tab').html();
  // go through each row in table that displays a transfer
  $('tr', div).each(function (index, value) {
    if (index !== 0) {
      const row = {};
      // grab each item in row and put into an object
      // note: using index of the tds rather than the classname for a td because some td's are missing a classname
      $('td', this).each(function (index, value) {
        switch (index) {
          case 0:
            row['date'] = $(value).text();
            break;
          case 2:
            row['player'] = $('h4', value).text();
            row['position'] = $('p', value).text();
            break;
          case 3:
            row['from'] = $(value).text();
            break;
          case 5:
            row['to'] = $(value).text();
            break;
          case 6:
            row['price'] = $(value).text();
            break;
        }
      });
      rows.push(row);
    }
  });
  return rows;
}

module.exports = printTransfers;
