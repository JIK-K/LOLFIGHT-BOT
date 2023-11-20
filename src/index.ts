import { Client } from "discord.js";
import commands from "./commands";

const BOT_TOKEN =
  "MTE3NjAxMzQxNTQwODQ4MDI2Ng.GBzlIA.9fTuTjRQeMAhY4QmUNGXh9wS3LqH97bxoPmeq0";

const client = new Client({
  intents: [],
});

const startBot = async () => {
  await client.login(BOT_TOKEN);
  console.info("info: login success!");

  client.on("ready", async () => {
    if (client.application) {
      await client.application.commands.set(commands);
      console.log("info: command registered");
    }
  });
};

startBot();
