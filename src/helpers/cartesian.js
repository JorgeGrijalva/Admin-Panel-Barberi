function cartesian(args) {
    let r = [], max = args.length-1;
    function helper(arr, i) {
        for (let j=0, l=args[i]?.length; j<l; j++) {
            let a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i===max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
};

export default cartesian