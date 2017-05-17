import React, { Component } from 'react';
import './App.css';
import ChatFeed from './ChatFeed.js'

class ChatApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages : [],
    }
  }

_handleFormData = (formData) => {
    this.setState({formData : formData})
    var formDataString = JSON.stringify(formData)
    document.getElementById("logInput").value = formDataString
  // handle a formData object
  // use for ecxample:
  // var formMailField = document.getElementById('contact-form__mail')
  // formMailField.value = FORM DATA

}

// hidden input in real dom

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
