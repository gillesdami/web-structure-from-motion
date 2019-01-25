# Warning: black magic, need a refactor

CONFIG_DIR = /home
SRC_DIR = /home/openMVG/src
EIGEN_DIR = /home/eigen-git-mirror
LEMON_DIR = $(SRC_DIR)/third_party/lemon
OSI_CLP_DIR = $(SRC_DIR)/dependencies/osi_clp
TMP_DIR = /tmp

JS_OPTIONS = -s MODULARIZE=1 -s EXPORT_NAME="$@" --pre-js $(CONFIG_DIR)/pre-js.js $(PREFERENCE) -s DISABLE_EXCEPTION_CATCHING=0 -s EXTRA_EXPORTED_RUNTIME_METHODS=["FS"]
BC_OPTIONS = --std=c++11

COMMON_INCLUDES = -I$(SRC_DIR) -I$(EIGEN_DIR) -I$(SRC_DIR)/dependencies/cereal/include/

JPEGLIB_SRC = jmemnobs.c jaricom.c jcapimin.c jcapistd.c jcarith.c jccoefct.c jccolor.c jcdctmgr.c jchuff.c jcinit.c jcmainct.c jcmarker.c jcmaster.c jcomapi.c jcparam.c jcprepct.c jcsample.c jctrans.c jdapimin.c jdapistd.c jdarith.c jdatadst.c jdatasrc.c jdcoefct.c jdcolor.c jddctmgr.c jdhuff.c jdinput.c jdmainct.c jdmarker.c jdmaster.c jdmerge.c jdpostct.c jdsample.c jdtrans.c jerror.c jfdctflt.c jfdctfst.c jfdctint.c jidctflt.c jidctfst.c jidctint.c jquant1.c jquant2.c jutils.c jmemmgr.c

.PHONY: all

all: main_ComputeFeatures main_ComputeMatches main_SfMInit_ImageListing main_GlobalSfM
	em++ -o wsfm.js $(JS_OPTIONS) -o3 $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(CONFIG_DIR)/wsfm.cpp -I$(CONFIG_DIR)

main_ComputeFeatures: stlplus sift image zlib features system cereal
	sed -i 's/int main/int main_ComputeFeatures/' $(SRC_DIR)/software/SfM/$@.cpp
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) -DVL_DISABLE_SSE2 $(COMMON_INCLUDES) $(SRC_DIR)/openMVG/sfm/sfm_data_io.cpp $(SRC_DIR)/openMVG/sfm/sfm_data_io_cereal.cpp $(SRC_DIR)/openMVG/sfm/sfm_data_utils.cpp $(patsubst %, $(TMP_DIR)/%.bc, $?) $(SRC_DIR)/software/SfM/$@.cpp

#main_IncrementalSfM:
#	echo "todo"

#main_ComputeStructureFromKnownPoses:
#	echo "todo"

main_ComputeMatches: lemon stlplus features system cereal multiview ceres matching_image_collection numeric matching
	sed -i 's/int main/int main_ComputeMatches/' $(SRC_DIR)/software/SfM/$@.cpp
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/lemon/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(SRC_DIR)/openMVG/sfm/sfm_data_io.cpp $(SRC_DIR)/openMVG/sfm/sfm_data_io_cereal.cpp $(SRC_DIR)/openMVG/sfm/sfm_data_utils.cpp $(TMP_DIR)/cereal.bc $(SRC_DIR)/software/SfM/$@.cpp

main_SfMInit_ImageListing: exif_IO_EasyExif image_io zlib stlplus easyexif cereal
	sed -i 's/int main/int main_SfMInit_ImageListing/' $(SRC_DIR)/software/SfM/$@.cpp
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(SRC_DIR)/openMVG/sfm/sfm_data_io.cpp $(SRC_DIR)/software/SfM/$@.cpp $(SRC_DIR)/openMVG/sfm/sfm_data_io_cereal.cpp $(SRC_DIR)/openMVG/sfm/sfm_data_utils.cpp

