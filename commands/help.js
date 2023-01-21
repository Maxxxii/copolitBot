import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const data =  new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get all commands for bot")
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        const helpEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setTitle("Available commands for CopilotBot")
            .addFields(
                {name: `brief <ICAO>`, value: `Gives you all the most important info about airport in one messsage`},
                {name: `metar <ICAO>`, value: `Downloads the latest metar`},
                {name: `taf <ICAO>`, value: `Downloads the latest taf`},
                {name: `atis <ICAO>`, value: `Gives you ATIS information from VATSIM (if available)`},
                {name: `charts <ICAO>`, value: `You can see and download airport charts`},
                {name: `rwy <ICAO>`, value: `Gives you the best runways for takeoff/landing according to weather`},
                {name: `slope <ICAO>`, value: `Shows you slopes of the runways`},
                {name: `elev <ICAO>`, value: `You can get infomation about airport/runways elevation`},
                {name: `info <ICAO>`, value: `Gives you important informations about airport`},
                {name: `event <ICAO>`, value: `Gives you all scheduled VATSIM events on requested airport`},
                {name: `atc <ICAO>`, value: `Shows all active VATSIM controllers on requested airport`},
                {name: `course <ICAO>`, value: `Gives you courses of runways on airport`},
                {name: `ils <ICAO>`, value: `Gives important information about ILS system on the airport`},
                {name: `alternate <ICAO>`, value: `Gives you recommended alternates`}, 
                {name: `name <ICAO>`, value: `Shows full name of requested airport`},
                {name: `add`, value: `You can add CoilotBot to your server`},
                {name: `discord`, value: `Link to CopilotBot's discord`},
                {name: `support`, value: `Link to support me`},
                {name: `help`, value: `Shows all available CopilotBot commands`}
            )
            .setFooter({text: "Author: Maxxxii. All rights reserved ©"})
        await interaction.editReply({
            embeds: [helpEmbed]
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