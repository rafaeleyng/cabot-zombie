'use strict'

const nodeListToArray = require('./nodeListToArray')
const visit = require('./visit')

const createService = (browser, data, options) => {
  const service = data.service
  const serviceName = options.resolveServiceName ? options.resolveServiceName(data) : service.name

  return visit(browser, 'service/create/')
    .then(() => {
      return browser
        .fill('name', serviceName)
        .click('#id_instances_chosen ul')
        .then(() => {
          return browser.click('#id_status_checks_chosen ul')
        })
        .then(() => {
          // select the right instances
          const instanceArray = nodeListToArray(browser, '#id_instances option')
          service.instances.forEach((instance, instanceIndex) => {
            const instanceData = {
              service: service,
              serviceIndex: data.serviceIndex,
              instance,
              instanceIndex,
            }
            const instanceName = options.resolveInstanceName ? options.resolveInstanceName(instanceData) : instance.name
            const instanceOption = instanceArray.find((li) => li.innerHTML === instanceName)
            instanceOption.selected = true

            // select the right checks
            const checkArray = nodeListToArray(browser, '#id_status_checks option')
            instance.checks.forEach((check, checkIndex) => {
              const checkData = {
                service: service,
                serviceIndex: data.serviceIndex,
                instance,
                instanceIndex,
                check,
                checkIndex,
              }
              const checkName = options.resolveCheckName ? options.resolveCheckName(checkData) : check.name
              const checkOptions = checkArray.filter((li) => {
                const customMatchCheckName = options.customCheckNameMatcher ? options.customCheckNameMatcher(li.innerHTML, checkData) : false
                return li.innerHTML === checkName || customMatchCheckName
              })
              checkOptions.forEach(c => c.selected = true)
            })
          })

          return browser.pressButton('Submit')
            .then(() => {
              console.log(`Done: create serviceName ${serviceName}`)
            })
        })
        .catch(e => {
          // sometimes this error happens, don't know the cause neither the real solution
          if (e.message === 'Cannot read property \'x\' of undefined') {
            console.log(`Done: create service ${serviceName}`)
            return
          }
          throw new Error(e)
        })
    })
}

module.exports = createService
