'use strict'

class Login {
  get rules() {
    return {
      email: 'required|email',
      password: 'required'
    }
  }

  get messages() {
    return {
      'email.required': 'This e-mail is required',
      'email.email': 'This e-mail invalid',
      'password.required': 'This password is required'
    }
  }
}

module.exports = Login
