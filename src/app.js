// Variaveis de ambiente
import 'dotenv/config';

import express from 'express';

// Gerenciamento de erros
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

// Painel de JOBS
import BullBoard from 'bull-board';
import Queue from './app/lib/Queue';

import routes from './routes';
import sentryConfig from './config/sentry';

// Importar a conexao com banco de dados
import './database';

class App {
  constructor() {
    this.server = express();
    BullBoard.setQueues(Queue.queues.map(queue => queue.bull));

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
  }

  routes() {
    this.server.use('/admin/queues', BullBoard.UI);
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json('Internal server error');
    });
  }
}

export default new App().server;
