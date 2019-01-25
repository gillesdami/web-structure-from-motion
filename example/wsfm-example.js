const wsfm = all();

wsfm.FS.mkdir('/input');
wsfm.FS.mkdir('/matches');
wsfm.FS.mkdir('/output');

function clearFS() {
    for (var dir of ["/input", "/matches", "/output"]) {
        for (file of bfs.readdir(dir)) {
            if(file !== "." && file !== "..")
                bfs.unlink(dir + "/" + file);
        }
    }
    log("Filesystem cleared !");
}

//upload files to wasm fs
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

//make the client download a blob
function download(blob, name) {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = name;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
} 

function run() {
    var fileInput = document.getElementById('fileloader');

    clearFS();
    uploadFilesToWasm(fileInput.files);
    fileInput.value = '';
    
    wsfm['callMain'](["-i", "/share/input", "-o", "/share/matches", "-d", "/share/input/sensor_width_camera_database.txt", "main_SfMInit_ImageListing"]);
    log("program0 done");
    wsfm['callMain'](["-i", "/share/matches/sfm_data.json", "-o", "/share/matches", "main_ComputeFeatures"]);
    log("program1 done");
    wsfm['callMain'](["-i", "/share/matches/sfm_data.json", "-o", "/share/matches", "main_ComputeMatches"]);
    log("program2 done");
    wsfm['callMain'](["-i", "/share/matches/sfm_data.json", "-m", "/share/matches", "-o", "/share/output", "main_GlobalSfM"]);    
    log("program3 done");
}
document.getElementById('runProgram').addEventListener("click", run);