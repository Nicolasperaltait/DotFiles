#!/bin/bash

# 1. Pendiente de documentacion de que hace cada paquete instalado o para que es 

#=======================================================================================#
## Instalacion Genesis Basicos e importates para el sistema. 

setxkbmap 'us(intl)'                                                                                                 # Teclado en Ingles Internacional con teclas muerta (AltGR)

sudo apt update && sudo apt upgrade && sudo apt install nala                                                         # Actualizacion inicial 

sudo nala fetch --auto -y                                                                                            # Examina los servidores espejo y setea los 3 primeros por defecto. 

sudo nala install xorg i3 i3lock i3status i3lock-fancy lxpolkit ntfs-3g dunst suckless-tools linux-headers-amd64 -y  # Esenciales para i3

sudo nala install wget curl ufw zsh htop preload kitty xrandr rofi compton font-manager lxappearance -y              # Instala Paquetes basicos.

sudo nala install feh lxappearance numlockx pulseaudio-utils pavucontrol arc-theme papirus-icon-theme -y     

# sacado de https://geekland.eu/instalar-configurar-y-usar-el-gestor-de-ventanas-i3-en-linux/

#=======================================================================================#

## Gestion de Audio y Sonido 

sudo apt install pipewire-alsa pipewire-jack pipewire-audio wireplumber pipewire-pulse libspa-0.2-bluetooth alsa-utils -y 

## La parte Bluethooth no es compatible todavia con el modulo de i3bloks 

#sudo nala install pulseaudio-module-bluetooth                                                                           # Necesario para el funcionamiento
#sudo nala install blueman                                                                                               # Gestor GUI


#=======================================================================================#

# Configuraciones basicas de seguridad.
echo "================== Firewall configuration =================="

sudo ufw enable                                                                            # Habilitar UFW para gestionar el firewall
sudo ufw default deny incoming                                                             # Configurar el firewall para denegar todas las conexiones entrantes por defecto
sudo ufw default allow outgoing                                                            # Configurar el firewall para permitir todas las conexiones salientes por defecto

#=======================================================================================#

echo "================== Anti-Virus configuration =================="

sudo nala install clamav -y && sudo nala install clamav-daemon -y
sudo systemctl stop clamav-freshclam                                                       # Detener el servicio de actualización de ClamAV
sudo freshclam                                                                             # Actualizar la base de datos de firmas de virus de ClamAV
sudo systemctl start clamav-freshclam                                                      # Iniciar de nuevo el servicio de actualización de ClamAV
sudo systemctl start clamav-daemon                                                         # Habilitar y iniciar el servicio de ClamAV
#=======================================================================================#

echo "Basic configuration done"

# ver documentacion nvidia driver  // https://wiki.debian.org/NvidiaGraphicsDrivers 


#=======================================================================================#