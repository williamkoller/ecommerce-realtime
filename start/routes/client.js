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
  Router.get('orders', 'OrderController.index').middleware(['auth'])
  Router.get('orders/:id', 'OrderController.show').middleware(['auth'])
  Router.post('orders', 'OrderController.store')
  Router.put('orders/:id', 'OrderController.update')
  Router.post('orders/apply-discount', 'OrderController.applyDiscount')
  Router.delete('orders/destroy-discount', 'OrderController.removeDiscount')
})
  .prefix('v1')
  .namespace('Client')
