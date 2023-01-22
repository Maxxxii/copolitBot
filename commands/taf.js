import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getTaf } from '../manager/avwxManager.js';

export const data =  new SlashCommandBuilder()
        .setName("taf")
        .setDescription("Get taf from airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
        .addBooleanOption((option) =>
            option
                .setName("raw")
                .setDescription("Decide if you need only raw report without decoded text")
                .setRequired(false))
export async function execute(interaction){
    try{
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const rawOnly = interaction.options.getBoolean("raw");
        const {raw, readable} = await getTaf(icao);
        const tafEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle(`TAF for ${icao.toUpperCase()}`)
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            if(rawOnly){
                tafEmbed.addFields(
                    {name: "Raw report", value: `${codeBlock(raw)}`} 
                )
            }
            else{
                tafEmbed.addFields(
                    {name: "Raw report", value: `${codeBlock(raw)}`},
                    {name: "Readable",value: `${readable}`}
                );
            }
        await interaction.editReply({
            embeds: [tafEmbed]
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


