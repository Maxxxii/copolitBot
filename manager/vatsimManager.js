import { codeBlock } from "discord.js";
export const getVatsimAtis = async function(icao){
    let vatsimAtis;
    const response = await fetch(`https://data.vatsim.net/v3/vatsim-data.json`);
    const result = await response.json();
    const atises = result.atis;
    for(let i = 0; i < atises.length;i++){
        const atisCallsign = atises[i].callsign;
        const atisAirport = atisCallsign.slice(0, atisCallsign.length - 5)
        if(atisAirport == icao.toUpperCase() && atises[i].text_atis){
            vatsimAtis = {name: "VATSIM", value: `Frequency: **${atises[i].frequency}**\nATIS code: **${atises[i].atis_code}**\nText ATIS: ${codeBlock(atises[i].text_atis)}`};
            break;
        }
    }
    if(!vatsimAtis){
        vatsimAtis = {name: "VATSIM", value: "No ATIS for this airport"};
    }
    return{
        vatsimAtis
    }
}