main_GlobalSfM: stlplus pipelines_global features system sfm geometry linearProgramming multiview numeric cxsparse
	sed -i 's/int main/int main_GlobalSfM/' $(SRC_DIR)/software/SfM/$@.cpp
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(SRC_DIR)/software/SfM/$@.cpp $(OSI_CLP_DIR)/Clp/src/liblib_clp.a $(OSI_CLP_DIR)/Clp/src/OsiClp/liblib_OsiClpSolver.a $(OSI_CLP_DIR)/Osi/src/Osi/liblib_Osi.a $(OSI_CLP_DIR)/CoinUtils/src/liblib_CoinUtils.a $(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/glog/logging.cc -I$(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/ -I$(SRC_DIR)/third_party/ceres-solver/include/ -I$(SRC_DIR)/third_party/ceres-solver/config/ $(SRC_DIR)/openMVG/matching/indMatch_utils.cpp $(SRC_DIR)/third_party/ceres-solver/lib/libopenMVG_ceres.a -I$(EIGEN_DIR) -I$(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/ -I../src/third_party/ceres-solver/internal/ -I$(SRC_DIR)/third_party/ceres-solver/include/ 

pipelines_global: lemon ceres
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(filter-out $(wildcard $(SRC_DIR)/openMVG/sfm/pipelines/global/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/sfm/pipelines/global/*.cpp)) $(SRC_DIR)/openMVG/sfm/pipelines/relative_pose_engine.cpp $(SRC_DIR)/openMVG/sfm/pipelines/sfm_robust_model_estimation.cpp -I$(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/ -I$(SRC_DIR)/third_party/lemon/ -I$(SRC_DIR)/third_party/ceres-solver/include/ -I$(SRC_DIR)/third_party/ceres-solver/config/ $(patsubst %, $(TMP_DIR)/%.bc, $?)

#main_ComputeSfM_DataColor:
#	echo "todo"

geometry:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/geometry/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/geometry/*.cpp))

linearProgramming: lemon
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/dependencies/osi_clp/CoinUtils/src/ -I$(SRC_DIR)/dependencies/osi_clp/Clp/src/OsiClp/ -I$(SRC_DIR)/dependencies/osi_clp/Clp/src/ -I$(SRC_DIR)/dependencies/osi_clp/Osi/src/Osi/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/linearProgramming/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/linearProgramming/*.cpp)) $(filter-out $(wildcard $(SRC_DIR)/openMVG/linearProgramming/lInfinityCV/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/linearProgramming/lInfinityCV/*.cpp))

sfm: lemon
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/ceres-solver/include/ -I$(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/ -I$(SRC_DIR)/third_party/ceres-solver/config/ -I$(SRC_DIR)/third_party/lemon/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/sfm/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/sfm/*.cpp))

exif_IO_EasyExif:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(SRC_DIR)/openMVG/exif/$@.cpp

cxsparse:
	emcc -o $(TMP_DIR)/$@.bc -I$(SRC_DIR)/third_party/cxsparse/Include/ $(wildcard $(SRC_DIR)/third_party/cxsparse/Source/*.c)

lemon: osi_clp
	cd $(SRC_DIR)/third_party/lemon/ && emconfigure cmake && emmake make
	cp $(SRC_DIR)/third_party/lemon/lemon/libopenMVG_lemon.a $(TMP_DIR)/lemon.bc

matching_image_collection:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/matching_image_collection/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/matching_image_collection/*.cpp))

matching:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/flann/src/cpp/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/matching/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/matching/*.cpp))

numeric:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/numeric/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/numeric/*.cpp))

ceres:
	cd $(SRC_DIR)/third_party/ceres-solver/ && emconfigure cmake -DEIGEN_INCLUDE_DIR=$(EIGEN_DIR) && emmake make
	#cp $(SRC_DIR)/third_party/ceres-solver/lib/libopenMVG_ceres.a $(TMP_DIR)/ceres.bc
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) -I$(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/ -I../src/third_party/ceres-solver/internal/ -I$(SRC_DIR)/third_party/ceres-solver/include/ -I$(SRC_DIR)/third_party/ceres-solver/config/ $(SRC_DIR)/third_party/ceres-solver/lib/libopenMVG_ceres.a

osi_clp:
	cd $(OSI_CLP_DIR) && emconfigure cmake && emmake make
	#$(OSI_CLP_DIR)/Clp/src/liblib_clp.a 
	#$(OSI_CLP_DIR)/Clp/src/OsiClp/liblib_OsiClpSolver.a 
	#$(OSI_CLP_DIR)/Osi/src/Osi/liblib_Osi.a 
	#$(OSI_CLP_DIR)/CoinUtils/src/liblib_CoinUtils.a

image: png tiff jpeg
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/png/ -I$(SRC_DIR)/third_party/tiff/ -I$(SRC_DIR)/third_party/jpeg/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/image/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/image/*.cpp))

system:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/system/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/system/*.cpp))

multiview:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/ceres-solver/include/ -I$(SRC_DIR)/third_party/ceres-solver/config/ -I$(SRC_DIR)/third_party/ceres-solver/internal/ceres/miniglog/ -I$(SRC_DIR)/third_party/lemon/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/multiview/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/multiview/*.cpp))

features: akaze liop
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/features/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/features/*.cpp))

akaze:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/features/akaze/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/features/akaze/*.cpp))

liop:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) $(patsubst %, $(TMP_DIR)/%.bc, $?) $(filter-out $(wildcard $(SRC_DIR)/openMVG/features/liop/*_test.cpp),$(wildcard $(SRC_DIR)/openMVG/features/liop/*.cpp))

image_io: png tiff jpeg
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) $(COMMON_INCLUDES) -I$(SRC_DIR)/third_party/png/ -I$(SRC_DIR)/third_party/tiff/ -I$(SRC_DIR)/third_party/jpeg/ $(patsubst %, $(TMP_DIR)/%.bc, $?) $(SRC_DIR)/openMVG/image/$@.cpp

png:
	cp $(SRC_DIR)/third_party/png/pnglibconf.h.prebuilt $(SRC_DIR)/third_party/png/pnglibconf.h
	emcc -o $(TMP_DIR)/$@.bc -I$(SRC_DIR)/third_party/png/ -I$(SRC_DIR)/third_party/zlib/ $(filter-out $(SRC_DIR)/third_party/png/pngtest.c,$(wildcard $(SRC_DIR)/third_party/png/*.c))

zlib:
	emcc -o $(TMP_DIR)/$@.bc -I$(SRC_DIR)/third_party/zlib/ $(filter-out $(SRC_DIR)/third_party/zlib/example.c $(SRC_DIR)/third_party/zlib/minigzip.c,$(wildcard $(SRC_DIR)/third_party/zlib/*.c))

jpeg:
	#cd $(SRC_DIR)/third_party/jpeg/ && emconfigure cmake && emmake make
	#$(SRC_DIR)/third_party/jpeg/libopenMVG_jpeg.a
	#cp $(CONFIG_DIR)/jconfig.h $(SRC_DIR)/third_party/jpeg/jconfig.h
	emcc -o $(TMP_DIR)/$@.bc -I$(SRC_DIR)/third_party/jpeg/ $(patsubst %, $(SRC_DIR)/third_party/jpeg/%, $(JPEGLIB_SRC))

tiff:
	emcc -o $(TMP_DIR)/$@.bc -I$(SRC_DIR)/third_party/tiff/ -I$(SRC_DIR)/third_party/zlib/ $(filter-out $(SRC_DIR)/third_party/tiff/tif_win32.c $(SRC_DIR)/third_party/tiff/mkg3states.c,$(wildcard $(SRC_DIR)/third_party/tiff/*.c))

stlplus:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) -I$(SRC_DIR)/third_party/stlplus3/filesystemSimplified/ $(wildcard $(SRC_DIR)/third_party/stlplus3/filesystemSimplified/*.cpp)

easyexif:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) -I$(SRC_DIR)/third_party/easyexif/ $(wildcard $(SRC_DIR)/third_party/easyexif/*.cpp)

cereal:
	em++ -o $(TMP_DIR)/$@.bc $(BC_OPTIONS) -I$(SRC_DIR)/dependencies/cereal/sandbox/sandbox_shared_lib/ -I$(SRC_DIR)/dependencies/cereal/include/ $(wildcard $(SRC_DIR)/dependencies/cereal/sandbox/sandbox_shared_lib/*.cpp)

sift:
	#cp $(EMSCRIPTEN)/system/include/SSE/emmintrin.h $(EIGEN_DIR)/mmintrin.h
	emcc -o $(TMP_DIR)/$@.bc -DVL_DISABLE_SSE2 -I$(SRC_DIR)/nonFree/sift/vl/ $(wildcard $(SRC_DIR)/nonFree/sift/vl/*.c)