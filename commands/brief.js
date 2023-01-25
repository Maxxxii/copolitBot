import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportName, getAirportRunways } from "../manager/airportDbManager.js";
import { getMetar } from "../manager/avwxManager.js";
import { getIvaoAtis } from "../manager/ivaoManager.js";
import { getVatsimAtis } from "../manager/vatsimManager.js";

export const data =  new SlashCommandBuilder()
        .setName("brief")
        .setDescription("Get brief for airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { name } = await getAirportName(icao);
        const { vatsimAtis } = await getVatsimAtis(icao);
        const { ivaoAtis } = await getIvaoAtis(icao);
        const { result } = await getMetar(icao);
        const { runwaysArr } = await getAirportRunways(icao);
        const calculatedRunways = findBestRunway(runwaysArr, result.wind_direction.value);
        const bestRunways = [...new Set(calculatedRunways)];
        const ilsArr = runwaysArr.map(runway => {
            if(runway.ilsFreq != undefined){
                return `**Runway ${runway.rwy}: Frequency: ${runway.ilsFreq}, Course: ${runway.ilsCourse}°**`;
            }
            else{
                return `**Runway ${runway.rwy}**: No ILS system`;
            }
        });
        let namesOfRunways = [];
        for(let i = 0; i < bestRunways.length;i++){
            namesOfRunways.push(bestRunways[i].rwy);
        }
        const briefEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setDescription(`**${name}**`)
            .addFields(vatsimAtis, ivaoAtis, {name: "Metar", value: `**${result.raw}**`}, {name: "Charts", value: `Charts for this airport are **[here](https://lukeairtool.net/viewchart.php?icao=${icao.toUpperCase()})**`}, {name: "Runways", value: `Best runways for takeoff/landing: **${result.wind_direction.repr !== "VRB" ? namesOfRunways.sort().join(", ") : "Wind is variable. To get takeoff/landing runways look at ATIS."}**`}, {name: "ILS", value: ilsArr.join("\n")})
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
        await interaction.editReply({
            embeds: [briefEmbed]
        });
    } catch(err){
        const errorEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setDescription(err.message)
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"});
        interaction.editReply({
            embeds: [errorEmbed]
        });
        console.error(err);
    }
    
}

function findBestRunway(anglesArr, angleToMatch){
    let runwaysDiff = [];
    let bestRunways = [];
    for(let i = 0; i < anglesArr.length;i++){
        const distance1 = Math.abs(anglesArr[i].hdg - angleToMatch);
        const distance2 = 360 - anglesArr[i].hdg + angleToMatch;
        const diff = Math.abs(angleToMatch - (distance1 < distance2 ? distance1 : distance2));
        runwaysDiff.push({rwy: anglesArr[i].rwy, diff: diff});
    };
    runwaysDiff.sort((a, b) => a.diff - b.diff);
    runwaysDiff.reduce((acc, el) => {
        if(el.diff -1 <= acc.diff){
            bestRunways.push(acc, el);
            return acc;
        }
        else{
            bestRunways.push(acc);
            return acc;
        }
    });
    return bestRunways;
}