'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Category extends Model {
  /**
   * relationship between category and featured image
   */
  image() {
    return this.belongsTo('App/Models/Image')
  }

  /**
   * relationship between category and products
   */
  products() {
    return thisbelongsToMany('App/Models/Product')
  }
}

module.exports = Category
