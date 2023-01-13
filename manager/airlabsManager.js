import { getStationInfo } from "./avwxManager.js";

export const getNearbyAirports = async function(id){
    const { result } = await getStationInfo(id);
    const lat = result.latitude;
    const long = result.longitude;
    const response = await fetch(`https://airlabs.co/api/v9/nearby?lat=${lat}&lng=${long}&distance=300&api_key=fe80ae76-f2ef-4b34-bf5d-54bd472dcbd2`);
    const data = await response.json();
    if(!data.response.airports){
        return Promise.reject(new Error("No suitable airports within 300km."));
    }
    const airports = data.response.airports;
    const popularAirports = airports.filter(airport => airport.popularity > 38500 && airport.icao_code != result.icao);
    popularAirports.sort((a, b) => a.distance - b.distance);
    const closestAirports = popularAirports.slice(0,3);
    return {
        closestAirports
    }
}
