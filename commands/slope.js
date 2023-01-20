import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportSlope } from "../manager/airportDbManager.js";

export const data =  new SlashCommandBuilder()
        .setName("slope")
        .setDescription("Get slopes of runways5 for airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { slopeArr } = await getAirportSlope(icao);
        const slopesArr = slopeArr.map(slope => `**Runway ${slope.rwy}: ${Math.round(slope.slope*100)/100}°**`)
        const slopeEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setDescription(slopesArr.join("\n"))
        await interaction.editReply({
            embeds: [slopeEmbed]
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