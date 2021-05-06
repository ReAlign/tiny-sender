# tiny-sender

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/tiny-sender.svg?longCache=true&style=for-the-badge
[npm-url]: https://www.npmjs.com/package/tiny-sender

> A tiny HTTP client for Browser, XHR is used by default, built-in progress-bar and notify, support for custom core, such as axios.

## Usage

```js
import TinySender from 'tiny-sender';

const tinySender = new TinySender(options);

async () => {
  try {
    const json = await tinySender.get(url);
    console.log(json);
  } catch(err) {
    console.log(err);
  }
};
```

## Documentation

