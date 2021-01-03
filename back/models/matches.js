const mongoose = require('mongoose');

const matchesSchema = new mongoose.Schema({
  matchid: {
    type: Number
  },
  platformid: {
    type: String
  },
  seasonid: {
    type: Number
  },
  duration: {
    type: Number
  },
  version: {
    type: String
  },
  participants: {
    type: Array
  },
  bans: {
    type: Array
  }
});

module.exports = mongoose.model('Matches', matchesSchema);
