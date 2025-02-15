#!/bin/bash
sudo apt update && sudo apt upgrade -y 

#                                                                           Configuraciones de Seguridad                                                                        #

#=======================================================================================#
#  Firewall 
echo "================== Firewall Configuration =================="

sudo apt install install ufw                                                

# Puertos Especificos
sudo ufw limit 22/tcp                                                                       # Limita las coneccions por puerto 22 ssh 

# Reglas Generales
sudo ufw default deny incoming
sudo ufw default allow outgoing

#habilitacion
sudo ufw enable                                                                             # Habilitar UFW para gestionar el firewall

#=======================================================================================#
# Anti Virus
echo "================== AV Configuration =================="

sudo nala install clamav -y && sudo nala install clamav-daemon -y

sudo systemctl stop clamav-freshclam                                                       # Detener el servicio de actualización de ClamAV
sudo freshclam                                                                             # Actualizar la base de datos de firmas de virus de ClamAV
sudo systemctl start clamav-freshclam                                                      # Iniciar de nuevo el servicio de actualización de ClamAV
sudo systemctl start clamav-daemon                                                         # Habilitar y iniciar el servicio de ClamAV

#=======================================================================================#