'use strict'

const Mail = use('Mail');

class ForgotPasswordController {
  async store({ request }){
    const { email } = request.input('email');

    await Mail.send('emails.welcome', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Welcome to yardstick')
    })
  }
}

module.exports = ForgotPasswordController
