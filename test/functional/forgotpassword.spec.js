const { test, trait, beforeEach, afterEach } = use('Test/Suite')('Session');
const Mail = use('Mail')
const Hash = use('Hash')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonis/js/lucid/src/lucid/Model)} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');

beforeEach(() => {
  Mail.fake()
})

afterEach(() => {
  Mail.restore()
})

async function generateForgotPasswordToken(client, email){
  const user = await Factory.model('App/Models/User').create({ email });

  await client
    .post('/forgot')
    .send({ email })
    .end();

  const token = await user.tokens().first();

  return token;
}

test('it should send an email with reset password instructions', async ({ assert, client }) => {
  const email = 'guilhermemaiasilva@hotmail.com';
  const token = await generateForgotPasswordToken(client, email);

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), {
    type: 'forgotpassword'
  });
});

test('it should be able to reset password', async ({ assert, client }) => {
  const email = 'guilhermemaiasilva@hotmail.com';
  const token = await generateForgotPasswordToken(client, email);

  await client.post('/reset')
    .send({
      token,
      password: '123456',
      password_confirmation: '123456'
    })
    .end()

  const user = await User.findBy('email', email);
  const checkPassword = await Hash.verify('123456', user.password);

  assert.isTrue(checkPassword);
})
