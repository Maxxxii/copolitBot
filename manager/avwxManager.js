import dayjs from 'dayjs';

export const getMetar = async function(id){
    let readable = "";
    let raw;
    const response = await fetch(`https://avwx.rest/api/metar/${id}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0&options=info,translate,speech`);
    await validateResponse(response, `No station available at the moment near ${id}`);
    const result = await response.json();
    raw = await result.raw;
    console.log(result.translate);
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

    console.log(readable);
    return {
        raw,
        readable,
        speech: result.speech
    }
} 
export const getTaf = async function(id){
    let raw;
    let readable = "";
    const response = await fetch(`https://avwx.rest/api/taf/${id}?token=jC-yBLTFICJyQhhTtX-CUSaB8vFt-OPyxffZ65wdog0&options=info,translate,speech`);
    await validateResponse(response, `No station available at the moment near ${id}`);    
    const result = await response.json();
    console.log(result);
    raw = await result.raw;
    readable += "Station: "
    if(result.info.icao){
        readable += `${result.info.icao}\n`
    }
    else{
        readable += `${result.info.station}\n`;
    }
    const observedTime = dayjs(result.time.dt).format("HHmm[Z]");
    readable += `Observed at: ${observedTime}\n`;
    readable += `Report: ${result.speech}`;
    console.log(readable);
    return {
        raw,
        readable,
        speech: result.speech
    }
}
function validateResponse(response, deafultError){
    if(response.status !== 200){
        if(response.status == 204){
            return Promise.reject(new Error("Airport has no metar station"));     
        }
        else{
            return Promise.reject(new Error("Wrong airport ID"));
        }
        
    }
}