# Assets do Main Process

Esta pasta contém os recursos estáticos utilizados pelo processo principal do Electron.

## Arquivos

### `icon.png`
- **Uso:** Ícone da bandeja do sistema (tray icon)
- **Tamanho:** 32x32 pixels
- **Formato:** PNG com transparência
- **Status:** Ícone temporário gerado automaticamente

## 🎨 Personalizando o Ícone

Para substituir o ícone temporário por um personalizado:

1. Crie ou obtenha um ícone PNG de 32x32 pixels
2. Substitua o arquivo `icon.png` nesta pasta
3. Recompile o projeto: `npm run build:main`
4. Reinicie o app: `npm run dev`

### Recomendações:

- **Tamanho:** 16x16, 32x32 ou 48x48 pixels
- **Formato:** PNG com fundo transparente
- **Cores:** Use cores que funcionem em temas claro e escuro
- **Simplicidade:** Ícones de bandeja devem ser simples e reconhecíveis

## 🔧 Referência no Código

O ícone é carregado em `packages/main/src/modules/Tray.ts`:

```typescript
this.tray = new Tray(path.join(__dirname, '../assets/icon.png'));
```

