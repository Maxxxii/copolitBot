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
        .addBooleanOption((option) =>
            option
                .setName("vatsim-only")
                .setDescription("Choose if you want atis only from VATSIM")
                .setRequired(false))
        .addBooleanOption((option) =>
            option
                .setName("ivao-only")
                .setDescription("Choose if you want atis only from IVAO")
                .setRequired(false))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const vatsimOnly = interaction.options.getBoolean("vatsim-only");
        const ivaoOnly = interaction.options.getBoolean("ivao-only");
        const atisEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`ATIS for ${icao.toUpperCase()}`)
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            if(vatsimOnly){                
                const { vatsimAtis } = await getVatsimAtis(icao);                
                atisEmbed.addFields(vatsimAtis);
            }
            else if(ivaoOnly){
                const { ivaoAtis } = await getIvaoAtis(icao);  
                atisEmbed.addFields(ivaoAtis);
            }
            else{
                const { ivaoAtis } = await getIvaoAtis(icao);
                const { vatsimAtis } = await getVatsimAtis(icao);
                atisEmbed.addFields(vatsimAtis, ivaoAtis);
            }
        await interaction.editReply({
            embeds: [atisEmbed]
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