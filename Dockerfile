FROM ubuntu:18.04

# install required tools
RUN apt-get update && apt-get install -y \
    git \
    cmake \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    libxxf86vm1 \
    libxxf86vm-dev \
    libxi-dev \
    libxrandr-dev \
    python-dev \  
    python-pip \
    python-minimal \
    nodejs \
    default-jre

# install emscripten
WORKDIR /home
RUN git clone https://github.com/emscripten-core/emsdk.git
WORKDIR /home/emsdk
RUN git checkout ea5d631
RUN ./emsdk install latest
RUN ./emsdk activate latest

# install openMVG
WORKDIR /home
RUN git clone https://github.com/openMVG/openMVG.git --branch v1.4
WORKDIR /home/openMVG
RUN git submodule update -i

# install eigen
WORKDIR /home
RUN git clone https://github.com/eigenteam/eigen-git-mirror --branch 3.3.7

# build openMVG-js
WORKDIR /home/openMVG/build_js
COPY src/pre-js.js /home/pre-js.js
COPY src/Makefile /home/Makefile
COPY src/tif_config.h /home/openMVG/src/third_party/tiff/tif_config.h
COPY src/jconfig.h /home/openMVG/src/third_party/jpeg/jconfig.h

ENTRYPOINT ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && make -f /home/Makefile"]