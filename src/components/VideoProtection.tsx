
import React, { useEffect, useRef } from 'react';

const VideoProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isScreenRecordingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // منع النقر الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // منع لقطات الشاشة والطباعة وأدوات المطور
    const handleKeyDown = (e: KeyboardEvent) => {
      // منع جميع اختصارات لقطة الشاشة
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && e.shiftKey && e.key === 'S') ||
        (e.metaKey && e.shiftKey && e.key === '3') ||
        (e.metaKey && e.shiftKey && e.key === '4') ||
        (e.metaKey && e.shiftKey && e.key === '5') ||
        (e.ctrlKey && e.key === 'PrintScreen') ||
        (e.altKey && e.key === 'PrintScreen') ||
        (e.shiftKey && e.key === 'PrintScreen')
      ) {
        e.preventDefault();
        e.stopPropagation();
        // إخفاء المحتوى فوراً
        document.body.style.visibility = 'hidden';
        setTimeout(() => {
          document.body.style.visibility = 'visible';
        }, 2000);
        return false;
      }

      // منع أدوات المطور
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.altKey && e.key === 'Tab')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // تعطيل السحب والإفلات
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // تعطيل التحديد
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // كشف وحماية من تسجيل الشاشة
    const protectFromScreenRecording = () => {
      // كشف تغيير حالة الرؤية
      const handleVisibilityChange = () => {
        if (document.hidden) {
          document.body.style.visibility = 'hidden';
          document.body.style.filter = 'blur(50px)';
          document.body.style.opacity = '0';
        } else {
          setTimeout(() => {
            document.body.style.visibility = 'visible';
            document.body.style.filter = 'none';
            document.body.style.opacity = '1';
          }, 1000);
        }
      };

      // كشف تغيير حجم النافذة
      const handleResize = () => {
        if (window.innerWidth < 800 || window.innerHeight < 600) {
          document.body.style.filter = 'blur(30px)';
          setTimeout(() => {
            document.body.style.filter = 'none';
          }, 2000);
        }
      };

      // كشف فقدان التركيز
      const handleBlur = () => {
        document.body.style.visibility = 'hidden';
        document.body.style.filter = 'blur(50px)';
        document.body.style.opacity = '0';
      };

      const handleFocus = () => {
        setTimeout(() => {
          document.body.style.visibility = 'visible';
          document.body.style.filter = 'none';
          document.body.style.opacity = '1';
        }, 1000);
      };

      // كشف حركة الماوس المشبوهة
      const handleMouseMove = (e: MouseEvent) => {
        // إذا كان الماوس يتحرك بسرعة غير طبيعية أو خارج النافذة
        if (e.clientX < 0 || e.clientY < 0 || 
            e.clientX > window.innerWidth || e.clientY > window.innerHeight) {
          document.body.style.filter = 'blur(30px)';
          setTimeout(() => {
            document.body.style.filter = 'none';
          }, 1000);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('resize', handleResize);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    };

    // منع أدوات المطور بطرق متقدمة
    const preventDevTools = () => {
      const detectDevTools = () => {
        const threshold = 160;
        const heightDiff = window.outerHeight - window.innerHeight;
        const widthDiff = window.outerWidth - window.innerWidth;
        
        if (heightDiff > threshold || widthDiff > threshold) {
          document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 24px; color: red; background: black;">غير مسموح بفتح أدوات المطور</div>';
        }

        // كشف Console
        let consoleOpened = false;
        const element = new Image();
        Object.defineProperty(element, 'id', {
          get: function() {
            consoleOpened = true;
            document.body.style.display = 'none';
            return '';
          }
        });
        console.log(element);
      };

      const interval = setInterval(detectDevTools, 100);
      return () => clearInterval(interval);
    };

    // منع النسخ واللصق
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // تطبيق جميع الحمايات
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyDown, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('copy', preventCopyPaste, true);
    document.addEventListener('paste', preventCopyPaste, true);
    document.addEventListener('cut', preventCopyPaste, true);

    // إضافة CSS للحماية القوية
    const bodyStyle = document.body.style as any;
    bodyStyle.userSelect = 'none';
    bodyStyle.webkitUserSelect = 'none';
    bodyStyle.MozUserSelect = 'none';
    bodyStyle.msUserSelect = 'none';
    bodyStyle.webkitTouchCallout = 'none';
    bodyStyle.webkitUserDrag = 'none';
    bodyStyle.webkitAppRegion = 'no-drag';

    // إضافة CSS متقدم للحماية
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
        -webkit-app-region: no-drag !important;
        pointer-events: auto !important;
      }
      
      video, iframe {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        pointer-events: auto !important;
      }

      /* منع الطباعة كلياً */
      @media print {
        * { 
          display: none !important; 
          visibility: hidden !important;
        }
        body::before {
          content: "الطباعة غير مسموحة";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: red;
        }
      }

      /* إخفاء المحتوى في وضع ملء الشاشة المشبوه */
      @media (display-mode: fullscreen) {
        body { 
          filter: blur(50px) !important; 
          opacity: 0 !important;
        }
      }

      /* حماية إضافية للهاتف */
      @media (max-width: 768px) {
        * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -khtml-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }
      }

      /* منع Screenshot على الويب */
      @media screen {
        body {
          -webkit-app-region: no-drag !important;
        }
      }

      /* CSS للحماية من التقاط الشاشة */
      html, body {
        overflow-x: hidden !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    // تفعيل الحمايات المتقدمة
    const cleanupDetection = protectFromScreenRecording();
    const cleanupDevTools = preventDevTools();

    // منع الوصول للـ Console
    const originalConsole = window.console;
    (window as any).console = {
      ...originalConsole,
      clear: () => {},
      log: () => {},
      warn: () => {},
      error: () => {},
      info: () => {},
      debug: () => {}
    };

    // حماية من Screen Capture API
    if ('getDisplayMedia' in navigator.mediaDevices) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = () => {
        document.body.style.display = 'none';
        return Promise.reject(new Error('Screen capture is blocked'));
      };
    }

    // حماية من getUserMedia
    if ('getUserMedia' in navigator.mediaDevices) {
      const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
      navigator.mediaDevices.getUserMedia = (constraints) => {
        if (constraints && (constraints as any).video && (constraints as any).video.mediaSource) {
          document.body.style.display = 'none';
          return Promise.reject(new Error('Screen recording is blocked'));
        }
        return originalGetUserMedia.call(navigator.mediaDevices, constraints);
      };
    }

    // حماية للأجهزة المحمولة
    const preventMobileCapture = () => {
      // منع لقطة الشاشة على أندرويد
      let volumeDownPressed = false;
      let powerButtonPressed = false;

      const handleVolumeDown = (e: KeyboardEvent) => {
        if (e.key === 'VolumeDown' || e.keyCode === 174) {
          volumeDownPressed = true;
          setTimeout(() => volumeDownPressed = false, 1000);
          if (powerButtonPressed) {
            document.body.style.visibility = 'hidden';
            setTimeout(() => {
              document.body.style.visibility = 'visible';
            }, 3000);
          }
        }
      };

      const handlePowerButton = (e: KeyboardEvent) => {
        if (e.key === 'Power' || e.keyCode === 116) {
          powerButtonPressed = true;
          setTimeout(() => powerButtonPressed = false, 1000);
          if (volumeDownPressed) {
            document.body.style.visibility = 'hidden';
            setTimeout(() => {
              document.body.style.visibility = 'visible';
            }, 3000);
          }
        }
      };

      // كشف حركات اللمس المشبوهة (iOS)
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length >= 3) {
          document.body.style.filter = 'blur(50px)';
          setTimeout(() => {
            document.body.style.filter = 'none';
          }, 2000);
        }
      };

      document.addEventListener('keydown', handleVolumeDown);
      document.addEventListener('keydown', handlePowerButton);
      document.addEventListener('touchstart', handleTouchStart, { passive: false });

      return () => {
        document.removeEventListener('keydown', handleVolumeDown);
        document.removeEventListener('keydown', handlePowerButton);
        document.removeEventListener('touchstart', handleTouchStart);
      };
    };

    const cleanupMobileCapture = preventMobileCapture();

    // مراقبة مستمرة للحماية
    const monitorInterval = setInterval(() => {
      // تحقق من حالة النافذة
      if (document.hidden || !document.hasFocus()) {
        document.body.style.filter = 'blur(30px)';
        document.body.style.opacity = '0.1';
      } else {
        document.body.style.filter = 'none';
        document.body.style.opacity = '1';
      }

      // كشف تغييرات مشبوهة في الحجم
      const windowRatio = window.innerWidth / window.innerHeight;
      if (windowRatio < 0.5 || windowRatio > 3) {
        document.body.style.display = 'none';
        setTimeout(() => {
          document.body.style.display = 'block';
        }, 2000);
      }
    }, 500);

    return () => {
      // تنظيف جميع Event Listeners
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyDown, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('copy', preventCopyPaste, true);
      document.removeEventListener('paste', preventCopyPaste, true);
      document.removeEventListener('cut', preventCopyPaste, true);
      
      // إعادة تعيين CSS
      const bodyStyle = document.body.style as any;
      bodyStyle.userSelect = '';
      bodyStyle.webkitUserSelect = '';
      bodyStyle.MozUserSelect = '';
      bodyStyle.msUserSelect = '';
      bodyStyle.webkitTouchCallout = '';
      bodyStyle.webkitUserDrag = '';
      bodyStyle.webkitAppRegion = '';
      document.body.style.visibility = 'visible';
      document.body.style.filter = 'none';
      document.body.style.opacity = '1';
      document.body.style.display = 'block';

      // تنظيف الحمايات
      cleanupDetection();
      cleanupDevTools();
      cleanupMobileCapture();
      clearInterval(monitorInterval);
      
      // إزالة الـ style المضاف
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }

      // إعادة Console
      (window as any).console = originalConsole;
    };
  }, []);

  return <>{children}</>;
};

export default VideoProtection;
