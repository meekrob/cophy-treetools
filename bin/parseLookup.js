#!/usr/bin/env node

function DataException(message) {
    this.message = message;
    this.name = "DataException";
}


function GetLookupFromDSV(filetext, delim="\t") {
    lookup = Object();
    left_names = new Set();
    right_names = new Set();

    filetext.split('\n').forEach(function(line) {
        if (line) { 
            fields = line.split("\t");
            left_name = fields[0];
            right_name = fields[1];
            
            if (left_names.has(left_name)) {
                err_msg = "left name '" + left_name + "' duplicated in left tree";
                throw new DataException(err_msg);
                //throw new Error("unknown error");
            }
            if (right_names.has(right_name)) {
                err_msg = "right name '" + right_name + "' duplicated in right tree";
                throw new DataException(err_msg);
            }

            left_names.add(left_name);
            right_names.add(right_name);
            lookup[left_name] = right_name;
        }
    });
    return lookup;
}

fs = require('fs');
filename='testfile.tsv';
filetxt = String(fs.readFileSync(filename));

try {
    lookup = GetLookupFromDSV(filetxt);
}
catch(e) {
    if (e instanceof DataException) {
        console.error("File parsing failed...");
    }
    else {
        console.error("Unanticipated error...");
    }
    console.error(e.name + ':', e.message);
    process.exit(1);
    
}

console.dir(lookup);
