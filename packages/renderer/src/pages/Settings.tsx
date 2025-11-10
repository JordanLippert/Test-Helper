import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [appEnabled, setAppEnabled] = useState<boolean>(true);
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const key = await window.electronAPI.getKey();
        const status = await window.electronAPI.getAppStatus();
        setApiKey(key);
        setAppEnabled(status);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
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
      console.error('Erro ao salvar:', error);
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

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>🤖</span>
        </div>
        <h1 style={styles.title}>Assistente de Desktop IA</h1>
        <p style={styles.subtitle}>Análise Inteligente da Tela & Insights</p>
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
          <h3 style={styles.sectionTitle}>⚡ Status</h3>
          <div style={styles.toggleContainer}>
            <div>
              <span style={styles.toggleLabel}>
                {appEnabled ? 'Ativo' : 'Inativo'}
              </span>
              <p style={styles.toggleSubtext}>
                {appEnabled ? 'O aplicativo ativado com sucesso' : 'Ative para usar o aplicativo'}
              </p>
            </div>
            <button
              onClick={() => handleToggleApp(!appEnabled)}
              style={{
                ...styles.toggleButton,
                backgroundColor: appEnabled ? '#4CAF50' : '#e0e0e0'
              }}
              aria-label={appEnabled ? 'Desativar aplicativo' : 'Ativar aplicativo'}
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
          <h3 style={styles.sectionTitle}>🔑 Configuração OpenAI</h3>
          <label style={styles.label}>Chave API</label>
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
              aria-label={showPassword ? 'Ocultar chave' : 'Mostrar chave'}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <button onClick={handleSave} style={styles.saveButton}>
            Salvar
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

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Como Funciona
        </p>
        <div style={styles.steps}>
          <div style={styles.step}>
            <span style={styles.stepNumber}>1</span>
            <span style={styles.stepText}>Capturar</span>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <span style={styles.stepNumber}>2</span>
            <span style={styles.stepText}>Analisar</span>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <span style={styles.stepNumber}>3</span>
            <span style={styles.stepText}>Responder</span>
          </div>
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
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #5b7cfa',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  iconContainer: {
    marginBottom: '12px'
  },
  icon: {
    fontSize: '48px',
    display: 'inline-block'
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '400'
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
    overflow: 'hidden'
  },
  section: {
    padding: '24px',
    borderBottom: '1px solid #f0f0f0'
  },
  sectionTitle: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#374151',
    fontWeight: '600',
    letterSpacing: '0.2px'
  },
  shortcutBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb'
  },
  shortcutKey: {
    padding: '8px 16px',
    backgroundColor: '#5b7cfa',
    color: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: '"SF Mono", Monaco, monospace',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 4px rgba(91, 124, 250, 0.2)'
  },
  shortcutDesc: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500'
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  },
  toggleLabel: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px'
  },
  toggleSubtext: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0
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
    outline: 'none',
    flexShrink: 0
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
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    fontWeight: '500'
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '12px'
  },
  input: {
    width: '100%',
    padding: '12px 45px 12px 12px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    boxSizing: 'border-box',
    fontFamily: '"SF Mono", Monaco, monospace',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#f9fafb'
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
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
    padding: 0
  },
  saveButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5b7cfa',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    boxShadow: '0 2px 4px rgba(91, 124, 250, 0.2)'
  },
  message: {
    marginTop: '12px',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: '500'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    maxWidth: '460px',
    width: '100%'
  },
  footerText: {
    fontSize: '12px',
    color: '#9ca3af',
    marginBottom: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  steps: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px'
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#5b7cfa',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700'
  },
  stepText: {
    fontSize: '11px',
    color: '#6b7280',
    fontWeight: '500'
  },
  stepArrow: {
    fontSize: '18px',
    color: '#d1d5db',
    marginTop: '-20px'
  }
};

// Adicionar animação do spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Settings;
