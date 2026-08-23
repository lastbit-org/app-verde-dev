const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let csrfToken = ''

export async function ensureCsrf() {
  if (csrfToken) {
    return csrfToken
  }

  const response = await fetch(`${API_URL}/auth/csrf`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}`)
  }

  const data = (await response.json()) as { csrfToken: string }
  csrfToken = data.csrfToken
  return csrfToken
}

export function clearCsrfToken() {
  csrfToken = ''
}

const SAFE = new Set(['GET', 'HEAD'])

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const method = (init?.method ?? 'GET').toUpperCase()
  if (!SAFE.has(method)) {
    headers.set('X-CSRF-Token', await ensureCsrf())
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  if (response.status === 403 && !SAFE.has(method) && csrfToken) {
    csrfToken = ''
    headers.set('X-CSRF-Token', await ensureCsrf())
    const retry = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
      credentials: 'include',
    })
    return parseResponse<T>(retry)
  }

  return parseResponse<T>(response)
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}`)
  }

  const text = await response.text()
  return (text ? JSON.parse(text) : null) as T
}
