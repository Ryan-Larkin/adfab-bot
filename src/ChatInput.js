import React, { Component } from 'react'

const styles = {
  chatInput: {
    flex: 1
  },
  inputStyle: {
    border: 'none',
    fontSize: 14,
    outline: 'none',
    padding: 30,
    width: '100%'
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
        <input ref="message" type="text" style={this.props.inputStyles || styles.inputStyle} placeholder={this.props.inputPlaceholder || 'CHAT WITH US'}></input>
        <button type="submit" value="Submit" />
      </form>
      </div>
    )
  }
}
