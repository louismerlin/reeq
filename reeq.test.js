/* eslint-env jest */
const app = require('express')()
const bodyParser = require('body-parser')
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
const upload = multer()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', async (_, res) => {
  res.json({ title: 'Hello World' })
})

app.post('/', upload.array(), async (req, res) => {
  res.json({ title: req.body.title + '!' })
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
  const { title } = JSON.parse(response)
  expect(title).toBe('Hello World')
})

/*
  Test out a simple POST request with JSON body
*/
test('makes a simple POST request with JSON body', async () => {
  const title = 'reeq rocks'
  const response = await reeq(URL, { method: 'POST', body: { title } })
  const parsedResponse = JSON.parse(response)
  expect(parsedResponse.title).toBe(title + '!')
})
