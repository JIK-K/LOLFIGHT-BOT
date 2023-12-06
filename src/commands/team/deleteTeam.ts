import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { SlashCommand } from "../../types/slashCommand";

export const deleteTeam: SlashCommand = {
  name: "팀삭제",
  description: "팀을 삭제합니다",
  options: [
    {
      required: true,
      name: "팀명",
      description: "삭제할 팀명을 작성합니다",
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
    const existTeam = interaction.guild?.roles.cache.find(
      (team) => team.name === teamName
    );
    if (!existTeam) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 존재하지 않는 팀명입니다 ❌`,
      });
      return;
    } else {
      await existTeam.delete();
      await interaction.followUp({
        ephemeral: true,
        content: `✅ ${existTeam.name} 팀을 삭제했습니다 `,
      });
    }
  },
};
