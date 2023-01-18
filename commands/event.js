import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getVatsimEvents } from "../manager/vatsimManager.js";

export const data =  new SlashCommandBuilder()
        .setName("event")
        .setDescription("Get events on airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { vatsimEvents } = await getVatsimEvents(icao);
        const chartsEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle("Scheduled events on " + icao.toUpperCase())
            .addFields(vatsimEvents)
        await interaction.editReply({
            embeds: [chartsEmbed]
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