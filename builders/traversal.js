(function() {
    treetools = {};
    treetools.visitPreOrder = function(root, callback, depth=0, data={}) {
        //console.log("visitPreOrder %d", depth);
        //console.dir(root);
        if (root) { callback(root, depth, data); }
        if (root.branchset) {
            //console.log("visitPreOrder root.branchset: %s", root.branchset);
            for (var i = 0; i < root.branchset.length; i++) {
                treetools.visitPreOrder(root.branchset[i], callback, depth+1,data);
            }   
        }   
    };  
    treetools.visitPostOrder = function(root, callback, depth=0, data={}) {
        console.log("visitPostOrder %d- %s ---------------------------", depth, root);
        //console.dir(root);
        writer.print_ascii(root);
        if (root.branchset) {
            for (var i = 0; i < root.branchset.length; i++) {
                treetools.visitPostOrder(root.branchset[i], callback, depth+1,data);
            }   
        }   
        if (root) { callback(root, depth, data); }
    }; 
    module.exports = treetools;
})();
