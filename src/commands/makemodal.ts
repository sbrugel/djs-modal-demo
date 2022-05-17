import { TextInputComponent, CommandInteraction, Modal, ModalActionRowComponent, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { Command } from "../interfaces/CommandInt";

export default class extends Command {
    name = 'makemodal';
    description = 'Ooh more fancy text prompts...'
    async slashRun(interaction: CommandInteraction): Promise<void> {
        let modal = new Modal()
            .setTitle('Do you like Typescript?')
            .setCustomId('myOtherModal');

        const essayComponent = new TextInputComponent()
            .setCustomId('essayInput')
            .setLabel('Write an essay on why you think this.')
            .setStyle("PARAGRAPH")
            .setRequired(true)
            .setMinLength(25)

        const essayRow = new MessageActionRow<ModalActionRowComponent>().addComponents(essayComponent);

        modal.addComponents(essayRow);

        await interaction.showModal(modal);
    }
}