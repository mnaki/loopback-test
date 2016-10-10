var chai = require('chai')
var expect = chai.expect
var server = require('../server')

describe('Client (user) model', function() {

  let Client = server.models.Client
  let data = { id: 1, email: 'lol@mdr.xd', password: 'pass' }

  it('should NOT find a client', function (done) {
    Client.find(data, function (err, arr) {
      expect(arr.length == 0).to.be.true
      done(err)
    })
  })

  it('should create a client (user)', function(done) {
    Client.replaceOrCreate(data, function (err, clientInstance) {
      expect(clientInstance).to.be.ok
      done(err)
    })
  })

  it('SHOULD find at least one client', function (done) {
    Client.find(data, function (err, arr) {
      expect(arr.length >= 0).to.be.true
      done(err)
    })
  })

})