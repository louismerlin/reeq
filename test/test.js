document.body.onload = runTests


function runTests () {
  
  function log (message) {
    const p = document.createElement('p')
    p.appendChild(document.createTextNode(message))
    document.getElementById('test').appendChild(p)
  }

  reeq('https://jsonplaceholder.typicode.com/posts/1').then(response => {
    const { title } = JSON.parse(response)
    if (title === 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit') {
      log('GET success')
    } else {
      log('GET failure')
    }
  })

  reeq('https://jsonplaceholder.typicode.com/posts', { method: 'POST', body: { title: 'Reeq rocks' } }).then(response => {
    const { title } = JSON.parse(response)
    if (title === 'Reeq rocks') {
      log('POST success')
    } else {
      log('POST failure')
    }
  })
}
