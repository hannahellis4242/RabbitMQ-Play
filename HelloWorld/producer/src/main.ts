import amqp from "amqplib";

const url = "amqp://localhost";
const queue = "my-queue";

const foo = async () => {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  const i = Math.random() * 100;
  channel.sendToQueue(queue, Buffer.from(`${i + 1}`));
  channel.close();
  connection.close();
  setTimeout(foo, 5000);
};

foo();
