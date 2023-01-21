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
            .addFields(vatsimAtis, ivaoAtis, {name: "Metar", value: `**${result.raw}**`}, {name: "Charts", value: `Charts for this airport are **[here](https://lukeairtool.net/viewchart.php?icao=${icao})**`}, {name: "Runways", value: `Best runways for takeoff/landing: **${namesOfRunways.sort().join(", ")}**`}, {name: "ILS", value: ilsArr.join("\n")})
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
    let bestRunways = [];
    anglesArr.reduce((acc, el) => {
        const accDistance1 = Math.abs(acc.hdg - angleToMatch)
        const accDistance2 = 360 - acc.hdg + angleToMatch
        const elDistance1 = Math.abs(el.hdg - angleToMatch)
        const elDistance2 = 360 - el.hdg + angleToMatch
        const currentDif = Math.abs(angleToMatch - (accDistance1 < accDistance2 ? accDistance1 : accDistance2))
        const newDiff = Math.abs(angleToMatch - (elDistance1 < elDistance2 ? elDistance1 : elDistance2))
        if(newDiff < currentDif){
            bestRunways.push(el);
            return el;
        }
        else if(newDiff > currentDif){
            bestRunways.push(acc);
            return acc;
        }
        else{
            bestRunways.push(el, acc);
            return acc;
        }
    });
    return bestRunways;
}