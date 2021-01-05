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
      { $sort: { "popularity": -1 } },
      { $limit: 6 }
    ]);
    const winRate = await TeamStats.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: "$participants.Champ", "total_played": { $sum: 1 }, "total_win": { $sum: { $cond: ["$win", 1, 0] } } } },
      { $project: { _id: 1, "win_rate": { $multiply: [{ $divide: ["$total_win", "$total_played"] }, 100] } } },
      { $sort: { "win_rate": -1 } },
      { $limit: 6 }
    ]);
    const banRatio = TeamStats.aggregate([
      { $unwind: "$bans" },
      { $group: { _id: "$bans", "total_banned": { $sum: 1 } } },
      { $project: { _id: 1, "ban_ratio": { $multiply: [{ $divide: ["$total_banned", teamStatsCount * 3] }, 100] } } },
      { $sort: { "ban_ratio": -1 } },
      { $limit: 6 }
    ]);
    return res.status(200).json({ popularity, winRate, banRatio });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RD2`, async (req, res) => {
  if (!req.body.championName || !req.body.answerType)
    return res.status(400).json('Either param championName and/or answerType missing.')

  try {
    switch (req.body.answerType) {
      case 'playingRate':
        const playingRate = await Matches.aggregate([
          { $group: { _id: { "version": "$version" }, version: { $first: "$version" }, match: { $addToSet: "$participants" }, matchid: { $addToSet: "$matchid" }, total: { $sum: 1 } } },
          { $unwind: "$match" },
          { $unwind: "$match" },
          { $match: { "match.Champ": req.body.championName } },
          { $project: { "version": 1, "match": 1, "total": 1 } },
          { $group: { _id: { "version": "$version" }, version: { $first: "$version" }, total: { $first: "$total" }, played: { $sum: 1 }, } },
          { $project: { version: 1, playingrate: { $divide: [{ $multiply: ["$played", 100] }, "$total"] } } },
          { $sort: { "version": -1 } },
          { $limit: 6 }
        ]);
        return res.status(200).json({ playingRate });
      default:
        const banRate = await Matches.aggregate([
          { $group: { _id: { "version": "$version" }, version: { $first: "$version" }, matchid: { $addToSet: "$matchid" }, total: { $sum: 1 } } },
          { $limit: 6 }
        ]);
        return res.status(200).json({ banRate });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RD3`, async (req, res) => {
  try {
    const response = await TeamStats.aggregate([
      { $project: { "win_firstBlood": { $cond: { if: { $eq: ["$win", "$firstblood"] }, then: 1, else: 0 } }, "win_firstTower": { $cond: { if: { $eq: ["$win", "$firsttower"] }, then: 1, else: 0 } }, "win_firstDragon": { $cond: { if: { $eq: ["$win", "$firstdragon"] }, then: 1, else: 0 } } } },
      { $project: { "win_firstBlood": 1, "win_firstTower": 1, "win_firstDragon": 1, "win_firstAll": { $avg: ["$win_firstBlood", "$win_firstTower", "$win_firstDragon"] } } },
      { $group: { _id: "null", "avg_win_firstBlood": { $avg: "$win_firstBlood" }, "avg_win_firstTower": { $avg: "$win_firstTower" }, "avg_win_firstDragon": { $avg: "$win_firstDragon" }, "avg_win_firstAll": { $avg: "$win_firstAll" } } },
      { $limit: 6 }
    ]);
    return res.status(200).json({ response });
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
      { $project: { _id: 1, "duration": 1, "avg_kills": 1, "ratio_kill_per_second": { $divide: ["$avg_kills", "$duration"] } } },
      { $limit: 6 }
    ]);
    return res.status(200).json({ response });
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
      { $sort: { "value": -1 } },
      { $limit: 6 }
    ]);
    return res.status(200).json({ response });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RU2`, async (req, res) => {
  try {
    const unwindOp = { $unwind: "$participants" };
    const matchChamp = { $match: { "participants.champ_commonLane": "MID", "participants.Champ": "Ziggs" } };
    const projectChamp = { $project: { "matchid": 1, "Team_ID": 1 } };
    const lookupOpponent = { $lookup: { from: "stats", localField: "matchid", foreignField: "matchid", as: "opponent" } };
    const unwindPlayers = { $unwind: "$opponent" };
    const matchPlayers = { $match: { "opponent.CommonLane": "MID" } };
    const projectPlayers = { $project: { "opponent": 1, "matchid": 1, "Team_ID": 1, "OpTeam": "$opponent.Team_ID" } };
    const keyGroup = { "matchid": "$matchid", "OpTeam": "$OpTeam" };
    const groupByMatchId = { $group: { _id: keyGroup, matchid: { $first: "$matchid" }, champteam: { $first: "$OpTeam" }, teamid: { $first: "$Team_ID" }, champ: { $addToSet: "$opponent.Champ" }, kills: { $sum: "$opponent.kills" }, deaths: { $sum: "$opponent.deaths" }, assists: { $sum: "$opponent.assists" }, items: { $addToSet: "$opponent.items" }, } };
    const projectGrpStat = { $project: { "matchid": "$_id.matchid", _id: 0, "champ": "$champ", "kills": "$kills", "deaths": "$deaths", "assists": "$assists", "ishere": { $cond: { if: { "$eq": ["$teamid", "$champteam"] }, then: true, else: false } }, "items": "$items", "teamid": 1, "champteam": 1, "score": { $subtract: ["$kills", "$deaths"] }, } };
    const sortBool = { $sort: { "matchid": 1, "ishere": 1 } };
    const lastgroupBy = { $group: { _id: keyGroup, champ: { $first: "$champ" }, op_score: { $first: { "$toInt": "$score" } }, chmp_score: { $last: { "$toInt": "$score" } }, items: { $first: "$items" }, } };
    const lastproject = { $project: { _id: 0, "champ": 1, items: 1, "dif": { $subtract: ["$op_score", "$chmp_score"] }, "competitor": "tocheck" } };
    const restructure = { $project: { "champ": 1, "dif": 1, "competitor": { $cond: { if: { "$and": [{ "$eq": ["$competitor", "tocheck"] }, { "$lt": ["$dif", -1] }] }, then: "weak", else: { $cond: { if: { "$gt": ["$dif", 1] }, then: "strong", else: "good" } } } }, "items": "$items" } };
    const itemStrong = { $match: { $or: [{ "competitor": "strong" }, { "competitor": "good" }] } };
    const unwindlistoflist = { $unwind: "$items" };
    const unwindItems = { $project: { items: 1 } };
    const unwindlistofitems = { $unwind: "$items" };
    const unwindItem = { $project: { items: 1 } };
    const itemkeyGroup = { "items": "$items" };
    const itemGroupBy = { $group: { _id: itemkeyGroup, item: { $first: "$items" }, item_score: { $sum: 1 } } };
    const itemSort = { $sort: { "item_score": -1 } };
    const countkeyGroup = { "champ": "$champ" };
    const countGroupBy = { $group: { _id: countkeyGroup, champ: { $first: "$champ" }, avg_dif: { $avg: "$dif" }, competitor: { $first: "$competitor" } } };
    const countproject = { $project: { "champ": 1, "avg_dif": 1, "competitor": { $cond: { if: { "$gt": ["$avg_dif", 1] }, then: "strong", else: { $cond: { if: { "$lt": ["$avg_dif", -1] }, then: "weak", else: "good" } } } } } };
    const countSort = { $sort: { "avg_dif": -1 } };

    let matches;
    if (req.body.type === 'a') {
      matches = await TeamStats.aggregate([
        unwindOp, matchChamp, projectChamp, lookupOpponent, unwindPlayers, matchPlayers, projectPlayers,
        groupByMatchId, projectGrpStat, sortBool, lastgroupBy, lastproject, restructure,
        countGroupBy, countproject, countSort,
        { $limit: 6 }
      ]);
    }
    else {
      matches = await TeamStats.aggregate([
        unwindOp, matchChamp, projectChamp, lookupOpponent, unwindPlayers, matchPlayers, projectPlayers,
        groupByMatchId, projectGrpStat, sortBool, lastgroupBy, lastproject, restructure,
        itemStrong, unwindlistoflist, unwindItems, unwindlistofitems, unwindItem, itemGroupBy, itemSort,
        { $limit: 6 }
      ]);
    }
    return res.status(200).json({ matches });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RU3`, async (req, res) => {
  try {
    if (!req.body.type)
      return res.status(400).json('Param type missing.');

    switch (req.body.type) {
      case 'item':
        const bestItems = await Stats.aggregate([
          { $unwind: "$items" },
          { $match: { Champ: "Ziggs", win: 1 } },
          { $project: { "items": 1, "Champ": 1 } },
          {
            $group: {
              _id: { "items": "$items" },
              item: { "$first": "$items" },
              Champ: { "$first": "$Champ" },
              "effective": { $sum: 1 }
            }
          },
          { $sort: { "effective": -1 } },
          { $limit: 6 }
        ]);
        return res.status(200).json({ bestItems });
      case 'ss':
        const bestSS = await Stats.aggregate([
          { $match: { Champ: "Ziggs", win: 1 } },
          { $project: { "Champ": 1, "ss1": 1, "ss2": 1 } },
          {
            $group: {
              _id: { "ss1": "$ss1", "ss2": "$ss2" },
              Champ: { "$first": "$Champ" },
              ss1: { "$first": "$ss1" },
              ss2: { "$first": "$ss2" },
              "effective": { $sum: 1 }
            }
          },
          { $sort: { "effective": -1 } },
          { $limit: 6 }
        ]);
        return res.status(200).json({ bestSS });
      default:
        const bestTrinket = await Stats.aggregate([
          { $match: { Champ: "Ziggs", win: 1 } },
          { $project: { "Champ": 1, "trinket": 1 } },
          {
            $group: {
              _id: { "trinket": "$trinket" },
              Champ: { "$first": "$Champ" },
              trinket: { "$first": "$trinket" },
              "effective": { $sum: 1 }
            }
          },
          { $sort: { "effective": -1 } },
          { $limit: 6 }
        ]);
        return res.status(200).json({ bestTrinket });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(`${baseURL}/RU4`, async (req, res) => {
  try {
    const teamSynergy = await TeamStats.aggregate([
      { $match: { "towerkills": { "$gte": 10 } } },
      { $project: { "participants": 1 } },
      { $unwind: "$participants" },
      { $lookup: { "from": "stats", "localField": "participants.Participant_ID", "foreignField": "Participant_ID", "as": "stats" } },
      { "$project": { "stat": { "$arrayElemAt": ["$stats", 0] } } },
      { $group: { _id: { "matchid": "$stat.matchid", "Team_ID": "$stat.Team_ID", "ChampRole": "$stat.champ_commonLane" }, "totaldmgobj": { "$sum": "$stat.dmgtoobj" }, champs: { "$addToSet": "$stat.Champ" }, } },
      { $group: { _id: { "champs": "$champs" }, champs: { "$first": "$champs" }, "totaldmgobj": { "$avg": "$totaldmgobj" } } },
      { $sort: { "totaldmgobj": -1 } },
      { $limit: 6 }
    ]);
    return res.status(200).json({ teamSynergy });
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
