import { codeBlock } from 'discord.js';
import dayjs from 'dayjs';
import { getNearbyAirports } from './airlabsManager.js';

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
        report += `**Latitude:** ${result.latitude}\n`;
    }
    if(result.longitude){
        report += `**Longitude:** ${result.longitude}`;
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
    const observedTime = dayjs(result.time.dt).format("HHmm[Z]");
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
    if(result.wind_speed?.value > 20){
        readable += `\n\n**Due to strong wind, we recomennd divert. Suggested alternates you can see below.**`
    }
    else if(result.wind_gust?.value > 20){
        readable += `\n\n**Due to strong gusts, we recomennd divert. Suggested alternates you can see below.**`
    }    
    else if(result.visibility?.value < 200){
        readable += `\n\n**Due to low visibility, we recomennd divert. Suggested alternates you can see below.**`
    }
    return {
        raw,
        readable,
        speech: result.speech,
        result
    }
} 
export const getMultipleMetar = async function(idArray){
    let metarArr = [];
    let result = "";
    let response = "";
    for(let i = 0; i < idArray.length; i++){
        response = await fetch(`https://avwx.rest/api/metar/${idArray[i]}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0&options=info`);
        await validateResponse(response);
        result = await response.json();
        metarArr.push(codeBlock(result.raw));
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
export const checkWeatherConditions = async function(metar, id){
    let idArr = [];
    let fieldsArr = [];
    if(metar.wind_gust?.value > 20 || metar.wind_speed?.value > 20 || metar.visibility?.value < 200){
        const { closestAirports } = await getNearbyAirports(id);
        if(!closestAirports){
            fieldsArr.push({name: "No suitable airport within 300km."});
        }
        else{
            for(let i = 0;i < closestAirports.length;i++){
                idArr.push(closestAirports[i].icao_code);
            }
            const { metarArr } = await getMultipleMetar(idArr);
            for(let i=0;i < metarArr.length;i++){
                fieldsArr.push({name: `${closestAirports[i].icao_code} (${closestAirports[i].name}). Distance: ${Math.round(closestAirports[i].distance*0.621371)}nm`, value: `${metarArr[i]}`})
            }
        }        
    }
    return{
        fieldsArr
    }
}
function validateResponse(response){
    if(response.status !== 200){
        if(response.status == 204){
            return Promise.reject(new Error("Airport has no weather station"));     
        }
        else{
            return Promise.reject(new Error("Wrong airport ID"));
        }
        
    }
}