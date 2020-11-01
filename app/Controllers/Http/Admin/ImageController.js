'use strict'

const Image = use('App/Models/Image')
const { manage_single_upload, manage_multiple_uploads } = use('App/Helpers')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Show a list of all images.
   * GET images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, pagination }) {
    const image = await Image.query()
      .whereNull('deleted_at')
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.limit)
    if (!image === 0)
      return response.status(404).send({ message: 'Not found images' })
    return response.status(200).send({ data: image })
  }

  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params: { id }, request, response }) {
    try {
      const img = await Image.findOrFail({ id, deleted_at: null })
      if (!img) {
        const fileJar = request.file('images', {
          types: ['image'],
          size: '2mb'
        })
        const images = []
        if (!fileJar.files) {
          const file = await manage_single_upload(fileJar)
          if (file.moved()) {
            const image = await Image.create({
              path: file.filename,
              size: file.size,
              original_name: file.clientName,
              extension: file.subtype
            })

            images.push(image)
            return response.status(201).send({ successes: images, error: {} })
          }

          return response.status(400).send({
            message: 'this image could not be processed at this time'
          })
        }
        const files = await manage_multiple_uploads(fileJar)
        await Promise.all(
          files.successes.map(async (file) => {
            const image = await Image.create({
              path: file.fileName,
              size: file.size,
              original_name: file.clientName,
              extension: file.subtype
            })
            images.push(image)
          })
        )
        return response
          .status(201)
          .send({ successes: images, error: files.errors })
      }
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Display a single image.
   * GET images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, view }) {
    try {
      const images = await Image.findOrFail({ id, deleted_at: null })
      return response.status(200).send({ data: images })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Update image details.
   * PUT or PATCH images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params: { id }, request, response }) {
    try {
      const image = await Image.findOrFail({ id, deleted_at: null })
      image.merge(request.only(['original_name']))
      await image.save()
      return response.status(200).send({ data: image })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }

  /**
   * Delete a image with id.
   * DELETE images/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: { id }, request, response }) {
    try {
      const image = await Image.findOrFail({ id, deleted_at: null })
      image.merge({ deleted_at: new Date() })
      await image.save()
      return response.status(201).send({ data: image })
    } catch (error) {
      return response.status(400).send({
        message: 'This request not performed',
        error: error.stack
      })
    }
  }
}

module.exports = ImageController
