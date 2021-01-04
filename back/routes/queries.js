const router = require('express').Router();
const Matches = require('../models/matches');
const Stats = require('../models/stats');
const TeamStats = require('../models/teamstats');

router.get('/', async (req, res) => {
  try {
    Matches.countDocuments({}, (err, matches) => {
      Stats.countDocuments({}, (err2, stats) => {
        TeamStats.countDocuments({}, (err3, teamstats) => {
          return res.status(200).json({ matches, stats, teamstats });
        });
      });
    });
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
