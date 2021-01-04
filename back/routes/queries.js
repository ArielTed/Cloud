const router = require('express').Router();

const Matches = require('../models/matches');
const Stats = require('../models/stats');
const TeamStats = require('../models/teamstats');

const baseURL = '/api';

router.post(`${baseURL}/RD1`, async (req, res) => {
  try {
    const teamStatsCount = await TeamStats.countDocuments({});
    const popularity = await TeamStats.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: "$participants.Champ", "total_played": { $sum: 1 }, "total_win": { $sum: { $cond: ["$win", 1, 0] } } } },
      { $project: { _id: 1, "popularity": { $multiply: [{ $divide: ["$total_played", teamStatsCount * 5] }, 100] } } },
      { $sort: { "popularity": -1 } }
    ]);
    const winRate = await TeamStats.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: "$participants.Champ", "total_played": { $sum: 1 }, "total_win": { $sum: { $cond: ["$win", 1, 0] } } } },
      { $project: { _id: 1, "win_rate": { $multiply: [{ $divide: ["$total_win", "$total_played"] }, 100] } } },
      { $sort: { "win_rate": -1 } }
    ]);
    const banRatio = TeamStats.aggregate([
      { $unwind: "$bans" },
      { $group: { _id: "$bans", "total_banned": { $sum: 1 } } },
      { $project: { _id: 1, "ban_ratio": { $multiply: [{ $divide: ["$total_banned", teamStatsCount * 3] }, 100] } } },
      { $sort: { "ban_ratio": -1 } }
    ]);
    return res.status(200).json({ popularity, winRate, banRatio });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RD2`, async (req, res) => {
  if (!req.body.championName)
    return res.status(400).json('Param championName missing.')

  try {
    switch (req.body.answerType) {
      case 1:
        const playingRate = await Matches.aggregate([
          { $group: { _id: { "version": "$version" }, version: { $first: "$version" }, match: { $addToSet: "$participants" }, matchid: { $addToSet: "$matchid" }, total: { $sum: 1 } } },
          { $unwind: "$match" },
          { $unwind: "$match" },
          { $match: { "match.Champ": req.body.championName } },
          { $project: { "version": 1, "match": 1, "total": 1 } },
          { $group: { _id: { "version": "$version" }, version: { $first: "$version" }, total: { $first: "$total" }, played: { $sum: 1 }, } },
          { $project: { version: 1, playingrate: { $divide: [{ $multiply: ["$played", 100] }, "$total"] } } },
          { $sort: { "version": -1 } }
        ]);
        return res.status(200).json(playingRate);
      default:
        const banRate = await Matches.aggregate([
          { $group: { _id: { "version": "$version" }, version: { $first: "$version" }, matchid: { $addToSet: "$matchid" }, total: { $sum: 1 } } }
        ]);
        return res.status(200).json(banRate);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RD3`, async (req, res) => {
  try {
    projectOp = {
      $project: {
        "win_firstBlood": {
          $cond: { if: { $eq: ["$win", "$firstblood"] }, then: 1, else: 0 }
        },
        "win_firstTower": {
          $cond: { if: { $eq: ["$win", "$firsttower"] }, then: 1, else: 0 }
        },
        "win_firstDragon": {
          $cond: { if: { $eq: ["$win", "$firstdragon"] }, then: 1, else: 0 }
        }
      }
    };
    projectOp2 = { $project: { "win_firstBlood": 1, "win_firstTower": 1, "win_firstDragon": 1, "win_firstAll": { $avg: ["$win_firstBlood", "$win_firstTower", "$win_firstDragon"] } } };
    groupOp = { $group: { _id: "null", "avg_win_firstBlood": { $avg: "$win_firstBlood" }, "avg_win_firstTower": { $avg: "$win_firstTower" }, "avg_win_firstDragon": { $avg: "$win_firstDragon" }, "avg_win_firstAll": { $avg: "$win_firstAll" } } };
    const response = await TeamStats.aggregate([projectOp, projectOp2, groupOp]);
    return res.status(200).json(response);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RD4`, async (req, res) => {
  try {
    const response = await Matches.aggregate([
      lookup = { $lookup: { from: "stats", "localField": "matchid", "foreignField": "matchid", as: "stats" } },
      { $unwind: "$stats" },
      { $group: { _id: "$platformid", "duration": { $avg: "$duration" }, "avg_kills": { $avg: "$stats.kills" } } },
      { $project: { _id: 1, "duration": 1, "avg_kills": 1, "ratio_kill_per_second": { $divide: ["$avg_kills", "$duration"] } } }
    ]);
    return res.status(200).json(response);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RU1`, async (req, res) => {
  try {
    const response = await TeamStats.aggregate([
      { $match: { "firstdragon": true } },
      { $project: { "participants": 1 } },
      { $unwind: "$participants" },
      { $match: { "participants.champ_commonLane": "JUNGLE" } },
      { $project: { "participants.Champ": 1 } },
      { $group: { _id: "$participants.Champ", "value": { $sum: 1 } } },
      { $sort: { "value": -1 } }
    ]);
    return res.status(200).json(response);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
