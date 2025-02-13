export type SendData = string | ArrayBufferLike
export type IncomingData = ArrayBufferView

export interface IsomorphicWebSocket {
  readonly send: (data: SendData) => void
  readonly close: (code?: number, reason?: string) => void
  readonly isClosed: () => boolean
}

export interface CloseEvent {
  readonly code: number
  readonly reason: string
  readonly wasClean: boolean
}

export interface Event {
  readonly type: string
}

export interface MessageEvent {
  readonly data: IncomingData
}

export interface InitWebSocketParams {
  url: URL
  onopen: (event: Event) => void
  onclose: (event: CloseEvent) => void
  onerror: (event: Event) => void
  onmessage: (event: MessageEvent) => void
}

export interface IsomorphicWebSocketAdapter {
  initWebSocket: (params: InitWebSocketParams) => IsomorphicWebSocket
}
