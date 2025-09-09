// Функція для визначення мобільного пристрою
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || 
           (navigator.userAgent.indexOf('IEMobile') !== -1) ||
           (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent));
  }
  
  // Функція для перевірки ширини екрану
  function checkScreenSize() {
    return window.innerWidth <= 768; // 768px - межа для мобільних пристроїв
  }
  
  // Перенаправлення при завантаженні сторінки
  function redirectOnLoad() {
    if (isMobileDevice() || checkScreenSize()) {
      // Перевіряємо, чи ми вже не в мобільній версії
      if (!window.location.pathname.includes('/mobile/')) {
        window.location.href = 'mobile/index.html';
      }
    } else {
      // Перевіряємо, чи ми вже не в десктопній версії
      if (window.location.pathname.includes('/mobile/')) {
        window.location.href = '../index.html';
      }
    }
  }
  
  // Перенаправлення при зміні розміру вікна
  window.addEventListener('resize', function() {
    redirectOnLoad();
  });
  
  // Викликаємо при завантаженні сторінки
  document.addEventListener('DOMContentLoaded', redirectOnLoad);