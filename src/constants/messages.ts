export const USER_VALID_MESSAGES = {
    VALIDATION_ERROR : 'Validate action says some errorss!',
    NAME_REQUIRED : 'Name can not be blank!',
    NAME_IS_STRING: 'Required String type for this field',
    NAME_LENGTH: 'Required at least 3 chars',
    EMAIL_EXIST: 'Email has already exist, please try another!',
    EMAIL_REQUIRED: 'Email can not be blank',
    EMAIL_VALID: 'Email maybe wrong type!',
    PASSWORD_REQUIRED: 'Password can not be blank',
    PASSWORD_LENGTH: 'Required at least 6 chars',
    PASSWORD_STRONG: 'Too Weak...try other password',
    CONFIRM_PASSWORD_REQUIRED: 'Confirm password not be blank',
    CONFIRM_PASSWORD_LENGTH: 'Too Weak...try other password',
    PASSWORD_MATCHING: 'Password not matching...please check carefully !!',
    DATE_VALID_ISO8601: 'Invalid Date Type'

} as const