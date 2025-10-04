export const USER_VALID_MESSAGES = {
  VALIDATION_ERROR: 'Validate action says some errorss!',
  NAME_REQUIRED: 'Name can not be blank!',
  NAME_IS_STRING: 'Required String type for this field',
  NAME_LENGTH: 'Required at least 3 chars',
  EMAIL_EXIST: 'Email has already exist, please try another!',
  EMAIL_REQUIRED: 'Email can not be blank',
  EMAIL_VALID: 'Email maybe wrong type!',
  EMAIL_ALREADY_VERIFIED: 'Email has already verified before',
  EMAIL_VERIFY_OK: 'Verify Done',
  RESEND_VERIFY_EMAIL_DONE: 'Resend Done',

  PASSWORD_REQUIRED: 'Password can not be blank',
  PASSWORD_LENGTH: 'Required at least 6 chars',
  PASSWORD_STRONG: 'Too Weak...try other password',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm password not be blank',
  CONFIRM_PASSWORD_LENGTH: 'Too Weak...try other password',
  PASSWORD_MATCHING: 'Password not matching...please check carefully !!',
  PASSWORD_RESET_FORGOT_OK: 'Reset password done',

  DATE_VALID_ISO8601: 'Invalid Date Type',
  USER_NOT_FOUND: 'user not found! Wrong email or password',
  ACCESS_TOKEN_REQUIRED: 'access token not be null! REQUIRED',
  REFRESH_TOKEN_REQUIRED: 'refresh token not be null! REQUIRED',
  REFRESH_TOKEN_INVALID: 'refresh token malformed, not valid',
  REFRESH_TOKEN_USED_OR_NOTEXIST: 'refresh token be used, or not exist'
} as const