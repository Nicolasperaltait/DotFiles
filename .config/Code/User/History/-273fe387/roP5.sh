sudo mkdir github && cd github &&
git clone https://github.com/vivien/i3blocks
cd i3blocks
./autogen.sh
./configure
make
make install