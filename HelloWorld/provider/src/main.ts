import { Channel, connect } from "amqplib";

const host = process.env.QUEUE_HOST || "localhost";
const url = `amqp://${host}`;
const queue = "my-queue";

const randomNumber = async (channel: Channel) => {
  const i = Math.random() * 100;
  const result = channel.sendToQueue(queue, Buffer.from(`${i}`));
  if (!result) {
    console.log("send to queue returned false");
  } else {
    console.log("sent ", i);
  }
  setTimeout(() => randomNumber(channel), 5000);
};

const startup = async (worker: (channel: Channel) => Promise<void>) => {
  try {
    const connection = await connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    await worker(channel);
    process.on("SIGINT", async () => {
      try {
        //await channel.close();
        await connection.close();
      } catch (e) {
        console.error("On shutdown :", e);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

startup(randomNumber);
