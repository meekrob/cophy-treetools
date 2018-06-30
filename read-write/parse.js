(function() { // hide namespace from global
    Newick = require('newick').Newick;
    fs = require('fs');

    treetools = {}; // object to export
    treetools.parse = function(newick_str) {
        console.log(".parse: " + newick_str);
        return new Newick(newick_str).tree;
    }

    treetools.parseFile = function(filename) {
        return treetools.parse( String(fs.readFileSync(filename)) );
    }

    treetools.parseFileAsync = function(filename, success_f, error_f) {
        console.log(".parseFile: " + filename);
        fs.readFile(filename, 'utf8', function(err,data) {
            if (err) {
                console.error("parseFile: unable to read file '" + filename + "'. Error: " + err);
                error_f(error);
                return null;
            }
            success_f(treetools.parse(data));
        });
    }
    module.exports = treetools;

})();
