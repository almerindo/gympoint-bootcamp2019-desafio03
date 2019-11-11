import { Router } from 'express';

// Autenticacao e controle de usuários
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

// Controller dos students
import StudentController from './app/controllers/StudentController';

// Controllers
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import HelpOrderAnswerController from './app/controllers/HelpOrderAnswerController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Rotas para chekin
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.show);

// Rotas para help_orders
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.show);

// Este middleare global só funciona para as rotas que estiverem a baixo dele.
routes.use(authMiddleware);

// Rota para resposta da help-orders, exige login
routes.post('/help-orders/:id/answer', HelpOrderAnswerController.store);

// USERS
routes.put('/users', UserController.update);
routes.post('/users', UserController.store);

// STUDENTS
// Create
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.get('/students/:id', StudentController.show);
routes.get('/students', StudentController.show);
routes.delete('/students/:id', StudentController.delete);

// Plans
routes.get('/plans', PlanController.show);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Enrollments
routes.get('/enrollments', EnrollmentController.show);
routes.get('/enrollments/:id', EnrollmentController.show);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
