import { codeBlock } from "discord.js";
import dayjs from 'dayjs';
import fetch from "node-fetch";

export const getVatsimAtis = async function(icao){
    let vatsimAtis;
    const response = await fetch(`https://data.vatsim.net/v3/vatsim-data.json`);
    const result = await response.json();
    const atises = result.atis;
    for(let i = 0; i < atises.length;i++){
        const atisCallsign = atises[i].callsign;
        const atisAirport = atisCallsign.slice(0, atisCallsign.length - 5)
        if(atisAirport == icao.toUpperCase() && atises[i].text_atis){
            vatsimAtis = {name: "VATSIM", value: `Frequency: **${atises[i].frequency}**\nATIS code: **${atises[i].atis_code != null ? atises[i].atis_code : "Not available"}**\nText ATIS: ${codeBlock(atises[i].text_atis)}`};
            if(vatsimAtis == "<HTML><BODY><H1>503 SERVICE UNAVAILABLE</H1>"){
                vatsimAtis = {name: "VATSIM", value: `Frequency: **${atises[i].frequency}**\nError: VATSIM service is unavailable`}
            }
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
export const getVatsimAtc = async function(icao){
    let vatsimAtc;
    const controllersArr = [];
    const response = await fetch(`https://data.vatsim.net/v3/vatsim-data.json`);
    const result = await response.json();
    const controllers = result.controllers;
    for(let i = 0; i < controllers.length;i++){
        const atcCallsign = controllers[i].callsign;
        if(atcCallsign.startsWith(icao.toUpperCase())){
            controllersArr.push(`**${atcCallsign}** ${controllers[i].frequency} ${controllers[i].name}`);
        }
    }
    if(controllersArr.length != 0){
        vatsimAtc = {name: "VATSIM", value: controllersArr.join("\n")};
    }
    else{
        vatsimAtc = {name: "VATSIM", value: "No active controllers."};
    }
    return {
        vatsimAtc
    }
}
export const getVatsimEvents = async function(icao){
    let vatsimEvents;
    const eventsArr = [];
    const response = await fetch(`https://my.vatsim.net/api/v1/events/all`);
    const result = await response.json();
    for(let i = 0; i < result.data.length;i++){
        for(let k = 0; k < result.data[i].airports.length;k++){
            if(result.data[i].airports[k].icao === icao.toUpperCase()){
                const startDate = dayjs(result.data[i].start_time).format("YYYY-MM-DD");
                const endDate = dayjs(result.data[i].end_time).format("YYYY-MM-DD");
                const eventDate = startDate + "-" + endDate;
                eventsArr.push(
                    `Name: **${result.data[i].name}**
                    Airports: ${result.data[i].airports.map(airport => ` **${airport.icao}**`)}
                    Date: **${startDate == endDate ? startDate : eventDate}**
                    Start time: **${dayjs(result.data[i].start_time).format("HH:mm")}Z**
                    End time: **${dayjs(result.data[i].end_time).format("HH:mm")}Z**`
                )
                break;
            }
        }
    }
    if(eventsArr.length != 0){
        vatsimEvents = {name: "VATSIM", value: eventsArr.join("\n\n")};
    }
    else{
        vatsimEvents = {name: "VATSIM", value: "No scheduled events on airpot"};
    }
    return{
        vatsimEvents
    }
}