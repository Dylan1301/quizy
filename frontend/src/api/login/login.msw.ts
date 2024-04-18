/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import {
  faker
} from '@faker-js/faker'
import {
  HttpResponse,
  delay,
  http
} from 'msw'
import type {
  Token
} from '.././model'

export const getLoginForAccessTokenLoginTokenPostResponseMock = (overrideResponse: any = {}): Token => ({access_token: faker.word.sample(), token_type: faker.helpers.arrayElement([faker.word.sample(), undefined]), ...overrideResponse})

export const getLoginLoginPostResponseMock = (overrideResponse: any = {}): Token => ({access_token: faker.word.sample(), token_type: faker.helpers.arrayElement([faker.word.sample(), undefined]), ...overrideResponse})


export const getLoginForAccessTokenLoginTokenPostMockHandler = (overrideResponse?: Token) => {
  return http.post('*/login/token', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getLoginForAccessTokenLoginTokenPostResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getLoginLoginPostMockHandler = (overrideResponse?: Token) => {
  return http.post('*/login', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getLoginLoginPostResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}
export const getLoginMock = () => [
  getLoginForAccessTokenLoginTokenPostMockHandler(),
  getLoginLoginPostMockHandler()
]
