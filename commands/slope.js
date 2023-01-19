import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data =  new SlashCommandBuilder()
        .setName("slope")
        .setDescription("Get slopes of runways5 for airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const chartsEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setDescription(`**Your charts are [here](https://lukeairtool.net/viewchart.php?icao=${icao})**`)
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