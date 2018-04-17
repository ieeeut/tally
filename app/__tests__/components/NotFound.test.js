import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15.4';
import NotFound from '../../components/NotFound'

Enzyme.configure({ adapter: new Adapter() })

const props = {};

const setup = () => {
  const wrapper = mount(<NotFound {...props} />)

  return {
    props,
    wrapper
  }
}

describe('components', () => {
  describe('NotFound', () => {
    it('should render self and subcomponents', () => {
      const { wrapper } = setup()
    })
  })
})
