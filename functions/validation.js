(function() {
    // need this
    function format(v) {
        if (! isInt(v)) {
            return v.toFixed(4);
        }
        return v;
    }

    function cmp(a,b) {
        if (a == b) return 0;
        return a < b ? -1 : 1;
    }

    function isInt(v) {
        return Math.trunc(v) == v;
    }
    treetools = {};

    treetools.get_json_mismatches = function(left, right)   {
        var left_to_right = treetools.compare_leaf_lists(left,right);
        var right_to_left = treetools.compare_leaf_lists(right, left);
        return { LTR: left_to_right, RTL: right_to_left };
    }
    treetools.compare_leaf_lists = function(nodelist, standard)   {


        var json_mismatches = [];

        for (var i = 0; i < nodelist.length; i++) {
            node_i = nodelist[i];
            outstr = i + ":\t" + node_i + "\t";

            var json_report = {};
            json_report.left_nodename = node_i;
            json_report.left_nodeindex = i;

            // exact matches:  standard.indexOf
            var j = standard.indexOf(node_i);
            json_report.right_index_for_left = j;

            outstr += j + "\t";
            if (j == -1) {
                json_report.found_exact_match = false;
                outstr += "NOT_FOUND\t";
            }
            else {
                json_report.found_exact_match = true;
                node_j = standard[j];
                json_report.right_nodename_for_left = node_j;
                outstr += node_j + "\t"
            }

            // best match method: find the closest matching string in standard, take the index of that match
            // not necessary for exact matches
            var bestMatchObj = treetools.findBestMatch(node_i, standard); 
            //var bestMatch = bestMatchObj.bestMatch;//.target;


            var ratings = bestMatchObj.ratings;
            ratings.sort(function(a,b) {
                if (a.rating == b.rating) {
                    return cmp(a.target,b.target);
                }
                return a.rating < b.rating ? -1 : 1; // Distance, low-to-high
            });
            var bestMatch = { target: ratings[0].target, rating: ratings[0].rating };
            json_report.best_match_in_right_for_left = bestMatch;
            
            var prev_j = j; // -1 if no exact match
            j = standard.indexOf(bestMatch.target);

            json_report.index_of_best_match_in_right_for_left = j;

            if (prev_j != j) {
                node_j = standard[j];
                outstr += j + "\t" + node_j + "(" + format(bestMatch.rating) + ")";
                json_report.rating_of_best_match_in_right_for_left = bestMatch.rating;

                json_report.match_ratings = [];
                for (var x=0; x < 5; x++) {
                        outstr += "\t" + ratings[x].target + "(" + format(ratings[x].rating) + ")";
                        json_report.match_ratings.push( { rank: x, match: ratings[x].target, levenshtein_distance: parseFloat(ratings[x].rating.toFixed(4)) } );
                }
                
                console.log(outstr);
                json_mismatches.push({ report_i: json_mismatches.length+1, report: json_report});
            }
        }
        
        return { mismatch_reports: json_mismatches, nmismatches: json_mismatches.length };

    }
    module.exports = treetools;
})();

