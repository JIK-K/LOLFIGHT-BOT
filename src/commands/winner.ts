import { ApplicationCommandOptionType, Message } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { fightDataInstance } from "../data/fightData";

const fightData = fightDataInstance.getData();

export const winner: SlashCommand = {
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
        content: `❌ 무튼 오류임 ㅅㄱ ❌`,
      });
      return;
    }

    const fightName = fightNameOption.value as string;
    const winnerTeam = winnerTeamOption.value as string;
    const messageData = findAndEditFightMessage(
      fightName,
      winnerTeam,
      interaction
    );
    await interaction.followUp({
      ephemeral: true,
      content: `${messageData}`,
    });
  },
};

async function findAndEditFightMessage(
  fightName: string,
  winnerTeam: string,
  interaction: any
): Promise<string | null> {
  const fight = fightData[fightName];
  if (fight) {
    try {
      const channel = interaction.channel;
      if (channel) {
        const message = (await channel.messages.fetch(
          fight.messageId
        )) as Message;
        if (message) {
          const modifiedContent = `✅ ${interaction.user.displayName.toString()} 내전 생성 완료 ✅ \n\n 📢   **내전 생성**   📢\n\n🔴내전명 : ${fightName}\n🟠 팀 A : ${
            fight.team1
          }\n🟡 팀 B : ${fight.team2} \n🟢 내전시간 : ${
            fight.fightTime
          }\n🏆 Winner: ${winnerTeam} 🏆`;
          await message.edit(modifiedContent);
          return "내전 메시지가 수정되었습니다.";
        }
      }
      return null;
    } catch (error) {
      console.error("메시지를 수정하는 도중 오류가 발생했습니다:", error);
      return null;
    }
  } else {
    return null;
  }
}
