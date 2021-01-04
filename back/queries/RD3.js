use local;

projectOp = 
{ 
    $project : 
    { 
        "win_firstBlood" :
        {
            $cond: { if: {$eq : ["$win", "$firstblood"]}, then: 1, else: 0 }
        },
        "win_firstTower" :
        {
            $cond: { if: {$eq : ["$win", "$firsttower"]}, then: 1, else: 0 }
        },
        "win_firstDragon" :
        {
            $cond: { if: {$eq : ["$win", "$firstdragon"]}, then: 1, else: 0 }
        }
    }
};

projectOp2 = {$project : {"win_firstBlood" : 1, "win_firstTower" : 1, "win_firstDragon" : 1, "win_firstAll" : { $avg: ["$win_firstBlood","$win_firstTower","$win_firstDragon"]}}};

groupOp = {$group: { _id : "null", "avg_win_firstBlood": {$avg:"$win_firstBlood"}, "avg_win_firstTower":{$avg:"$win_firstTower"}, "avg_win_firstDragon":{$avg:"$win_firstDragon"}, "avg_win_firstAll":{$avg:"$win_firstAll"}}};


db.getCollection("Sample_TeamStats").aggregate([projectOp, projectOp2, groupOp]);
