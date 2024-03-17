import { createServer, IncomingMessage, ServerResponse } from 'http';

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { createOrder, mainRoute } from '../routes.js';
import { POST_ORDER } from '../const.js';
import { PublisherChannel } from './publisher-channel.js';

const port = 3000;

const publisherChannel = new PublisherChannel();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = req.method + ' ' + req.url;
  switch (route) {
    case POST_ORDER:
      createOrder(req, res, publisherChannel);
      break;
    default:
      mainRoute(req, res, 'Publisher');
      break;
  }
});

server.listen(port);
console.log(`Publisher running! port ${port}`);
