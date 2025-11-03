# 🧪 Test Helper - Assistente de IA para Testes

> Aplicativo desktop multiplataforma que captura tela, extrai texto via OCR e analisa com IA da OpenAI

[![Electron](https://img.shields.io/badge/Electron-39.0.0-47848F?style=flat&logo=electron)](https://www.electronjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Funcionalidades

- 🎯 **Atalho Global** - Pressione `Ctrl+T` (ou `Cmd+T` no Mac) para capturar qualquer tela
- 🖼️ **Captura Inteligente** - Captura automaticamente a região relevante da janela ativa
- 📝 **OCR Avançado** - Extrai texto de imagens usando Tesseract.js
- 🤖 **Análise com IA** - Integração com OpenAI GPT para análise contextual
- 🎨 **Interface Moderna** - Design limpo e intuitivo com React
- 💾 **Configurações Persistentes** - Salva suas preferências localmente
- 🔒 **Seguro** - Armazenamento criptografado de API keys
- 🌐 **Multiplataforma** - Windows, macOS e Linux

## 📦 Instalação para Usuários

### Windows

1. Baixe o instalador: `release/Test Helper Setup 1.0.0.exe`
2. Execute o instalador e siga as instruções
3. O aplicativo será iniciado automaticamente na bandeja do sistema

## 🚀 Guia de Uso Rápido

### 1️⃣ Configuração Inicial

1. Clique com botão direito no ícone da bandeja do sistema
2. Selecione **"Configurações"**
3. Cole sua **OpenAI API Key** (obtenha em: https://platform.openai.com/api-keys)
4. Clique em **"💾 Salvar Chave"**
5. Certifique-se que o toggle está **verde** (ativo)

### 2️⃣ Capturando e Analisando

1. Abra qualquer aplicativo (navegador, sistema, etc.)
2. Pressione **`Ctrl+T`**
3. Aguarde o processamento:
   - 📸 Captura da tela
   - 📝 Extração de texto (OCR)
   - 🤖 Análise com IA
   - 💬 Exibição da resposta

## 🛠️ Desenvolvimento

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **npm** 9+
- **Git**

### Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd test-helper

# Instalar todas as dependências
npm install
```

### Scripts de Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
npm run dev

# Compilar apenas o backend (main process)
npm run build:main

# Compilar apenas o frontend (renderer)
npm run build:renderer

# Compilar tudo (ícones + main + renderer)
npm run build

# Gerar apenas os ícones
npm run build:icons
```

### Build de Produção

```bash
# Gerar instalador completo (NSIS)
npm run dist

# Gerar apenas o diretório (sem instalador)
npm run dist:dir

# Gerar versão portátil
npm run dist:portable
```

**Saída:** Os executáveis estarão em `release/`

## 📁 Estrutura do Projeto

```
Test Helper/
├── packages/
│   ├── main/                          # Backend (Processo Principal)
│   │   ├── src/
│   │   │   ├── index.ts              # Entry point
│   │   │   ├── preload.ts            # Ponte segura IPC
│   │   │   └── modules/
│   │   │       ├── AI.ts             # Integração OpenAI
│   │   │       ├── Capture.ts        # Captura de tela + OCR
│   │   │       ├── IPC.ts            # Comunicação entre processos
│   │   │       └── Tray.ts           # Bandeja do sistema
│   │   ├── assets/
│   │   │   └── icon.png              # Ícone do app
│   │   └── dist/                     # Build compilado
│   │
│   └── renderer/                      # Frontend (Interface)
│       ├── src/
│       │   ├── App.tsx               # Componente raiz
│       │   ├── main.tsx              # Entry point React
│       │   ├── @types/
│       │   │   └── electron.d.ts     # Tipagens TypeScript
│       │   └── pages/
│       │       ├── Settings.tsx      # Tela de configurações
│       │       └── Popup.tsx         # Popup de resposta
│       ├── index.html
│       ├── vite.config.ts
│       └── dist/                     # Build compilado
│
├── build/                             # Ícones gerados (auto)
├── release/                           # Executáveis gerados
│   ├── Test Helper Setup 1.0.0.exe   # Instalador
│   └── win-unpacked/                 # Versão portátil
├── electron-builder.yml              # Config do builder
├── package.json                      # Dependências raiz
└── README.md                         # Este arquivo
```

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build:main` | Compila backend (TypeScript → JavaScript) |
| `npm run build:renderer` | Compila frontend (React + Vite) |
| `npm run build:icons` | Gera ícones em múltiplos tamanhos |
| `npm run build` | Compila tudo (ícones + main + renderer) |
| `npm run dist` | Gera instalador NSIS completo |
| `npm run dist:dir` | Gera apenas diretório (sem instalador) |
| `npm run dist:portable` | Gera versão portátil |

## 🔧 Stack Tecnológico

### Core
- **Electron** `39.0.0` - Framework para aplicativos desktop multiplataforma
- **TypeScript** `5.6.0` - Tipagem estática e melhor DX
- **React** `18.2.0` - Biblioteca UI declarativa
- **Vite** `7.1.12` - Build tool ultrarrápido

### Backend (Main Process)
- **OpenAI** `4.0.0` - API de IA para análise de texto
- **Tesseract.js** `5.0.0` - OCR (reconhecimento óptico de caracteres)
- **active-win** `8.1.0` - Detecção de janela ativa
- **electron-store** `8.1.0` - Persistência local de dados
- **Jimp** `1.6.0` - Manipulação e processamento de imagens

### Frontend (Renderer Process)
- **React Router DOM** `6.20.0` - Roteamento entre páginas
- **Inline Styles** - CSS-in-JS para componentes

### Build & Deploy
- **electron-builder** `26.0.12` - Empacotamento e distribuição
- **Sharp** - Processamento de ícones
- **NSIS** - Instalador para Windows

## 🎨 Interface do Usuário

### Tela de Configurações
- 📸 **Captura de Tela** - Exibe o atalho Ctrl+T em destaque
- ⚡ **Status do App** - Toggle visual (verde/cinza) para ativar/desativar
- 🔑 **API Key** - Campo seguro com botão mostrar/ocultar
- 💾 **Salvar** - Feedback visual de sucesso/erro

### Popup de Resposta
- ⏳ **Loading** - Indicador durante processamento
- ✅ **Sucesso** - Exibe resposta da IA
- ❌ **Erro** - Mensagens de erro amigáveis

## 🔐 Segurança e Privacidade

- ✅ **Armazenamento Local** - API keys salvos apenas no seu computador
- ✅ **Context Isolation** - Processos isolados para segurança
- ✅ **No Telemetry** - Sem coleta de dados ou telemetria
- ✅ **Code Signing Disabled** - Para desenvolvimento (habilite em produção)
- ✅ **Sem Vulnerabilidades** - Execute `npm audit` para verificar

## 🐛 Solução de Problemas

### O atalho Ctrl+T não funciona
1. Verifique se o app está ativo (toggle verde nas configurações)
2. Certifique-se que o ícone está na bandeja do sistema
3. Reinicie o aplicativo

### Erro ao capturar tela
1. Verifique se a janela alvo está visível e não minimizada
2. Aguarde alguns segundos e tente novamente
3. Certifique-se que há texto visível na tela

### Erro ao processar com IA
1. Verifique sua chave da API OpenAI
2. Confirme que tem créditos disponíveis na sua conta
3. Teste sua conexão com a internet

### Erro ao instalar dependências
- Se encontrar erros com `active-win`, certifique-se de estar usando Node.js 18+
- Execute `npm install --legacy-peer-deps` se houver conflitos de dependências

### Erro ao gerar build
- Execute `npm run build` antes de `npm run dist`
- Certifique-se que o diretório `release/` não está em uso
- Feche todas as instâncias do app antes de buildar

## 📚 Documentação Adicional

- **[BLUEPRINT.md](BLUEPRINT.md)** - Arquitetura e design do sistema
- **[LICENSE](LICENSE)** - Licença MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Changelog

### v1.0.0 (2025-11-03)
- ✨ Lançamento inicial
- 🎯 Atalho global Ctrl+T
- 📸 Captura inteligente de tela
- 📝 OCR com Tesseract.js
- 🤖 Integração com OpenAI GPT
- 🎨 Interface moderna com React
- 💾 Persistência de configurações
- 🔒 Armazenamento seguro de API keys

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**Jordan Oliveira**

- 📧 Email: [seu-email@exemplo.com]
- 💼 LinkedIn: [seu-linkedin]
- 🐙 GitHub: [@seu-usuario]

---

<div align="center">

**Desenvolvido com ❤️ usando Electron + React + TypeScript**

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>

