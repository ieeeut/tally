import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

/* Configure enzyme */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';
import { shallow } from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

import Home from '../../../app/components/Home';
import Messages from '../../../app/components/Messages';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Home component', () => {
  const component = shallow(<Home store={mockStore({ messages: {} })}/>).shallow();

  it('contains flash messages component', () => {
    expect(component.find(Messages)).to.have.length(1);
  });
});
