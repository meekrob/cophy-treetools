(function() {
    function extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; }); 
        return obj;
    }
    treetools = {};
    treetools = extend(treetools, require('./detangler'));
    treetools = extend(treetools, require('./general'));
    treetools = extend(treetools, require('./validation'));
    treetools = extend(treetools, require('./string-similarity'));
    module.exports = treetools;
})();

