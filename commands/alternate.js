import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAlternatesMetar } from "../manager/avwxManager.js";

export const data =  new SlashCommandBuilder()
        .setName("alternate")
        .setDescription("Get alternate to airport")
        .addStringOption((option) => 
            option
                .setName("id")
                .setDescription("Put ICAO, IATA or coordinates of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const id = interaction.options.getString("id");
        const {fieldsArr} = await getAlternatesMetar(id);
        const alternateEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setFields(fieldsArr)
        await interaction.editReply({
            embeds: [alternateEmbed]
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


