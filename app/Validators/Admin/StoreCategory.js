'use strict'

class StoreCategory {
  get rules() {
    return {
      title: 'required',
      description: 'required'
    }
  }
}

module.exports = StoreCategory
