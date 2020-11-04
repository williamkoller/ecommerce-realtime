'use strict'
const Transformer = use('App/Transformers/Admin/UserTransformer')
class UserController {
  async me({ response, transform, auth }) {
    let user = await auth.getUser()
    const userData = await transform.item(user, Transformer)
    userData.roles = await user.getRoles()
    return response.send(userData)
  }
}

module.exports = UserController
