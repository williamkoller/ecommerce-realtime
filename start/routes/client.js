'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')}*/
const Router = use('Route')

Router.group(() => {
  /**
   * Products routes
   */
  Router.get('products', 'ProductController.index')
  Router.get('products/:id', 'ProductController.show')
  /**
   * Orders routes
   */
  Router.get('orders', 'OrderController.index')
  Router.get('orders/:id', 'OrderController.show')
  Router.post('orders', 'OrderController.store')
  Router.put('orders/:id', 'OrderController.update')
})
  .prefix('v1')
  .namespace('Client')
