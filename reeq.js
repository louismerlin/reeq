function createError (message, request) {
  return new Error(message + ' ' + request.status + ' ' + request.responseText)
}

function reeq (url, options) {
  return new Promise(function (resolve, reject) {
    const method = (options && options.method) || 'GET'
    let body = (options && options.body) || null
    const type = (options && options.type) || null
    const headers = (options && options.headers) || {}

    if (!url) {
      reject(new Error('No url was given'))
    }

    const request = new XMLHttpRequest()
    request.open(method, url, true)

    if (body instanceof FormData || type === 'form-data') {
      request.setRequestHeader('Content-Type', 'multipart/form-data')
    } else if ((body !== null && typeof body === 'object') || type === 'json') {
      if (typeof body === 'object') {
        body = JSON.stringify(body)
      }
      request.setRequestHeader('Content-Type', 'application/json')
    } else if (!type) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    } else {
      request.setRequestHeader('Content-Type', type)
    }

    Object.keys(headers).forEach(key => {
      const value = headers[key]
      request.setRequestHeader(key, value)
    })

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        try {
          const response = JSON.parse(request.responseText)
          resolve(response)
        } catch (_) {
          resolve(request.responseText)
        }
      } else {
        reject(createError('Server returned:', request))
      }
    }

    request.onerror = function () {
      reject(createError('Connection error:', request))
    }

    request.send(body)
  })
}

export default reeq
