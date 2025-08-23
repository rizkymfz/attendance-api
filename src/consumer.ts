import amqplib from "amqplib";
import { UserLog } from "./models/UserLog.js";

async function startConsumer() {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL || "");
  const channel = await connection.createChannel();
  await channel.assertQueue("user_logs", { durable: true });
  await channel.purgeQueue("user_logs");

  console.log("consumer waiting for messages..");

  channel.consume("user_logs", async (msg) => {
    if (msg !== null) {
      const logData = JSON.parse(msg.content.toString());
      console.log("Received log:", logData);

      await UserLog.create(logData);

      channel.ack(msg);
    }
  });
}

startConsumer().catch(console.error);
