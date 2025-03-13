import { transformProtocolInUrlFromHttpToWs, urlJoinPath } from './util.ts'
import { describe, test } from '@std/testing/bdd'
import { expect } from '@std/expect'

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
    expect(() => transformProtocolInUrlFromHttpToWs(new URL('tcp://129.0.0.1'))).toThrow(
      `Expected protocol of tcp://129.0.0.1 to be on of: ws, wss, http, https`,
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
  for (
    const params of [
      { url: 'http://localhost', path: '/', expect: 'http://localhost/' },
      { url: 'http://localhost:410', path: '/', expect: 'http://localhost:410/' },
      { url: 'http://localhost', path: '/foo', expect: 'http://localhost/foo' },
      { url: 'http://localhost', path: 'foo/bar', expect: 'http://localhost/foo/bar' },
      { url: 'http://localhost/', path: '/path', expect: 'http://localhost/path' },
    ]
  ) {
    test(`${params.url} + ${params.path} = ${params.expect}`, () => {
      expect(urlJoinPath(new URL(params.url), params.path)).toEqual(new URL(params.expect))
    })
  }
})
