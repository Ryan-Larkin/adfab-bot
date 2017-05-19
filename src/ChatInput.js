import React, { Component } from 'react'

const styles = {
  chatInput: {
    flex: 1,
    background: 'rgb(250, 250, 250)'
  },
  inputStyle: {
    border: 'none',
    margin: 0,

    fontSize: 24,
    fontWeight: 'bold',
    outline: 'none',
    width: '100%',
    background: 'rgb(250, 250, 250)'
  }
}

export default class ChatInput extends Component {


_handleSubmit = (event) => {
  event.preventDefault();
  this.props.userMessage(this.refs.message.value)
  this.refs.message.value = ""
}


  render = () => {
    return (
      <div className="chat-input" style={styles.chatInput}>
        <form onSubmit={this._handleSubmit}>
        <input className="chat-text" ref="message" type="text" style={this.props.inputStyles || styles.inputStyle} placeholder={this.props.inputPlaceholder || 'CHAT WITH US'}></input>
      </form>
      </div>
    )
  }
}
