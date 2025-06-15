
import React, { useEffect, useRef } from 'react';

const VideoProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isScreenRecordingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // منع النقر الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // منع لقطات الشاشة والطباعة وأدوات المطور
    const handleKeyDown = (e: KeyboardEvent) => {
      // منع Ctrl+Shift+I (أدوات المطور)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      // منع F12 (أدوات المطور)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+U (عرض المصدر)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+P (طباعة)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      // منع PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
      // منع Alt+Tab (تبديل النوافذ)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        return false;
      }
      // منع Ctrl+Shift+S (لقطة شاشة في بعض المتصفحات)
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        return false;
      }
      // منع Windows + PrintScreen
      if (e.metaKey && e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    // تعطيل السحب والإفلات
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // تعطيل التحديد
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // كشف محاولات تسجيل الشاشة
    const detectScreenRecording = () => {
      // كشف تغيير حالة الرؤية (عند تبديل النوافذ أو التطبيقات)
      const handleVisibilityChange = () => {
        if (document.hidden) {
          // إخفاء المحتوى عند تبديل النافذة
          document.body.style.visibility = 'hidden';
          setTimeout(() => {
            if (!document.hidden) {
              document.body.style.visibility = 'visible';
            }
          }, 1000);
        } else {
          document.body.style.visibility = 'visible';
        }
      };

      // كشف تغيير حجم النافذة (قد يشير لمحاولة تسجيل)
      const handleResize = () => {
        const currentTime = Date.now();
        if (window.innerWidth < 800 || window.innerHeight < 600) {
          console.warn('تم اكتشاف تغيير مشبوه في حجم النافذة');
        }
      };

      // كشف Focus/Blur events
      const handleFocus = () => {
        document.body.style.filter = 'none';
      };

      const handleBlur = () => {
        document.body.style.filter = 'blur(10px)';
        setTimeout(() => {
          if (document.hasFocus()) {
            document.body.style.filter = 'none';
          }
        }, 500);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('resize', handleResize);
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('blur', handleBlur);
      };
    };

    // منع أدوات المطور
    const preventDevTools = () => {
      // كشف فتح أدوات المطور
      const detectDevTools = () => {
        const threshold = 160;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        
        if (heightThreshold || widthThreshold) {
          console.clear();
          document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 24px; color: red;">غير مسموح بفتح أدوات المطور</div>';
        }
      };

      const interval = setInterval(detectDevTools, 500);
      return () => clearInterval(interval);
    };

    // منع النسخ واللصق
    const preventCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // منع حفظ الصفحة
    const preventSave = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    };

    // تطبيق جميع الحمايات
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', preventSave);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);

    // إضافة CSS لمنع التحديد والحماية الإضافية
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    (document.body.style as any).MozUserSelect = 'none';
    (document.body.style as any).msUserSelect = 'none';
    document.body.style.webkitTouchCallout = 'none';
    document.body.style.webkitUserDrag = 'none';
    document.body.style.webkitAppRegion = 'no-drag';

    // حماية CSS إضافية
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
      
      video {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }

      /* منع التقاط الشاشة على مستوى CSS */
      @media print {
        * { display: none !important; }
      }

      /* حماية من Screen Sharing */
      @media (display-mode: fullscreen) {
        body { filter: blur(10px) !important; }
      }
    `;
    document.head.appendChild(style);

    // تفعيل كشف تسجيل الشاشة وأدوات المطور
    const cleanupDetection = detectScreenRecording();
    const cleanupDevTools = preventDevTools();

    // منع الوصول للـ Console
    if (typeof console !== 'undefined') {
      console.clear = () => {};
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
    }

    // حماية من Screen Capture API
    if ('getDisplayMedia' in navigator.mediaDevices) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
      navigator.mediaDevices.getDisplayMedia = () => {
        return Promise.reject(new Error('Screen capture is not allowed'));
      };
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', preventSave);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      
      // إعادة تعيين CSS
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      (document.body.style as any).MozUserSelect = '';
      (document.body.style as any).msUserSelect = '';
      document.body.style.webkitTouchCallout = '';
      document.body.style.webkitUserDrag = '';
      document.body.style.webkitAppRegion = '';
      document.body.style.visibility = 'visible';
      document.body.style.filter = 'none';

      // إزالة الحمايات
      cleanupDetection();
      cleanupDevTools();
      
      // إزالة الـ style المضاف
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return <>{children}</>;
};

export default VideoProtection;
