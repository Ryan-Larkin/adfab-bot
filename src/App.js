import React, { Component } from 'react';
import './App.css';
import ChatFeed from './ChatFeed.js'
import Message from './Message.js'

class ChatApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages : [],
    }
  }

_handleFormData = (formData) => {

  // handle a message to see if it contai s form data...
  // if contains form data, use document.getElementById('contact-form__mail')

}



render() {
    return (
      <div className="ChatApp">
        <ChatFeed
          handleFormData={this._handleFormData}
          messages={this.state.messages}
          isTyping={this.state.is_typing}
          hasInputField={true}
          bubblesCentered={false}
          bubbleStyles={{
            text: {fontSize: 15},
            chatbubble: {borderRadius: 70,padding: 20}
          }}
        />
      </div>
    );
  }
}

export default ChatApp;
