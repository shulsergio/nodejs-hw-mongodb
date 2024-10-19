import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
export const setupServer = () => {
  const app = express();

  const PORT = Number(env('PORT', '3000'));

  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, World!',
    });
  });

  app.get('*', (req, res) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on  port  ${PORT}`);
  });
};
