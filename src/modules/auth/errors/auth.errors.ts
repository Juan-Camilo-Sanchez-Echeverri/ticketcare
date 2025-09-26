export const AuthErrors = {
  UNAUTHENTICATED_USER: {
    message: 'Login is required to perform the requested action.',
  },

  TOKEN_NOT_FOUND: {
    message: 'Authentication token not sent',
  },

  TOKEN_EXPIRED: {
    message: 'Authentication token has expired.',
  },

  INVALID_TOKEN: {
    message: 'Invalid authentication token',
  },

  USER_NOT_FOUND: {
    message: 'user not found.',
  },

  USER_EMAIL_NOT_FOUND: {
    message: 'The credentials are incorrect.',
  },

  PASSWORD_MISMATCH: {
    message: 'The credentials are incorrect.',
  },

  USER_INACTIVE: {
    message: 'The user is inactive.',
  },

  USER_DELETED: {
    message: 'user not found.',
  },

  EMAIL_NOT_FOUND: {
    message: 'No account exists with this email',
  },
};
