#include "wsfm.hpp"

int main(int argc, char **argv) {
    if (argc < 2) {
        std::cerr << "Invalid number of parameter, please specify the program to run";
    }
    argc--;

    if(strcmp(argv[1], "main_ComputeFeatures") != 0) {
        return main_ComputeFeatures(argc, argv);
    } else if (strcmp(argv[1], "main_ComputeMatches") != 0) {
        return main_ComputeMatches(argc, argv);
    } else if (strcmp(argv[1], "main_SfMInit_ImageListing") != 0) {
        return main_SfMInit_ImageListing(argc, argv);
    } else if (strcmp(argv[1], "main_GlobalSfM") != 0) {
        return main_GlobalSfM(argc, argv);
    }
    
    std::cerr << "The last parameter must be one of main_ComputeFeatures, main_ComputeMatches, main_SfMInit_ImageListing, main_GlobalSfM";

    return 1;
}