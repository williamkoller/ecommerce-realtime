'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')

/**
 * Generate random string
 *
 * @param { int } length
 * @return { string }
 */

const str_random = async (length = 40) => {
  let string = ''
  const len = string.length

  if (len < length) {
    const size = length - len
    const bytes = await crypto.randomBytes(size)
    const buffer = Buffer.from(bytes)
    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }
  return string
}

/**
 * @param { FileJar } file
 * @param { string } path
 */

const manage_single_upload = async (file, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')

  const random_name = await str_random(30)
  const filename = `${new Date().getTime()}-${random_name}.${file.subType}`
  await file.move(path, {
    name: filename
  })
  return file
}

module.exports = { str_random, manage_single_upload }
