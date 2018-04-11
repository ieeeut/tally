const initialState = {
  userList: [],
  settings: {}
};

export default function admin(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'GET_USERS_SUCCESS':
      return Object.assign({}, state, {
        userList: action.users
      });
    case 'GET_SETTINGS_SUCCESS':
    case 'OPEN_CHECKIN_SUCCESS':
    case 'CLOSE_CHECKIN_SUCCESS':
      return Object.assign({}, state, {
        settings: action.settings
      });
    default:
      return state;
  }
}
