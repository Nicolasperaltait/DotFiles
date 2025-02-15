#!/bin/bash
sudo apt update && sudo apt upgrade -y 

#                                                                           Configuraciones de Seguridad                                                                        #

#=======================================================================================#
#  Firewall 
sudo apt install install ufw                                                

# Puertos Especificos
sudo ufw limit 22/tcp                                                                       # Limita las coneccions por puerto 22 ssh 

# Reglas Generales
sudo ufw default deny incoming
sudo ufw default allow outgoing

#habilitacion
sudo ufw enable                                                                             # Habilitar UFW para gestionar el firewall
#=======================================================================================#


