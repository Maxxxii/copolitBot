import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data =  new SlashCommandBuilder()
        .setName("support")
        .setDescription("Support developing bot")
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const supportEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle("Support me in developing CopilotBot")
            .setDescription("You can support me here - https://www.buymeacoffee.com/CopilotBot")
        await interaction.editReply({
            embeds: [supportEmbed]
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