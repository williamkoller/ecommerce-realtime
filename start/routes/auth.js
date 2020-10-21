'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')}*/
const Router = use('Route')

/**
 * Auth Routes
 */
Router.group(() => {
  Router.post('/register', 'AuthController.register').as('auth.register')
  Router.post('/login', 'AuthController.login').as('auth.login')
  Router.post('/refresh', 'AuthController.refresh').as('auth.refresh')
  Router.post('/logout', 'AuthController.logout').as('auth.logout')
  /**
   * restore password routes
   */
  Router.post('/reset-password', 'AuthController.forgot').as('auth.forgot')
  Router.get('/reset-password', 'AuthController.remember').as('auth.remember')
  Router.put('/reset-password', 'AuthController.reset').as('auth.reset')
})
  .prefix('v1/auth')
  .namespace('Auth')
