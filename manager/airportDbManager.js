import geomag from 'geomag';


export const getAirportElevation = async function(icao){
    const response = await fetch(`https://airportdb.io/api/v1/airport/${icao}?apiToken=3e316dbfeeb1c47ab4bd821cb3faeed1f608d02cdd6eb86c1e704a13d58a83d12d66d1ae440bca38326c065ff8b631b3`);
    await validateResponse(response);
    const result = await response.json();
    const airportElev = `Airport elevation of ${result.name}: ${result.elevation_ft}ft`;
    const runways = result.runways;
    const runwaysElevArr = runways.map(runway => {
        if(runway.closed === "0"){
            return `**Runway ${runway.le_ident}: ${runway.le_elevation_ft}ft\nRunway ${runway.he_ident}: ${runway.he_elevation_ft}ft**`
        }
    });
    return{
        airportElev,
        runwaysElevArr
    }
}
export const getAirportRunways = async function(icao){
    const response = await fetch(`https://airportdb.io/api/v1/airport/${icao}?apiToken=3e316dbfeeb1c47ab4bd821cb3faeed1f608d02cdd6eb86c1e704a13d58a83d12d66d1ae440bca38326c065ff8b631b3`);
    await validateResponse(response);
    const result = await response.json();
    const runways = result.runways;
    const field = geomag.field(result.latitude_deg, result.longitude_deg);
    const declination = field.declination;
    const allRunwaysArr = runways.flatMap(runway => {
        if(runway.closed === "0"){
            return [{rwy: runway.le_ident, hdg: runway.le_heading_degT - declination, ilsFreq: runway.le_ils ? runway.le_ils.freq : undefined, ilsCourse: runway.le_ils ? runway.le_ils.course : undefined }, {rwy: runway.he_ident, hdg: runway.he_heading_degT - declination, ilsFreq: runway.he_ils ? runway.he_ils.freq : undefined, ilsCourse: runway.he_ils ? runway.he_ils.course : undefined }]
        }
    });
    const runwaysArr = allRunwaysArr.filter(runway => runway !== undefined);
    return{
        runwaysArr
    }
}
export const getAirportName = async function(icao){
    const response = await fetch(`https://airportdb.io/api/v1/airport/${icao}?apiToken=3e316dbfeeb1c47ab4bd821cb3faeed1f608d02cdd6eb86c1e704a13d58a83d12d66d1ae440bca38326c065ff8b631b3`);
    await validateResponse(response);
    const result = await response.json();
    const name = result.name;
    return{
        name
    }
}
export const getAirportSlope = async function(icao){
    const response = await fetch(`https://airportdb.io/api/v1/airport/${icao}?apiToken=3e316dbfeeb1c47ab4bd821cb3faeed1f608d02cdd6eb86c1e704a13d58a83d12d66d1ae440bca38326c065ff8b631b3`);
    await validateResponse(response);
    const result = await response.json();
    const runways = result.runways;
    const allSlopeArr = runways.flatMap(runway => {
        if(runway.closed == 0){
            const leSlope = (runway.he_elevation_ft - runway.le_elevation_ft)/(runway.length_ft/3.2808)*100;
            const heSlope = (runway.le_elevation_ft - runway.he_elevation_ft)/(runway.length_ft/3.2808)*100;
            return [{rwy: runway.le_ident, slope: leSlope}, {rwy: runway.he_ident, slope: heSlope}]
        }
    });
    const slopeArr = allSlopeArr.filter(runway => runway !== undefined);
    return {
        slopeArr
    }
    
}
function validateResponse(response){
    if(response.status !== 200){
        if(response.status == 204){
            return Promise.reject(new Error("No information about airport"));     
        }
        else{
            return Promise.reject(new Error("Wrong airport ID"));
        }
        
    }
}