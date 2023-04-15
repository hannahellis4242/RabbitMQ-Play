import { Channel, connect } from "amqplib";

const host = process.env.QUEUE_HOST || "localhost";
const url = `amqp://${host}`;
const queue = "my-queue";

const startup = async () => {
  try {
    const connection = await connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (data) => {
      if (data) {
        console.log(`recived - ${Buffer.from(data.content)}`);
        channel.ack(data);
      }
    });
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

startup();
