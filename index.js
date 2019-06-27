const XMLHttpRequest = global.XMLHttpRequest

function reeq (url, options) {
  return new Promise(function (resolve, reject) {
    const method = (options && options.method) || 'GET'
    const data = (options && options.data) || null
    const json = (options && options.json) || false

    if (!url) {
      reject(new Error('No url was given'))
    }

    if (method !== 'GET' && method !== 'POST') {
      console.log(method !== 'GET')
      reject(new Error('Method must be GET or POST'))
    }

    const request = new XMLHttpRequest()
    request.open(method, url, true)

    if (method === 'POST') {
      if (typeof data === 'object' || json) {
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
      } else {
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      }
    }

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        resolve(request.responseText)
      } else {
        reject(new Error(XMLHttpRequest.statusText))
      }
    }

    request.onerror = function () {
      reject(new Error(XMLHttpRequest.statusText))
    }

    request.send(data)
  })
}

module.exports = reeq
