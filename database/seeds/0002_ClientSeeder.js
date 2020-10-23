'use strict'

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/
const Factory = use('Factory')
const Role = use('Role')
const User = use('App/Models/User')
class ClientSeeder {
  async run() {
    const role = await Role.findBy('slug', 'client')
    const clients = await Factory.model('App/Models/User').createMany(30)
    await Promise.all(
      clients.map(async (client) => {
        await client.roles().attach([role.id])
      })
    )

    const user = await User.create({
      name: 'William',
      surname: 'Koller',
      email: 'wkoller25@gmail.com',
      password: 'secret'
    })
    const adminRole = await Role.findBy('slug', 'admin')
    await user.roles().attach([adminRole.id])
  }
}

module.exports = ClientSeeder
