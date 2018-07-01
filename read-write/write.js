(function() { // shield global namespace
    treetools = require('../index');
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
    
    treetools.to_bullet_tree = function(tree) {
        /* From ascii-tree: bullet string has to look like this:
            #root node
            ##node1
            ###node11
            ##node2
        */
        var d = {};
        d.bullet_str = '';
        var line_ending = "\r\n"; // from a windows developer?
        treetools.visitPreOrder(
            tree, 
            function(node, depth, data) {
                // function executed at each node to for bullet format
                var indent='#';
                for (var i=0; i < depth; i++) { indent += '#'; }
                data.bullet_str += indent + node.name + line_ending; // was str_so_far passed by value or by reference?
            },
            0,
            d
        );
        return d.bullet_str;
    };
    var asciitree = require('ascii-tree');
    treetools.to_ascii = function(newick) { // currently unscaled
        var bullet = treetools.to_bullet_tree(newick);
        var ascii = asciitree.generate(bullet);
        return ascii;
    };
    treetools.print_ascii = function(tree) {
        console.log( treetools.to_ascii(tree) );
    }
    treetools.print_ascii_error = function(tree) {
        console.error( treetools.to_ascii(tree) );
    }
    treetools.print_ascii_old = function(node, depth=0, scale = 1) { // depth is the length from node to root
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
