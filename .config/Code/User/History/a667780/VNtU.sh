#!/bin/bash

sudo apt update && sudo apt upgrade -y
sudo apt-get install software-properties-common -y && sudo apt-add-repository contrib -y                        # Agregamos Contrib Repo

setxkbmap 'us(intl)'                                                                                            # Teclado en Ingles Internacional con teclas muerta (AltGR)
## Instalaciones 

sudo apt install nala -y && sudo nala fetch --auto -y                                                           # Examina los servidores espejo y setea los 3 primeros por defecto.
                                                          
sudo nala install xorg i3 i3status lxpolkit ntfs-3g dunst suckless-tools linux-headers-amd64 xfce4-session -y   # Esenciales para i3

sudo nala install git wget curl zsh htop preload kitty flameshot xrandr rofi compton font-manager lxappearance timeshift -y     

sudo nala install feh lxappearance numlockx arc-theme gammy solaar thunar gnome-calculator gnome-calendar obs-studio copyQ -y  #papirus-icon-theme // copyQ = clipbord manager // solaar = Control de mouse para el MX3          

## Gestion de Audio y Sonido 

sudo apt install pulseaudio-utils pavucontrol pulseaudio-module-bluetooth blueman pipewire-alsa pipewire-jack pipewire-audio wireplumber pipewire-pulse libspa-0.2-bluetooth -y # https://wiki.debian.org/PipeWire

echo 
echo "================== Basic configuration done =================="