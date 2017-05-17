import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ChatFeed, Message } from 'react-chat-ui'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
