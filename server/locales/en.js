// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        edit: {
          error: 'Failed to edit',
          success: 'User edited successfully',
        },
        delete: {
          error: 'Failed to delete',
          success: 'User deleted successfully',
        },
        authError: 'Access denied! Please login',
      },
      statuses: {
        create: {
          error: 'Failed to add status',
          success: 'Status added successfully',
        },
        edit: {
          error: 'Failed to edit status',
          success: 'Status edited successfully',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status deleted successfully',
        },
        authError: 'Access denied! Please login',
      },
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        statuses: 'Statuses',
        addStatus: 'Add status',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
        createdAt: 'Created at',
        editButton: 'Edit',
        deleteButton: 'Delete',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          changeHeader: 'Edit',
          submit: 'Edit',
        },
      },
      statuses: {
        editButton: 'Edit',
        deleteButton: 'Delete',
        id: 'ID',
        name: 'Name',
        new: {
          add: 'Add',
          submit: 'Add',
        },
        edit: {
          changeHeader: 'Edit Status',
          submit: 'Edit',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
    },
  },
};
