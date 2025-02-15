#!/bin/bash

# Configuraciones de Seguridad 

#  Firewall

sudo apt update && sudo apt upgrade -y 

sudo apt install install ufw 

sudo ufw limit 22/tcp

sudo ufw default deny incoming
sudo ufw default allow outgoing


sudo ufw enable