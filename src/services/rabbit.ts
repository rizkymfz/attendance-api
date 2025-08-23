import amqplib from "amqplib";

let channel: amqplib.Channel;

export async function connectRabbit() {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || "");
    channel = await connection.createChannel();
    await channel.assertQueue("user_logs", { durable: true });
    console.log("--rabbit channel connected--");
  } catch (err) {
    console.error("--rabbit connection failed--", err);
  }
}

export function publishToChannel(queue: string, message: any) {
  if (!channel) {
    console.error("channel not initialized");
    return;
  }
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}
