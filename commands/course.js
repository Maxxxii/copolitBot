import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportRunways } from "../manager/airportDbManager.js";

export const data =  new SlashCommandBuilder()
        .setName("course")
        .setDescription("Get courses of runways on airport")
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
        const coursesArr = runwaysArr.map(runway => `**Runway ${runway.rwy}: ${Math.round(runway.hdg*100)/100}°**`)
        const courseEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`Courses of runways on ${icao.toUpperCase()}`)
            .setDescription(coursesArr.join("\n"))
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
        await interaction.editReply({
            embeds: [courseEmbed]
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