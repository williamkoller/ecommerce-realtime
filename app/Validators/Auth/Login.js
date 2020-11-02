'use strict'

class Login {
  get rules() {
    return {
      email: 'required|email',
      password: 'required'
    }
  }
}

module.exports = Login
