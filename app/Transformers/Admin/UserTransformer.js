'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ['image']
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      surname: model.surname,
      email: model.email
    }
  }

  includeImage(user) {
    return this.item(user.getRelated('image'), ImageTransformer)
  }
}

module.exports = UserTransformer
