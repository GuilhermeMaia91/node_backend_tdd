'use strict'

const User = use('App/Models/User');

class ResetPasswordController {
  async store({ request }){
    const { token, passwor d} = request.only({
      'token',
      'password'
    });


  }
}

module.exports = ResetPasswordController
