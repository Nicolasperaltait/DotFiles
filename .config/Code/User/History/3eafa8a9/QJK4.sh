#!/bin/bash

# Paquetes necesarios: nala, clamav, clamav-daemon 


sudo nala update && sudo nala upgrade -y 


echo "================================================== LIMPIEZA =================================================="

sudo nala clean                                               # Elimina los paquetes ya no necesarios en el sistema.
sudo nala autoremove -y                                       # Elimina paquetes instalados automáticamente y que ya no son necesarios.
sudo nala autopurge -y                                        # Elimina también los archivos de configuración residuales.

#=========================================================#

echo "Actualizacion de DB ClamAV"

sudo systemctl stop clamav-freshclam                          # Detener el servicio de actualización de ClamAV
sudo freshclam                                                # Actualizar la base de datos de firmas de virus de ClamAV
sudo systemctl start clamav-freshclam                         # Iniciar de nuevo el servicio de actualización de ClamAV
sudo systemctl start clamav-daemon                            # Habilitar y iniciar el servicio de ClamAV

#=========================================================#

echo "ACTUALIZACION y LIMPIEZA FINALIZADA"