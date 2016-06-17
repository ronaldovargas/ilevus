# ilevus

## Ambiente de Desenvolvimento

É utilizado o Visual Studio 2015. Após a instalação do Visual Studio 2015, no menu `Tools >> Extensions Manager` instale a extensão *NPM Task Runner*.

Instale o NodeJS em seu computador:
- https://nodejs.org/dist/v4.4.3/node-v4.4.3-x64.msi

Com isso, coloque o Node na variável PATH (caso o instalador não coloque automaticamente) e configure o Visual Studio
para usar o Node que foi instalado ao invés do Node builtin dele, pois este é uma versão muito antiga.
-1 No menu, ir em Tools >> Options.
-2 Nas opções, ir em Projects and Solutions >> External Web Tools.
-3 Selecione o item $(PATH) e aperte o botão com uma seta para cima até que este item seja o segundo na lista, logo abaixo de ".\node_modules\.bin".
-4 Reinicie o Visual Studio.
