import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportElevation } from "../manager/airportDbManager.js";


export const data =  new SlashCommandBuilder()
        .setName("elev")
        .setDescription("Get elvation of airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { airportElev, runwaysElevArr } = await getAirportElevation(icao);
        const elevEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(airportElev)
            .setDescription(runwaysElevArr.join("\n"))
        await interaction.editReply({
            embeds: [elevEmbed]
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