import { useState, useEffect } from 'react';

let listeners = [];
let current = null;

export function showToast(message, type = 'success') {
  current = { message, type, id: Date.now() };
  listeners.forEach((l) => l(current));
  setTimeout(() => {
    current = null;
    listeners.forEach((l) => l(null));
  }, 3500);
}

function ToastHost() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const l = (t) => setToast(t);
    listeners.push(l);
    return () => { listeners = listeners.filter((x) => x !== l); };
  }, []);
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type === 'error' ? 'error' : toast.type === 'success' ? 'success' : ''}`}>
      {toast.type === 'error' ? '⚠️' : '✅'} {toast.message}
    </div>
  );
}

export default ToastHost;
