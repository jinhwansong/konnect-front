// public/firebase-messaging-sw.js

importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
);

// Firebase config (env 말고 하드코딩하는 게 안전)
firebase.initializeApp({
  apiKey: 'AIzaSyBmiMQzGLefv7rakg0XycUjaTyMp1l3kXE',
  authDomain: 'kennect-acec6.firebaseapp.com',
  projectId: 'kennect-acec6',
  storageBucket: 'kennect-acec6.firebasestorage.app',
  messagingSenderId: '788221283642',
  appId: '1:788221283642:web:beece8f32e7f18e4e65403',
});

// Initialize messaging (compat)
const messaging = firebase.messaging();

// 백그라운드 메시지 처리
messaging.onBackgroundMessage(payload => {
  try {
    // Some payloads may not include notification
    const title = payload?.notification?.title || 'Konnect 알림';
    const body = payload?.notification?.body || '';
    const data = payload?.data || {};

    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      data,
    });
  } catch (err) {
    // Avoid crashing the SW on malformed payloads
    console.error('FCM onBackgroundMessage error:', err);
  }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const link = event.notification.data?.link || '/';
  event.waitUntil(clients.openWindow(link));
});
