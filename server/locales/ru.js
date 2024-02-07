// @ts-check

export default {
  translation: {
    appName: 'Fastify Шаблон',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          error: 'Не удалось изменить данные',
          success: 'Пользователь успешно изменен',
        },
        authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
      },
      statuses: {
        create: {
          error: 'Не удалось добавить статус',
          success: 'Статус успешно добавлен',
        },
        edit: {
          error: 'Не удалось отредатктировать статус',
          success: 'Статус успешно изменен',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удален',
        },
        authError: 'Access denied! Please login',
      },
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        addStatus: 'Добавить статус',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        firstName: 'Имя',
        lastName: 'Фамилия',
        createdAt: 'Дата создания',
        editButton: 'Редактировать',
        deleteButton: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          changeHeader: 'Редактировать',
          submit: 'Редактировать',
        },
      },
      statuses: {
        editButton: 'Редактировать',
        deleteButton: 'Удалить',
        id: 'ID',
        name: 'Название',
        new: {
          add: 'Создать',
          submit: 'Создать',
        },
        edit: {
          changeHeader: 'Редактирова статус',
          submit: 'Редактировать',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
