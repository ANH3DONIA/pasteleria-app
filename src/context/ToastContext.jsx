import { createContext, useState, useContext, useCallback, useRef } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const activeMessages = useRef(new Set());

  const addToast = useCallback((message, type = 'success') => {
    if (activeMessages.current.has(message)) return; // Evitar spam
    
    activeMessages.current.add(message);
    const id = Date.now() + Math.random();
    
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      activeMessages.current.delete(message);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✓' : 'ℹ'}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
