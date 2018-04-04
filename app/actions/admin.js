export function getUsers() {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/api/users', {
      method: 'get'
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'GET_USERS_SUCCESS',
            users: json.users
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'GET_USERS_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}
