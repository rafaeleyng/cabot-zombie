'use strict'

const visit = require('./visit')

const login = (browser, credentials) => {
  return visit(browser, '')
    .then(() => {
      return browser
        .fill('username', credentials.username)
        .fill('password', credentials.password)
        .pressButton('Log in')
    })
}

module.exports = login
