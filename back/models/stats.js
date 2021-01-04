const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  matchid: {
    type: Number
  },
  Participant_ID: {
    type: Number
  },
  Champ: {
    type: String
  },
  CommonLane: {
    type: String
  },
  RoleInGame: {
    type: String
  },
  Team_ID: {
    type: Number
  },
  items: {
    type: Array
  },
  win: {
    type: Number
  },
  kills: {
    type: Number
  },
  deaths: {
    type: Number
  },
  assists: {
    type: Number
  },
  trinket: {
    type: Number
  },
  totdmgdealt: {
    type: Number
  },
  totdmgtochamp: {
    type: Number
  },
  dmgtoobj: {
    type: Number
  },
  turretkills: {
    type: Number
  },
  ss1: {
    type: Number
  },
  ss2: {
    type: Number
  }
});

module.exports = mongoose.model('Stats', statsSchema);
