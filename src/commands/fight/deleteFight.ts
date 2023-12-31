import { ApplicationCommandOptionType, TextChannel } from "discord.js";
import { SlashCommand } from "../../types/slashCommand";
import { getFight, removeFight } from "../../api/fight.api";

const NOTICE_CHANNEL: string =
  process.env.NOTICE_CHANNEL || "1176779943510806528";

export const deleteFight: SlashCommand = {
  name: "내전삭제",
  description: "내전을 삭제합니다",
  options: [
    {
      required: true,
      name: "내전명",
      description: "삭제할 내전명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const fightNameOption = interaction.options.get("내전명");

    if (!fightNameOption) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 존재하지 않는 내전명 입니다 ❌`,
      });
      return;
    }

    const fightName = fightNameOption.value as string;
    const guildId = interaction.guild!.id;
    const guild = interaction.client.guilds.cache.get(guildId);
    const fight = await getFight(fightName);
    interaction.deleteReply();
    if (fight) {
      const channel = (await interaction.client.channels.fetch(
        NOTICE_CHANNEL
      )) as TextChannel;
      if (channel) {
        const deleteMessage = await channel.messages.fetch(fight.messageId);
        if (deleteMessage) {
          await deleteMessage.delete();
          guild?.scheduledEvents.delete(fight.eventId);
          await removeFight(fightName);
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
        content: `❌ 동일한 내전명 존재하지 않습니다 ❌`,
      });
    }
  },
};
