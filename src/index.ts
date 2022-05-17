import DiscordJS, { ApplicationCommand, Client, Collection, CommandInteraction, Guild, Intents } from 'discord.js'
import { MongoClient } from 'mongodb';
import { Command } from './interfaces/CommandInt';
import { readdirRecursive } from './utils/readdirRecursive';
import cron from 'cron';
import { BOT } from './config';


const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.login(BOT.TOKEN);

client.on('ready', async () => {
    // load commands
    console.log("Loading commands...");
    client.commands = new Collection();
    const { commands } = client.guilds.cache.get('679777315814637683') as Guild;
    const commandFiles = readdirRecursive(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
    const awaitedCommands: Promise<ApplicationCommand>[] = [];

    for (const file of commandFiles) {
        const commandModule = await import(file);

        const dirs = file.split('/');
		const name = dirs[dirs.length - 1].split('.')[0];

        if (!(typeof commandModule.default === 'function')) {
			console.log(`Invalid command ${name}`);
			continue;
		}

        const command: Command = new commandModule.default;

        command.name = name;

        const guildCmd = commands.cache.find(cmd => cmd.name === command.name);

        const cmdData = {
            name: command.name,
            description: command.description,
            options: command?.options || [],
            defaultPermission: true // allow commands to be used by anyone
        }

        if (!guildCmd) {
            awaitedCommands.push(commands.create(cmdData));
        } else {
            awaitedCommands.push(commands.edit(guildCmd.id, cmdData));
        }
        
        client.commands.set(name, command);
    }

    // done with everything now!
    console.log('Ready!');
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) runCommand(interaction, client);
    else if (interaction.isModalSubmit()) {
        const { customId, fields } = interaction;
        if (customId === 'myModal') {
            interaction.reply(`Thank you for submitting! Here is what you put:\n\t**Hash > **${fields.getTextInputValue('hashInput')}\n\t**Misc > **${fields.getTextInputValue('textInput')}`);
        } else if (customId === 'myOtherModal') {
            interaction.reply(`Thanks for your wonderful essay. This is what I got from you: ${fields.getTextInputValue('essayInput')}`);
        }
    }
})

async function runCommand(interaction: CommandInteraction, client: Client): Promise<unknown> {
    const command = client.commands.get(interaction.commandName);

    if (command.slashRun !== undefined) {
        try {
            command.slashRun(interaction);
        } catch (error) {
            console.log(error);
        }
    }

    return;
}