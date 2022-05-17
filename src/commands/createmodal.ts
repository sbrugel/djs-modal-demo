import { TextInputComponent, CommandInteraction, Modal, ModalActionRowComponent, MessageActionRow } from "discord.js";
import { Command } from "../interfaces/CommandInt";

export default class extends Command {
    name = 'createmodal';
    description = 'Ooh fancy text prompts...'
    async slashRun(interaction: CommandInteraction): Promise<void> {
        let modal = new Modal()
            .setTitle('An Awesome Form')
            .setCustomId('myModal')

        const hashComponent = new TextInputComponent()
            .setCustomId('hashInput')
            .setLabel('What is your hash?')
            .setStyle("SHORT")
            .setRequired(true)
            .setMinLength(25)

        const hashRow = new MessageActionRow<ModalActionRowComponent>().addComponents(hashComponent);

        const textComponent = new TextInputComponent()
            .setCustomId('textInput')
            .setLabel('Anything you wanna tell us?')
            .setStyle("PARAGRAPH")
            .setRequired(false)
            .setMaxLength(200)

        const textRow = new MessageActionRow<ModalActionRowComponent>().addComponents(textComponent);

        modal.addComponents(hashRow, textRow);

        await interaction.showModal(modal);
    }
}