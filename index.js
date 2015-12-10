var about = require('./package.json')
var version = require('version-route')(__dirname)
var seaportautopilot = require('seaport-autopilot')
var Boom = require('boom')
var Hapi = require('hapi')
var Joi = require('joi')
var Whoru = require('whoru')

exports.start = function (db, config) {
	var whoaru = Whoru(db)
	seaportautopilot(about.name + '@' + about.version, config.seaportautopilot, function (err, port, pathname) {
    var server = new Hapi.Server()
    server.connection({ 'port': port })
    server.route(version)
    server.route({
      method: 'POST',
      path: '/fingerprint/{fingerprint}',
      handler: function (req, reply) {
        if (req.payload) whoaru.addFingerprint(req.params.fingerprint, req.payload, reply)
        else whoaru.addFingerprint(req.params.fingerprint, reply)
      }
    })

    server.route({
      method: 'POST',
      path: '/login/{fingerprint}',
      handler: function (req, reply) {
        whoaru.addLogin(
          req.payload.fingerprint,
          req.payload.userLoginID,
          req.payload.loginType,
          req.payload.app,
          req.payload.space,
          req.payload.details,
          function (err, details) {
            if (err) return reply(Boom.wrap(err))
            reply(null, {ok: true})
          }
        )
      },
      config: {
        validate: {
          payload: {
            userLoginID: Joi.string().required(),
            loginType: Joi.string().required(),
            app: Joi.string().required(),
            space: Joi.string().required(),
            details: Joi.object()
          }
        }
      }
    })

    server.route({
      method: 'GET',
      path: '/person/find/{fingerprint}/{app}/{space}',
      handler: function (req, reply) {
        reply('ok')
      }
    })

    server.route({
      method: 'GET',
      path: '/person/find/{fingerprint}',
      handler: function (req, reply) {
        reply('ok')
      }
    })


    server.route({
      method: 'GET',
      path: '/person/{person}',
      handler: function (req, reply) {
        reply('ok')
      }
    })


    server.start(function (err) {
      console.log('started')
    })
  })
}
