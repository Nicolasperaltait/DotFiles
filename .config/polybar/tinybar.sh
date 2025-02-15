#!/usr/bin/env bash



# Base 

#echo "---" | tee -a /tmp/polybar2.log
#polybar tray >> /tmp/polybar2.log 2>&1


# Nuevo 


echo "---" | tee -a /tmp/polybar2.log

# Inicia la barra en segundo plano y guarda su PID
polybar tray >> /tmp/polybar2.log 2>&1 &
BAR_PID=$!

# Espera 3 segundos
sleep 5

# Cierra la barra usando el PID almacenado
kill $BAR_PID
