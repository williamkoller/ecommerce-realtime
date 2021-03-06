'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')}*/
const Router = use('Route')
/**
 * Admin Routes
 */
Router.group(() => {
  /**
   * Categories resource routes
   */
  Router.resource('categories', 'CategoryController')
    .apiOnly()
    .validator(
      new Map([
        [['categories.store'], ['Admin/StoreCategory']],
        [['categories.update'], ['Admin/StoreCategory']]
      ])
    )
  /**
   * Coupon resource routes
   */
  Router.resource('coupons', 'CouponController').apiOnly()
  /**
   * Image resource routes
   */
  Router.resource('images', 'ImageController').apiOnly()
  /**
   * Order resource routes
   */
  Router.post('orders/:id/discount', 'OrderController.applyDiscount')
  Router.delete('orders/:id/discount', 'OrderController.removeDiscount')
  Router.resource('orders', 'OrderController')
    .apiOnly()
    .validator(new Map([[['orders.store'], ['Admin/StoreOrder']]]))
  /**
   * Products resource routes
   */
  Router.resource('products', 'ProductController').apiOnly()
  /**
   * User resource routes
   */
  Router.resource('users', 'UserController')
    .apiOnly()
    .validator(
      new Map([
        [['users.store'], ['Admin/StoreUser']],
        [['users.update'], ['Admin/StoreUser']]
      ])
    )

  Router.get('dashboard', 'DashboardController.index').as('dashboard')
})
  .prefix('v1/admin')
  .namespace('Admin')
  .middleware(['auth', 'is:(admin || manager)'])
