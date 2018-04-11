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

export function updateSettings(meetingPoints, socialPoints, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/api/settings', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        socialPoints,
        meetingPoints,
        token
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_SETTINGS_SUCCESS',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'UPDATE_SETTINGS_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function getSettings(token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/api/settings', {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'GET_SETTINGS_SUCCESS',
            settings: json.settings
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'GET_SETTINGS_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function openCheckin(event, token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/api/settings', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        event: event
      })
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'OPEN_CHECKIN_SUCCESS',
            settings: json.settings
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'OPEN_CHECKIN_FAIL',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}

export function closeCheckin(token) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/api/settings', {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.ok) {
        return response.json().then((json) => {
          dispatch({
            type: 'CLOSE_CHECKIN_SUCCESS',
            settings: json.settings
          });
        });
      } else {
        return response.json().then((json) => {
          dispatch({
            type: 'CLOSE_CHECKIN_FAIL',
            messages: Array.isArray(json) ? json : [json]
          });
        });
      }
    });
  };
}
