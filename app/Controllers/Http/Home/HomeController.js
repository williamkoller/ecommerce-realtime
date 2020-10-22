'use strict'

class HomeController {
  /**
   *
   * @param {Response} ctx.response
   */
  async index({ response }) {
    return response.redirect('/v1')
  }
}

module.exports = HomeController
