import {
  Client,
  GuildScheduledEventCreateOptions,
  Interaction,
} from "discord.js";
import commands from "./commands";
import "dotenv/config";
import {
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from "discord-api-types/v10";
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

  // const futureStartTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
  // const futureEndTime = new Date(futureStartTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours after futureStartTime
  const now = new Date();
  const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
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

  const guild = client.guilds.cache.get("1090831238538985596");
  guild?.scheduledEvents.create(options).then((createEvnent) => {
    console.log(`create event id : ${createEvnent.id}`);
  });
};

startBot();
