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


echo "================================================== Backup Configs =================================================="

cp -p -f -r /home/nicolas/.config /media/nicolas/Almacen/01-Cloud/06-DebianDotFiles

echo "================================================== Analisis de Malware =================================================="

                           #   #!/bin/bash

                              # Solicita confirmación del usuario
                              #read -p "¿Está seguro que desea ejecutar 'clamscan' en el directorio /home? (y/n): " confirm

                              # Verifica la respuesta del usuario
                              #if [[ $confirm == "y" ]]; then
                                # Ejecuta el comando si el usuario confirma
                              #  sudo clamscan -r /home
                              #else
                              #  # Mensaje en caso de cancelación
                              # echo "Operación cancelada."
                              #fi


#!/bin/bash

# Solicita confirmación del usuario con tiempo de espera de 10 segundos
read -t 10 -p "¿Está seguro que desea ejecutar 'clamscan' en el directorio /home? (y/n): " confirm

# Verifica la respuesta del usuario
if [[ $confirm == "y" ]]; then
  # Ejecuta el comando si el usuario confirma
  sudo clamscan -r /home
else
  # Mensaje en caso de cancelación o tiempo de espera agotado
  echo "Operación cancelada o tiempo de espera agotado."
fi

#=========================================================#
echo ¨ ¨
echo ¨ ¨
echo ¨ ¨
echo "Ya podes cerrar la terminal"