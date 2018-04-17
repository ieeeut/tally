import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/admin'
import fetchMock from 'fetch-mock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('admin actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('creates CHECKIN_SUCCESS when checkin has been successful', () => {
    const users = [
      {
        eid: 'abc123'
      }, {
        eid: 'xyz123'
      }
    ]

    fetchMock
      .getOnce('/api/users', { body: { users: users }, headers: { 'content-type': 'application/json' } })

    const expectedActions = [
      expect.objectContaining({ type: 'CLEAR_MESSAGES' }),
      expect.objectContaining({ type: 'GET_USERS_SUCCESS' })
    ]

    const store = mockStore()

    return store.dispatch(actions.getUsers()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('creates CHECKIN_FAILURE when response code is not ok', () => {
    const users = [
      {
        eid: 'abc123'
      }, {
        eid: 'xyz123'
      }
    ]

    fetchMock
      .getOnce('/api/users', { status: 400, body: { users: users }, headers: { 'content-type': 'application/json' } })

    const expectedActions = [
      expect.objectContaining({ type: 'CLEAR_MESSAGES' }),
      expect.objectContaining({ type: 'GET_USERS_FAILURE' })
    ]

    const store = mockStore()

    return store.dispatch(actions.getUsers()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
