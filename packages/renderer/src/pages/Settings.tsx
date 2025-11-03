import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [appEnabled, setAppEnabled] = useState<boolean>(true);
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const key = await window.electronAPI.getKey();
      const status = await window.electronAPI.getAppStatus();
      setApiKey(key);
      setAppEnabled(status);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await window.electronAPI.saveKey(apiKey);
      setSavedMessage('✓ Configurações salvas com sucesso!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      setSavedMessage('✗ Erro ao salvar configurações');
    }
  };

  const handleToggleApp = async (enabled: boolean) => {
    try {
      await window.electronAPI.toggleApp(enabled);
      setAppEnabled(enabled);
    } catch (error) {
      console.error('Erro ao alternar estado do app:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Test Helper</h1>
        <p style={styles.subtitle}>Assistente de captura de tela com IA</p>
      </div>

      <div style={styles.card}>
        {/* Atalho de Captura */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📸 Captura de Tela</h3>
          <div style={styles.shortcutBox}>
            <span style={styles.shortcutKey}>Ctrl + T</span>
            <span style={styles.shortcutDesc}>Pressione para capturar a tela</span>
          </div>
        </div>

        {/* Toggle Ligar/Desligar */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>⚡ Status do App</h3>
          <div style={styles.toggleContainer}>
            <span style={styles.toggleLabel}>
              {appEnabled ? 'App está ativo' : 'App está desativado'}
            </span>
            <button
              onClick={() => handleToggleApp(!appEnabled)}
              style={{
                ...styles.toggleButton,
                backgroundColor: appEnabled ? '#4CAF50' : '#e0e0e0'
              }}
            >
              <span style={{
                ...styles.toggleCircle,
                transform: appEnabled ? 'translateX(24px)' : 'translateX(2px)'
              }} />
            </button>
          </div>
        </div>

        {/* Chave da OpenAI */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔑 Chave da API OpenAI</h3>
          <div style={styles.inputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              style={styles.input}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              title={showPassword ? 'Ocultar' : 'Mostrar'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button onClick={handleSave} style={styles.saveButton}>
            💾 Salvar Chave
          </button>
          {savedMessage && (
            <p style={{
              ...styles.message,
              color: savedMessage.includes('✓') ? '#4CAF50' : '#f44336'
            }}>
              {savedMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f7f9fc',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    fontWeight: '400'
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden'
  },
  section: {
    padding: '24px',
    borderBottom: '1px solid #e8e8e8'
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '15px',
    color: '#333',
    fontWeight: '600',
    letterSpacing: '0.3px'
  },
  shortcutBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  shortcutKey: {
    padding: '8px 16px',
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: '"SF Mono", Monaco, monospace',
    letterSpacing: '1px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
  },
  shortcutDesc: {
    fontSize: '14px',
    color: '#5a5a5a',
    fontWeight: '500'
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toggleLabel: {
    fontSize: '14px',
    color: '#555',
    fontWeight: '500'
  },
  toggleButton: {
    position: 'relative',
    width: '52px',
    height: '28px',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    padding: 0,
    outline: 'none'
  },
  toggleCircle: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '24px',
    height: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    display: 'block'
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '12px'
  },
  input: {
    width: '100%',
    padding: '12px 45px 12px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontFamily: '"SF Mono", Monaco, monospace',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  eyeButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s ease',
    padding: 0
  },
  saveButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
  },
  message: {
    marginTop: '12px',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: '500'
  }
};

export default Settings;