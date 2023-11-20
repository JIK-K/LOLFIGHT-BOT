// import { ApplicationCommandOptionType } from "discord.js";
// import { SlashCommand } from "../types/slashCommand";

// export const fight: SlashCommand = {
//   name: "내전 생성",
//   description: "내전 생성",
//   options: [
//     {
//       required: true,
//       name: "내전명",
//       description: "내전명(한글)",
//       type: ApplicationCommandOptionType.String,
//     },
// {
//   required: true,
//   name: "팀1",
//   description: "팀1",
//   type: ApplicationCommandOptionType.String,
// },
// {
//   required: true,
//   name: "팀2",
//   description: "팀2",
//   type: ApplicationCommandOptionType.String,
// },
// {
//   required: true,
//   name: "내전시간",
//   description: "내전시간(숫자만 입력)",
//   type: ApplicationCommandOptionType.Integer,
// },
//   ],
//   execute: async (_, interaction) => {
//     // const fightName = interaction.options.get("내전명")?.value;
//     // const team1 = interaction.options.get("팀1")?.value;
//     // const team2 = interaction.options.get("팀2")?.value;
//     // const time = interaction.options.get("내전시간")?.value;
//     // const echoMessage = `📢   **${fightName}내전 생성**   📢\n====================\n* TEAM A : ${team1}\n* TEAM B : ${team2} \n* TIME : ${time}\n====================`;\
//     const echoMessage = "sibal";

//     console.log(echoMessage);
//     await interaction.followUp({
//       ephemeral: true,
//       content: `${interaction.user.username.toString()} 내전 생성 완료: ${echoMessage}`,
//     });
//   },
// };
import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "../types/slashCommand";

export const echo: SlashCommand = {
  name: "내전생성",
  description: "내전을 생성합니다",
  options: [
    {
      required: true,
      name: "내전명",
      description: "내전명을 작성합니다",
      type: ApplicationCommandOptionType.String,
    },
  ],
  execute: async (_, interaction) => {
    const echoMessage = interaction.options.get("뭐라고")?.value || "";
    await interaction.followUp({
      ephemeral: true,
      content: `${interaction.user.username.toString()} 가라사대: ${echoMessage}`,
    });
  },
};
