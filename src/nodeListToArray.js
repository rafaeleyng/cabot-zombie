'use strict'

const nodeListToArray = (browser, selector) => {
  const nodeList = browser.document.querySelectorAll(selector)
  const array = []
  for (var i in nodeList) {
    array.push(nodeList[i])
  }
  return array
}

module.exports = nodeListToArray
