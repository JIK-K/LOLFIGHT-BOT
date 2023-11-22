import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { SlashCommand } from "../types/slashCommand";
import { fightDataInstance } from "../data/fightData";

export const fight: SlashCommand = {
  name: "내전생성",
  description: "내전을 생성합니다",
  options: [
    {
      required: true,
      name: "내전명",
      description: "내전명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
    {
      required: true,
      name: "팀1",
      description: "팀1을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
    {
      required: true,
      name: "팀2",
      description: "팀2를 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
    {
      required: true,
      name: "내전시간",
      description: "내전시간을 작성합니다 (ex: 2023/12/25 22:30)",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const fightNameOption = interaction.options.get("내전명");
    const team1Option = interaction.options.get("팀1");
    const team2Option = interaction.options.get("팀2");
    const fightTimeOption = interaction.options.get("내전시간");

    if (!fightNameOption || !team1Option || !team2Option || !fightTimeOption) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 미입력 확인 ❌`,
      });
      return;
    }

    const fightName = fightNameOption.value as string;
    const team1 = team1Option.value as string;
    const team2 = team2Option.value as string;
    const fightTime = fightTimeOption.value as number;

    if (fightDataInstance.exists(fightName)) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 이미 존재하는 내전명입니다 ❌`,
      });
      return;
    }

    const sendContent = `
      생성자 - ${interaction.user.displayName.toString()}
      📢   **내전 생성**   📢\n
      🔴 **내전명** : ${fightName}\n
      🟠 **팀 A** : ${team1}\n
      🟡 **팀 B** : ${team2}\n
      🟢 **내전시간** : ${fightTime}`;

    const noticeChannel = (await interaction.client.channels.fetch(
      "1176823090416730193"
    )) as TextChannel;

    if (noticeChannel) {
      const sendMessage = await noticeChannel.send(sendContent);
      const messageId = sendMessage.id;

      fightDataInstance.setData(fightName, {
        team1: team1,
        team2: team2,
        fightTime: fightTime,
        messageId: messageId,
      });

      interaction.deleteReply();
    }
  },
};
