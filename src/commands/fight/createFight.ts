import {
  ApplicationCommandOptionType,
  GuildScheduledEventCreateOptions,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../../types/slashCommand";
import { fightDataInstance } from "../../data/fightData";
import {
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from "discord-api-types/v10";

export const createFight: SlashCommand = {
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
      name: "본인팀",
      description: "본인이 속한 팀명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
    {
      required: true,
      name: "상대팀",
      description: "상대방의 팀명을 작성합니다",
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
    const team1Option = interaction.options.get("본인팀");
    const team2Option = interaction.options.get("상대팀");
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
    const fightTime = fightTimeOption.value as string;

    if (fightDataInstance.exists(fightName)) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 이미 존재하는 내전명입니다 ❌`,
      });
      return;
    }

    const dateRegex = /^\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}$/;
    if (!dateRegex.test(fightTime)) {
      // 유효하지 않은 날짜 형식인 경우
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 잘못된 시간 형식입니다. (ex: 2023/12/25 22:30) ❌`,
      });
      return;
    }

    const targetDate = new Date(fightTime);
    const now = new Date();
    const maxDate = new Date(now.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);

    if (targetDate <= now) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 시작 시간은 현재 시간 이후로 설정되어야 합니다 ❌`,
      });
      return;
    }

    if (targetDate > maxDate) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 유효하지 않은 날짜입니다. (ex: 2023/12/25 22:30) ❌`,
      });
      return;
    }

    // name: string;
    // scheduledStartTime: DateResolvable;
    // scheduledEndTime?: DateResolvable;
    // privacyLevel: GuildScheduledEventPrivacyLevel;
    // entityType: GuildScheduledEventEntityType;
    // description?: string;
    // channel?: GuildVoiceChannelResolvable;
    // entityMetadata?: GuildScheduledEventEntityMetadataOptions;
    // image?: BufferResolvable | Base64Resolvable | null;
    // reason?: string;

    const targetTime = new Date(fightTime);
    console.log(targetTime);

    const guildId = interaction.guild!.id;
    const guild = interaction.client.guilds.cache.get(guildId);
    // const now = new Date();
    // const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const startTime = new Date(targetTime.getTime());
    const finishTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
    const privacyLevel: GuildScheduledEventPrivacyLevel = 2;
    const entityType: GuildScheduledEventEntityType = 2;
    const options: GuildScheduledEventCreateOptions = {
      name: "test",
      scheduledStartTime: startTime,
      scheduledEndTime: finishTime,
      privacyLevel: privacyLevel,
      entityType: entityType,
      description: "test description",
      channel: "1175700332198756452",
    };

    guild?.scheduledEvents.create(options).then((createEvnent) => {
      console.log(`create event id : ${createEvnent.id}`);
    });

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
