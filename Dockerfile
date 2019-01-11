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
RUN git clone https://github.com/juj/emsdk.git
WORKDIR /home/emsdk
RUN ./emsdk install latest
RUN ./emsdk activate latest

# install openMVG
WORKDIR /home
RUN git clone https://github.com/openMVG/openMVG.git
COPY CMakeLists.txt /home/openMVG/src/CMakeLists.txt
WORKDIR /home/openMVG
RUN git submodule update -i
WORKDIR /home/openMVG/build
## optional valid that the project can be build (takes a while)
RUN cmake ../src/
RUN make
RUN rm -Rf /home/openMVG/build

# install EIGEN (may be avoidable but dunno how)
WORKDIR /home
RUN git clone https://github.com/eigenteam/eigen-git-mirror

# build openMVG-js
WORKDIR /home/openMVG/build_js
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o out.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror ../src/software/SfM/main_GlobalSfM.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]