const dayjs = require('dayjs');
const API_TOKEN = require('./token');

const headers = {
  headers: {
    Accept: 'application/json',
    'X-Auth-Token': API_TOKEN
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
