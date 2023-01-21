import { codeBlock } from "discord.js";
import fetch from "node-fetch";


export const getIvaoAtis = async function(icao){
    let ivaoAtis;
    const response = await fetch(`https://api.ivao.aero/v2/tracker/whazzup/atis`);
    const result = await response.json();
    for(let i = 0; i < result.length;i++){
        const atisCallsign = result[i].callsign;
        const atisAirport = atisCallsign.slice(0, 4)
        if(atisAirport == icao.toUpperCase()){
            ivaoAtis = {name: "IVAO", value: `ATIS code: **${result[i].revision}**\nText ATIS: ${codeBlock(result[i].lines.slice(1))}`};
            break;
        }
    }
    if(!ivaoAtis){
        ivaoAtis = {name: "IVAO", value: "No ATIS for this airport"};
    }
    return{
        ivaoAtis
    }
}
export const getIvaoAtc = async function(icao){
    let ivaoAtc;
    const controllersArr = [];
    const response = await fetch(`https://api.ivao.aero/v2/tracker/whazzup/atis`);
    const result = await response.json();
    for(let i = 0; i < result.length;i++){
        const atisCallsign = result[i].callsign;
        const atisAirport = atisCallsign.slice(0, 4)
        if(atisAirport == icao.toUpperCase()){
            controllersArr.push(`**${atisCallsign}** ${result[i].atcSession.frequency}`);
        }
    }
    if(controllersArr.length != 0){
        ivaoAtc = {name: "IVAO", value: controllersArr.join("\n")};
    }
    else{
        ivaoAtc = {name: "IVAO", value: "No ATIS for this airport"};
    }
    return{
        ivaoAtc
    }
}