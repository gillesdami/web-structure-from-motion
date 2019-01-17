JS_OPTIONS = -s MODULARIZE=1 -s EXPORT_NAME="$@" --pre-js /home/pre-js.js $(PREFERENCE) -s DISABLE_EXCEPTION_CATCHING=0 -s EXTRA_EXPORTED_RUNTIME_METHODS=["FS"]
BC_OPTIONS = --std=c++11

SRC_DIR = /home/openMVG/src
EIGEN_DIR = /home/eigen-git-mirror
BUILD_DIR = /home/openMVG/build_js
TMP_DIR = /tmp

COMMON_INCLUDES = -I$(SRC_DIR) -I$(EIGEN_DIR)

.PHONY: all

all: main_ComputeFeatures main_IncrementalSfM main_ComputeStructureFromKnownPoses main_ComputeMatches main_SfMInit_ImageListing main_GlobalSfM main_ComputeSfM_DataColor
	echo "todo"

main_ComputeFeatures:
	echo "todo"

main_IncrementalSfM:
	echo "todo"

main_ComputeStructureFromKnownPoses:
	echo "todo"

main_ComputeMatches:
	echo "todo"

main_SfMInit_ImageListing: sfm_data_utils exif_IO_EasyExif image_io
	em++ -o $@.js $(JS_OPTIONS) $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(SRC_DIR)/software/SfM/$@.cpp

main_GlobalSfM:
	echo "todo"

main_ComputeSfM_DataColor:
	echo "todo"

sfm_data_utils:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(SRC_DIR)/openMVG/sfm/$@.cpp

exif_IO_EasyExif:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(SRC_DIR)/openMVG/exif/$@.cpp

image_io: pnglibconf.h
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/png/ -I$(SRC_DIR)/third_party/tiff/ -I$(SRC_DIR)/third_party/jpeg/ $(SRC_DIR)/openMVG/image/$@.cpp

pnglibconf.h:
	mv $(SRC_DIR)/third_party/png/pnglibconf.h.prebuilt $(SRC_DIR)/third_party/png/pnglibconf.h

stlplus:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) -I$(SRC_DIR)/third_party/stlplus3/filesystemSimplified/ $(SRC_DIR)/third_party/stlplus3/filesystemSimplified/$@.cpp