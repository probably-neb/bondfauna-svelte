   const {
          couldHaveAd: bool_could_have_ad,
          hasAd: bool_has_add,
          pageScrollable: r
        }
        = a,
        n = Es(),
        i = W(_a),
        l = W(Sa),
        c = W(za),
        d = W(Aa),
        u = W(Ta),
        m = B(),
        parent_ref = t.useRef(null),
        this_ref = t.useRef(null);

return t.useEffect((() =>{
  (() =>{
    const parent = parent_ref.current,
    this = this_ref.current;
    if (!parent || !this) return;
    // const t = bool_could_have_ad && bool_has_add ? 300 : 0,
    const t = 300 if bool_could_have_ad && bool_has_add else 0;
    offset = t;
    // r = (n = Math.floor(parent.clientHeight * (5 / 6)), i = t, Math.min(Math.max(n, i), 350));
    const n = Math.floor(parent.clientHeight * (5 / 6)),
          r = Math.min(Math.max(n, t), 350));
    x = r;
//    var n,
  //  i;
    const l = 6 * Math.floor(r / 5);
    y = l;
    this.style.width = ''.concat(x, 'px'),
    this.style.height = ''.concat(y, 'px'),
    parent.style.overflow = bool_could_have_ad && bool_has_add && x === offset ? 'unset' : ''
  }) ()
}));
