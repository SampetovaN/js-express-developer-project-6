// @ts-check

import _ from 'lodash';
import fastify from 'fastify';
import { faker } from '@faker-js/faker';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { prepareData, getCookie, getTestData } from './helpers/index.js';

describe('test users CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
    cookie = await getCookie(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });

    expect(response.statusCode)
      .toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newUser'),
    });

    expect(response.statusCode)
      .toBe(200);
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('users'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode)
      .toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query()
      .findOne({ email: params.email });
    expect(user)
      .toMatchObject(expected);
  });

  describe('delete', () => {
    it('registrated user can delete his/her profile', async () => {
      const existingUserData = testData.users.existing;
      const { id } = await models.user.query()
        .findOne({
          email: existingUserData.email,
        });

      const response = await app.inject({
        method: 'DELETE',
        url: app.reverse('deleteUser', { id }),
        cookies: cookie,
      });

      expect(response.statusCode)
        .toBe(302);

      const deletedUser = await models.user.query()
        .findById(id);
      expect(deletedUser)
        .toEqual(undefined);
    });
    it('registrated user can\'t delete profile of another person', async () => {
      const id = faker.number.toString();
      const response = await app.inject({
        method: 'DELETE',
        url: app.reverse('deleteUser', { id }),
        cookies: cookie,
      });

      expect(response.statusCode)
        .toBe(302);

      const deletedUser = await models.user.query()
        .findById(id);
      expect(deletedUser)
        .toEqual(deletedUser);
    });
  });
  describe('update', () => {
    it('registrated user can update his/her profile', async () => {
      const existingUserData = testData.users.existing;
      const { id } = await models.user.query()
        .findOne({
          email: existingUserData.email,
        });
      const params = {
        ...existingUserData,
        lastName: 'changedLastName',
        firstName: 'changedFirstName',
      };

      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('updateUser', { id }),
        payload: {
          data: params,
        },
        cookies: cookie,
      });

      expect(response.statusCode)
        .toBe(302);

      const editedUser = await models.user.query()
        .findById(id);
      expect(editedUser.lastName)
        .toEqual(params.lastName);
      expect(editedUser.firstName)
        .toEqual(params.firstName);
    });
    it('registrate user can\'t update profile of another person', async () => {
      const existingUserData = testData.users.existing;
      const params = {
        ...existingUserData,
        email: 'lawrence.kulas.changed87@outlook.com',
      };
      const id = faker.number.toString();
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('updateUser', { id }),
        payload: {
          data: params,
        },
        cookies: cookie,
      });

      expect(response.statusCode)
        .toBe(302);

      const editedUser = await models.user.query()
        .findOne({ email: existingUserData.email });
      expect(editedUser)
        .not
        .toBeUndefined();
    });
    it('user can\'t update profile if required fields empty', async () => {
      const existingUserData = testData.users.existing;
      const params = {
        ...existingUserData,
        lastName: null,
        firstName: null,
      };
      const {
        id,
        lastName,
        firstName,
      } = await models.user.query()
        .findOne({
          email: existingUserData.email,
        });
      const response = await app.inject({
        method: 'PATCH',
        url: app.reverse('updateUser', { id }),
        payload: {
          data: params,
        },
        cookies: cookie,
      });

      expect(response.statusCode)
        .toBe(422);

      const editedUser = await models.user.query()
        .findOne({ email: existingUserData.email });
      expect(editedUser)
        .not
        .toBeUndefined();
    });
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
