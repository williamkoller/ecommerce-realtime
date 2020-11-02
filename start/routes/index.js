'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/', 'HomeController.index').namespace('Home')
Route.get('/v1', () => {
  String.prototype.toHHMMSS = function () {
    const sec_num = parseInt(this, 10) // don't forget the second param
    let hours = Math.floor(sec_num / 3600)
    let minutes = Math.floor((sec_num - hours * 3600) / 60)
    let seconds = sec_num - hours * 3600 - minutes * 60

    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    const time = hours + ':' + minutes + ':' + seconds
    return time
  }

  const time = process.uptime()
  const uptime = (time + '').toHHMMSS()

  return {
    greeting: 'Welcome to Ecommerce real time',
    version: process.version,
    uptime: uptime
  }
})

require('./auth')
require('./admin')
require('./client')
