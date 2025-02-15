#!/bin/bash

#=======================================================================================#

# Actualizacion e Instalacion de paquetes basicos.

sudo apt update && sudo apt upgrade -y && sudo apt install nala -y                      
sudo nala fetch --auto -y &&                                                               # Examina los servidores espejo y setea los 3 primeros por defecto. 
sudo nala install wget curl ufw font-manager zsh htop preload kitty -y &&                  # Instala Paquetes basicos.
sudo apt install xfce4 xfce4-goodies xorg dbus-x11 x11-xserver-utils -y &&                 # Instala el entorno de escritorio XFCE4 necesario para conectarse por RDP.
sudo apt install linux-headers-amd64 -y

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

#test

