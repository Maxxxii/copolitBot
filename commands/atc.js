import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getIvaoAtc } from "../manager/ivaoManager.js";
import { getVatsimAtc } from "../manager/vatsimManager.js";

export const data =  new SlashCommandBuilder()
        .setName("atc")
        .setDescription("Get ATC for airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { vatsimAtc } = await getVatsimAtc(icao);
        const { ivaoAtc } = await getIvaoAtc(icao);
        const atcEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle("Active controllers on " + icao.toUpperCase())
            .addFields(vatsimAtc, ivaoAtc)
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
        await interaction.editReply({
            embeds: [atcEmbed]
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