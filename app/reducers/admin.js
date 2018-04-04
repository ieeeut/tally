const initialState = {
  userList: []
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
    default:
      return state;
  }
}
