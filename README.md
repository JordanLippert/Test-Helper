# 🤖 Test Helper - Assistente de Desktop IA

> Aplicativo desktop que captura sua tela, extrai texto via OCR e fornece respostas inteligentes usando IA.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/Electron-39.1.0-47848f)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Portable](https://img.shields.io/badge/instalador-portátil-brightgreen)

## ✨ Funcionalidades

- 📸 **Captura de Tela Inteligente**: Pressione `Ctrl+T` para capturar a janela ativa
- 🔍 **OCR Aprimorado**: Extração de texto em cores com contraste e normalização otimizados
- 🧠 **Parser Inteligente**: Identifica automaticamente perguntas numeradas e alternativas (NOVO!)
- 🎯 **Validação de Questões**: Verifica se o texto capturado é realmente uma questão antes de processar (NOVO!)
- 🤖 **Integração com OpenAI**: Respostas rápidas e precisas via GPT-4o-mini com prompt otimizado
- 🎨 **Interface Moderna**: UI estilo Slack com popups discretos
- ⚡ **Sistema de Tray**: Aplicativo roda na bandeja do sistema
- 🔐 **Seguro**: Armazenamento local criptografado da chave API
- 💰 **Econômico**: Modelo GPT-4o-mini (200x mais barato que GPT-4)
- 🛡️ **Controle Total**: Toggle para ativar/desativar e evitar consumo acidental
- 🚀 **Instalador Portável**: Build uma vez, funciona em qualquer máquina Windows (v1.1.0+)
- 📱 **Adaptativo**: Detecção automática de resolução e escala DPI (125%, 150%, 200%) para captura precisa
- 📝 **Logs Limpos**: Sistema de logging profissional sem caracteres especiais corrompidos

## 🏗️ Arquitetura

Este projeto é um **monorepo** organizado com workspaces npm:

```
test-helper-v3/
├── packages/
│   ├── main/              # Processo principal do Electron (Backend)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── preload.ts
│   │   │   └── modules/
│   │   │       ├── AI.ts          # Integração OpenAI
│   │   │       ├── Capture.ts     # Captura de tela e OCR
│   │   │       ├── TextParser.ts  # Parser inteligente de questões (NOVO!)
│   │   │       ├── IPC.ts         # Comunicação entre processos
│   │   │       └── Tray.ts        # Ícone da bandeja
│   │   └── assets/
│   │       └── icon.png
│   │
│   └── renderer/          # Interface React (Frontend)
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── pages/
│       │       ├── Settings.tsx  # Tela de configurações
│       │       └── Popup.tsx     # Popup de respostas
│       └── index.html
│
├── build/                 # Ícones para distribuição
├── package.json
├── electron-builder.yml
└── README.md
```

## 🚀 Instalação e Uso

### Pré-requisitos

- **Node.js** 18+ e **npm** 9+
- **Chave API da OpenAI** (obtenha em https://platform.openai.com/api-keys)

### Instalação

```bash
# Clone ou navegue até o diretório
cd Test-Helper-v3

# Instale as dependências
npm install
```

### Desenvolvimento

```bash
# Terminal 1: Inicie o servidor de desenvolvimento do renderer
cd packages/renderer
npm run dev

# Terminal 2: Compile o main e inicie o Electron
cd ../..
npm run dev
```

### Build para Produção

```bash
# Build completo (main + renderer)
npm run build

# Criar instalador (NSIS para Windows)
npm run dist

# Criar executável sem instalador (mais rápido para testes)
npm run dist:dir
```

**⏱️ Tempo de Build:** O processo `npm run dist` pode levar **3-5 minutos**. Durante o empacotamento, pode parecer travado na etapa de "packaging" - isso é normal! Aguarde até o processo completar.

**📦 Saída:**
- **Instalador:** `release/Test Helper Setup 1.2.0.exe` (instalador completo)
- **Portátil:** `release/win-unpacked/Test Helper.exe` (executável direto)

**🖥️ Após Instalação:** 
- O aplicativo aparecerá como um ícone na **bandeja do sistema** (system tray) no canto inferior direito da tela, próximo ao relógio
- Um atalho será criado automaticamente na **Área de Trabalho** para fácil acesso

## ⚙️ Configuração

### Primeira Execução

1. **Localize o ícone** na bandeja do sistema (canto inferior direito, próximo ao relógio) 🔵
2. **Clique com botão direito** no ícone → **Configurações**
3. **Insira sua Chave API** da OpenAI (obtenha em https://platform.openai.com/api-keys)
4. **Clique em Salvar**
5. **Pronto!** Pressione `Ctrl+T` em qualquer janela para capturar e analisar

### 🔐 Segurança da Chave API OpenAI

**Sua chave está 100% segura e privada!**

- ✅ **Armazenamento Local:** A chave é salva em `%APPDATA%\Test Helper\config.json` (fora do repositório)
- ✅ **Não Versionada:** Nunca será commitada no Git ou compartilhada
- ✅ **Por Usuário:** Cada máquina/usuário tem sua própria configuração isolada
- ✅ **Privacidade:** Apenas você tem acesso à sua chave
- ✅ **Portabilidade:** Ao clonar o repo ou instalar em outra máquina, você precisará configurar novamente

**Importante:** A chave é enviada **apenas** para a API oficial da OpenAI durante as consultas. Nunca é compartilhada com terceiros ou armazenada em nuvem.

## 🎯 Como Usar

1. **Abra qualquer aplicativo** com texto que deseja analisar
2. **Pressione `Ctrl+T`** (ou `Cmd+T` no macOS)
3. **Aguarde** - Popup de loading aparece no centro
4. **Receba a resposta** - Popup discreto no canto inferior direito (estilo Slack)
5. **Auto-fechamento** - Popup desaparece automaticamente após 5 segundos

### Exemplo de Uso

- 📚 Responder questões de testes e provas
- 📖 Explicar conceitos em PDFs e documentos
- 💻 Analisar código na tela
- 📝 Resumir textos longos
- 🎓 Auxiliar em estudos acadêmicos

### 💡 Dica de Economia
- O app usa **GPT-4o-mini** - 200x mais barato que GPT-4
- Desative o toggle quando não estiver usando para evitar capturas acidentais
- Cada captura custa aproximadamente $0.0001 (menos de 1 centavo)

## 🛠️ Tecnologias Utilizadas

### Backend (Main Process)
- **Electron** - Framework desktop multiplataforma
- **TypeScript** - Tipagem estática
- **OpenAI SDK** - Integração com GPT-4o-mini
- **Tesseract.js** - OCR em cores com suporte a múltiplos idiomas
- **Jimp** - Processamento de imagens (contraste, normalização)
- **TextParser** - Parser inteligente de questões (NOVO!)
- **active-win** - Detecção de janela ativa
- **electron-store** - Armazenamento persistente

### Frontend (Renderer Process)
- **React 18** - UI reativa
- **React Router** - Navegação entre páginas
- **Vite** - Build tool rápido
- **TypeScript** - Tipagem estática
- **Design System** - Estilo Slack com cores roxas (#3f1f47)

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o app em modo desenvolvimento
npm run build:main       # Compila apenas o processo principal
npm run build:renderer   # Compila apenas o renderer
npm run build            # Compila tudo

# Distribuição
npm run dist             # Cria instalador completo
npm run dist:dir         # Cria pasta com executável (sem instalador)
```

## 🆕 Novidades da Versão Atual

### Parser Inteligente de Questões

A versão atual inclui um **sistema avançado de parsing** que resolve o problema de captura de perguntas:

**Problema Resolvido:**
- ✅ Perguntas numeradas (1., 2., 3.) agora são identificadas automaticamente
- ✅ Alternativas (a, b, c, d, e) são extraídas e organizadas
- ✅ Validação garante que apenas questões válidas são processadas
- ✅ Texto é estruturado antes de enviar para a IA

**Como Funciona:**
1. OCR extrai o texto da tela
2. TextParser identifica a estrutura da questão
3. Texto é formatado de forma clara (QUESTÃO → PERGUNTA → ALTERNATIVAS)
4. IA recebe texto estruturado e responde com precisão

**Veja mais detalhes:** Consulte o arquivo `MELHORIAS-PARSER.md` para documentação completa.

## 🐛 Solução de Problemas

### Tela branca ao abrir Configurações

**Solução:** Este problema foi corrigido na v3! Os paths de carregamento do HTML agora estão corretos para produção.

```typescript
// Correção aplicada em Tray.ts e Capture.ts
if (app.isPackaged) {
  const htmlPath = path.join(process.resourcesPath, 'app.asar', 'packages', 'renderer', 'dist', 'index.html');
  window.loadFile(htmlPath, { hash: '/settings' });
} else {
  window.loadURL('http://localhost:5173/#/settings');
}
```

### Erro "Chave da API não configurada"

**Solução:** Abra as Configurações e insira uma chave válida da OpenAI.

### Captura não funciona ou captura apenas a barra de navegação

**Solução:** 
1. Verifique se o app está ativo (toggle nas Configurações)
2. Certifique-se de que há uma janela aberta e ativa
3. Tente pressionar `Ctrl+T` novamente
4. **Novo na v1.2.0:** O app agora detecta automaticamente:
   - O fator de escala do Windows (125%, 150%, 200%)
   - A resolução física real da captura
   - Ajusta os offsets dinamicamente para capturar o conteúdo correto
   - Funciona perfeitamente em notebooks com diferentes configurações de DPI

## 🔒 Segurança

- ✅ **Context Isolation** habilitado
- ✅ **Node Integration** desabilitado no renderer
- ✅ **Preload script** seguro com `contextBridge`
- ✅ **Chave API armazenada localmente** em `%APPDATA%\Test Helper\config.json` (não em código)
- ✅ **Sem acesso direto** ao sistema de arquivos pelo renderer
- ✅ **Dados não versionados** - Configurações nunca vão para o Git
- ✅ **Isolamento por usuário** - Cada instalação tem suas próprias configurações

## 📝 Licença

MIT © Jordan Oliveira

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feat/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feat/nova-feature`)
5. Abrir um Pull Request

## 📞 Suporte

Se encontrar problemas ou tiver sugestões:

1. Verifique a seção de **Solução de Problemas**
2. Abra uma **Issue** no repositório
3. Entre em contato com o desenvolvedor

---

**Desenvolvido com ❤️ usando Electron + React + OpenAI**

