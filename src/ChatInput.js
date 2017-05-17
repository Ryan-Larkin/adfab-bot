'use strict';
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import config from '../config.json'

export default class ChatInput extends Component {
  constructor(props) {
    super(props)
  }

_handleSubmit = (event) => {
  event.preventDefault();
  console.log('hello' + this.refs.message.value)
  console.log(this.props)
  this.props.userMessage(this.refs.message.value)
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

const styles = {
  chatInput: {
    flex: 1
  },
  inputStyle: {
    border: 'none',
      // borderTopWidth: '1',
      // borderTopStyle: 'solid',
      // borderTopColor: '#ddd',
    fontSize: '16',
    outline: 'none',
    padding: '30',
    width: '100%'
  }
}
