import React, { useState, useEffect } from 'react';

const Popup: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Ouvir eventos do processo principal
    const cleanup = window.electronAPI.onShowResponse((data) => {
      setStatus(data.status);
      setMessage(data.message);
    });

    return cleanup;
  }, []);

  // Auto-fechar após 5 segundos quando mostrar resposta ou erro
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        window.close();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  // Popup de loading - discreto no centro
  if (status === 'loading') {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <span style={styles.loadingText}>Analisando...</span>
        </div>
      </div>
    );
  }

  // Popup de resposta/erro - discreto no canto inferior direito (estilo Slack)
  return (
    <div style={styles.toastContainer}>
      <div style={status === 'error' ? styles.toastError : styles.toastSuccess}>
        {status === 'success' && (
          <>
            <div style={styles.toastHeader}>
              <div style={styles.iconSuccessSmall}>✓</div>
              <span style={styles.toastTitle}>Resposta</span>
            </div>
            <div style={styles.toastContent}>
              <p style={styles.toastText}>{message}</p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={styles.toastHeader}>
              <div style={styles.iconErrorSmall}>✗</div>
              <span style={styles.toastTitleError}>Erro</span>
            </div>
            <div style={styles.toastContent}>
              <p style={styles.toastTextError}>{message}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  // Estilos para o popup de loading (centro da tela)
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'transparent',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  loadingCard: {
    backgroundColor: '#3f1f47',
    borderRadius: '12px',
    padding: '20px 28px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    animation: 'fadeIn 0.2s ease-out'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #5a3d5c',
    borderTop: '3px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#ffffff',
    margin: 0
  },

  // Estilos para o toast de resposta (canto inferior direito - estilo Slack)
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '24px'
  },
  toastSuccess: {
    backgroundColor: '#3f1f47',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    width: '360px',
    maxHeight: '200px',
    pointerEvents: 'auto',
    animation: 'slideInRight 0.3s ease-out',
    overflow: 'hidden'
  },
  toastError: {
    backgroundColor: '#3f1f47',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    width: '360px',
    maxHeight: '200px',
    pointerEvents: 'auto',
    animation: 'slideInRight 0.3s ease-out',
    overflow: 'hidden'
  },
  toastHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    borderBottom: '1px solid #5a3d5c'
  },
  iconSuccessSmall: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  iconErrorSmall: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  toastTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0
  },
  toastTitleError: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ff6b6b',
    margin: 0
  },
  toastContent: {
    padding: '14px 16px',
    maxHeight: '140px',
    overflowY: 'hidden'
  },
  toastText: {
    margin: 0,
    fontSize: '13px',
    color: '#e0e0e0',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  toastTextError: {
    margin: 0,
    fontSize: '13px',
    color: '#ffb3b3',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  }
};

// Adicionar CSS para animações
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default Popup;
