function useFileInput(evt) {
    fileInput = evt.target;
    
    if (fileInput.files.length == 0)
        return;
    var file = fileInput.files[0];

    var fr = new FileReader();
    fr.onload = function () {
        var data = new Uint8Array(fr.result);

        FS.createDataFile('/', 'filename', data, true, true, true);

        fileInput.value = '';
    };
    fr.readAsArrayBuffer(file);
}

main_SfMInit_ImageListing()

document.getElementById('fileloader').addEventListener("change", useFileInput);

function run(...args) {
    il = main_SfMInit_ImageListing()
    il['callMain'](args)
}