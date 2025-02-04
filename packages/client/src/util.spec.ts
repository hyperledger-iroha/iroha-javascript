import { transformProtocolInUrlFromHttpToWs, urlJoinPath } from './util'
import { describe, expect, test } from 'vitest'

describe('transform URL protocol to WS', () => {
  test('replaces http with ws', () => {
    expect(transformProtocolInUrlFromHttpToWs(new URL('http://129.0.0.1:412/api'))).toEqual(
      new URL('ws://129.0.0.1:412/api'),
    )
  })

  test('replaces https with wss', () => {
    expect(transformProtocolInUrlFromHttpToWs(new URL('https://129.0.0.1:412/api'))).toEqual(
      new URL('wss://129.0.0.1:412/api'),
    )
  })

  test('throws if the protocol is not http/https/ws/wss', () => {
    expect(() => transformProtocolInUrlFromHttpToWs(new URL('tcp://129.0.0.1'))).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Expected protocol of tcp://129.0.0.1 to be on of: ws, wss, http, https]`,
    )
  })

  for (const protocol of ['ws', 'wss']) {
    const url = new URL(`${protocol}://localhost`)

    test(`Leaves ${url} untouched`, () => {
      expect(transformProtocolInUrlFromHttpToWs(url)).toEqual(url)
    })
  }
})

describe('URL join', () => {
  test.each([
    { url: 'http://localhost', path: '/', expect: 'http://localhost/' },
    { url: 'http://localhost:410', path: '/', expect: 'http://localhost:410/' },
    { url: 'http://localhost', path: '/foo', expect: 'http://localhost/foo' },
    { url: 'http://localhost', path: 'foo/bar', expect: 'http://localhost/foo/bar' },
    { url: 'http://localhost/', path: '/path', expect: 'http://localhost/path' },
  ])('$url + $path = $expect', (params) => {
    expect(urlJoinPath(new URL(params.url), params.path)).toEqual(new URL(params.expect))
  })

  // test('localhost + /', () => {
  //   expect(urlJoinPath(new URL('http://localhost'), '/')).toEqual(new URL('http://localhost/'))
  // })

  // test('localhost:410 + /path', () => {
  //   expect(urlJoinPath(new URL('http://localhost:410'), '/path')).toEqual(new URL('http://localhost:410/path'))
  // })
})
