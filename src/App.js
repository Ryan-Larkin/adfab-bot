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

// this part dynamically fills the form from the chatfeed props
_handleFormData = (formData) => {
    this.setState({formData : formData})
    var formDataString = JSON.stringify(formData)
    document.getElementById("logInput").value = formDataString
    document.getElementById('contact-form__firstName').value = `${formData.firstName !== undefined  ? formData.firstName :'First Name'}`
    document.getElementById('contact-form__lastName').value = `${formData.lastName !== undefined  ? formData.lastName : 'Last Name'}`
    document.getElementById('contact-form__number').value = `${formData.phoneNumber !== undefined  ? formData.phoneNumber : 'Number'}`
    document.getElementById('contact-form__company').value = `${formData.company !== undefined ? formData.company : 'Company'}`
    document.getElementById('contact-form__mail').value = `${formData.email !== undefined ? formData.email : 'Email'}`
}



// renders the chat feed and sets some styles to it
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
            text: {fontSize: 20},
            chatbubble: {borderRadius: 10,padding: 25}
          }}
        />
      </div>
    );
  }
}

export default ChatApp;
