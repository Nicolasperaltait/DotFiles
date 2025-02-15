#!/bin/bash
#======================================================================================================================================#

# Es necesario tener instalado curl y zsh para poder descargar ohmyzsh.

#======================================================================================================================================#

sudo nala install curl zsh -y                                                                                                      # Instalamos curl y zsh 

mkdir -p /usr/share/fonts/ttf && cd / && cd /home/nicolas/Debian12/Fonts-ttf/ && sudo cp *.ttf /usr/share/fonts/ttf && fc-cache -f -v          # Instalar fuentes // las movemos del repo al sistema // actualizamos el cache 

#======================================================================================================================================#
echo "=== Descargando ohmyzsh - Esto puede tardar varios minutos ===="

if echo "y" | sudo sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"; then               # Descarga e instalación de Oh My Zsh
    echo "Oh My Zsh instalado con éxito"
else
    echo "Error al instalar Oh My Zsh" >&2
    exit 1
fi 

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

#======================================================================================================================================#

if git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting; then 
    echo "Plugin zsh-syntax-highlighting descargado con éxito"
else
    echo "Error al descargar el plugin zsh-syntax-highlighting" >&2                                                                    # Descargamos el plugin de sintaxis
    exit 1
fi


if git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions; then     # Descargamos el plugin de sugerencias
    echo "Plugin zsh-autosuggestions descargado con éxito"
else
    echo "Error al descargar el plugin zsh-autosuggestions" >&2
    exit 1
fi

#======================================================================================================================================#


if sudo cp -a -f /home/nicolas/debian12/Dotfiles/.zshrc /home/nicolas/; then                                                           # Copiamos el archivo .zshrc personalizado
    echo ".zshrc personalizado copiado con éxito"
else
    echo "Error al copiar el archivo .zshrc" >&2
    exit 1
fi

echo "Fin de la instalación de ohmyzsh y configuración de Zsh"
