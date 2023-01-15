import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getAlternatesMetar } from "../manager/avwxManager.js";

export const data =  new SlashCommandBuilder()
        .setName("alternate")
        .setDescription("Get alternate to airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
        .addIntegerOption((option) => 
            option
                .setName("range")
                .setDescription("Set range of searching for alternate (max. 500km, deafult 300km)")
                .setRequired(false))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        let range = interaction.options.getInteger("range");
        if(!range || range > 500){
            range = 300;
        }
        const {fieldsArr} = await getAlternatesMetar(icao, range);
        const alternateEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setFields(fieldsArr)
        await interaction.editReply({
            embeds: [alternateEmbed]
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


