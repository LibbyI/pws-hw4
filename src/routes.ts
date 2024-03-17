import { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';
import { PublisherChannel } from './order-service/publisher-channel.js';

const exampleData = {
  title: 'This is nice example',
  subtitle: 'Good Luck! :)',
};

export const mainRoute = (
  req: IncomingMessage,
  res: ServerResponse,
  hello: string
) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(`<h1>${hello}</h1>`);
  res.end();
};

// POST createOrder
export const createOrder = (
  req: IncomingMessage,
  res: ServerResponse,
  publisherChannel: PublisherChannel
) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    // Parse request body as JSON
    const data = JSON.parse(body);

    // Communicate with Inventory service:
    // const inventoryResponse = await sendRequest(
    //   "http://localhost:3001/api/inventory",
    //   "PUT",
    //   JSON.stringify(data)
    // );

    // Publish event:
    await publisherChannel.sendEvent(body);

    // console.log("My order:", data);
    res.statusCode = 201;
    res.end(
      JSON.stringify({
        data,
      })
    );
  });
};

// PUT /api/inventory/
export const updateItem = (req: IncomingMessage, res: ServerResponse) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    // Parse request body as JSON
    const data = JSON.parse(body);

    console.log('FROM API CALL - My item:', data);

    await fetch;

    res.statusCode = 201;
    res.end(
      JSON.stringify({
        data,
      })
    );
  });
};
