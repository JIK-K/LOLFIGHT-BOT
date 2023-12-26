import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../../types/slashCommand";

export const inviteTeam: SlashCommand = {
  name: "팀초대",
  description: "본인의 팀에 멤버를 초대합니다",
  options: [
    {
      required: true,
      name: "사용자명",
      description: "초대할 사람의 이름을 입력해주세요",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const inviteNameOption = interaction.options.get("사용자명");
    if (!inviteNameOption) {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 미입력 확인 ❌`,
      });
      return;
    }

    const inviteName = inviteNameOption.value as string;
    let invitedMember;
    const guild = interaction.client.guilds.cache.get("1090831238538985596"); // 여기에 서버 ID를 넣어주세요
    if (guild) {
      guild.members
        .fetch({ withPresences: true })
        .then(async (fetchedMembers) => {
          const findMember = fetchedMembers.find(
            (member) =>
              //   console.log(member.displayName)
              member.displayName === inviteName
          );
          invitedMember = findMember?.displayName;
          if (!invitedMember) {
            console.log(invitedMember);
            await interaction.followUp({
              ephemeral: true,
              content: `❌ 존재하지 않는 이름입니다 ❌`,
            });
            return;
          }
        });
    }

    const inviterUser = interaction.member?.user.id;
    if (inviterUser) {
      const inviterUserRole =
        interaction.guild?.members.cache.get(inviterUser)?.roles.highest;

      if (inviterUserRole) {
        await invitedMember!.roles.add(inviterUserRole);
        await interaction.followUp({
          ephemeral: true,
          content: `✅ ${inviteName} 님이 팀에 초대되었습니다! ✅`,
        });
      } else {
        await interaction.followUp({
          ephemeral: true,
          content: `❌ 초대자의 역할을 찾을 수 없습니다 ❌`,
        });
      }
    } else {
      await interaction.followUp({
        ephemeral: true,
        content: `❌ 초대자를 찾을 수 없습니다 ❌`,
      });
    }
  },
};
