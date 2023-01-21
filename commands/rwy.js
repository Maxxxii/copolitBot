import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportElevation, getAirportRunways } from "../manager/airportDbManager.js";
import { getMetar } from "../manager/avwxManager.js";


export const data =  new SlashCommandBuilder()
        .setName("rwy")
        .setDescription("Get best runway for take-off/landing")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
        .addBooleanOption((option) =>
            option
                .setName("show-metar")
                .setDescription("Choose if you want to see metar from airport")
                .setRequired(false))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const showMetar = interaction.options.getBoolean("show-metar");
        const { runwaysArr } = await getAirportRunways(icao);
        const { result } = await getMetar(icao);
        const calculatedRunways = findBestRunway(runwaysArr, result.wind_direction.value);
        const bestRunways = [...new Set(calculatedRunways)];
        let namesOfRunways = [];
        for(let i = 0; i < bestRunways.length;i++){
            namesOfRunways.push(bestRunways[i].rwy);
        }
        const rwyEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`Active runways on ${icao.toUpperCase()}`)
            .setDescription(`Best runways for takeoff/landing: **${namesOfRunways.sort().join(", ")}**`)
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            if(showMetar){
                rwyEmbed.addFields({name: "Metar report", value: `${codeBlock(result.raw)}`})
            }
        await interaction.editReply({
            embeds: [rwyEmbed]
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
        if(el.diff <= acc.diff){
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