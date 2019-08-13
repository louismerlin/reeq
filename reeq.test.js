/* eslint-env jest */
const express = require('express')
const multer = require('multer')
const reeq = require('./dist/reeq.js')
const { XMLHttpRequest } = require('xmlhttprequest')

/*
  Use a fake XMLHttpRequest to simulate browser
*/
global.XMLHttpRequest = XMLHttpRequest
global.FormData = class FormData {}

/*
  Create a small server to generate fake responses
*/
const PORT = 1064 // generated with random.org
const URL = `http://localhost:${PORT}`
const app = express()
const upload = multer()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', async (_, res) => {
  res.json({ title: 'Hello World' })
})

app.post('/', upload.array(), async (req, res) => {
  res.json({ title: req.body.title + '!' })
})

app.get('/not-json', async (_, res) => {
  res.send('this is not json!')
})

app.get('/special-header', async (req, res) => {
  if (req.accepts('reeq/special-type')) {
    return res.send('There was a special header')
  } else {
    return res.status(400).send('Accept should have reeq/special-type')
  }
})

app.post('/form-data', async (req, res) => {
  if (req.is('multipart/form-data')) {
    return res.send('Recevied form-data!')
  } else {
    return res.status(400).send('Content-type should be form-data')
  }
})

app.post('/form-urlencoded', async (req, res) => {
  if (req.is('application/x-www-form-urlencoded')) {
    return res.send(req.body.word)
  } else {
    return res.status(400).send('Content-type should be form-urlencoded')
  }
})

app.post('/stringified-json', async (req, res) => {
  if (req.is('application/json')) {
    return res.send(req.body.hello)
  } else {
    return res.status(400).send('Content-type should be json')
  }
})

app.get('/error', async (_, res) => {
  res.status(418).send('I\'m a teapot')
})

var mockServer

/*
  Before all tests, start the server
*/
beforeAll(done => {
  mockServer = app.listen(PORT, done)
})

/*
  After all tests, close the server
*/
afterAll(() => {
  return mockServer.close()
})

/*
  Test out a simple GET request
*/
test('makes a simple GET request', async () => {
  const response = await reeq(URL)
  expect(response.title).toBe('Hello World')
})

/*
  Test out a simple POST request with JSON body
*/
test('makes a simple POST request with JSON body', async () => {
  const title = 'reeq rocks'
  const response = await reeq(URL, { method: 'POST', body: { title } })
  expect(response.title).toBe(title + '!')
})

/*
  Test out a GET request that does not return json
*/
test('makes a simple GET request that does not return JSON', async () => {
  const response = await reeq(`${URL}/not-json`)
  expect(response).toBe('this is not json!')
})

/*
  Test out a GET request with a special header
*/
test('makes a GET request with a special header', async () => {
  const response = await reeq(`${URL}/special-header`, { headers: { 'Accept': 'reeq/special-type' } })
  expect(response).toBe('There was a special header')
})

/*
  Test out a POST request that has a multipart form-data body
*/
test('makes a POST request that has multipart form-data body', async () => {
  const response = await reeq(`${URL}/form-data`, { method: 'POST', type: 'form-data' })
  expect(response).toBe('Recevied form-data!')
})

/*
  Test out a POST request that has a form-urlencoded body
*/
test('makes a POST request that has form-urlencoded body', async () => {
  const word = 'azerty'
  const response = await reeq(`${URL}/form-urlencoded`, { method: 'POST', body: `word=${word}` })
  expect(response).toBe(word)
})

/*
  Test out a POST request that has a stringified JSON body
*/
test('makes a POST request that has stringified JSON body', async () => {
  const response = await reeq(`${URL}/stringified-json`, { method: 'POST', body: JSON.stringify({ hello: 'world' }), type: 'json' })
  expect(response).toBe('world')
})

/*
  Try calling reeq without an url
*/
test('throws if no url is given', async () => {
  expect.assertions(1)
  try {
    await reeq()
  } catch (e) {
    expect(e).toBeDefined()
  }
})

/*
  Try calling reeq with an url that does not exist
*/
test('throws if the url does not exist', async () => {
  expect.assertions(1)
  try {
    await reeq(`this-should-not-exist`)
  } catch (e) {
    expect(e).toBeDefined()
  }
})

/*
  Test out a request that returns an error
*/
test('throws if the response code indicates an error', async () => {
  expect.assertions(1)
  try {
    await reeq(`${URL}/error`)
  } catch (e) {
    expect(e.message.includes('418')).toBeTruthy()
  }
})
