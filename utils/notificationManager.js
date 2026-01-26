export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title, body, icon = './bell-icon.png') {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon,
      badge: icon,
      tag: 'reminder-notification',
      requireInteraction: true, 
      vibrate: [200, 100, 200], 
    });

   
    playNotificationSound();

    notification.onclick = function() {
      window.focus();
      notification.close();
    };

    return notification;
  }
}

export function playNotificationSound() {
  const audio = new Audio('./notification.mp3'); // Add your sound file to public folder
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Audio play failed:', err));
}