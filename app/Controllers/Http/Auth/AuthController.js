'use strict'

const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {
  async register({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const { name, surname, email, password } = request.all()
      const userFound = await User.query()
        .where('email', email)
        .whereNull('deleted_at')
        .first()

      if (userFound) {
        return response.status(409).send({
          message: `user already registered`
        })
      }

      const user = await User.create({ name, surname, email, password }, trx)

      const userRole = await Role.findOrFail('slug', 'client')

      await user.roles().attach([userRole.id], null, trx)
      await trx.commit()

      return response.status(201).send({ data: user })
    } catch (error) {
      await trx.rollback()
      response.status(400).send({
        error: error.message
      })
    }
  }
  async login({ request, response, auth }) {
    const { email, password } = request.all()

    const data = await auth.withRefreshToken().attempt(email, password)
    return response.send({ data })
  }
  async refresh({ request, response, auth }) {
    let refresh_token = request.input('refresh_token')
    if (!refresh_token) {
      refresh_token = request.header('refresh_token')
    }

    const user = await auth
      .newRefreshToken()
      .generateForRefreshToken(refresh_token)

    return response.send({ data: user })
  }
  async logout({ request, response, auth }) {
    let refresh_token = request.input('refresh_token')

    if (!refresh_token) {
      refresh_token = request.header('refresh_token')
    }

    await auth.authenticator('jwt').revokeTokens([refresh_token], true)
    return response.status(204).send({})
  }
  async forgot({ request, response, auth }) {}
  async remember({ request, response }) {}
  async reset({ request, response }) {}
}

module.exports = AuthController
