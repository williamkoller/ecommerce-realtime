'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ImageTransformer class
 *
 * @class ImageTransformer
 * @constructor
 */
class ImageTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(image) {
    image = image.toJSON()
    return {
      id: image.id,
      url: image.url
    }
  }
}

module.exports = ImageTransformer
