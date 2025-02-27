// import { http, HttpResponse } from 'msw';
// import { faker } from '@faker-js/faker'

// const date = ()=>{
//     const lastWeek = new Date(Date.now())
//     lastWeek.setDate(lastWeek.getDate() - 7);
//     return faker.date.between({
//       from: lastWeek,
//       to: new Date(),
//     });
// };

// const user = [
//   {
//     id: 1,
//     name: 'John',
//     nickname: 'user1',
//     email: 'user1@example.com',
//     phone: '01012345678',
//     profileImage: faker.image.url(),
//   },
//   {
//     id: 2,
//     name: 'John2',
//     nickname: 'user2',
//     email: 'user2@example.com',
//     phone: '01022222222',
//     profileImage: faker.image.url(),
//   },
// ];

// export const handlers = [
//   http.post('/api/login', () => {
//     return HttpResponse.json(user[1], {
//       headers: {
//         'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
//       },
//     });
//   }),
//   http.post('/api/logout', () => {
//     return new HttpResponse(null, {
//       headers: {
//         'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
//       },
//     });
//   }),
//   http.post('/api/users', async ({ request }) => {
//     // return HttpResponse.text(JSON.stringify('user_exists'), {
//     //   status: 403,
//     // })
//     return HttpResponse.text(JSON.stringify('ok'), {
//       headers: {
//         'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
//       },
//     });
//   }),
// ];