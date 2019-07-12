# reeq

> Ultra simple, ultra light, dependency-free and tree-shakeable HTTP client for the browser, made with JSON in mind

[![version](https://img.shields.io/npm/v/reeq.svg)](https://www.npmjs.com/package/reeq) [![size](https://img.shields.io/bundlephobia/minzip/reeq.svg)](https://bundlephobia.com/result?p=reeq)

Reeq targets [most browsers](https://caniuse.com/#feat=promises).

Use reeq if:
 - You do not care about anything else other than the response (no status codes etc)
 - You want as few bytes as possible

#### Please feel free to open an issue and/or contribute !

## Install

### In your javascript project

```bash
yarn add reeq
```

### In your HTML `<body>`

```html
<script src="https://unpkg.com/reeq"></script>
```

## Usage

```javascript
import reeq from 'reeq' // not necessary if you used the HTML <script>

// in an async function

// a simple GET request
const repo = await reeq('https://api.github.com/repos/louismerlin/reeq')
console.log(response.license.name) // => 'MIT License'

// a simple POST request
const issueDescription = {
  title: 'I have a problem',
  body: 'Description of my problem'
}
const issue = await reeq('https://api.github.com/repos/louismerlin/reeq/issues', { method: 'POST', body: issueDescription })
console.log(issue.state) // => 'open'
```

## API

### `reeq(url, [options])`

> Make a request to a specified URL.

Returns a promise that resolves to the response (a javascript object if the response was JSON).

Where `url` is the url of the ressource.

`options` is an optional object argument that might include the following keys:

- method (string, default `GET`): the [HTTP request method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).
- body (string or object, default `null`): the request body.
- type (string, intelligent default): the header content-type.

The header `content-type` will be automatically set based on the body, for `FormData` and `object` (JSON) bodies. You should use this option if you want to override the `content-type`.

`json` is a special type value that will set the `content-type` to `application/json`.
