import {
  ApplicationCommandOptionType,
  Client,
  TextChannel,
  Permissions,
} from "discord.js";
import { SlashCommand } from "../../types/slashCommand";

export const createTeam: SlashCommand = {
  name: "팀생성",
  description: "팀을 생성합니다",
  options: [
    {
      required: true,
      name: "팀명",
      description: "생성할 팀명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const teamNameOption = interaction.options.get("팀명");
    if (!teamNameOption) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 미입력 확인 ❌`,
      });
      return;
    }

    const teamName = teamNameOption.value as string;
    const role = interaction.guild?.roles.cache.find(
      (role) => role.name === teamName
    );
    if (role) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 이미 존재하는 팀명입니다 ❌`,
      });
      return;
    }

    // const member = interaction.guild?.members.cache.get(interaction.user.id);
    // if (member?.roles.cache.some((role) => role.name === teamName)) {
    //   await interaction.followUp({
    //     ephemeral: true,
    //     content: `❌ 이미 해당 팀에 속해있습니다 ❌`,
    //   });
    //   return;
    // }

    const totalRole = await interaction.guild!.roles.create({
      name: teamName,
      color: "#ff0000",
      permissions: [
        "ViewChannel",
        "CreateInstantInvite",
        "ChangeNickname",
        "SendMessages",
        "EmbedLinks",
        "AttachFiles",
        "AddReactions",
        "ReadMessageHistory",
        "UseApplicationCommands",
        "Connect",
        "Speak",
        "Stream",
        "UseVAD",
        "MuteMembers",
        "DeafenMembers",
        "MoveMembers",
        // "ManageEvents",
      ],
    });

    const sendContent = `
      ✅ ${interaction.user.displayName.toString()} 님이 ${teamName} 팀을 생성 하셨습니다.`;

    const noticeChannel = (await interaction.client.channels.fetch(
      "1175701624866471986"
    )) as TextChannel;

    if (noticeChannel) {
      const sendMessage = await noticeChannel.send(sendContent);

      interaction.deleteReply();
    }
  },
};