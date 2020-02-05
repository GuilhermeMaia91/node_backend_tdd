const { test, trait } = use('Test/Suite')('Session');
const Mail = use('Mail')
const Hash = use('Hash')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

/** @type {typeof import('@adonis/js/lucid/src/lucid/Model)} */
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('it should send an email with reset password instructions', async ({ assert, client }) => {
  Mail.fake();

  const user = await Factory.model('App/Models/User').create({ email });

  await client
    .post('/forgot')
    .send({ email })
    .end();

  const token = await user.tokens().first();

  const email = 'guilhermemaiasilva@hotmail.com';

  const recentEmail = Mail.pullRecent();

  assert.equal(recentEmail.message.to[0].address, email);

  assert.include(token.toJSON(), {
    type: 'forgotpassword'
  });

  Mail.restore();
});

test('it should be able to reset password', async ({ assert, client }) => {
  const email = 'guilhermemaiasilva@hotmail.com';
  const user = await Factory.model('App/Models/User').create();
  const tokenFactory = await Factory.model('App/Models/Token').make();

  await user.tokens().save(tokenFactory);

  const { token } = await Factory.model('App/Models/Token').create({
    type: 'forgotpassword'
  });

  await client.post('/reset')
    .send({
      token,
      password: '123456',
      password_confirmation: '123456'
    })
    .end();

  await user.reload();
  const checkPassword = await Hash.verify('123456', user.password);

  assert.isTrue(checkPassword);
});
