import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportRunways } from "../manager/airportDbManager.js";

export const data =  new SlashCommandBuilder()
        .setName("ils")
        .setDescription("Get ils info for airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { runwaysArr } = await getAirportRunways(icao);
        const ilsArr = runwaysArr.map(runway => {
            if(runway.ilsFreq != undefined){
                return `**Runway ${runway.rwy}: Frequency: ${runway.ilsFreq}, Course: ${runway.ilsCourse}°**`;
            }
            else{
                return `**Runway ${runway.rwy}**: No ILS system`;
            }
        });
        const ilsEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`ILS for ${icao.toUpperCase()}`)
            .setDescription(ilsArr.join("\n"))
        await interaction.editReply({
            embeds: [ilsEmbed]
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