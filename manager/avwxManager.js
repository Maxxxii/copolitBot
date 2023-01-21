import { codeBlock } from 'discord.js';
import dayjs from 'dayjs';
import { getNearbyAirports } from './airlabsManager.js';
import fetch from "node-fetch";

export const getStationInfo = async function(id){
    let report = "";
    const response = await fetch(`https://avwx.rest/api/station/${id}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0`);
    await validateResponse(response);
    const result = await response.json();
    if(result.name){
        report += `**Airport:** ${result.name}\n`;
    }
    if(result.city){
        report += `**City:** ${result.city}\n`
    }
    if(result.country){
        report += `**Country:** ${result.country}\n`
    }
    if(result.icao){
        report += `**ICAO:** ${result.icao}\n`;
    }
    if(result.iata){
        report += `**IATA:** ${result.iata}\n`;
    }
    if(result.elevation_ft){
        report += `**Elevation:** ${result.elevation_ft}ft(${result.elevation_m}m)\n`;
    }
    if(result.latitude){
        report += `**Latitude:** ${Math.round((result.latitude + Number.EPSILON) * 10000) / 10000}\n`;
    }
    if(result.longitude){
        report += `**Longitude:** ${Math.round((result.longitude + Number.EPSILON) * 10000) / 10000}\n`;
    }
    return {
        report,
        result
    }
}
export const getMetar = async function(id){
    let readable = "";
    let raw;
    const response = await fetch(`https://avwx.rest/api/metar/${id}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0&options=info,translate,speech`);
    await validateResponse(response);
    const result = await response.json();
    raw = await result.raw;
    readable += "**Station:** "
    if(result.info.icao){
        readable += `${result.info.icao}\n`
    }
    else{
        readable += `${result.info.station}\n`;
    }
    const observedTime = dayjs(result.time.dt).format("HH:mm");
    readable += `**Observed at:** ${observedTime}\n`;
    if(result.translate.wind){
        readable += "**Wind: **" + result.translate.wind + "\n";
    }
    if(result.translate.visibility){
        readable += "**Visibility:** " + result.translate.visibility + "\n";
    }
    if(result.translate.temperature){
        readable += "**Temperature:** " + result.translate.temperature + "\n";
    }
    if(result.translate.dewpoint){
        readable += "**Dew point:** " + result.translate.dewpoint + "\n";
    }
    if(result.translate.altimeter){
        readable += "**Altimeter:** " + result.translate.altimeter + "\n";
    }
    if(result.translate.clouds){
        readable += "**Clouds:** " + result.translate.clouds + "\n";
    }
    if(result.translate.other){
        readable += "**Other:** " + result.translate.other + "\n";
    }
    if(result.flight_rules){
        readable += "**Flight rules:** " + result.flight_rules;
    }
    return {
        raw,
        readable,
        speech: result.speech,
        result
    }
} 
export const getMultipleMetar = async function(idArr){
    let metarArr = [];
    for(let i=0; i < idArr.length; i++){
        const response = await fetch(`https://avwx.rest/api/metar/${idArr[i]}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0&options=info`);
        await validateResponse(response);
        const result = await response.json();
        metarArr.push(result);
    }    
    return{
        metarArr
    }
    
}
export const getTaf = async function(id){
    let raw;
    let readable = "";
    const response = await fetch(`https://avwx.rest/api/taf/${id}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0&options=info,translate,speech`);
    await validateResponse(response);    
    const result = await response.json();
    raw = await result.raw;
    readable += "**Station:** "
    if(result.info.icao){
        readable += `${result.info.icao}\n`
    }
    else{
        readable += `${result.info.station}\n`;
    }
    const observedTime = dayjs(result.time.dt).format("HHmm[Z]");
    readable += `**Observed at:** ${observedTime}\n`;
    readable += `**Report:** ${result.speech}`;
    return {
        raw,
        readable,
        speech: result.speech
    }
}
export const getAlternatesMetar = async function(id, range){
    let fieldsArr = [];
    const { closestAirports } = await getNearbyAirports(id, range);
    if(!closestAirports.length){
        fieldsArr.push({name: "Alternates", value: `No suitable airport within ${range}km.`});
    }
    else{
        const idArr = closestAirports.map(airport => airport.icao_code);
        const { metarArr } = await getMultipleMetar(idArr);
        for(let i=0;i < metarArr.length;i++){
            fieldsArr.push({name: `${closestAirports[i].icao_code} (${closestAirports[i].name}). Distance: ${Math.round(closestAirports[i].distance*0.621371)}nm`, value: `${codeBlock(metarArr[i].raw)}`})
        }
    }
    return{
        fieldsArr
    }
}
function validateResponse(response){
    if(response.status !== 200){
        if(response.status == 204){
            return Promise.reject(new Error("Airport doesn't provide metar/taf information"));     
        }
        else{
            return Promise.reject(new Error("Wrong airport ID"));
        }
        
    }
}