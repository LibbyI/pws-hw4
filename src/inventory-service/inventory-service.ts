import { createServer, IncomingMessage, ServerResponse } from 'http';

// import with .js, and not ts.
// for more info: https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#type-in-package-json-and-new-extensions
import { updateItem, mainRoute } from '../routes.js';
import { PUT_ITEM } from '../const.js';
import { consumeMessages } from './counsume-messages.js';

const port = 3001;

// start consuming messages
consumeMessages();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  const route = req.method + ' ' + req.url;
  switch (route) {
    case PUT_ITEM:
      updateItem(req, res);
      break;
    default:
      mainRoute(req, res, 'Consumer');
      break;
  }
});

server.listen(port);
console.log(`Consumer - port ${port}`);
