import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data =  new SlashCommandBuilder()
        .setName("charts")
        .setDescription("Get charts for airport")
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
            .setTitle(`Charts for ${icao.toUpperCase()}`)
            .setDescription(`**Your charts are [here](https://lukeairtool.net/viewchart.php?icao=${icao.toUpperCase()})**`)
            .setFooter({text: "Author: Maxxxii. Powered by LukeAirTool. All rights reserved ©"})
        await interaction.editReply({
            embeds: [chartsEmbed]
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