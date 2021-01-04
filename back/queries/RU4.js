use lol;

//Teamstat Towers
matchTeam = {$match: {"towerkills": {"$gte": 10}}};
projectTeam = {$project: {"participants": 1}};

unwindTeam = {$unwind: "$participants"};

lookupStats = {$lookup: {
    "from": "Sample_Stats",
    "localField": "participants.Participant_ID",
    "foreignField": "Participant_ID",
    "as": "stats"
}};
projectStats = {"$project": {"stat": {"$arrayElemAt": ["$stats",0]} } };

//Count
keyGroupLaneTeam = {"matchid" : "$stat.matchid", "Team_ID": "$stat.Team_ID","ChampRole": "$stat.champ_commonLane"};
groupByLaneTeam = {$group : {
    _id: keyGroupLaneTeam,
    "totaldmgobj":{"$sum":"$stat.dmgtoobj"},
    champs: {"$addToSet": "$stat.Champ"},
    }};

keyGlobalLaneTeam = {"champs" : "$champs"};
groupByGlobal = {$group : {
    _id: keyGlobalLaneTeam,
    champs: {"$first": "$champs"},
    "totaldmgobj":{"$avg":"$totaldmgobj"}
    }};

sortDmg = {$sort : {"totaldmgobj":-1}};
//projectTeamScore = {$project: {"champ1": 1, "champ2": 1}};

TeamSynergy = db.getCollection("Sample_TeamStats").aggregate([matchTeam, projectTeam, unwindTeam, lookupStats, projectStats,
groupByLaneTeam, groupByGlobal, sortDmg]);
