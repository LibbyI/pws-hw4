import { IncomingMessage, ServerResponse } from 'http';

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



