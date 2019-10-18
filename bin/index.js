#!/usr/bin/env node

const yargs = require("yargs");
const axios = require("axios");
const chalk = require('chalk');
require('dotenv').config();

const options = yargs
  .usage("Usage: -t <table>")
  .option("t", {alias: "table", describe: "League table", type: "string"})
  .usage("Usage: -s <schedule>")
  .option("s", {alias: "schedule", describe: "League schedule", type: "string"})
  .usage("Usage: -ac <milan>")
  .option("a", {alias: "milan", describe: "League schedule", type: "string"})
  .argv;

const headers = {headers: {Accept: "application/json", "X-Auth-Token": process.env.API_KEY}};

if ('table' in options) {
  const url = `http://api.football-data.org/v2/competitions/2019/standings`;
  axios.get(url, headers)
    .then(res => {
      // console.log(res.data.standings[0].table);
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
    });
}

function formatDate(date) {
  const dayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "June", "July",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  const dayIndex = date.getDay();
  const dateNum = date.getDate();
  const monthIndex = date.getMonth();
  const hours = date.getHours();
  const minutes = date.getMinutes() === 0 ? date.getMinutes() + '0' : date.getMinutes();
  return dayNames[dayIndex] + ' ' + dateNum + ' ' + monthNames[monthIndex] + ' ' + hours + ':' + minutes;
}

function getCurrentDate() {
  const currentDate = {
    year: new Date().getFullYear(),
    month: Number(new Date().getMonth()) + 1,
    day: new Date().getDate()
  };
  return `${currentDate.year}-${currentDate.month}-${currentDate.day}`;
}

function getFutureDate(daysInFuture) {
  let futureDate = new Date(),
    date = futureDate.setDate(futureDate.getDate() + daysInFuture);
  futureDate = {year: futureDate.getFullYear(), month: Number(futureDate.getMonth()) + 1, day: futureDate.getDate()};
  return `${futureDate.year}-${futureDate.month}-${futureDate.day}`;
}

if ('schedule' in options) {
  let currentDate = {
    year: new Date().getFullYear(),
    month: Number(new Date().getMonth()) + 1,
    day: new Date().getDate()
  };
  let futureDate = new Date(),
    date = futureDate.setDate(futureDate.getDate() + 7);
  futureDate = {year: futureDate.getFullYear(), month: Number(futureDate.getMonth()) + 1, day: futureDate.getDate()};

  const today = `${currentDate.year}-${currentDate.month}-${currentDate.day}`,
    future = `${futureDate.year}-${futureDate.month}-${futureDate.day}`;
  const url = `http://api.football-data.org/v2/competitions/2019/matches?dateFrom=${today}&dateTo=${future}`;
  // console.log(url);
  axios.get(url, headers)
    .then(res => {
      const matches = res.data.matches.map(match => ({
        time: formatDate(new Date(match.utcDate)),
        home: match.homeTeam.name,
        away: match.awayTeam.name
      }));
      console.table(matches);
    });
}

if ('milan' in options) {
  const
    today = getCurrentDate(),
    future = getFutureDate(30);
  const url = `https://api.football-data.org/v2/teams/98/matches?dateFrom=${today}&dateTo=${future}`;
  axios.get(url, headers)
    .then(res => {
      const matches = res.data.matches.map(match => ({
        time: formatDate(new Date(match.utcDate)),
        home: match.homeTeam.name,
        away: match.awayTeam.name
      }));
      // console.log(matches);
      console.log(`${chalk.green.bold('Upcoming Milan Matches:\n')}`);
      matches.forEach(match => {
        console.log(`${match.home === 'AC Milan' ? chalk.red.bold(match.home) : chalk.cyan.bold(match.home)} v ${match.away === 'AC Milan' ? chalk.red.bold(match.away) : chalk.cyan.bold(match.away)} 
@ ${chalk.white.bold(match.time)} \n`)
      });
    });
}

// CURRENT SCORES -sc
// http://api.football-data.org/v2/competitions/2019/matches?status=LIVE OR IN_PLAY
// LIVE | IN_PLAY

// TOP SCORERS -capo
// https://api.football-data.org/v2/competitions/SA/scorers

