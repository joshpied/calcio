#!/usr/bin/env node
const yargs = require('yargs');

const printTable = require('./cmds/table');
const printFixtures = require('./cmds/fixtures');
const printMilan = require('./cmds/milan');
const printScores = require('./cmds/scores');
const printTopScorers = require('./cmds/capocannoniere');
const printTransfers = require('./cmds/transfers');

const options = yargs
  .usage('Usage: -t <table>')
  .option('t', {alias: 'table', describe: 'League table', type: 'string'})
  .usage('Usage: -f <fixtures>')
  .option('f', {
    alias: 'fixtures',
    describe: 'League fixtures/schedule',
    type: 'string'
  })
  .usage('Usage: -ac <milan>')
  .option('a', {
    alias: 'milan',
    describe: 'AC Milan schedule',
    type: 'string'
  })
  .usage('Usage: -s <scores>')
  .option('s', {
    alias: 'scores',
    describe: 'Scores for live matches',
    type: 'string'
  })
  .usage('Usage: -c <capo>')
  .option('c', {
    alias: 'capo',
    describe: 'Top scorers for the season',
    type: 'string'
  })
  .usage('Usage: -r <transfers>')
  .option('r', {
    alias: 'transfers',
    describe: 'Latest confirmed transfers in the league',
    type: 'string'
  })
  .help()
  .argv;

if ('table' in options) {
  printTable();
}

if ('fixtures' in options) {
  printFixtures();
}

if ('milan' in options) {
  printMilan();
}

if ('scores' in options) {
  printScores();
}

if ('capo' in options) {
  printTopScorers();
}

if ('transfers' in options) {
  printTransfers();
}

// TODO: TOP SCORERS -capo
// https://api.football-data.org/v2/competitions/SA/scorers
