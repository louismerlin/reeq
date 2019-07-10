import reeq from './index'

reeq('https://jsonplaceholder.typicode.com/posts/1').then(response => {
  const { title } = JSON.parse(response)
  if (title === 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit') {
    console.log('GET success')
  } else {
    console.log('GET failure')
  }
})

reeq('https://jsonplaceholder.typicode.com/posts', { method: 'POST', data: { title: 'Reeq rocks' } }).then(response => {
  const { title } = JSON.parse(response)
  if (title === 'Reeq rocks') {
    console.log('POST success')
  } else {
    console.log('POST failure')
  }
})
