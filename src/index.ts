import { Client, Interaction } from "discord.js";
import commands from "./commands";
import "dotenv/config";
const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [],
});

const stopBot = async () => {
  await client.destroy(); // Discord 봇 연결 해제
  console.log("info: Discord bot stopped");

  console.log("info: Stopping TypeScript...");
  process.exit(0); // TypeScript 프로세스 종료
};

const startBot = async () => {
  await client.login(BOT_TOKEN);
  console.info("info: login success!");

  client.on("ready", async () => {
    if (client.application) {
      await client.application.commands.set(commands);
      console.log("info: command registered");
    }
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      //등록한 명령어를 찾아서
      const currentCommand = commands.find(
        ({ name }) => name === interaction.commandName
      );

      if (currentCommand) {
        await interaction.deferReply();
        //실행해준다.
        currentCommand.execute(client, interaction);
        console.log(`info: command ${currentCommand.name} handled correctly`);
      }
    }
  });
};

startBot();
