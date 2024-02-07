import i18next from 'i18next';
import { ValidationError } from 'objection';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      console.log(statuses, '====statuses')
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .get(
      '/statuses/:id/edit',
      {
        name: 'editStatus',
        preValidation: app.auth([app.checkIfUserCanEditProfile, app.authenticate]),
      },

      async (req, reply) => {
        const user = await app.objection.models.status.query()
          .findById(req.params.id);
        reply.render('statuses/edit', { user });
        return reply;
      },
    )
    .post('/statuses', async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query()
          .insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (data) {
        console.log(data, '======data')
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', {
          status,
          errors: data?.err?.data,
        });
      }

      return reply;
    })
    .patch(
      '/statuses/:id',
      {
        name: 'updateStatus',
        preValidation: app.auth([app.checkIfUserCanEditProfile, app.authenticate]),
      },
      async (req, reply) => {
        try {
          const {
            body: { data },
          } = req;
          const user = await app.objection.models.status.query()
            .findById(req.params.id);
          await user.$query()
            .patch(data);
          req.flash('success', i18next.t('flash.statuses.edit.success'));
          reply.redirect(app.reverse('statuses'));
          return reply;
        } catch (error) {
          if (error instanceof ValidationError) {
            req.flash('error', i18next.t('flash.statuses.edit.error'));
            const user = (new app.objection.models.status())
              .$set({
                ...req.body.data,
                id: req.params.id,
              });
            reply.render('statuses/edit', {
              user,
              errors: error.data,
            });
            return reply.code(422);
          }
          throw error;
        }
      },
    )
    .delete('/statuses/:id', {
      name: 'deleteStatus',
      preValidation: app.auth([app.checkIfUserCanEditProfile, app.authenticate]),
    }, async (req, reply) => {
      const user = await app.objection.models.status.query()
        .findById(req.params.id);
      if (!user) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
      } else {
        await user.$query()
          .delete();
        req.logOut();
        req.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect('/statuses');
      }
      return reply;
    });
};
