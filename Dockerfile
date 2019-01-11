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
## optional valid that the project can be built (takes a while)
RUN cmake ../src/
RUN make
RUN rm -Rf /home/openMVG/build

# install eigen (may be avoidable but dunno how)
WORKDIR /home
RUN git clone https://github.com/eigenteam/eigen-git-mirror

# build openMVG-js (TODO must be improved, contribution is welcome)
WORKDIR /home/openMVG/build_js
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o SfMInit_ImageListing.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror ../src/software/SfM/SfMInit_ImageListing.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o main_ComputeFeatures.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror -I/home/openMVG/src/dependencies/cereal/include/ ../src/software/SfM/main_ComputeFeatures.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]

#TODO main_ComputeMatches
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o main_IncrementalSfM.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror ../src/software/SfM/main_IncrementalSfM.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o main_GlobalSfM.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror ../src/software/SfM/main_GlobalSfM.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o main_ComputeSfM_DataColor.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror ../src/software/SfM/main_ComputeSfM_DataColor.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]
RUN ["/bin/bash", "-c", "source /home/emsdk/emsdk_env.sh && em++ -o main_ComputeStructureFromKnownPoses.js --std=c++11 -I/home/openMVG/src/ -I/home/eigen-git-mirror ../src/software/SfM/main_ComputeStructureFromKnownPoses.cpp -s ERROR_ON_UNDEFINED_SYMBOLS=0"]
