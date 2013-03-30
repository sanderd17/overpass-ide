// ----------------------------------------------------------------------
// RuleChain base class
// In contrast to Halcyon, note that length() is a function, not a getter property

/**	A descendant list of MapCSS selectors (Rules).

  For example,
  relation[type=route] way[highway=primary]
  ^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^
  first Rule           second Rule
  |------------|---------|
  |
  one RuleChain

*/

styleparser.RuleChain = function() {

    this.rules=[];				// list of Rules
    this.subpart= 'default';		// subpart name, as in way[highway=primary]::centreline

    // Functions to define the RuleChain
    this.addRule=function(_subject) {
        this.rules.push(new styleparser.Rule());
        this.rules[this.rules.length-1].addSubject(_subject);
    };

    this.addConditionToLast=function(_condition) {
        this.rules[this.rules.length-1].addCondition(_condition);
    };

    this.addZoomToLast=function(z1,z2) {
        this.rules[this.rules.length-1].minZoom=z1;
        this.rules[this.rules.length-1].maxZoom=z2;
    };


    this.length=function() {
        return this.rules.length;
    };

    this.setSubpart=function(subpart) {
        this.subpart = subpart || 'default';
    };

    // Test a ruleChain
    // - run a set of tests in the chain
    //		works backwards from at position "pos" in array, or -1  for the last
    //		separate tags object is required in case they've been dynamically retagged
    // - if they fail, return false
    // - if they succeed, and it's the last in the chain, return happily
    // - if they succeed, and there's more in the chain, rerun this for each parent until success

    this.test= function(pos, entity, tags, zoom) {
        // summary:		Test a rule chain by running all the tests in reverse order.
        if (this.rules.length === 0) { return false; }
        if (pos==-1) { pos=this.rules.length-1; }

        var r = this.rules[pos];
        if (!r.test(entity, tags, zoom)) { return false; }
        if (pos === 0) { return true; }

        var o = [];//TODO//entity.entity.parentObjects();
        for (var i = 0; i < o.length; i++) {
            var p=o[i];
            if (this.test(pos-1, p, p.tags, zoom)) { return true; }
        }
        return false;
    };
};