import {
  ApplicationCommandOptionType,
  GuildScheduledEventCreateOptions,
  TextChannel,
} from "discord.js";
import { SlashCommand } from "../../types/slashCommand";
import {
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from "discord-api-types/v10";
import { getFight, postFight } from "../../api/fight.api";
import { getTeam } from "../../api/team.api";

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
    const homeTeamOption = interaction.options.get("본인팀");
    const awayTeamOption = interaction.options.get("상대팀");
    const fightTimeOption = interaction.options.get("내전시간");

    if (
      !fightNameOption ||
      !homeTeamOption ||
      !awayTeamOption ||
      !fightTimeOption
    ) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 미입력 확인 ❌`,
      });
      return;
    }

    const fightName = fightNameOption.value as string;
    const homeTeam = homeTeamOption.value as string;
    const awayTeam = awayTeamOption.value as string;
    const fightTime = fightTimeOption.value as string;

    const existFightName = await getFight(fightName);
    if (existFightName) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 이미 존재하는 내전명입니다 ❌`,
      });
      return;
    }

    const dateRegex = /^\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}$/;
    if (!dateRegex.test(fightTime)) {
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

    const existHomeTeam = await getTeam(homeTeam);
    const existAwayTeam = await getTeam(awayTeam);
    if (!existHomeTeam || !existAwayTeam) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 본인팀 또는 상대팀이 존재하지 않습니다 ❌`,
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
    const descriptionText = homeTeam + "vs" + awayTeam + "내전";
    const guildId = interaction.guild!.id;
    const guild = interaction.client.guilds.cache.get(guildId);
    const startTime = new Date(targetDate.getTime());
    const finishTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
    const privacyLevel: GuildScheduledEventPrivacyLevel = 2;
    const entityType: GuildScheduledEventEntityType = 2;
    const options: GuildScheduledEventCreateOptions = {
      name: fightName,
      scheduledStartTime: startTime,
      scheduledEndTime: finishTime,
      privacyLevel: privacyLevel,
      entityType: entityType,
      description: descriptionText,
      channel: "1175700332198756452",
    };

    guild?.scheduledEvents.create(options).then(async (createEvnent) => {
      const sendContent = `
      생성자 - ${interaction.user.displayName.toString()}
      📢   **내전 생성**   📢\n
      🔴 **내전명** : ${fightName}\n
      🟠 **Home 팀** : ${homeTeam}\n
      🟡 **Away 팀** : ${awayTeam}\n
      🟢 **내전시간** : ${fightTime}`;

      const noticeChannel = (await interaction.client.channels.fetch(
        "1176823090416730193"
      )) as TextChannel;

      if (noticeChannel) {
        const sendMessage = await noticeChannel.send(sendContent);
        const messageId = sendMessage.id;
        const eventId = createEvnent.id;
        postFight(fightName, homeTeam, awayTeam, startTime, messageId, eventId);

        interaction.deleteReply();
      }
      console.log(`create event id : ${createEvnent.id}`);
    });
  },
};
