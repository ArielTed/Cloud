use lol;

mapFunction = function(){
    if(this.firstdragon){
        for(j =0; j<this.participants.length;j++){
            if(this.participants[j].champ_commonLane == "JUNGLE"){
                jungler = this.participants[j].Champ;
                    emit(jungler, 1);
            }   
        }
    }
};

reduceFunction = function(key, values) {
    return {"ChampName": key, "total": Array.sum(values)};
//    res = {"ChampName": key, "total": Array.sum(values)};
//    return res;
};

queryParam = {"query":{}, "out":{"inline":1}};

results = db.getCollection("teamstats-mockup").mapReduce(mapFunction,reduceFunction,queryParam).results;

sres = results.sort((x,y) => {
   return y.value.total - x.value.total;
});
