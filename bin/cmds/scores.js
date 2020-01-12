const axios = require('axios');
const {headers, formatDate, getCurrentDate, getFutureDate} = require('../utils/helpers');
const chalk = require('chalk');

async function getMatchDay() {
  const today = getCurrentDate(), futureDay = getFutureDate(7);
  const url = `http://api.football-data.org/v2/competitions/SA/matches?dateFrom=${today}&dateTo=${futureDay}`;
  const res = await axios.get(url, headers);
  if (res.data.count === 0)
    return 'No upcoming matches!';
  console.log(res.data.matches[5]);
  return res.data.matches[0].matchday
}

function formatMatches(matches) {
  return matches.map(match => ({
    homeTeam: match.homeTeam.name,
    awayTeam: match.awayTeam.name,
    score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`,
    status: match.status,
    date: match.utcDate
  }));
}

async function printScores() {
  // First need to get the current matchday manually as retrieving the currentMatchday from Serie A is wrong
  const matchday = await getMatchDay();
  if (matchday === 'No upcoming matches!') {
    console.log(chalk.red(matchday));
    return;
  }
  // can now use matchday to get all matches for the current weekend
  const url = `https://api.football-data.org/v2/competitions/2019/matches?matchday=${matchday}`;
  try {
    const res = await axios.get(url, headers);
    // cleanup data we need
    const matches = formatMatches(res.data.matches);
    const liveMatches = matches.filter(match => match.status === 'IN_PLAY' || match.status === 'PAUSED');
    const finishedMatches = matches.filter(match => match.status === 'FINISHED');
    const scheduledMatches = matches.filter(match => match.status === 'SCHEDULED');

    console.log(chalk.cyan.bold(`\nMatchday #${(matchday)}`));
    if (liveMatches.length) {
      console.log(`\nIn Play`);
      liveMatches.forEach(match => {
        console.log(`${chalk.green(match.homeTeam)} ${match.score} ${chalk.green(match.awayTeam)}`);
      });
    }
    if (finishedMatches.length) {
      console.log(`\nMatches Played`);
      finishedMatches.forEach(match => {
        console.log(`${chalk.cyanBright(match.homeTeam)} ${match.score} ${chalk.cyanBright(match.awayTeam)}`);
      });
    }
    if (scheduledMatches.length) {
      console.log(`\nMatches Scheduled`);
      scheduledMatches.forEach(match => {
        console.log(`${chalk.yellow(match.homeTeam)} - ${chalk.yellow(match.awayTeam)} @ ${formatDate(match.date)}`);
      });
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = printScores;
