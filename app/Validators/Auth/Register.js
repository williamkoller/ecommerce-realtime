'use strict'

class Register {
  get rules() {
    return {
      name: 'required',
      surname: 'required',
      email: 'required|email|unique:users,email',
      password: 'required|confirmed'
    }
  }

  get messages() {
    return {
      'name.required': 'The name is required!',
      'surname.required': 'The surnameis required!',
      'email.required': 'The e-mail is required',
      'email.email': 'The e-mail invalid',
      'email.unique': 'This e-mail already exists',
      'password.required': 'The password is required',
      'password.confirmed': 'Passwords are not the same'
    }
  }
}

module.exports = Register
