const fs = require('node:fs');

const a = [1165,1525,1225];
const ps = [257154];
let fids, tids, jids;

function getPosition(pl){
    if(fids.filter(f => f.x == pl.x && f.y == pl.y).length > 0)
        return {"t": 'f', 'id': fids.filter(f => f.x == pl.x && f.y == pl.y)[0].id}
    if(tids.filter(t => t.x == pl.x && t.y == pl.y).length > 0)
        return {"t": 't', 'id': tids.filter(t => t.x == pl.x && t.y == pl.y)[0].id}
    if(jids.filter(j => j.x == pl.x && j.y == pl.y).length > 0)
        return {"t": 'j', 'id': jids.filter(j => j.x == pl.x && j.y == pl.y)[0].id}
    return null;
}

function filterData(sd,pd){
    let sData = JSON.parse(sd)
    let pData = JSON.parse(pd)

    let relevantData = sData.filter(player =>
            !player.isDeadFlagged &&
            ((!player.isSleeping &&
            !player.isSleepingFort &&
            !player.isSleepingTent) || player.last_duel) &&
            player.holiday_duel &&
            (!(new Date(player.nextBattleAtLocation*1000) > new Date()) || player.last_duel) &&
            (a.includes(player.alliance_id) || ps.includes(player.player_id)) &&
            getPosition(player) != null
       )
    
    relevantData.forEach(p => p["hp"] = pData.health.filter(entry => entry.name == p.name)[0].skill_level
        * ((p.charclass == "soldier") ? 2 : 1) + p.level)
    relevantData.forEach(p => 
        p["rss"] = pData.reflex.filter(entry => entry.name == p.name)[0].skill_level 
            + Math.round(pData.tough.filter(entry => entry.name == p.name)[0].skill_level * 0.25) + 55)
    relevantData.forEach(p => 
        p["rsp"] = pData.tough.filter(entry => entry.name == p.name)[0].skill_level 
            + Math.round(pData.reflex.filter(entry => entry.name == p.name)[0].skill_level * 0.25) + 55)
    relevantData.forEach(p => 
        p["tct"] = Math.round(pData.tactic.filter(entry => entry.name == p.name)[0].skill_level 
            * ((p.charclass == "soldier") ? 1.5 : 1)))
    relevantData.forEach(p => p["p"] = getPosition(p));
    relevantData = relevantData.sort((a,b) =>  a.hp - b.hp)
    return relevantData;
}
(async function(){   
    fids = await (await fetch("https://james-saw-ya.github.io/ft2/fids.json")).json();
    tids = await (await fetch("https://james-saw-ya.github.io/ft2/tids.json")).json();
    jids = await (await fetch("https://james-saw-ya.github.io/ft2/jids.json")).json();
    try {
      const pd = fs.readFileSync('pd.json', 'utf8');
      const sd = fs.readFileSync('sd.json', 'utf8');
      
      fs.writeFile('data.json', JSON.stringify(filterData(sd,pd)), err => {
      if (err) {
        console.error(err);
      } else {
        console.log("written successfully")
      }
    });
    } catch (err) {
      console.error(err);
    }
})()
