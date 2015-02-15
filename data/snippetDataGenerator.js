//snippetData generator base on node.js
var fs = require('fs');

//파일을 읽은 뒤, 리스트로 반환하여 출력한다.
//TODO 변수명 리팩토링
var readFileListReculsive = function (basePath) {

    var fileList = fs.readdirSync(basePath);
    var resultFileList = [];
    for (var idx = 0; idx < fileList.length; idx++) {
        var element = fileList[idx];
        var fileWithPath = basePath + "/" + element;

        if (fs.lstatSync(fileWithPath).isDirectory()) {
            var childFileList = readFileListReculsive(fileWithPath);
            resultFileList = resultFileList.concat(childFileList);
        } else {
            resultFileList.push(fileWithPath);
        }
    }

    return resultFileList;
};


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

var fileList = readFileListReculsive("./gitignore-snippet");
var snippetList = [];
for (var idx = 0; idx < fileList.length; idx++) {
    var file = fileList[idx];
    if (endsWith(file, ".gitignore")) {
        snippetList.push({
            name: file.split("/").pop().replace(".gitignore", ""),
            path: "data/" + file.replace("./", "")
        });
    }
}

snippetList = snippetList.sort(function (a, b) {
    if (a.name > b.name) {
        return 1
    }
    else {
        return -1;
    }
});

fs.writeFile("./snippetData.json", JSON.stringify(snippetList));