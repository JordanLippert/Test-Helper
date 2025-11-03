import React, { useState, useEffect } from 'react';

const Popup: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handleResponse = (data: { status: 'success' | 'error'; message: string }) => {
      setStatus(data.status);
      setMessage(data.message);

      setTimeout(() => {
        window.close();
      }, 5000);
    };

    window.electronAPI.onShowResponse(handleResponse);
  }, []);

  if (status === 'loading') {
    return <div>Processando...</div>;
  }

  return (
    <div>
      <h1>{status === 'success' ? 'Sucesso' : 'Erro'}</h1>
      <p>{message}</p>
    </div>
  );
};

export default Popup;