use lol;
db.getCollection("teamstats-mockup").find({});

matchOp = {$match: {"firstdragon": true}};
projectOp = {$project: {"participants": 1}};
unwindOp = {$unwind: "$participants"};
matchChamp = {$match: {"participants.champ_commonLane": "JUNGLE"}};
projectChamp = {$project: {"participants.Champ": 1}};
groupOp = {$group: {_id: "$participants.Champ", "value": {$sum:1}}};
sortOp = {$sort: {"value": -1}};
db.getCollection("teamstats-mockup").aggregate([matchOp, projectOp, unwindOp, matchChamp, projectChamp, groupOp, sortOp]);