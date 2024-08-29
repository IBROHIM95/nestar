export enum Message {
    SOMETHING_WENT_WRONG = 'Something went wrong',
    NO_DATA_FOUND = 'No data is found',
    CREATE_FAILED = 'Create is failed',
    UPDATE_FAILED = 'Update is failed',
    REMOVE_FAILED = 'Remove is failed',
    UPLOAD_FAILED = 'Upload is failed',
    BAD_REQUEST = 'Bad Request',

    USED_MEMBERNICK_OR_PHONE= 'Already used membernick or phone!',
    NO_MEMBER_NICK = 'No member with that member nick',
    BLOCKED_USER = 'You have been blocked. contact restaurant',
    WRONG_PASSWORD = 'Wrong password entered, please try again',
    NOT_AUTHENTICATED = 'You are not authenticated, Please login first',
    TOKEN_NOT_EXIST = 'Bearer token is not provided',
    ONLY_SPECIFIC_ROLES_ALLOWED= 'Allowed only for members with specific roles',
    NOT_ALLOWED_REQUEST=  'Not Allowed Request',
    PROVIDE_ALLOWED_FORMAT= 'Please provide jpg, jpeg or png images!',
    SELF_SUBSCRIBTION_DENIED = 'Self subscription is denied'
}