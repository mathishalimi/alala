import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { config } from '../config/index.js';

export const setupSecurity = (app) => {
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  
  app.use(compression());
  
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
    optionsSuccessStatus: 200
  }));
};