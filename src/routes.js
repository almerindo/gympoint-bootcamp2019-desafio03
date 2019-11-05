import { Router } from 'express';

// Autenticacao e controle de usuários
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

// Controller dos students
import StudentControllers from './app/controllers/StudentControllers';

// Controller dos Plans
import PlanController from './app/controllers/PlanController';


const routes = new Router();

routes.post('/sessions', SessionController.store);

// Este middleare global só funciona para as rotas que estiverem a baixo dele.
routes.use(authMiddleware);

// USERS!
routes.put('/users', UserController.update);
routes.post('/users', UserController.store);

// STUDENTS
// Create
routes.post('/students', StudentControllers.store);
routes.put('/students/:id', StudentControllers.update);
routes.get('/students/:id', StudentControllers.show);
routes.get('/students', StudentControllers.show);
routes.delete('/students/:id', StudentControllers.delete);

//TODO fazer CRUD dos planos
//Plans
routes.post('/plans', PlanController.store);
routes.put('/plan/:id', PlanController.update);
routes.get('/plan/:id', PlanController.show);
routes.get('/plans', PlanController.show);
routes.delete('/plans/:id', PlanController.delete);

export default routes;
