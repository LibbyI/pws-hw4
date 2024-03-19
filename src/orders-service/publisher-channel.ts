import * as amqp from 'amqplib';
import {updateEventTickets} from "../const.js";
export class PublisherChannel {
  channel: amqp.Channel;

  // Method to create a channel on the RabbitMQ connection
  async createChannel() {
    // var amqp = require('amqplib/callback_api');
    // amqp.connect('amqp://localhost', function(error0, connection) {});



    const connection = await amqp.connect(
      'amqps://kzxmuqdf:eIBnjgWBDQL0e9fP0S4NmePIA56i6iIN@sparrow.rmq.cloudamqp.com/kzxmuqdf'

    );
    // Create a channel on this connection
    this.channel = await connection.createChannel();
  }

  // Method to send an event/message to a specified exchange
  async sendEvent(msg: string) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchange = 'order_exchange';

    // Declare an exchange with the specified name and type ('fanout').
    // If the exchange doesn't exist, it will be created.
    // `durable: false` means the exchange does not survive broker restarts
    await this.channel.assertExchange(exchange, 'fanout', { durable: false });

    // Publish the message to the exchange
    // The empty string as the second argument represents the routing key, which is not used by fanout exchanges
    // `Buffer.from(msg)` converts the message string into a buffer for transmission
    // amqp.pro.Builder props = new amqp.BasicProperties.Builder();
    // headers = new HashMap<String, Object>();
    // headers.put("x-delay", 5000);
    // const headers = {
    //     expiration: 20000,
    // };
    await this.channel.publish(exchange, '', Buffer.from(msg));
    console.log(
      `Publisher >>> | message "${msg}" published to exchange "${exchange}"`
    );
  }

  async sendEventtimeout(msg: string) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchange_timeout_que = 'timeout que';

   await this.channel.assertExchange(exchange_timeout_que, 'fanout', { durable: false });

    
    await this.channel.publish(exchange_timeout_que, '', Buffer.from(msg));
    console.log(
      `Publisher >>> | message "${msg}" published to exchange "${exchange_timeout_que}"`
    );
  }
}


