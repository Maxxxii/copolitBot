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