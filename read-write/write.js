(function() { // shield global namespace
    treetools = {}; // object to export
    treetools.toString = function(nw) {
        
        // gather names, values recursively
        var compileNW = function(node, stack)
        {   
            stack.unshift(node.name + ":" + node.length);
    
            if (node.branchset)
            {   
                stack.unshift(")");
                for (var i = node.branchset.length - 1; i >= 0 ; i--)
                {   
                    var branch = node.branchset[i];
                    compileNW(branch, stack);
                    if (i > 0)
                    {   
                        stack.unshift(',');
                    }   
                }   
                stack.unshift("(");
            }   
        };  

        var top_stack = []; 
        compileNW(nw, top_stack);
        var nw_str = top_stack.join('') + ';';
        return nw_str;
    };  
    treetools.writeFile = function(filename, nw, error_f) {
        fs.writeFile(filename, treetools.toString(nw), 'utf-8', error_f);
    };
    treetools.print_ascii = function(node, depth=0, scale = 1) { // depth is the length from node to root
        var indent = ""; 
        for (var i = 0; i < (scale * depth); i++) { indent += " "; }
        var edge = ""; 
        for (i = 0; i < (scale * node.length); i++) { edge += "-"; }
        console.log(indent + "+" + edge + node.name + ":" + node.length);
        if (node.branchset) {
            for (i = 0; i < node.branchset.length; i++) {
                treetools.print_ascii(node.branchset[i], depth+node.length, scale);
            }   
        }   
    };

    module.exports = treetools;

})();
