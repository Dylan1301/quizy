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
  Room,
  RoomCreate,
  RoomList,
  RoomPublic,
  RoomWithQuiz
} from '.././model'

export const getRoomCreateRoomPostResponseMock = (overrideResponse: any = {}): Room => ({created_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ended_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), id: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), undefined]), is_published: faker.datatype.boolean(), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}), undefined]), updated_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ...overrideResponse})

export const getRoomListRoomListGetResponseMock = (overrideResponse: any = {}): RoomList => ({data: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({created_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ended_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), id: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), undefined]), is_published: faker.datatype.boolean(), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}), undefined]), updated_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ...overrideResponse})), ...overrideResponse})

export const getRoomDetailRoomRoomIdGetResponseMock = (overrideResponse: any = {}): Room => ({created_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ended_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), id: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), undefined]), is_published: faker.datatype.boolean(), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}), undefined]), updated_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ...overrideResponse})

export const getRoomEditRoomRoomIdPutResponseMock = (overrideResponse: any = {}): Room => ({created_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ended_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), id: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), undefined]), is_published: faker.datatype.boolean(), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}), undefined]), updated_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ...overrideResponse})

export const getStudentRoomDetailRoomStudentRoomIdGetResponseMock = (overrideResponse: any = {}): RoomWithQuiz => ({created_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ended_at: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), id: faker.number.int({min: undefined, max: undefined}), is_published: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz: {created_at: `${faker.date.past().toISOString().split('.')[0]}Z`, description: faker.word.sample(), id: faker.number.int({min: undefined, max: undefined}), questions: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({answers: Array.from({ length: faker.number.int({ min: 1, max: 10 }) }, (_, i) => i + 1).map(() => ({content: faker.word.sample(), created_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), id: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), undefined]), is_correct: faker.datatype.boolean(), question_id: faker.helpers.arrayElement([faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), undefined]), updated_at: faker.helpers.arrayElement([faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), undefined]), ...overrideResponse})), created_at: `${faker.date.past().toISOString().split('.')[0]}Z`, explaination: faker.word.sample(), id: faker.number.int({min: undefined, max: undefined}), tilte: faker.word.sample(), time_limit: faker.helpers.arrayElement([faker.number.int({min: undefined, max: undefined}),{}]), type: faker.helpers.arrayElement([faker.word.sample(),{}]), updated_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ...overrideResponse})), teacher_id: faker.number.int({min: undefined, max: undefined}), tilte: faker.word.sample(), updated_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ...overrideResponse}, quiz_id: faker.number.int({min: undefined, max: undefined}), updated_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ...overrideResponse})

export const getRoomPublicDetailRoomRoomIdPublicGetResponseMock = (overrideResponse: any = {}): RoomPublic => ({created_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ended_at: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), id: faker.number.int({min: undefined, max: undefined}), is_published: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.number.int({min: undefined, max: undefined}), updated_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ...overrideResponse})

export const getRoomPublishRoomRoomIdPublishPostResponseMock = (overrideResponse: any = {}): RoomCreate => ({is_published: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.number.int({min: undefined, max: undefined}), ...overrideResponse})

export const getRoomEndRoomRoomIdEndPostResponseMock = (overrideResponse: any = {}): RoomPublic => ({created_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ended_at: faker.helpers.arrayElement([`${faker.date.past().toISOString().split('.')[0]}Z`,{}]), id: faker.number.int({min: undefined, max: undefined}), is_published: faker.helpers.arrayElement([faker.datatype.boolean(), undefined]), is_randomized: faker.datatype.boolean(), name: faker.word.sample(), quiz_id: faker.number.int({min: undefined, max: undefined}), updated_at: `${faker.date.past().toISOString().split('.')[0]}Z`, ...overrideResponse})


export const getRoomCreateRoomPostMockHandler = (overrideResponse?: Room) => {
  return http.post('*/room', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomCreateRoomPostResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomListRoomListGetMockHandler = (overrideResponse?: RoomList) => {
  return http.get('*/room/list', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomListRoomListGetResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomDetailRoomRoomIdGetMockHandler = (overrideResponse?: Room) => {
  return http.get('*/room/:roomId', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomDetailRoomRoomIdGetResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomEditRoomRoomIdPutMockHandler = (overrideResponse?: Room) => {
  return http.put('*/room/:roomId', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomEditRoomRoomIdPutResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomDeleteRoomRoomIdDeleteMockHandler = () => {
  return http.delete('*/room/:roomId', async () => {
    await delay(1000);
    return new HttpResponse(null,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getStudentRoomDetailRoomStudentRoomIdGetMockHandler = (overrideResponse?: RoomWithQuiz) => {
  return http.get('*/room/student/:roomId', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getStudentRoomDetailRoomStudentRoomIdGetResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomPublicDetailRoomRoomIdPublicGetMockHandler = (overrideResponse?: RoomPublic) => {
  return http.get('*/room/:roomId/public', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomPublicDetailRoomRoomIdPublicGetResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomPublishRoomRoomIdPublishPostMockHandler = (overrideResponse?: RoomCreate) => {
  return http.post('*/room/:roomId/publish', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomPublishRoomRoomIdPublishPostResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}

export const getRoomEndRoomRoomIdEndPostMockHandler = (overrideResponse?: RoomPublic) => {
  return http.post('*/room/:roomId/end', async () => {
    await delay(1000);
    return new HttpResponse(JSON.stringify(overrideResponse ? overrideResponse : getRoomEndRoomRoomIdEndPostResponseMock()),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  })
}
export const getRoomMock = () => [
  getRoomCreateRoomPostMockHandler(),
  getRoomListRoomListGetMockHandler(),
  getRoomDetailRoomRoomIdGetMockHandler(),
  getRoomEditRoomRoomIdPutMockHandler(),
  getRoomDeleteRoomRoomIdDeleteMockHandler(),
  getStudentRoomDetailRoomStudentRoomIdGetMockHandler(),
  getRoomPublicDetailRoomRoomIdPublicGetMockHandler(),
  getRoomPublishRoomRoomIdPublishPostMockHandler(),
  getRoomEndRoomRoomIdEndPostMockHandler()
]
