'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.get('/', 'HomeController.index').namespace('Home')
Route.get('/v1', () => {
  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10) // don't forget the second param
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - hours * 3600) / 60)
    var seconds = sec_num - hours * 3600 - minutes * 60

    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    var time = hours + ':' + minutes + ':' + seconds
    return time
  }

  var time = process.uptime()
  var uptime = (time + '').toHHMMSS()

  return {
    greeting: 'Welcome to Ecommerce real time',
    version: process.version,
    uptime: uptime,
  }
})

require('./auth')
require('./admin')
require('./client')
