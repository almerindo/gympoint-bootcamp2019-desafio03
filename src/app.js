import express from 'express';
import routes from './routes';

// TODO Usar gerenciamento de erros
// TODO Usar mailNotification para lembrar usuário

// Importar a conexao com banco de dados
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
