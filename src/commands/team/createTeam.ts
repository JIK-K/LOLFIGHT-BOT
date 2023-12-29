import {
  ApplicationCommandOptionType,
  ColorResolvable,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../../types/slashCommand";
import { patchPlusTeamMember, postTeam } from "../../api/team.api";
import { postTeamMember } from "../../api/team-member.api";

const getRandomColor = (): ColorResolvable => {
  const r = Math.floor(Math.random() * 256); // 0부터 255 사이의 임의의 빨강 값
  const g = Math.floor(Math.random() * 256); // 0부터 255 사이의 임의의 초록 값
  const b = Math.floor(Math.random() * 256); // 0부터 255 사이의 임의의 파랑 값

  const color = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  const colordata: ColorResolvable = color as ColorResolvable;
  return colordata;
};

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

    const userName = interaction.user.displayName as string;
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

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (member) {
      const roles = member?.guild?.roles.cache;
      if (roles) {
        const memberRoles = Array.from(member?.guild?.roles.cache.values());
        const hasRoles = memberRoles.length > 2;
        if (hasRoles) {
          await interaction.followUp({
            ephemeral: true,
            content: `❌ 이미 팀에 속해있습니다 ❌`,
          });
        } else {
          const randomColor: ColorResolvable = getRandomColor();
          const totalRole = await interaction.guild!.roles.create({
            name: teamName,
            color: randomColor,
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
            ],
          });

          totalRole.setHoist(true);

          const userid = String(interaction.member?.user.id);
          const newMember = interaction.guild?.members.cache.get(userid);
          if (newMember && totalRole) {
            try {
              await newMember.roles.add(totalRole.id);
            } catch (error) {}
          }
          const sendContent = `
      ✅ ${interaction.user.displayName.toString()} 님이 ${teamName} 팀을 생성 하셨습니다.`;

          const noticeChannel = (await interaction.client.channels.fetch(
            "1175701624866471986"
          )) as TextChannel;

          if (noticeChannel) {
            await noticeChannel.send(sendContent);
            interaction.deleteReply();
          }
          postTeam(teamName);
          postTeamMember(userName, teamName);
        }
      }
    }
  },
};
