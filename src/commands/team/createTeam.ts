import { ApplicationCommandOptionType, Client, TextChannel } from "discord.js";
import { SlashCommand } from "../../types/slashCommand";

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES] });

export const createTeam: SlashCommand = {
  name: "팀생성",
  description: "팀을 생성합니다",
  options: [
    {
      required: true,
      name: "내전명",
      description: "내전명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const teamNameOption = interaction.options.get("내전명");

    if (!teamNameOption) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 미입력 확인 ❌`,
      });
      return;
    }

    const teamName = teamNameOption.value as string;

    //이미존재하는 팀명입니다

    const guild = client.guilds.cache.get(guildId);

    const { PermissionsBitField } = require("discord.js");

    guild.roles.create({
      name: "Mod",
      permissions: [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.KickMembers,
      ],
    });

    const sendContent = `
      ✅ ${interaction.user.displayName.toString()} 님이 ${teamName} 팀을 생성 하셨습니다.`;

    const noticeChannel = (await interaction.client.channels.fetch(
      "1176823090416730193"
    )) as TextChannel;

    if (noticeChannel) {
      const sendMessage = await noticeChannel.send(sendContent);
      const messageId = sendMessage.id;

      interaction.deleteReply();
    }
  },
};
