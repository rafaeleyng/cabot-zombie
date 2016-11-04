'use strict'

const nodeListToArray = require('./nodeListToArray')
const visit = require('./visit')

const createHttpCheck = (browser, data, options) => {
  const check = data.check
  const instance = data.instance

  const instanceName = options.resolveInstanceName ? options.resolveInstanceName(data) : instance.name
  const checkName = options.resolveCheckName ? options.resolveCheckName(data) : check.name

  return visit(browser, 'httpcheck/create/')
    .then(() => {
      return browser
        .fill('name', checkName)
        .fill('endpoint', check.endpoint)
        .fill('text_match', check.textMatch || '')
        .click('#id_instance_set_chosen ul')
        .then(() => {

          const instanceNodeList = nodeListToArray(browser, '#id_instance_set option')
          const instanceArray = []
          for (var i in instanceNodeList) {
            instanceArray.push(instanceNodeList[i])
          }

          // select the right instance
          const instanceOption = instanceArray.find((li) => li.innerHTML === instanceName)
          instanceOption.selected = true

          return browser.pressButton('Submit')
            .then(() => {
              console.log(`Done: create http check ${checkName}`)
            })
        })
    })
}

module.exports = createHttpCheck
