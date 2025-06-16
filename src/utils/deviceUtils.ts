

// Generate a unique device ID based on various browser characteristics
export const generateDeviceId = (): string => {
  // Create a unique fingerprint based on browser characteristics
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 0,
    (navigator as any).deviceMemory || 0
  ].join('|');
  
  // Generate a hash of the fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to base36 and add timestamp for uniqueness
  const deviceId = Math.abs(hash).toString(36) + Date.now().toString(36);
  
  console.log('Generated device ID:', deviceId);
  return deviceId;
};

// Get device ID from localStorage or generate new one
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('device_id', deviceId);
    console.log('Stored new device ID:', deviceId);
  } else {
    console.log('Retrieved existing device ID:', deviceId);
  }
  
  return deviceId;
};

// Clear device ID from localStorage
export const clearDeviceId = (): void => {
  localStorage.removeItem('device_id');
  console.log('Device ID cleared from localStorage');
};

