/**
 * Allocate the program memory and init the file system
 */
const ctxs = [main_SfMInit_ImageListing(), 
    main_ComputeFeatures(),
    main_ComputeMatches(),
    main_GlobalSfM()];

const bfs = new BrowserFS.EmscriptenFS();
bfs.mkdir('/input');
bfs.mkdir('/matches');
bfs.mkdir('/output');

for (ctx of ctxs) {
    ctx.FS.createFolder(ctx.FS.root, 'share', true, true);
    ctx.FS.mount(bfs, {root: '/'}, '/share');

    ctx.print = log;
    ctx.printErr = (txt) => log(txt, true);
}

/**
 * Logging utility
 * 
 * @param {string} txt 
 */
function log(txt, err = false) {
    console.log(txt);
}

/**
 * Reset the file system
 */
function clearFS() {
    for (var dir of ["/input", "/matches", "/output"]) {
        for (file of bfs.readdir(dir)) {
            if(file !== "." && file !== "..")
                bfs.unlink(dir + "/" + file);
        }
    }
    log("Filesystem cleared !");
}

/**
 * Upload the selected files to the filesystem
 * 
 * @param {Event} evt 
 */
function uploadFilesToWasm(files) {
    Array.from(files).forEach(function(file) {
        var fr = new FileReader();
        fr.onload = function () {
            var data = new Uint8Array(fr.result);
            console.log('/input', file.name);
            bfs.createDataFile('/input', file.name, data, true, true, true);
        };
        fr.readAsArrayBuffer(file);
    });
}

function download(blob) {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = 'sfm_data.json';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
} 

/**
 * run main_SfMInit_ImageListing and make the browser download the result
 * 
 * @param  {string[]} args
 */
function run() {
    var fileInput = document.getElementById('fileloader');

    clearFS();
    uploadFilesToWasm(fileInput.files);
    fileInput.value = '';

    ctxs[0]['callMain'](["-i", "/share/input", "-o", "/share/matches", "-d", "/share/input/sensor_width_camera_database.txt"]);
    log("program0 done");
    ctxs[1]['callMain'](["-i", "/share/matches/sfm_data.json", "-o", "/share/matches"]);
    log("program1 done");
    ctxs[2]['callMain'](["-i", "/share/matches/sfm_data.json", "-o", "/share/matches"]);
    log("program2 done");
    ctxs[3]['callMain'](["-i", "/share/matches/sfm_data.json", "-m", "/share/matches", "-o", "/share/output"]);    
    log("program3 done")
}
document.getElementById('runProgram').addEventListener("click", run);