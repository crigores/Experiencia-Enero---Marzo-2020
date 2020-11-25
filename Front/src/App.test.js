import React from 'react';
import ReactDOM from 'react-dom';
import MAGI from './MAGI';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MAGI />, div);
  ReactDOM.unmountComponentAtNode(div);
});
