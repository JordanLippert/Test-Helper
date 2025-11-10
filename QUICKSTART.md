# 🚀 Quick Start - Test Helper v3

## Instalação Rápida

```bash
# 1. Navegue até o diretório
cd Test-Helper-v3

# 2. Instale as dependências
npm install
```

## Desenvolvimento

### Opção 1: Modo Completo (Recomendado)

```bash
# Terminal 1: Inicie o servidor Vite
cd packages/renderer
npm run dev

# Terminal 2: Inicie o Electron
cd ../..
npm run dev
```

### Opção 2: Build e Execute

```bash
npm run build
npm run dev
```

## Primeira Configuração

1. **Inicie o app** com `npm run dev`
2. **Localize o ícone** 🔵 na bandeja do sistema (canto inferior direito, próximo ao relógio)
3. **Clique com botão direito** no ícone
4. **Selecione "Configurações"**
5. **Insira sua chave OpenAI** (obtenha em https://platform.openai.com/api-keys)
6. **Clique em "Salvar"**
7. **Teste**: Abra qualquer janela e pressione `Ctrl+T`

### 🔐 Sua Chave API está Segura!

- ✅ Salva localmente em `%APPDATA%\Test Helper\config.json`
- ✅ Nunca vai para o Git ou será compartilhada
- ✅ Cada máquina tem sua própria configuração privada

## Build para Produção

```bash
# Build completo
npm run build

# Criar instalador (demora 3-5 minutos)
npm run dist

# Ou apenas o executável (mais rápido)
npm run dist:dir
```

**⏱️ Importante:** O `npm run dist` pode demorar 3-5 minutos e vai parecer travado na etapa de "packaging" - **não cancele!** Isso é normal.

**📦 Saída:**
- Instalador: `release/Test Helper Setup 1.0.1.exe`
- Portátil: `release/win-unpacked/Test Helper.exe`

**🖥️ Após instalar:** O app aparece como ícone 🔵 na bandeja do sistema (canto inferior direito).

## Problemas Comuns

### "Cannot find module"
```bash
# Reinstale as dependências
rm -rf node_modules
npm install
```

### Servidor Vite não inicia
```bash
# Verifique se a porta 5173 está livre
cd packages/renderer
npm run dev
```

### Erro de build
```bash
# Limpe e reconstrua
npm run build:main
npm run build:renderer
```

## Estrutura de Comandos

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala todas as dependências |
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` | Compila main + renderer |
| `npm run build:main` | Compila apenas o backend |
| `npm run build:renderer` | Compila apenas o frontend |
| `npm run dist` | Cria instalador completo |
| `npm run dist:dir` | Cria pasta com executável |

## Próximos Passos

- 📖 Leia o [README.md](README.md) completo
- 🏗️ Veja a arquitetura no [BLUEPRINT.md](BLUEPRINT.md)
- 🐛 Reporte bugs ou sugira melhorias

---

**Pronto para usar!** 🎉

