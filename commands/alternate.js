import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getNearbyAirports} from '../manager/airlabsManager.js';
import { getMultipleMetar } from "../manager/avwxManager.js";

export const data =  new SlashCommandBuilder()
        .setName("alternate")
        .setDescription("Get alternate to airport")
        .addStringOption((option) => 
            option
                .setName("id")
                .setDescription("Put ICAO, IATA or coordinates of airport")
                .setRequired(true))
export async function execute(interaction){
    try{        
        await interaction.deferReply();
        let idArr = [];
        let fieldsArr = [];
        const id = interaction.options.getString("id");
        const { closestAirports } = await getNearbyAirports(id);
        for(let i = 0;i < closestAirports.length;i++){
            idArr.push(closestAirports[i].icao_code);
        }
        const { metarArr } = await getMultipleMetar(idArr);
        for(let i=0;i < metarArr.length;i++){
            fieldsArr.push({name: `${closestAirports[i].icao_code} (${closestAirports[i].name}). Distance: ${Math.round(closestAirports[i].distance*0.621371)}nm`, value: `${codeBlock(metarArr[i].raw)}`})
        }
        const alternateEmbed = new EmbedBuilder()
            .setAuthor({ name: "CopilotBot" })
            .setColor("ffffff")
            .setTimestamp()
            .setFields(fieldsArr)
        await interaction.editReply({
            embeds: [alternateEmbed]
        });
    } catch(err){
        interaction.editReply(err.message);
        console.error(err);
    }
    
}


