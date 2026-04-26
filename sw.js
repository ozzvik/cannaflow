// CannaFlow Service Worker — Push Notifications
const CACHE_NAME = 'cannaflow-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// קבלת push notification
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  const title = data.title || '🌿 CannaFlow';
  const options = {
    body: data.body || 'בדוק את המשימות היום',
    icon: '/cannaflow/icon-192.png',
    badge: '/cannaflow/icon-192.png',
    tag: 'cannaflow-daily',
    renotify: true,
    data: { url: '/cannaflow/' },
    actions: [
      { action: 'open', title: 'פתח' },
      { action: 'dismiss', title: 'סגור' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// לחיצה על ה-notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('cannaflow') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/cannaflow/');
    })
  );
});

// התראה מתוזמנת — בדיקה כל 30 דקות
self.addEventListener('periodicsync', e => {
  if (e.tag === 'cannaflow-morning') {
    e.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  const now = new Date();
  if (now.getHours() !== 9) return;

  const allClients = await clients.matchAll();
  // אם האפליקציה פתוחה — לא שלח (היא תטפל בזה)
  if (allClients.length > 0) return;

  await self.registration.showNotification('🌿 CannaFlow — בוקר טוב!', {
    body: 'לחץ לראות את משימות היום',
    icon: '/cannaflow/icon-192.png',
    tag: 'cannaflow-morning',
    data: { url: '/cannaflow/' }
  });
}
