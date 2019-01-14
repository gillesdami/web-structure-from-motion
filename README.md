# WSFM - web structure from motion

SfM pipeline from  [openMVG](https://github.com/openMVG/openMVG) ported to js.

This port is made possible by the amazing work of [emscripten](https://github.com/kripken/emscripten) and [openMVG](https://github.com/openMVG/openMVG) teams, checkout their repos!

## Usage

I recommand reading and following the [tutorial of openMVG](https://openmvg.readthedocs.io/en/latest/software/SfM/SfM/) using this repo.

The file system API port is documented [here](https://kripken.github.io/emscripten-site/docs/api_reference/Filesystem-API.html) and [here](https://kripken.github.io/emscripten-site/docs/api_reference/advanced-apis.html).

I also provide a complete [example](example.js) on how to use the lib.

## Build

The project can be built with docker.

```bash
docker build -t wsfm .
docker run --rm -t -v $(pwd)/dist:/home/openMVG/build_js wsfm
```

## Test

The test suite ensure that every wasm program can run without throwing an error.

```bash
docker run -it --rm -v $(pwd):/var/www node:9 /bin/bash
yarn
yarn test
```