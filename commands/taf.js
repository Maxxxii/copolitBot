import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getTaf } from '../manager/avwxManager.js';

export const data =  new SlashCommandBuilder()
        .setName("taf")
        .setDescription("Get taf from airport")
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
        const {raw, readable} = await getTaf(id);
        const tafEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            if(rawOnly){
                tafEmbed.setDescription(codeBlock(raw))
            } 
            else{
                tafEmbed.addFields(
                    {name: "Raw report", value: `${codeBlock(raw)}`},
                    {name: "Readable",value: `**${readable}**`}
                );
            }
        await interaction.reply({
            embeds: [tafEmbed]
        });
    } catch(err){
        interaction.reply(err.message);
        console.error(err);
    }
    
}


