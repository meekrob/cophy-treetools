(function() {
    function extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; }); 
        return obj;
    }
    treetools = {};
    treetools = extend(treetools, require('./traversal'));
    treetools = extend(treetools, require('./edit'));
    module.exports = treetools;
})();
