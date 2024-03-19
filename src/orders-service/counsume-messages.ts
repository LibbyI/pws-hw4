import * as amqp from 'amqplib';

import {orederExpiredDate} from "../const.js";
import {findanddelete} from "./order-routs.js"
export const consumeMessages = async () => {
  try {
    // connect to RabbitMQ
    const conn = await amqp.connect(
        'amqps://kzxmuqdf:eIBnjgWBDQL0e9fP0S4NmePIA56i6iIN@sparrow.rmq.cloudamqp.com/kzxmuqdf'
    );
    const channel = await conn.createChannel();

    const exchange_timeout_que = 'timeout que';
    await channel.assertExchange(exchange_timeout_que, 'fanout', { durable: false });

    const queue = 'timeout_queue';
    await channel.assertQueue(queue, { durable: false });

   await channel.bindQueue(queue, exchange_timeout_que, '');
   
   await channel.consume(queue, (msg) => {
      (async () => {
          try {
              console.log(`Consumer >>> received message: ${msg.content.toString()}`);
              // const body = JSON.parse(msg.content.toString());
              const body: orederExpiredDate = JSON.parse(msg.content.toString());
              const now  = new Date();
              console.log("consumed: ", body);
              if (new Date(body.expiredDate) < now){
                const response = await findanddelete(body);
                //call function that remove tickects
                if (response){
                  console.log("end time out!!!");
                  channel.ack(msg);
                }
                else{
                  channel.nack(msg, true, true);
                  console.log("removed from queue");
                }
              }
              else{
                channel.nack(msg, true, true);
                // console.log(now, body.expiredDate);
              }
              
          } catch (error) {
              console.error('Error processing message:', error);
          }
      })();
  });
  } catch (error) {
    console.error(error);
  }
};