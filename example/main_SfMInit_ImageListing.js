/**
 * Allocate the program memory and init the file system
 */
const ctxs = [main_SfMInit_ImageListing(), 
    main_ComputeFeatures(),
    main_ComputeMatches(),
    main_GlobalSfM()];

for (ctx of ctxs) {
    ctx.FS.mkdir('/input');
    ctx.FS.mkdir('/matches');
    ctx.FS.mkdir('/output');
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
        for (file of bfs.nodefs.readdirSync(dir)) {
            if(file !== "." && file !== "..")
                bfs.nodefs.unlinkSync(dir + "/" + file);
        }
    }
    log("Filesystem cleared !");
}

/**
 * Upload the selected files to the filesystem
 * 
 * @param {Event} evt 
 */
async function uploadFilesToWasm(files) {
    return Promise.all(Array.from(files).map(async function(file) {
        return new Promise(r => {
            var fr = new FileReader();
            fr.onload = function () {
                var data = new Uint8Array(fr.result);
                for(ctx of ctxs) {
                    ctx.FS.writeFile('/input/' + file.name, data);
                }
                console.log('/input/'+ file.name);
                r();
            };
            fr.readAsArrayBuffer(file);
        });
    }));
}

function download(blob, name) {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
} 

function transferData(ctxFrom, ctxTo, dir) {
    for (file of ctxFrom.FS.readdir(dir)) {
        if(file !== "." && file !== "..") {
            ctxTo.FS.writeFile(dir + "/" + file, ctxFrom.FS.readFile(dir + "/" + file));
        }
    }
}

/**
 * run main_SfMInit_ImageListing and make the browser download the result
 * 
 * @param  {string[]} args
 */
async function run() {
    var fileInput = document.getElementById('fileloader');

    //clearFS();
    await uploadFilesToWasm(fileInput.files);
    fileInput.value = '';

    ctxs[0]['callMain'](["-i", "/input", "-o", "/matches", "-d", "/input/sensor_width_camera_database.txt"]);
    log("program0 done");
    transferData(ctxs[0], ctxs[1], '/matches');
    ctxs[0] = null;

    ctxs[1]['callMain'](["-i", "/matches/sfm_data.json", "-o", "/matches"]);
    log("program1 done");
    transferData(ctxs[1], ctxs[2], '/matches');
    ctxs[1] = null;

    ctxs[2]['callMain'](["-i", "/matches/sfm_data.json", "-o", "/matches", "-g", "e"]);
    log("program2 done");
    transferData(ctxs[2], ctxs[3], '/matches');
    ctxs[2] = null;

    ctxs[3]['callMain'](["-i", "/matches/sfm_data.json", "-m", "/matches", "-o", "/output"]);    
    log("program3 done")

    download(new Blob([ctxs[3].FS.readFile('/output/cloud_and_poses.ply')]), 'cp2.ply')
    download(new Blob([ctxs[3].FS.readFile('/output/residuals_histogram.svg')]), 'residuals_histogram.svg')
}
document.getElementById('runProgram').addEventListener("click", run);