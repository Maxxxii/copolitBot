import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAlternatesMetar, getMetar } from '../manager/avwxManager.js';

export const data =  new SlashCommandBuilder()
        .setName("metar")
        .setDescription("Get metar from airport")
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
        const {raw, readable, result} = await getMetar(icao);        
        const metarEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            if(rawOnly){
                metarEmbed.addFields(
                    {name: "**Raw report**", value: `${codeBlock(raw)}`}
                );
            } 
            else{
                metarEmbed.addFields(
                    {name: "**Raw report**", value: `${codeBlock(raw)}`},
                    {name: "**Decoded report**",value: `${readable}`}
                );
            }
            if(result.wind_gust?.value > 25 || result.wind_speed?.value > 20 || result.visibility?.value < 200){
                if(result.wind_speed?.value > 20){
                    metarEmbed.addFields({name: "Alert", value: `\n\n**Due to strong wind, we recomennd divert. Suggested alternates you can see below.**`});
                }
                else if(result.wind_gust?.value > 25){
                    metarEmbed.addFields({name: "Alert", value: `\n\n**Due to strong gusts, we recomennd divert. Suggested alternates you can see below.**`});
                }    
                else if(result.visibility?.value < 200){
                    metarEmbed.addFields({name: "Alert", value: `\n\n**Due to low visibility, we recomennd divert. Suggested alternates you can see below.**`}); 
                }
                const {fieldsArr} = await getAlternatesMetar(icao, 300);
                metarEmbed.addFields(fieldsArr);
            }
        await interaction.editReply({
            embeds: [metarEmbed]
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


