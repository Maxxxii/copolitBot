import { config } from 'dotenv';
import { Client, GatewayIntentBits, REST, Routes, Collection } from 'discord.js';
import { readdirSync } from 'fs';
config();

const TOKEN = process.env.TOKEN;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commands = [];

const commandFiles = readdirSync(`./commands`).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
};

const rest = new REST({version: '10'}).setToken(TOKEN);

client.on('ready', () => {    
    const CLIENT_ID = client.user.id;
    console.log(`${client.user.tag} successfuly log in`);
    (async () => {
        try{
            await rest.put(Routes.applicationCommands(CLIENT_ID), {
                body: commands
            });
            console.log("Successfully registered commands globally")
        } catch(err){
            console.error(err);
        }
    })();
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName)

    if(!command) return;

    try{
        await command.execute(interaction);
    } catch(err){
        console.error(err);

        await interaction.reply({
            content: "An error occurred while executing that command.",
            ephemeral: true
        });
    }
})

client.login(TOKEN);



