# script to Tiny-launch polybar

#!/usr/bin/env bash

echo "---" | tee -a /tmp/polybar2.log
polybar bar1 >> /tmp/polybar2.log 2>&1
