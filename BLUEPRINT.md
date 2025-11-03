# 📝 Blueprint do Projeto: Test Helper (Assistente de IA Desktop)

**Versão:** 1.0
**Arquiteto:** Gemini

---

## 1. Visão Geral da Arquitetura

Este projeto será um aplicativo de desktop multiplataforma (foco no Windows) construído com **Electron**. Ele funcionará como um **monorepo** para gerenciar de forma limpa as diferentes partes do sistema.

A arquitetura do Electron é dividida em dois processos principais, que trataremos como pacotes separados no monorepo:

1.  **`main` (Processo Principal):** O "backend" em Node.js. É invisível para o usuário. Ele lida com toda a lógica pesada: atalhos de teclado, captura de tela, OCR, chamadas de IA e gerenciamento de janelas.
2.  **`renderer` (Processo de Renderização):** O "frontend" em React/TS. É a interface gráfica que o usuário vê (a janela de Configurações e os pop-ups de resposta/loading).
3.  **`preload` (Ponte de Segurança):** Um script especial do Electron que atua como uma ponte segura entre o `main` (Node.js) e o `renderer` (React), expondo seletivamente funções de backend para o frontend.

## 2. Estrutura do Monorepo

Usaremos **workspaces npm** para gerenciar o monorepo.

/test-helper-monorepo
├── package.json                 # package.json "raiz"
├── packages/
│   ├── main/                    # Pacote do Processo Principal (Backend)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── modules/
│   │   │   │   ├── Capture.ts
│   │   │   │   ├── AI.ts
│   │   │   │   ├── Tray.ts
│   │   │   │   └── IPC.ts
│   │   │   └── preload.ts
│   │   └── package.json
│   │
│   └── renderer/                # Pacote do Processo de Renderização (Frontend)
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── pages/
│       │   │   ├── Settings.tsx
│       │   │   └── Popup.tsx
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
│
└── electron-builder.yml


## 3. Stack de Tecnologia e Dependências Chave

### 3.1. Raiz (`/package.json`)

* `devDependencies`: `electron`, `electron-builder`, `vite`, `typescript`, `@electron-vite/plugin`
* **Configuração:**
    ```json
    {
      "name": "test-helper-monorepo",
      "private": true,
      "workspaces": [
        "packages/main",
        "packages/renderer"
      ],
      "scripts": {
        "start": "electron-vite dev -w",
        "build": "electron-vite build",
        "dist": "npm run build && electron-builder"
      }
    }
    ```

### 3.2. Pacote `main` (`/packages/main/package.json`)

* `dependencies`:
    * `openai`: Para a API do GPT.
    * `tesseract.js`: Para o OCR.
    * `active-win`: Para obter os limites da janela ativa.
    * `electron-store`: Para salvar a API key.
    * `jimp`: Para cortar a imagem capturada.

### 3.3. Pacote `renderer` (`/packages/renderer/package.json`)

* `dependencies`:
    * `react`: UI.
    * `react-dom`: UI.
    * `react-router-dom`: Para as rotas `/settings` e `/popup`.

## 4. Detalhamento dos Módulos e Classes (Backend)

### 4.1. Pacote `main` (Backend)

#### `src/index.ts` (Ponto de Entrada)

* **Responsabilidade:** Orquestrar o aplicativo. Inicia o Electron, cria a janela principal (oculta), registra o `Tray` e o `globalShortcut`.
* **Lógica:**
    1.  Importar `TrayModule` de `./modules/Tray`.
    2.  Importar `CaptureModule` de `./modules/Capture`.
    3.  Importar `IPCModule` de `./modules/IPC`.
    4.  No `app.on('ready')`:
        * `TrayModule.createTray()` (que por sua vez cria a janela de `Settings` quando clicado).
        * `IPCModule.registerHandlers()`.
        * `globalShortcut.register('CommandOrControl+T', CaptureModule.handleCapture)`.

#### `src/modules/Tray.ts`

* **Responsabilidade:** Gerenciar o ícone da bandeja do sistema.
* **Funções:**
    * `createTray()`: Cria um `new Tray` e um `Menu` com "Configurações" e "Sair".
    * `createSettingsWindow()`: Cria uma `new BrowserWindow` e carrega a rota `/settings` do React.

#### `src/modules/Capture.ts`

* **Responsabilidade:** O fluxo de trabalho principal de captura e OCR.
* **Função:** `async handleCapture()`:
    1.  Obter Janela Ativa: `const windowBounds = await activeWindow();` (Usando `active-win`).
    2.  Calcular Retângulo: Calcular o `captureRect` com base em `windowBounds` (12% topo, 1.5% lados, 4% baixo).
    3.  Criar Pop-up de Loading: Chamar uma função `createPopup()` (que cria uma `BrowserWindow` pequena) e carregar a rota `/popup`.
    4.  Capturar Tela: Usar `desktopCapturer` e `jimp` para cortar a imagem usando o `captureRect`.
    5.  Executar OCR: `const { data: { text } } = await Tesseract.recognize(imageBuffer, 'por');`
    6.  Chamar IA: `const answer = await AIModule.getAnswer(text);`
    7.  Enviar Resposta: Enviar evento IPC de sucesso (ou erro) para o pop-up.

#### `src/modules/AI.ts`

* **Responsabilidade:** Interface com a API OpenAI.
* **Função:** `async getAnswer(ocrText)`:
    1.  Carregar a API key do `electron-store`.
    2.  Construir o prompt robusto.
    3.  Fazer a chamada `openai.chat.completions.create(...)`.
    4.  Retornar `completion.choices[0].message.content`.

#### `src/modules/IPC.ts`

* **Responsabilidade:** Definir todos os "ouvintes" do `ipcMain`.
* **Função:** `registerHandlers()`:
    * `ipcMain.handle('save-api-key', ...)`
    * `ipcMain.handle('get-api-key', ...)`

#### `src/preload.ts` (A Ponte)

* **Responsabilidade:** Expor com segurança as funções IPC para o React.
* **Código:**
    ```typescript
    import { contextBridge, ipcRenderer } from 'electron';

    contextBridge.exposeInMainWorld('electronAPI', {
      // Funções Renderer -> Main (Invocam)
      saveKey: (key: string) => ipcRenderer.invoke('save-api-key', key),
      getKey: () => ipcRenderer.invoke('get-api-key'),
      
      // Funções Main -> Renderer (Ouvem)
      onShowResponse: (callback: (data: { status: 'success' | 'error', message: string }) => void) => {
        ipcRenderer.on('show-response', (event, data) => callback(data));
      }
    });
    ```