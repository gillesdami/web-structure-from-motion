/**
 * Allocate the program memory and init the file system
 */
var ctx = main_SfMInit_ImageListing();
ctx.FS.mkdir('/input');
ctx.FS.mkdir('/output');
ctx.print = log;
ctx.printErr = (txt) => log(txt, true);

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
    for (var dir of ["/input", "/output"]) {
        for (file of ctx.FS.readdir(dir)) {
            if(file !== "." && file !== "..")
                ctx.FS.unlink(dir + "/" + file);
        }
    }
    log("Filesystem cleared !");
}

/**
 * Upload the selected files to the filesystem
 * 
 * @param {Event} evt 
 */
function uploadFilesToWasm(evt) {
    fileInput = evt.target;

    clearFS();

    if (fileInput.files.length == 0)
        return;
    
    Array.from(fileInput.files).forEach(function(file) {
        var fr = new FileReader();
        fr.onload = function () {
            var data = new Uint8Array(fr.result);
            console.log('/input', file.name);
            ctx.FS.createDataFile('/input', file.name, data, true, true, true);
    
            fileInput.value = '';
        };
        fr.readAsArrayBuffer(file);
    });
}
document.getElementById('fileloader').addEventListener("change", uploadFilesToWasm);

/**
 * run main_SfMInit_ImageListing and make the browser download the result
 * 
 * @param  {string[]} args
 */
function run() {
    ctx['callMain'](["-i", "/input", "-o", "/output", "-d", "/input/sensor_width_camera_database.txt"]);

    log("program succeed, downloading the result...")
    var jsonStr = ctx.FS.readFile('/output/sfm_data.json', { encoding: 'utf8' });

    //download
    var blob = new Blob([jsonStr], {type: 'application/json'});
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = 'sfm_data.json';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}