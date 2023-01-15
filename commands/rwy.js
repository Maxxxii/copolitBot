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
            .setDescription(err.message);
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