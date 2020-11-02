'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')}*/
const Router = use('Route')

/**
 * Auth Routes
 */
Router.group(() => {
  Router.post('/register', 'AuthController.register')
    .as('auth.register')
    .middleware(['guest'])
  Router.post('/login', 'AuthController.login')
    .as('auth.login')
    .middleware(['guest'])
  Router.post('/refresh', 'AuthController.refresh')
    .as('auth.refresh')
    .middleware(['guest'])
  Router.post('/logout', 'AuthController.logout')
    .as('auth.logout')
    .middleware(['auth'])
  /**
   * restore password routes
   */
  Router.post('/reset-password', 'AuthController.forgot')
    .as('auth.forgot')
    .middleware(['guest'])
  Router.get('/reset-password', 'AuthController.remember')
    .as('auth.remember')
    .middleware(['guest'])
  Router.put('/reset-password', 'AuthController.reset')
    .as('auth.reset')
    .middleware(['guest'])
})
  .prefix('v1/auth')
  .namespace('Auth')
