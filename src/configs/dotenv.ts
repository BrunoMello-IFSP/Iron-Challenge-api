import dotenv from 'dotenv';

type Environment = 'dev' | 'uat' | 'prod';
type EnvironmentFiles = '.env' | '.env.dev' | '.env.uat';

const NODE_ENV = process.env.NODE_ENV as Environment;
let path: EnvironmentFiles = '.env';

switch (NODE_ENV) {
  case 'dev':
    path = '.env.dev';
    break;

  case 'uat':
    path = '.env.uat';
    break;

  default:
    path = '.env';
}

dotenv.config({
  path,
});
