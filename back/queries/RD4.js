use local;

lookup = {$lookup: { from: "Sample_Stats", "localField": "matchid", "foreignField": "matchid", as: "stats" }};

unwindOp = {$unwind: "$stats"};
groupOp = {$group: { _id : "$platformid", "duration": {$avg:"$duration"}, "avg_kills":{$avg:"$stats.kills" }}};

projectOp = {$project: { _id : 1, "duration" : 1, "avg_kills" : 1, "ratio_kill_per_second" : {$divide : ["$avg_kills","$duration"]}}};

db.getCollection("Sample_Matches").aggregate([lookup, unwindOp, groupOp, projectOp]);