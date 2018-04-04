export function checkin(eid) {
  return (dispatch) => {
    dispatch({
      type: 'CLEAR_MESSAGES'
    });
    return fetch('/checkin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eid: eid})
    }).then((response) => {
      return response.json().then((json) => {
        console.log(json);
        if (response.ok) {
          dispatch({
            type: 'CHECKIN_SUCCESS',
            user: json.user,
            messages: Array.isArray(json) ? json : [json]
          });
        } else {
          dispatch({
            type: 'CHECKIN_FAILURE',
            messages: Array.isArray(json) ? json : [json]
          });
        }
      });
    });
  };
}
