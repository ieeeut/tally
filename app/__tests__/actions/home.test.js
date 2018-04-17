import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/home'
import fetchMock from 'fetch-mock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('home actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('creates CHECKIN_SUCCESS when checkin has been successful', () => {
    const eid = 'abc123'
    const user = {
      eid: 'abc123'
    }

    fetchMock
      .postOnce('/checkin', { body: { user: user }, headers: { 'content-type': 'application/json' } })

    const expectedActions = [
      expect.objectContaining({ type: 'CLEAR_MESSAGES' }),
      expect.objectContaining({ type: 'CHECKIN_SUCCESS' })
    ]

    const store = mockStore()

    return store.dispatch(actions.checkin(eid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('creates CHECKIN_FAILURE when response is not ok', () => {
    const eid = 'abc123'
    const user = {
      eid: 'abc123'
    }

    fetchMock
      .postOnce('/checkin', { body: { user: user }, status: 400, headers: { 'content-type': 'application/json' } })

    const expectedActions = [
      expect.objectContaining({ type: 'CLEAR_MESSAGES' }),
      expect.objectContaining({ type: 'CHECKIN_FAILURE', })
    ]

    const store = mockStore()

    return store.dispatch(actions.checkin(eid)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
