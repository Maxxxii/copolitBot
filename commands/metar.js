import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getMetar } from '../manager/avwxManager.js';

export const data =  new SlashCommandBuilder()
        .setName("metar")
        .setDescription("Get metar from airport")
        .addStringOption((option) => 
            option
                .setName("id")
                .setDescription("Put ICAO, IATA or cordinates of airport")
                .setRequired(true))
        .addBooleanOption((option) =>
            option
                .setName("raw")
                .setDescription("Decide if you need only raw report without decoded text")
                .setRequired(false))
export async function execute(interaction){
    try{
        const id = interaction.options.getString("id");
        const rawOnly = interaction.options.getBoolean("raw");
        const {raw, readable} = await getMetar(id);
        const metarEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            if(rawOnly){
                metarEmbed.setDescription(codeBlock(raw))
            } 
            else{
                metarEmbed.addFields(
                    {name: "**Raw report**", value: `${codeBlock(raw)}`},
                    {name: "**Decoded report**",value: `${readable}`}
                );
            }
            
        await interaction.reply({
            embeds: [metarEmbed]
        });
    } catch(err){
        interaction.reply(err.message);
        console.error(err);
    }
    
}


