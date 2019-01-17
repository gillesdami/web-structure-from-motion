#!/bin/sh
preference="-s DISABLE_EXCEPTION_CATCHING=0 -s EXTRA_EXPORTED_RUNTIME_METHODS=[\"FS\"]"
opts="--std=c++11 -s DEMANGLE_SUPPORT=1 -s MODULARIZE=1 --pre-js /home/pre-js.js ${preference}"
src="/home/openMVG/src/"
common_includes="-I${src} -I/home/eigen-git-mirror"

em++ -o main_SfMInit_ImageListing.js ${opts} ${common_includes} -s EXPORT_NAME="main_SfMInit_ImageListing" \
  ${src}software/SfM/main_SfMInit_ImageListing.cpp
em++ -o main_ComputeFeatures.js ${opts} ${common_includes} -s EXPORT_NAME="main_ComputeFeatures" \
  -I${src}dependencies/cereal/include/ \
  ${src}software/SfM/main_ComputeFeatures.cpp
em++ -o main_ComputeMatches.js ${opts} ${common_includes} -s EXPORT_NAME="main_ComputeMatches" \
  -I${src}dependencies/cereal/include/ -I${src}third_party/lemon/ \
  ${src}software/SfM/main_ComputeMatches.cpp
em++ -o main_IncrementalSfM.js ${opts} ${common_includes} -s EXPORT_NAME="main_IncrementalSfM" \
  ${src}software/SfM/main_IncrementalSfM.cpp
em++ -o main_GlobalSfM.js --std=c++11 ${opts} ${common_includes} -s EXPORT_NAME="main_GlobalSfM" \
  ${src}software/SfM/main_GlobalSfM.cpp
em++ -o main_ComputeSfM_DataColor.js ${opts} ${common_includes} -s EXPORT_NAME="main_ComputeSfM_DataColor" \
  ${src}software/SfM/main_ComputeSfM_DataColor.cpp
em++ -o main_ComputeStructureFromKnownPoses.js ${opts} ${common_includes} -s EXPORT_NAME="main_ComputeStructureFromKnownPoses" \
  ${src}software/SfM/main_ComputeStructureFromKnownPoses.cpp