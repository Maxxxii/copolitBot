import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getStationInfo } from '../manager/avwxManager.js';

export const data =  new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get info about airport")
        .addStringOption((option) => 
            option
                .setName("id")
                .setDescription("Put ICAO, IATA or coordinates of airport")
                .setRequired(true))
export async function execute(interaction){
    try{
        await interaction.deferReply();
        const id = interaction.options.getString("id");
        const { report } = await getStationInfo(id);
        const infoEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .addFields({name: "Report", value: report})
            
        await interaction.editReply({
            embeds: [infoEmbed]
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


