'use strict'

const globalConfig = require('./globalConfig')

const visit = (browser, context) => {
  if (!globalConfig.baseUrl) {
    throw new Error('[visit] you should set `globalConfig.baseUrl` before calling for the first time')
  }

  const url = `${globalConfig.baseUrl}${context}`
  console.log(`Start: navigation to ${url}`)

  return browser.visit(url)
    .then(() => {
      browser.assert.success()
      console.log(`Sucess: navigation to ${url}`)
    })
}

module.exports = visit
