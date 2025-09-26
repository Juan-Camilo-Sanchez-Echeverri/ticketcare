export const EmailRequestErrors = {
  TOKEN_INVALID: {
    code: 9000,
    message: 'Email request token is invalid',
  },
  TOKEN_EXPIRED: {
    code: 9001,
    message: 'Email request token expired',
  },
  MAX_ATTEMPTS_REACHED: {
    code: 9002,
    message: 'Maximum number of attempts reached',
  },
  REQUEST_NOT_FOUND_OR_EXPIRED: {
    code: 9003,
    message: 'Request not found or expired',
  },
};
