use lol;

//Get total matches per version
keyGroup1 = {"version" : "$version"};
groupByVersion1 = {$group : {
    _id: keyGroup1,
    version: {$first: "$version"},
    match: {$addToSet: "$participants"},
    matchid: {$addToSet: "$matchid"},
    total: {$sum:1}
    }
};

// Get matches Param Champ involved in
unwindMatch = {$unwind: "$match"};
unwindParticipant = {$unwind: "$match"};
matchChamp = {$match: {"match.Champ": "Ziggs"}};
projectChamp = {$project: {"version":1, "match": 1, "total": 1}};

//Get matches played per version
keyGroup2 = {"version" : "$version"};
groupByVersion2 = {$group : {
    _id: keyGroup2,
    version: {$first: "$version"},
    total: {$first: "$total"},
    played: {$sum: 1},
    }
};
//Calculation
projectPlayingRate = {$project: {version:1, playingrate: {$divide: [{$multiply: ["$played", 100]}, "$total"]}}};
sortVersion = {$sort: {"version":-1}};
//Execute PlayingRate
db.getCollection("Sample_Matches_v4").aggregate([groupByVersion1, unwindMatch, unwindParticipant, matchChamp,
 projectChamp, groupByVersion2, projectPlayingRate, sortVersion]);

//Get total matches per version for bans
keyGroupBan = {"version" : "$version"};
groupByVersion1 = {$group : {
    _id: keyGroupBan,
    version: {$first: "$version"},
    matchid: {$addToSet: "$matchid"},
    total: {$sum:1}
    }
};

//ban rate
db.getCollection("Sample_Matches_v4").aggregate([groupByVersion1]);
