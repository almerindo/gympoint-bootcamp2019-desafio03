
echo "#############################################################"
echo "Este script cria uma estrutura inicial com o YARN e o Express"
echo "e instala o nodemon e sucrase."
echo "No final é indicado algumas configuraçoes manuais que devem ser fetas"
echo "################################################################"

echo "Iniciando o YARN"
yarn init -y
yarn add express



echo "Criando diretorio ./src"
mkdir src

echo "criando os arquivos app.js server.js e routes.js"
cd src
echo "import express from 'express';
import routes from './routes';

class App {
  constructor(){
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares(){
    this.server.use(express.json());
  }

  routes(){
    this.server.use(routes);
  }
}

export default new App().server;" > app.js


echo "import {Router} from 'express';

const routes = new Router();

routes.get('/', (req,res)=>{
  return res.json({message: 'Hello World'});
});

export default routes;
" > routes.js

echo "import app from './app';

app.listen(3333);" > server.js


echo "Instalando sucrase e nodemon como dependencia de desenvolvimento"
yarn add nodemon -D
yarn add sucrase -D


echo "configurando o nodemon e sucrase"
echo '{ 
  "execMap" : {
    "js": "node -r sucrase/register"
  }
}' > ../nodemon.json

echo "#################### CONF NECESSARIAS ########################"
echo "Adicione a configuração a seguir no seu packet.json"

echo '"scripts": {
    "dev": "nodemon src/server.js",
    "dev:debug": "nodemon --inspect src/server.js"
  }'

echo "#################### CONF NECESSARIAS ########################"
echo "No seu debug adicione a congiguração para utilizar o sucrase"

echo '"configurations": [

    {
      "type": "node",
      "request": "attach",
      "name": "Launch Program",
      "restart": true,
      "protocol": "inspector"
    }
  ]'





