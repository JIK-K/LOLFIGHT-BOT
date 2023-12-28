import { SlashCommand } from "../../types/slashCommand";
import { ApplicationCommandOptionType, Role } from "discord.js";

export const leaveTeam: SlashCommand = {
  name: "팀탈퇴",
  description: "원하는 팀에서 탈퇴합니다",
  options: [
    {
      required: true,
      name: "팀명",
      description: "탈퇴할 팀명을 작성합니다",
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
    const member = interaction.guild?.members.cache.get(interaction.user.id);

    if (!member) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 사용자 정보를 찾을 수 없습니다 ❌`,
      });
      return;
    }

    const roleToRemove = interaction.guild?.roles.cache.find(
      (role) => role.name === teamName
    ) as Role | undefined;

    if (!roleToRemove) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 존재하지 않는 팀명입니다 ❌`,
      });
      return;
    }

    try {
      if (member.roles.cache.has(roleToRemove.id)) {
        await member.roles.remove(roleToRemove);
        await interaction.followUp({
          ephemeral: true,
          content: `✅ ${teamName} 팀에서 탈퇴했습니다 ✅`,
        });
      } else {
        await interaction.followUp({
          ephemeral: true,
          content: `❌ 해당 팀에 가입되어 있지 않습니다 ❌`,
        });
      }
    } catch (error) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 팀 탈퇴에 실패했습니다: ${error} ❌`,
      });
    }
  },
};
