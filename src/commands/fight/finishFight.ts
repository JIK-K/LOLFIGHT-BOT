import { ApplicationCommandOptionType, Message, TextChannel } from "discord.js";
import { SlashCommand } from "../../types/slashCommand";
import { getFight, patchFight } from "../../api/fight.api";

const NOTICE_CHANNEL: string =
  process.env.NOTICE_CHANNEL || "1176823090416730193";

export const finishFight: SlashCommand = {
  name: "내전우승",
  description: "내전 승자를 결정합니다",
  options: [
    {
      required: true,
      name: "내전명",
      description: "내전명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
    {
      required: true,
      name: "승자팀",
      description: "승자팀을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const fightNameOption = interaction.options.get("내전명");
    const winnerTeamOption = interaction.options.get("승자팀");

    if (!fightNameOption || !winnerTeamOption) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 미입력 확인 ❌`,
      });
      return;
    }

    const fightName = fightNameOption.value as string;
    const winnerTeam = winnerTeamOption.value as string;
    const fight = await getFight(fightName);

    if (fight) {
      const channel = (await interaction.client.channels.fetch(
        NOTICE_CHANNEL
      )) as TextChannel;
      if (channel) {
        const message = (await channel.messages.fetch(
          fight.messageId
        )) as Message;
        if (message) {
          const modifiedContent = `
          📢   **내전 종료**   📢\n
          🔴 **내전명** : ${fightName}\n
          🟠 **팀 A** : ${fight.homeTeam}\n
          🟡 **팀 B** : ${fight.awayTeam}\n
          🟢 **내전시간** : ${fight.fightTime}\n
          🏆 **Winner**: **${winnerTeam}** 🏆`;
          await message.edit(modifiedContent);

          interaction.deleteReply();
          await patchFight(fightName);
        }
      } else {
        await interaction.followUp({
          ephemeral: true,
          content: `❌ 동일한 채널명 존재하지 않습니다 ❌`,
        });
      }
    } else {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 동일한 내전명이 존재하지 않습니다 ❌`,
      });
    }
  },
};
