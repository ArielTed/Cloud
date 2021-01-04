use lol;

//Champ, items
matchChamp = {$match: {Champ: "Ziggs", win:1}};
limitEffective = { $limit : 6 };
sortEffective = {$sort : {"effective":-1}};

unwindItem = {$unwind: "$items"};
projectItem = {$project: {"items": 1, "Champ":1}};
//Count
keyGroupItem = {"items" : "$items"};
groupByItem = {$group : {
    _id: keyGroupItem,
    item:{"$first":"$items"},
    "effective":{$sum:1}
    }};

projectSS = {$project: {"Champ":1,"ss1": 1, "ss2": 1}};
//Count
keyGroupSS = {"ss1" : "$ss1", "ss2" : "$ss2"};
groupBySS = {$group : {
    _id: keyGroupSS,
    ss1: {"$first": "$ss1"},
    ss2: {"$first": "$ss2"},
    "effective":{$sum:1}
    }};

//Champ, trinket
projectTrinket = {$project: {"Champ":1,"trinket": 1 }};
//Count
keyGroupTrinket = {"trinket" : "$trinket"};
groupByTrinket = {$group : {
    _id: keyGroupTrinket,
    Champ: {"$first": "$Champ"},
    trinket: {"$first": "$trinket"},
    "effective":{$sum:1}
    }};

//Item
bestItems = db.getCollection("Sample_Stats_v3-3").aggregate([
    {$unwind: "$items"},
    {$match: {Champ: "Ziggs", win: 1}},
    {$project: {"items": 1, "Champ":1}},
    {$group : {
    _id: {"items" : "$items"},
    item:{"$first":"$items"},
    Champ:{"$first":"$Champ"},
    "effective":{$sum:1}
    }},
    {$sort : {"effective":-1}},
    {$limit: 6}
]);

//ss
bestSS = db.getCollection("Sample_Stats_v3-3").aggregate([
{$match: {Champ: "Ziggs", win: 1}},
{$project: {"Champ":1,"ss1": 1, "ss2": 1}},
{$group : {
    _id: {"ss1" : "$ss1", "ss2" : "$ss2"},
    Champ: {"$first": "$Champ"},
    ss1: {"$first": "$ss1"},
    ss2: {"$first": "$ss2"},
    "effective":{$sum:1}
}},
{$sort : {"effective":-1}},
{$limit: 6}
]);

//trinket
bestTrinket = db.getCollection("Sample_Stats_v3-3").aggregate([
{$match: {Champ: "Ziggs", win: 1}},
{$project: {"Champ":1,"trinket": 1 }},
{$group : {
    _id: {"trinket" : "$trinket"},
    Champ: {"$first": "$Champ"},
    trinket: {"$first": "$trinket"},
    "effective":{$sum:1}
}},
{$sort : {"effective":-1}},
{$limit: 6}
]);