import * as amqp from 'amqplib';
import * as dotenv from "dotenv";
import {addEvent} from "./user-routs.js"
dotenv.config();
const cloudamqpurl = process.env.COUDAMQP
export const consumeMessages = async () => {
  try {
    // connect to RabbitMQ
    const conn = await amqp.connect(cloudamqpurl);
    const channel = await conn.createChannel();
    const channel2 = await conn.createChannel();

    // Declare an exchange with a name 'order_exchange' and type 'fanout'.
    // 'fanout' type broadcasts all the messages it receives to all the queues it knows.
    // `{ durable: false }` means the exchange will not survive a broker restart.
    const exchange = 'add_event_exchange';
    const exchange2 = 'update_date_event_exchange';

    await channel.assertExchange(exchange, 'fanout', { durable: false });
    await channel.assertExchange(exchange2, 'fanout', { durable: false });

    // Declare a queue with a name 'order_queue'. If it doesn't exist, it will be created.
    // `{ durable: false }` here means messages in the queue are stored in memory only, not on disk.
    const queue = 'add_events_queue';
    const queue_update_date = 'update_date_queue';

    await channel.assertQueue(queue, { durable: false });
    await channel2.assertQueue(queue_update_date, { durable: false });

    // Bind the declared queue to the exchange. This creates a relationship between the exchange and the queue.
    // Messages sent to this exchange will be routed to the queue according to the exchange type and routing rules.
    // The empty string as the third parameter is the routing key, which is ignored by fanout exchanges.
    await channel.bindQueue(queue, exchange, '');
    await channel2.bindQueue(queue_update_date, exchange2, '');

    // Start consuming messages from the queue. The callback function is invoked whenever a message is received.
    // `msg.content.toString()` converts the message content to a string for logging or processing.
    // `channel.ack(msg)` acknowledges the message, indicating it has been processed and can be removed from the queue.
    await channel.consume(queue, (msg) => {
        console.log(`Consumer >>> received message in ${queue} queue: ${msg.content.toString()}`);
        (async () => {
            try{
                const succsse = await addEvent(JSON.parse(msg.content.toString()));
                if(succsse){
                    channel.ack(msg);
                    console.log("event id update on user");
                }
                else{
                console.log("error update user");
                channel.nack(msg, true, false);
                }
            }catch(error){
                console.log(error,msg.content.toString() , "remove from queue");
                channel.nack(msg, true, false);
            }
        })();
    });

    await channel2.consume(queue_update_date, (msg) => {
        console.log(`Consumer >>> received message in ${queue_update_date} queue: ${msg.content.toString()}`);
        (async () => {
            channel2.ack(msg);
        })();
    });
  } catch (error) {
    console.error(error);
  }
};