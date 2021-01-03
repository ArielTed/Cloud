use local;

//1 & 2
unwindOp = {$unwind: "$participants"};
groupOp = {$group: { _id : "$participants.Champ", "total_played":{ $sum : 1 }, "total_win":{$sum : {$cond: [ "$win", 1, 0]}}}};

//--------------------------------------------------- 1 -----------------------------------------------------------
// Let's suppose that there is 5000 players in our sample dataset
projectOp1 = {$project: { _id : 1, "popularity" : {$multiply : [{$divide : ["$total_played", db.Sample_TeamStats.count() * 5 ]}, 100]}}};
sort1 = {$sort : {"popularity" : -1}};
Popularity = db.getCollection("Sample_TeamStats").aggregate([unwindOp, groupOp, projectOp1, sort1]);

//--------------------------------------------------- 2 -----------------------------------------------------------

projectOp2 = {$project: { _id : 1, "win_rate" : {$multiply : [{$divide : ["$total_win", "$total_played" ]}, 100]}}};
sort2 = {$sort : {"win_rate" : -1}};
Win_rate = db.getCollection("Sample_TeamStats").aggregate([unwindOp, groupOp, projectOp2, sort2]);

//--------------------------------------------------- 3 -----------------------------------------------------------

unwindOp2 = {$unwind: "$bans"};
groupOp2 = {$group: { _id : "$bans", "total_banned":{ $sum : 1 }}};

projectOp3 = {$project: { _id : 1, "ban_ratio" : {$multiply : [{$divide : ["$total_banned", db.Sample_TeamStats.count() * 3 ]}, 100]}}};
sort3 = {$sort : {"ban_ratio" : -1}};
Ban_ratio = db.getCollection("Sample_TeamStats").aggregate([unwindOp2, groupOp2, projectOp3, sort3]);