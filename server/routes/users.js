import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get(
      '/users/:id/edit',
      {
        name: 'editUser',
        preValidation: app.auth([app.checkIfUserCanEditProfile, app.authenticate]),
      },

      async (req, reply) => {
        const user = await app.objection.models.user.query()
          .findById(req.params.id);
        reply.render('users/edit', { user });
        return reply;
      },
    )
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query()
          .insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('users'));
      } catch (err) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', {
          user,
          errors: err?.data,
        });
      }

      return reply;
    })
    .patch(
      '/users/:id',
      {
        name: 'updateUser',
        preValidation: app.auth([app.checkIfUserCanEditProfile, app.authenticate]),
      },
      async (req, reply) => {
        try {
          const {
            body: { data },
          } = req;
          const user = await app.objection.models.user.query()
            .findById(req.params.id);
          await user.$query()
            .patch(data);
          req.flash('success', i18next.t('flash.users.edit.success'));
          reply.redirect(app.reverse('users'));
          return reply;
        } catch (error) {
          if (error instanceof ValidationError) {
            req.flash('error', i18next.t('flash.users.edit.error'));
            const user = (new app.objection.models.user())
              .$set({
                ...req.body.data,
                id: req.params.id,
              });
            reply.render('users/edit', {
              user,
              errors: error.data,
            });
            return reply.code(422);
          }
          throw error;
        }
      },
    )
    .delete('/users/:id', {
      name: 'deleteUser',
      preValidation: app.auth([app.checkIfUserCanEditProfile, app.authenticate]),
    }, async (req, reply) => {
      const user = await app.objection.models.user.query()
        .findById(req.params.id);
      if (!user) {
        req.flash('error', i18next.t('flash.users.delete.error'));
      } else {
        await user.$query()
          .delete();
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect('/users');
      }
      return reply;
    });
};
