// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// const firebaseConfig = {
//   apiKey: 'AIzaSyBmiMQzGLefv7rakg0XycUjaTyMp1l3kXE',
//   authDomain: 'kennect-acec6.firebaseapp.com',
//   projectId: 'kennect-acec6',
//   storageBucket: 'kennect-acec6.firebasestorage.app',
//   messagingSenderId: '788221283642',
//   appId: '1:788221283642:web:beece8f32e7f18e4e65403',
//   measurementId: 'G-1L01V9FCD6',
// };

// // 초기화
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// export const sendToken = async ()=> {
//     try {
//         // 알람 권한 요청
//         const permission = await Notification.requestPermission();
//         if ( permission === 'granted') {
//             // 토큰 받기
//             const token = await getToken(messaging, {
//               vapidKey:
//                 'BBtH4QrCnybP70CfuEoNiELkeAYXwfFr6o86E7UwkEmxmya0MmA5So2Bn7zHqDODG_Md0Oh7JbgIfIgptgBG2TA',
//             });
//             console.log('토큰을 받앗나?', token);
//             await sendToToken(token)
//             return token;
//         }
//     } catch (error) {
//         console.warn('알림 권한이 거부되었습니다.');
//         return null;
//     }
// }