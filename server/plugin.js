// @ts-check

import { fileURLToPath } from 'url';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import Pug from 'pug';
import i18next from 'i18next';
import fastifyFormbody from '@fastify/formbody';
import fastifyAuth from '@fastify/auth';

import fastifyObjectionjs from 'fastify-objectionjs';
import fastifyMethodOverride from 'fastify-method-override';
import fastifySecureSession from '@fastify/secure-session';
import fastifyPassport from '@fastify/passport';
import qs from 'qs';
import ru from './locales/ru.js';
import en from './locales/en.js';
// @ts-ignore
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import models from './models/index.js';
import * as knexConfig from '../knexfile.js';
import FormStrategy from './lib/passportStrategies/FormStrategy.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));
const mode = process.env.NODE_ENV || 'development';

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next
    .init({
      lng: 'en',
      fallbackLng: 'ru',
      // debug: isDevelopment,
      resources: {
        ru,
        en,
      },
    });
};

const registerPlugins = async (app) => {
  await app.register(fastifyReverseRoutes);
  await app.register(fastifyAuth);
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
    },
  });

  fastifyPassport.registerUserDeserializer(
    (user) => app.objection.models.user.query().findById(user.id),
    );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.decorate('fp', fastifyPassport);
  app.decorate('authenticate', (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: app.reverse('root'),
      failureFlash: i18next.t('flash.authError'),
    },
    // @ts-ignore
  )(...args));
  await app.register(fastifyMethodOverride);
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
  app.decorate('checkIfUserCanEditProfile', async (request, reply) => {
    if (request.user?.id !== parseInt(request.params.id, 10)) {
      request.flash('error', i18next.t('flash.users.authError'));
      reply.redirect('/users');
    }
  });
};

export const options = {
  exposeHeadRoutes: false,
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });
};

// eslint-disable-next-line no-unused-vars
export default async (app, _options) => {
  await registerPlugins(app);

  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);
  return app;
};
