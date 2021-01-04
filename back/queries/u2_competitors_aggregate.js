use lol;
db.getCollection("Sample_TeamStats").find({});

//Champ, Role
unwindOp = {$unwind: "$participants"};
matchChamp = {$match: {"participants.ChampRole": "MID", "participants.Champ": "Ziggs"}};
projectChamp = {$project: {"matchid": 1, "Team_ID":1}};

// Two Teams Competition
lookupOpponent = {$lookup: {
    "from": "Sample_Stats",
    "localField": "matchid",
    "foreignField": "matchid",
    "as": "opponent"
}};
unwindPlayers = {$unwind: "$opponent"};
matchPlayers = {$match: {"opponent.ChampRole": "MID"}};
projectPlayers = {$project: {"opponent": 1, "matchid": 1, "Team_ID":1, "OpTeam":"$opponent.Team_ID"}};

//Opponent facing each other and keep needed stats 
keyGroup = {"matchid" : "$matchid", "OpTeam" : "$OpTeam"};
groupByMatchId = {$group : {
    _id: keyGroup,
    matchid: {$first: "$matchid"},
    champteam: {$first: "$OpTeam"},
    teamid: {$first: "$Team_ID"},
    champ: {$addToSet: "$opponent.Champ"}, 
    kills: {$sum: "$opponent.kills"},
    deaths: {$sum: "$opponent.deaths"},
    assists: {$sum: "$opponent.assists"},
    items: {$addToSet: "$opponent.items"},
    }
};

projectGrpStat = {$project:{"matchid": "$_id.matchid", _id:0, "champ":"$champ", "kills":"$kills", "deaths":"$deaths", "assists":"$assists",  
    "ishere": {$cond: {if: {"$eq": ["$teamid","$champteam"]}, then: true, else: false}},
    "items":"$items", "teamid":1, "champteam":1, "score": {$subtract: ["$kills","$deaths"]},
    }};

sortBool = {$sort: {"matchid":1,"ishere": 1}};

//Result of Comparison
lastkeyGroup = {"matchid" : "$matchid"};
lastgroupBy = {$group : {
    _id: keyGroup,
    champ: {$first: "$champ"}, 
    op_score: {$first: {"$toInt": "$score"}},
    chmp_score: {$last: {"$toInt": "$score"}},
    items: {$first: "$items"},
    }
};

lastproject = {$project:{_id:0, "champ":1,items:1,
    "dif": {$subtract: ["$op_score","$chmp_score"]},
    "competitor": "tocheck"}
    };

restructure = {$project: {"champ": 1, "dif": 1 ,"competitor": {$cond: {if: {"$and": [{"$eq": ["$competitor", "tocheck"]},
     {"$lt": ["$dif",-1]}]}, then: "weak", else: {$cond: {if: {"$gt": ["$dif", 1]},
    then: "strong", else: "good"}
    }}},
     "items":"$items"
    }};

// Items Effective Against Champ
itemStrong = {$match: {
    $or: [{"competitor": "strong"}, {"competitor": "good"}]
}
};
unwindlistoflist = {$unwind: "$items"};
unwindItems = {$project: {items: 1}};
unwindlistofitems = {$unwind: "$items"};
unwindItem = {$project: {items: 1}};
itemkeyGroup = {"items" : "$items"};
itemGroupBy = {$group : {
    _id: itemkeyGroup,
    item: {$first: "$items"},
    item_score: {$sum: 1}
    }
};
itemSort = {$sort: {"item_score":-1}};

// Count For Each Champ Team
countkeyGroup = {"champ" : "$champ"};
countGroupBy = {$group : {
    _id: countkeyGroup,
    champ: {$first: "$champ"},
    avg_dif: {$avg: "$dif"},
    competitor: {$first: "$competitor"}
    }
};

countproject = {$project:{"champ":1,
    "avg_dif": 1,
    "competitor": { $cond: {if: {"$gt": ["$avg_dif", 1]},
    then: "strong", else: {$cond: {if: {"$lt": ["$avg_dif",-1]},
    then: "weak", else: "good"
    }}
    }}
}};

countSort = {$sort: {"avg_dif":-1}};

//Execute U2
matches = db.getCollection("Sample_TeamStats").aggregate([unwindOp, matchChamp, projectChamp, lookupOpponent, unwindPlayers
, matchPlayers, projectPlayers, groupByMatchId, projectGrpStat, sortBool, lastgroupBy, lastproject, restructure
//U2.b
,itemStrong, unwindlistoflist, unwindItems, unwindlistofitems,unwindItem, itemGroupBy, itemSort
//U2.a
//,countGroupBy,countproject,countSort
]);