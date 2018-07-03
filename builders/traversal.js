(function() {
    treetools = {};
    treetools.depth = function(root) {
        if (! root.branchset) return 0;
        var depths = [];
        for (branch_i in root.branchset) {
            depths.append( treetools.depth( root.branchset[branch_i] ) );
        }
        return Math.max(depths) + 1;
    }
    treetools.visitPreOrder = function(root, callback, depth=0, data={}) {
        if (root) { callback(root, depth, data); }
        if (root.branchset) {
            for (var i = 0; i < root.branchset.length; i++) {
                treetools.visitPreOrder(root.branchset[i], callback, depth+1,data);
            }   
        }   
    };  
    treetools.visitPostOrder = function(root, callback, depth=0, data={}) {
        if (root.branchset) {
            for (var i = 0; i < root.branchset.length; i++) {
                treetools.visitPostOrder(root.branchset[i], callback, depth+1,data);
            }   
        }   
        if (root) { callback(root, depth, data); }
    }; 
    /***** NOT TESTED *************/
    treetools.visitDepthOrder = function(root, callback, targetDepth=0, currentDepth=0, data={}) {
        // only execute callback at targetDepth 
        if (root) {
            if (targetDepth == currentDepth) {
                callback(root,currentDepth,data);
            }
            else if (root.branchset) {
                for (var i = 0; i < root.branchset.length; i++) {
                    treetools.visitDepthOrder(root.branchset[i], callback, targetDepth, currentDepth+1, data);
                }
            }
        }
    }
    module.exports = treetools;
})();
