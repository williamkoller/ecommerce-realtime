'use strict'

class StoreUser {
  get rules() {
    const userId = this.ctx.params.id
    const rule = ''
    if (userId) {
      rule = `unique|:users,email,id,${userId}`
    } else {
      rule = 'unique|:users,email|required'
    }
    return {
      email: rule,
      image_id: 'exists:images,id'
    }
  }
}

module.exports = StoreUser
