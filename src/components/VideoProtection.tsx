
import React, { useEffect } from 'react';

const VideoProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // منع النقر الأيمن
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // منع لقطات الشاشة والطباعة
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

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // إضافة CSS لمنع التحديد
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      
      // إعادة تعيين CSS
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, []);

  return <>{children}</>;
};

export default VideoProtection;
