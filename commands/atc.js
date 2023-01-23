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
        .addBooleanOption((option) =>
            option
                .setName("vatsim-only")
                .setDescription("Choose if you want atc only from VATSIM")
                .setRequired(false))
        .addBooleanOption((option) =>
            option
                .setName("ivao-only")
                .setDescription("Choose if you want atc only from IVAO")
                .setRequired(false))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const vatsimOnly = interaction.options.getBoolean("vatsim-only");
        const ivaoOnly = interaction.options.getBoolean("ivao-only");
        const atcEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle("Active controllers on " + icao.toUpperCase())
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            if(vatsimOnly){                
                const { vatsimAtc } = await getVatsimAtc(icao);                
                atcEmbed.addFields(vatsimAtc);
            }
            else if(ivaoOnly){
                const { ivaoAtc } = await getIvaoAtc(icao);  
                atcEmbed.addFields(ivaoAtc);
            }
            else{
                const { ivaoAtc } = await getIvaoAtc(icao);
                const { vatsimAtc } = await getVatsimAtc(icao);
                atcEmbed.addFields(vatsimAtc, ivaoAtc);
            }
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