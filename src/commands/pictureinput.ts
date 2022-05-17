import { TextInputComponent, CommandInteraction, Modal, ModalActionRowComponent, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, ApplicationCommandOptionData } from "discord.js";
import { Command } from "../interfaces/CommandInt";

export default class extends Command {
    name = 'pictureinput';
    description = 'quick test'
    options: ApplicationCommandOptionData[] = [
		{
			name: 'picture',
			description: 'something',
			type: 'ATTACHMENT',
			required: true
		}
	]
    async slashRun(interaction: CommandInteraction): Promise<void> {
        const attachment = interaction.options.getAttachment('picture')!;
        return interaction.reply(`Here are some things about your attachment:
        **Name > **${attachment.name}
        **Type > **${attachment.contentType}
        **Alt Text > **${attachment.description}
        **Dimensions > **${attachment.height} x ${attachment.width}
        **File size > **${attachment.size}
        **URL > **${attachment.proxyURL}
        **Is Spoiler? > ${attachment.spoiler}`);
    }
}