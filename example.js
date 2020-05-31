const runButton = document.getElementById('runProgram');
const infoElement = document.getElementById('info');

/********
 * UTILS
 ********/

/**
 * load a script
 * 
 * @param {string} src 
 */
const loadScript = async(src) => new Promise(r => {
    const script = document.createElement('script');
    script.onload = r;
    script.src = src;
    document.head.appendChild(script);
});

/**
 * files input to uint8
 * 
 * @param {Files} files
 * @returns {*} [[fileName, Uint8Array], ...]
 */
const filesToUint8Arrays = (files) =>
    Promise.all(Array.from(files).map(async (file) => new Promise(r => {
        const fr = new FileReader();
        fr.onload = () => r([file.name, new Uint8Array(fr.result)]);
        fr.readAsArrayBuffer(file);
    })));

/**
 * Read all files in a dir and return them
 * 
 * @param {*} ctx emscripten wrapper
 * @param {string} dir 
 * @returns {*} [[fileName, Uint8Array], ...]
 */
const readAll = (ctx, dir) =>
    ctx.FS.readdir(dir)
        .filter(f => f != '.' && f != '..')
        .map(f => [f, ctx.FS.readFile(dir + '/' + f)]);

/**
 * Write files data in a dir
 * 
 * @param {*} ctx emscripten wrapper
 * @param {string} dir 
 * @param {*} data [[fileName, Uint8Array], ...]
 */
const writeAll = (ctx, dir, data) =>
    data.forEach(d => ctx.FS.writeFile(dir + '/' + d[0], d[1]));

/**
 * Create working dirs
 * 
 * @param {*} ctx emscripten wrapper
 */
const prepareFS = (ctx) => {
    ctx.FS.mkdir('/input');
    ctx.FS.mkdir('/matches');
    ctx.FS.mkdir('/output');
};

/**
 * Makes the client download a blob
 * 
 * @param {Blob} blob 
 * @param {string} name 
 */
const download = (blob, name) => {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

const promiseContextReady = (ctx) => 
    new Promise(r => ctx['onRuntimeInitialized'] = r);

/********
 * Main
 ********/
const run = async () => {
    runButton.removeEventListener("click", run);
    infoElement.innerText = "Step 0/4 - Loading input files";

    const fileInput = document.getElementById('fileloader');
    const inputData = await filesToUint8Arrays(fileInput.files);
    fileInput.value = '';
    
    //// main_SfMInit_ImageListing ////
    infoElement.innerText = "Step 1/4 - Image listing";
    await loadScript("../dist/main_SfMInit_ImageListing.js");
    let ctx = main_SfMInit_ImageListing();
    await promiseContextReady(ctx);
    prepareFS(ctx);
    writeAll(ctx, '/input', inputData);    

    ctx['callMain'](["-i", "/input", "-o", "/matches", "-d", "/input/sensor_width_camera_database.txt"]);
    let resultData = readAll(ctx, '/matches');

    main_SfMInit_ImageListing = null;

    //// main_ComputeFeatures /////
    infoElement.innerText = "Step 2/4 - Compute Features (takes a while, you should do something else)";
    await loadScript("../dist/main_ComputeFeatures.js");
    ctx = main_ComputeFeatures();
    await promiseContextReady(ctx);
    prepareFS(ctx);
    writeAll(ctx, '/input', inputData);
    writeAll(ctx, '/matches', resultData);

    ctx['callMain'](["-i", "/matches/sfm_data.json", "-o", "/matches"]);
    resultData = readAll(ctx, '/matches');

    main_ComputeFeatures = null;

    //// main_ComputeMatches ////
    infoElement.innerText = "Step 3/4 - Compute Matches (takes a while, you should do something else)";
    await loadScript("../dist/main_ComputeMatches.js");
    ctx = main_ComputeMatches();
    await promiseContextReady(ctx);
    prepareFS(ctx);
    writeAll(ctx, '/input', inputData);
    writeAll(ctx, '/matches', resultData);

    ctx['callMain'](["-i", "/matches/sfm_data.json", "-o", "/matches", "-g", "e"]);
    resultData = readAll(ctx, '/matches');

    main_ComputeMatches = null;

    //// main_GlobalSfM
    infoElement.innerText = "Step 4/4 - Reconstruction (takes a while, you should do something else)";
    await loadScript("../dist/main_GlobalSfM.js");
    ctx = main_GlobalSfM();
    await promiseContextReady(ctx);
    prepareFS(ctx);
    writeAll(ctx, '/input', inputData);
    writeAll(ctx, '/matches', resultData);

    ctx['callMain'](["-i", "/matches/sfm_data.json", "-m", "/matches", "-o", "/output"]);
    resultData = readAll(ctx, '/matches');

    main_GlobalSfM = null;

    const zip = new JSZip();
    resultData.forEach(f => zip.file(f[0], f[1]));
    download(await zip.generateAsync({type : "blob"}), "results.zip");

    infoElement.innerText = "End - Downloaded result";
};
runButton.addEventListener("click", run);

window.addEventListener("error", function (e) {
    alert("An error occurred: " + e.error.message);
    return false;
});