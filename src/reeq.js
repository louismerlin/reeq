function reeq (url, options) {
  return new Promise(function (resolve, reject) {
    const method = (options && options.method) || 'GET'
    let body = (options && options.body) || null
    const type = (options && options.type) || null

    if (!url) {
      reject(new Error('No url was given'))
    }

    const request = new XMLHttpRequest()
    request.open(method, url, true)

    if (body instanceof FormData || type === 'form-data') {
      request.setRequestHeader('Content-Type', 'multipart/form-data')
    } else if (typeof body === 'object' || type === 'json') {
      body = JSON.stringify(body)
      request.setRequestHeader('Content-Type', 'application/json')
    } else if (!type) {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    } else {
      request.setRequestHeader('Content-Type', type)
    }

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        resolve(request.responseText)
      } else {
        reject(new Error('Server returned:', XMLHttpRequest.statusText))
      }
    }

    request.onerror = function () {
      reject(new Error('Connection error,', XMLHttpRequest.statusText))
    }

    request.send(body)
  })
}

export default reeq
