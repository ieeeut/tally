import reducer from '../../reducers/admin'
describe('admin reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        hydrated: true,
        userList: [],
        settings: {}
      }
    )
  })

  it('should handle GET_USERS_SUCCESS', () => {
    const users = [
      {
        eid: 'abc123'
      }, {
        eid: 'xyz123'
      }
    ]

    expect(
      reducer([], {
        type: 'GET_USERS_SUCCESS',
        users: users
      })
    ).toEqual(
      {
        hydrated: true,
        settings: {},
        userList: users
      }
    )
  })
})
