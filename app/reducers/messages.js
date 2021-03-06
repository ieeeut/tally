export default function messages(state = {}, action) {
  switch (action.type) {
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
    case 'UPDATE_PROFILE_FAILURE':
    case 'CHANGE_PASSWORD_FAILURE':
    case 'FORGOT_PASSWORD_FAILURE':
    case 'RESET_PASSWORD_FAILURE':
    case 'CHECKIN_FAILURE':
    case 'GET_USERS_FAILURE':
    case 'GET_SETTINGS_FAILURE':
    case 'UPDATE_SETTINGS_FAILURE':
      return {
        error: action.messages
      };
    case 'UPDATE_PROFILE_SUCCESS':
    case 'CHANGE_PASSWORD_SUCCESS':
    case 'RESET_PASSWORD_SUCCESS':
    case 'CONTACT_FORM_SUCCESS':
    case 'CHECKIN_SUCCESS':
    case 'UPDATE_SETTINGS_SUCCESS':
      return {
        success: action.messages
      };
    case 'FORGOT_PASSWORD_SUCCESS':
    case 'DELETE_ACCOUNT_SUCCESS':
      return {
        info: action.messages
      };
    case 'CLEAR_MESSAGES':
      return {};
    default:
      return state;
  }
}
