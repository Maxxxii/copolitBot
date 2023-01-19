import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAirportName } from "../manager/airportDbManager.js";

export const data =  new SlashCommandBuilder()
        .setName("name")
        .setDescription("Get charts for airport")
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
        const nameEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`Full name of ${icao.toUpperCase()}`)
            .setDescription(`**${name}**`)
        await interaction.editReply({
            embeds: [nameEmbed]
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