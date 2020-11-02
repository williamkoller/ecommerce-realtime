'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

/**
 * CategoryTransformer class
 *
 * @class CategoryTransformer
 * @constructor
 */
class CategoryTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['image']
  }
  /**
   * This method is used to transform the data.
   */
  transform(categories) {
    return {
      id: categories.id,
      title: categories.title,
      description: categories.description
    }
  }

  includeImage(categories) {
    return this.item(categories.getRelated('image'), ImageTransformer)
  }
}

module.exports = CategoryTransformer
