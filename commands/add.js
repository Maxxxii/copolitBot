import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data =  new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add CopilotBot to your server")
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const addEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle("Add CopilotBot to your server!")
            .setDescription("You can get access to bot via this [link](https://discord.com/api/oauth2/authorize?client_id=881597443555344404&permissions=551903415296&scope=bot)")
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
        await interaction.editReply({
            embeds: [addEmbed]
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