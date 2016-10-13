var chai = require('chai')
var expect = chai.expect
var should = chai.should()
var server = require('../server')

/* global describe it */

/**
 * Test client for class Client
 * "Client" for is used because User is already used as a builtin model
 * which Client is based upon
 *
 * Tests should eventually serve as self-describing documentation
 */

describe('Client model', function () {

  let Client = server.models.Client
  let fixt = { id: 1, email: 'lol@mdr.xd', password: 'pass' }

  it('should create a client', function (done) {
    Client.replaceOrCreate(fixt, function (err, res) {
      expect(res).to.be.ok
      done(err)
    })
  })

  it('should find one client by id', function (done) {
    Client.find({where: {id: fixt.id, email: fixt.email}}, function (err, res) {
      console.log(res)
      res[0].email.should.eql(fixt.email)
      done(err)
    })
  })

  it('should remove a client', function (done) {
    Client.destroyById(fixt.id, function (err, res) {
      expect(res).to.eql({count: 1})
      done(err)
    })
  })

  it('should not find a client', function (done) {
    Client.find({ where: {id: fixt.id, email: fixt.email} }, function (err, res) {
      expect(res).to.have.lengthOf(0)
      done(err)
    })
  })

})

describe('Client authentication', function () {

  let Client = server.models.Client
  let fixt = { id: 2, email: 'john-apple@microsoft.com', password: 'dat-password-tho' }

  Client.replaceOrCreate(fixt, function (err, res) {
    if (err) done(err)
  })

  let token

  it('should login user', function (done) {
      Client.login({ email: fixt.email, password: fixt.password }, function (err, tok) {
        tok.id.should.be.ok
        token = tok
        done(err)
      })
  })

  it('should logout user', function (done) {
    Client.logout(token.id, function (err) {
      done(err)
    })
  })

})