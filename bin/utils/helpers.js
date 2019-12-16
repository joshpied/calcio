const dayjs = require('dayjs');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const headers = {
  headers: {
    Accept: 'application/json',
    'X-Auth-Token': process.env.API_KEY
  }
};

function formatDate(date) {
  return dayjs(date).format('ddd DD MMM hh:mm');
}

function getCurrentDate() {
  return dayjs().format('YYYY-MM-DD');
}

function getFutureDate(daysInFuture) {
  return dayjs().add(daysInFuture, 'day').format('YYYY-MM-DD');
}

module.exports = {
  headers,
  formatDate,
  getCurrentDate,
  getFutureDate
};
