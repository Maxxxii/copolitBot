import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getIvaoAtis } from "../manager/ivaoManager.js";
import { getVatsimAtis } from "../manager/vatsimManager.js";

export const data =  new SlashCommandBuilder()
        .setName("atis")
        .setDescription("Get atis for airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { vatsimAtis } = await getVatsimAtis(icao);
        const { ivaoAtis} = await getIvaoAtis(icao);
        const atisEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`ATIS for ${icao.toUpperCase()}`)
            .addFields(vatsimAtis, ivaoAtis);
        await interaction.editReply({
            embeds: [atisEmbed]
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