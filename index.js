'use strict'

const Browser = require('zombie')
const Promise = require('bluebird')
const login = require('./src/login')
const globalConfig = require('./src/globalConfig')

const createHttpCheck = require('./src/createHttpCheck')
const createInstance = require('./src/createInstance')
const createService = require('./src/createService')

const createInstanceChecks = (browser, data, options) => {
  const httpCheckPromises = data.instance.checks
    .filter(check => check.type === 'http')
    .map((check, checkIndex) => {
      const httpCheckData = {
        service: data.service,
        serviceIndex: data.serviceIndex,
        instance: data.instance,
        instanceIndex: data.instanceIndex,
        check,
        checkIndex,
      }
      return createHttpCheck(browser, httpCheckData, options)
    })

  // TODO handle other types of checks, concat all the promises and return a single one containing them all

  return Promise.all(httpCheckPromises)
}

const createServiceInstances = (browser, data, options) => {
  return Promise.all(data.service.instances.map((instance, instanceIndex) => {
    const instanceData = {
      service: data.service,
      serviceIndex: data.serviceIndex,
      instance,
      instanceIndex,
    }
    return createInstance(browser, instanceData, options)
      .then(() => createInstanceChecks(browser, instanceData, options))
  }))
}

const loginAndCreateServices = (config, data, options) => {
  let resolvePromise
  const promise = new Promise(resolve => {
    resolvePromise = resolve
  })

  const services = data.services
  let currentServiceIndex = 0

  const loginAndCreateService = (service, serviceIndex) => {
    const browser = new Browser()
    const serviceData = {
      service,
      serviceIndex,
    }

    login(browser, config.credentials)
      .then(() => {
        return createServiceInstances(browser, serviceData, options)
          .then(() => createService(browser, serviceData, options))
      })
      .catch((e) => {
        // this error happens in the page Javascript when we enter in /services without any service
        if (e.message === 'Cannot read property \'asSorting\' of undefined') {
          return createServiceInstances(browser, serviceData, options)
            .then(() => createService(browser, serviceData, options))
        }
        throw new Error(e)
      })
      .then(() => {
        currentServiceIndex++
        if (services[currentServiceIndex]) {
          loginAndCreateService(services[currentServiceIndex], currentServiceIndex)
        } else {
          resolvePromise()
        }
      })
  }

  loginAndCreateService(services[currentServiceIndex], currentServiceIndex)

  return promise
}

const cabotZombie = (config, options) => {
  globalConfig.baseUrl = config.baseUrl
  return loginAndCreateServices(config, config.data, options)
}

module.exports = cabotZombie
