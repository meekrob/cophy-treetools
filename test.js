
var treetools = require('../cophy-treetools');

var nw = treetools.parse('((B:6.0,(A:5.0,C:3.0)i0:5.0)i1:4.0,D:15.0)simple-tree:10;');
console.log(nw);

console.log("about to parse a file");
var nwf = treetools.parseFile('simple.newick', main, error);

function main(newick) {
    console.dir(newick);
};

function error(err_str) {
    console.log("Error:" + err);
    process.exit(1);
}
