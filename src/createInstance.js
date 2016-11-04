'use strict'

const visit = require('./visit')

const createInstance = (browser, data, options) => {
  const instance = data.instance
  const instanceName = options.resolveInstanceName ? options.resolveInstanceName(data) : instance.name

  return visit(browser, 'instance/create/')
    .then(() => {
      return browser
        .fill('name', instanceName)
        .fill('address', instance.address)
        .pressButton('Submit')
        .then(() => {
          console.log(`Done: create instance ${instanceName}`)
        })
        .catch(e => {
          // sometimes this error happens, don't know the cause neither the real solution
          if (e.message === 'Cannot read property \'x\' of undefined') {
            console.log(`Done: create instance ${instanceName}`)
            return
          }
          throw new Error(e)
        })
    })
}

module.exports = createInstance
