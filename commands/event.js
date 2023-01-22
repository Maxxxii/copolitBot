import { pagination, TypesButtons, StylesButton } from "@devraelfreeze/discordjs-pagination";
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getVatsimEvents } from "../manager/vatsimManager.js";

export const data =  new SlashCommandBuilder()
        .setName("event")
        .setDescription("Get events on airport")
        .addStringOption((option) => 
            option
                .setName("icao")
                .setDescription("Put ICAO of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const icao = interaction.options.getString("icao");
        const { eventsArr } = await getVatsimEvents(icao);
        const embeds = [];
        for(let i = 0; i < eventsArr.length; i++){
            embeds.push(new EmbedBuilder()
                .setAuthor({ name: "CopilotBot" })
                .setColor("ffffff")
                .setTimestamp()
                .setTitle("Scheduled events on " + icao.toUpperCase())
                .addFields({name: "VATSIM", value: eventsArr[i]})
                .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            )
        };
        if(eventsArr.length == 0){
            embeds.push(new EmbedBuilder()
                .setAuthor({ name: "CopilotBot" })
                .setColor("ffffff")
                .setTimestamp()
                .setTitle("Scheduled events on " + icao.toUpperCase())
                .addFields({name: "VATSIM", value: "No scheduled events on airport."})
                .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
            )
        }
        await interaction.editReply(await pagination({
            embeds: embeds,
            author: interaction.member.user,
            interaction: interaction,
            ephemeral: true,
            time: 30000,
            disableButtons: false,
            fastSkip: false,
            pageTravel: false,
            buttons: [
                {
                    value: TypesButtons.previous,
                    label: 'Previous Page',
                    style: StylesButton.Primary
                },
                {
                    value: TypesButtons.next,
                    label: 'Next Page',
                    style: StylesButton.Success
                }
            ]
        }));
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