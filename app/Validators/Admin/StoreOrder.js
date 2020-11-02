'use strict'

class StoreOrder {
  get rules() {
    return {
      'items.*.product_id': 'exists:products,id',
      'items.*.quantity': 'min:1'
    }
  }
}

module.exports = StoreOrder
