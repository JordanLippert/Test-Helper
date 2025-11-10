# 📦 Guia de Instalação - Test Helper v3

## 🎯 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ **Node.js** versão 18 ou superior
- ✅ **npm** versão 9 ou superior
- ✅ **Chave API da OpenAI** (obtenha em https://platform.openai.com/api-keys)
- ✅ **Windows 10/11** (testado) ou macOS/Linux

### Verificar Versões

```bash
node --version   # Deve ser v18 ou superior
npm --version    # Deve ser v9 ou superior
```

Se não tiver Node.js instalado, baixe em: https://nodejs.org/

## 🚀 Instalação Passo a Passo

### 1. Navegue até o Diretório

```bash
cd "C:\Users\Jordan Oliveira\Downloads\Test-Helper-v3"
```

### 2. Instale as Dependências

```bash
npm install
```

Este comando irá:
- Instalar dependências da raiz
- Instalar dependências de `packages/main`
- Instalar dependências de `packages/renderer`
- Configurar os workspaces

**Tempo estimado:** 2-5 minutos (dependendo da conexão)

### 3. Verifique a Instalação

```bash
# Verificar se os node_modules foram criados
dir node_modules
dir packages\main\node_modules
dir packages\renderer\node_modules
```

## 🛠️ Desenvolvimento

### Opção A: Modo Completo (Recomendado)

Abra **dois terminais**:

**Terminal 1 - Servidor Vite:**
```bash
cd packages\renderer
npm run dev
```

Aguarde até ver:
```
VITE v6.0.5  ready in XXX ms

➜  Local:   http://localhost:5173/
```

**Terminal 2 - Electron:**
```bash
npm run dev
```

O aplicativo deve abrir automaticamente!

### Opção B: Build e Execute

```bash
# Compile tudo primeiro
npm run build

# Execute
npm run dev
```

## 🎨 Primeira Configuração

1. **Localize o ícone** 🔵 na bandeja do sistema (canto inferior direito, próximo ao relógio)
2. **Clique com botão direito** no ícone
3. **Selecione "Configurações"**
4. **Insira sua chave OpenAI** no campo "Chave API" (obtenha em https://platform.openai.com/api-keys)
5. **Clique em "Salvar"**
6. **Teste**: Abra qualquer janela e pressione `Ctrl+T`

### 🔐 Sobre a Segurança da sua Chave API

**Sua chave OpenAI está 100% segura!**

- ✅ **Armazenamento Local:** Salva em `%APPDATA%\Test Helper\config.json`
- ✅ **Não vai para o Git:** O arquivo de configuração está fora do repositório
- ✅ **Privada por usuário:** Cada máquina tem sua própria configuração
- ✅ **Não é compartilhada:** Apenas você tem acesso à sua chave
- ✅ **Portabilidade segura:** Ao instalar em outra máquina, precisará configurar novamente

**Importante:** Mesmo que você compartilhe o código ou o instalador, sua chave API permanece privada no seu computador!

## 📦 Build para Produção

### Build Completo

```bash
npm run build
```

Este comando:
- ✅ Compila TypeScript do `main` para JavaScript
- ✅ Copia assets (ícones)
- ✅ Compila React do `renderer` com Vite
- ✅ Otimiza e minifica o código

### Criar Instalador

```bash
npm run dist
```

Este comando:
- ✅ Executa o build completo
- ✅ Empacota com electron-builder
- ✅ Cria instalador NSIS para Windows

**⏱️ Tempo estimado:** 3-5 minutos

**⚠️ IMPORTANTE:** Durante o processo, pode parecer travado na etapa de "packaging" - **isso é normal!** O electron-builder está:
- Copiando arquivos do Electron
- Criando o arquivo app.asar
- Desempacotando assets necessários
- Gerando o instalador NSIS

**NÃO cancele o processo!** Aguarde até aparecer mensagens como:
- `• building        target=nsis`
- `• building block map`

**📦 Saída:** 
- **Instalador:** `release\Test Helper Setup 1.0.1.exe` (instalador completo)
- **Portátil:** `release\win-unpacked\Test Helper.exe` (executável direto)

**🖥️ Após Instalação:** O app aparecerá como um ícone 🔵 na **bandeja do sistema** (system tray) no canto inferior direito da tela.

### Criar Executável Sem Instalador (Mais Rápido)

```bash
npm run dist:dir
```

**Saída:** `release\win-unpacked\Test Helper.exe`

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

```bash
# Limpe e reinstale
rmdir /s /q node_modules
rmdir /s /q packages\main\node_modules
rmdir /s /q packages\renderer\node_modules
npm install
```

### Erro: "Port 5173 is already in use"

```bash
# Encontre o processo usando a porta
netstat -ano | findstr :5173

# Mate o processo (substitua XXXX pelo PID)
taskkill /PID XXXX /F

# Ou use outra porta editando packages/renderer/vite.config.ts
```

### Erro: "electron: command not found"

```bash
# Reinstale o Electron
npm install electron --save-dev
```

### Tela Branca ao Abrir Configurações

**Isso NÃO deve acontecer na v3!** Se acontecer:

1. Verifique se você está usando a v3 (não v1 ou v2)
2. Verifique se o build foi feito corretamente:
   ```bash
   npm run build
   npm run dist
   ```
3. Verifique os logs do console do Electron

### Build Falha

```bash
# Limpe tudo e reconstrua
rmdir /s /q dist
rmdir /s /q packages\main\dist
rmdir /s /q packages\renderer\dist
rmdir /s /q release

npm run build
```

### Erro de Permissão no Windows

Execute o terminal como **Administrador** e tente novamente.

## 📊 Verificação de Instalação

Execute este checklist:

```bash
# 1. Dependências instaladas?
dir node_modules

# 2. Build do main funciona?
npm run build:main
dir packages\main\dist

# 3. Build do renderer funciona?
npm run build:renderer
dir packages\renderer\dist

# 4. Electron inicia?
npm run dev
```

Se todos os comandos funcionarem, está tudo OK! ✅

## 🔧 Comandos Úteis

### Limpeza

```bash
# Limpar builds
rmdir /s /q packages\main\dist
rmdir /s /q packages\renderer\dist
rmdir /s /q release

# Limpar dependências
rmdir /s /q node_modules
```

### Rebuild Completo

```bash
# Limpar tudo
rmdir /s /q node_modules packages\main\dist packages\renderer\dist release

# Reinstalar e rebuildar
npm install
npm run build
npm run dist
```

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. 📖 Leia o [README.md](README.md) para entender o projeto
2. 🏗️ Veja o [BLUEPRINT.md](BLUEPRINT.md) para arquitetura
3. 🚀 Siga o [QUICKSTART.md](QUICKSTART.md) para uso rápido
4. 📋 Confira o [CHANGELOG.md](CHANGELOG.md) para histórico

## 🆘 Suporte

Se encontrar problemas:

1. ✅ Verifique esta seção de "Solução de Problemas"
2. ✅ Leia o README.md
3. ✅ Verifique os logs do console
4. ✅ Entre em contato com o desenvolvedor

## ✅ Checklist Final

Antes de considerar a instalação completa, verifique:

- [ ] Node.js 18+ instalado
- [ ] `npm install` executado sem erros
- [ ] `npm run dev` inicia o app
- [ ] Ícone aparece na bandeja do sistema
- [ ] Configurações abre sem tela branca
- [ ] Chave OpenAI pode ser salva
- [ ] `Ctrl+T` captura a tela
- [ ] Popup de resposta aparece
- [ ] `npm run dist` cria o executável

Se todos os itens estiverem marcados: **PARABÉNS! 🎉**

---

**Instalação Completa!** Agora você está pronto para usar o Test Helper v3.

