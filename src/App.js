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
    console.log(document.getElementById("logInput").value)
    // I can properly assign the data to the input field. tested and working
    document.getElementById('contact-form__name').value = `${
      formData.firstName !== undefined && formData.lastName !== undefined ?
      formData.firstName + ' ' + formData.lastName : 'name'}`
      document.getElementById('contact-form__company').value = `${formData.company !== undefined ? formData.company : 'company'}`
      document.getElementById('contact-form__mail').value = `${formData.email !== undefined ? formData.email : 'email'}`
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
            text: {fontSize: 20},
            chatbubble: {borderRadius: 10,padding: 25}
          }}
        />
      </div>
    );
  }
}

export default ChatApp;
