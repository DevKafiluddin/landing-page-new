const __vite__mapDeps = (i, m=__vite__mapDeps, d=(m.f || (m.f = ["assets/page-D-NAkGX4.js", "assets/Footer-CERx8IHF.js", "assets/page-loWmfJ5S.js", "assets/pagination-B21wJZdZ.js", "assets/pagination-B_l4pjL9.css", "assets/page-OqNlvT0X.js", "assets/page-CJS09K7r.js"]))) => i.map(i => d[i]);
(function() {
    const a = document.createElement("link").relList;
    if (a && a.supports && a.supports("modulepreload"))
        return;
    for (const c of document.querySelectorAll('link[rel="modulepreload"]'))
        o(c);
    new MutationObserver(c => {
        for (const f of c)
            if (f.type === "childList")
                for (const d of f.addedNodes)
                    d.tagName === "LINK" && d.rel === "modulepreload" && o(d)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function r(c) {
        const f = {};
        return c.integrity && (f.integrity = c.integrity),
        c.referrerPolicy && (f.referrerPolicy = c.referrerPolicy),
        c.crossOrigin === "use-credentials" ? f.credentials = "include" : c.crossOrigin === "anonymous" ? f.credentials = "omit" : f.credentials = "same-origin",
        f
    }
    function o(c) {
        if (c.ep)
            return;
        c.ep = !0;
        const f = r(c);
        fetch(c.href, f)
    }
}
)();
const Lu = [];
let dg = !0;
const hg = console.error;
function em(u) {
    Lu.length > 5 || !dg || Lu.push(u)
}
function mg(u) {
    Lu.push({
        type: "runtime",
        args: u
    })
}
function gg(u) {
    u.preventDefault()
}
function Uv(u) {
    try {
        const a = u.find(r => r instanceof Error);
        if (a && a.stack)
            em({
                type: "console.error",
                args: a
            });
        else if (u.length > 0) {
            const r = u.map(c => typeof c == "object" ? JSON.stringify(c) : String(c)).join(" ")
              , o = new Error(r);
            em({
                type: "console.error",
                args: o
            })
        }
    } catch (a) {
        console.warn(a)
    }
}
window.addEventListener("error", mg);
window.addEventListener("unhandledrejection", gg);
console.error = function(...a) {
    Uv(a),
    hg.apply(this, a)
}
;
function Hv() {
    return window.removeEventListener("error", mg),
    window.removeEventListener("unhandledrejection", gg),
    console.error = hg,
    dg = !1,
    Lu
}
const jv = 1e3
  , tm = Symbol("postMessageResponseTimeout");
let Eu = 0;
const is = "*";
class Kl {
    client;
    baseTimeout;
    waitRes = new Map;
    removeListeners = new Set;
    clear;
    constructor(a, r) {
        this.client = a,
        this.baseTimeout = r?.timeout || jv;
        const o = this.emitResponse.bind(this);
        this.clear = () => {
            window.removeEventListener("message", o)
        }
        ,
        window.addEventListener("message", o)
    }
    destroy() {
        this.clear(),
        this.removeListeners.forEach(a => a())
    }
    isTimeout(a) {
        return a === tm
    }
    post(a, r, o) {
        Eu++;
        const {timeout: c, origin: f=is} = o || {};
        return this.client.postMessage({
            data: r,
            id: Eu,
            type: a
        }, f),
        new Promise(d => {
            this.waitRes.set(Eu, m => {
                d(m)
            }
            ),
            setTimeout( () => {
                this.waitRes.delete(Eu),
                d(tm)
            }
            , c || this.baseTimeout)
        }
        )
    }
    on(a, r, o) {
        const {once: c, origin: f=is} = o || {}
          , d = async g => {
            const {id: p, type: S, data: v} = g.data;
            let E;
            S === a && (E = await r(v),
            console.log(a, c, E, v),
            (p && f === g.origin || f === is) && g.source?.postMessage({
                fromType: a,
                id: p,
                data: E
            }, g.origin),
            c && m())
        }
        ;
        window.addEventListener("message", d);
        const m = () => {
            window.removeEventListener("message", d),
            this.removeListeners.delete(m)
        }
        ;
        return this.removeListeners.add(m),
        m
    }
    emitResponse(a) {
        const r = a.data
          , {id: o, data: c} = r
          , f = this.waitRes.get(o);
        f && f(c)
    }
}
class Bv {
    #e = new WeakMap;
    #n;
    #l;
    #t = !1;
    constructor() {
        this.#n = HTMLElement.prototype.addEventListener,
        this.#l = HTMLElement.prototype.removeEventListener
    }
    patch() {
        if (this.#t)
            return;
        const a = this;
        HTMLElement.prototype.addEventListener = function(r, o, c) {
            return a.#a(this, r, o),
            a.#n.call(this, r, o, c)
        }
        ,
        HTMLElement.prototype.removeEventListener = function(r, o, c) {
            return a.#i(this, r, o),
            a.#l.call(this, r, o, c)
        }
        ,
        this.#t = !0,
        console.log("[EventListenerRegistry] ✅ addEventListener patched")
    }
    unpatch() {
        this.#t && (HTMLElement.prototype.addEventListener = this.#n,
        HTMLElement.prototype.removeEventListener = this.#l,
        this.#t = !1,
        console.log("[EventListenerRegistry] ⚠️ addEventListener unpatched"))
    }
    #a(a, r, o) {
        let c = this.#e.get(a);
        c || (c = new Map,
        this.#e.set(a, c));
        let f = c.get(r);
        f || (f = new Set,
        c.set(r, f)),
        f.add(o)
    }
    #i(a, r, o) {
        const c = this.#e.get(a);
        if (!c)
            return;
        const f = c.get(r);
        f && (f.delete(o),
        f.size === 0 && c.delete(r))
    }
    hasListeners(a, r) {
        const o = this.#e.get(a);
        return !o || o.size === 0 ? !1 : r ? r.some(c => {
            const f = o.get(c);
            return f && f.size > 0
        }
        ) : !0
    }
    getEventTypes(a) {
        const r = this.#e.get(a);
        return r ? Array.from(r.keys()) : []
    }
    getListenerCount(a, r) {
        const o = this.#e.get(a);
        if (!o)
            return 0;
        const c = o.get(r);
        return c ? c.size : 0
    }
    getDebugInfo() {
        return {
            patched: this.#t,
            note: "WeakMap is used for automatic memory cleanup. Cannot enumerate elements."
        }
    }
    getElementDebugInfo(a) {
        const r = this.#e.get(a);
        return r ? {
            element: a,
            tag: a.tagName,
            className: a.className,
            hasListeners: !0,
            eventTypes: Array.from(r.keys()),
            totalListeners: Array.from(r.values()).reduce( (o, c) => o + c.size, 0)
        } : {
            element: a,
            hasListeners: !1,
            eventTypes: [],
            totalListeners: 0
        }
    }
}
const Zl = new Bv
  , pg = ["click", "dblclick", "contextmenu", "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover", "mouseout", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointerup", "pointermove", "pointerenter", "pointerleave", "pointerover", "pointerout", "pointercancel"];
function Hs(u) {
    return Zl.hasListeners(u, pg)
}
function yg(u) {
    return Zl.getEventTypes(u).filter(r => pg.includes(r))
}
function vg(u) {
    const a = yg(u)
      , r = {};
    return a.forEach(o => {
        r[o] = Zl.getListenerCount(u, o)
    }
    ),
    {
        hasEvents: a.length > 0,
        eventTypes: a,
        listeners: r
    }
}
function qv(u) {
    return Zl.getElementDebugInfo(u)
}
function Sg(u=window) {
    Zl.patch(),
    u.__eventListenerRegistry__ = {
        hasListeners: Hs,
        getEventTypes: yg,
        getDetail: vg,
        getDebugInfo: () => Zl.getDebugInfo(),
        getElementDebugInfo: qv
    },
    console.log("[EnhancedEventDetector] ✅ Initialized and patched addEventListener")
}
typeof window < "u" && Sg(window);
const js = ["onClick", "onDoubleClick", "onContextMenu", "onMouseDown", "onMouseUp", "onPointerDown", "onPointerUp", "onTouchStart", "onTouchEnd", "onDragStart", "onDrop", "onChange", "onSubmit", "onKeyDown", "onKeyUp"];
function Bs(u) {
    const a = Object.keys(u).find(r => r.startsWith("__reactFiber$") || r.startsWith("__reactInternalInstance$"));
    return a ? u[a] : null
}
function bg(u) {
    return !u || typeof u != "object" ? !1 : js.some(a => typeof u[a] == "function")
}
function Gv(u) {
    return !u || typeof u != "object" ? [] : js.filter(a => typeof u[a] == "function")
}
function Eg(u) {
    let a = Bs(u);
    for (; a; ) {
        if (a.memoizedProps && bg(a.memoizedProps))
            return !0;
        a = a.return || null
    }
    return !1
}
function _g(u) {
    const a = {
        hasEvents: !1,
        events: []
    };
    let r = Bs(u);
    for (; r; ) {
        if (r.memoizedProps) {
            const o = Gv(r.memoizedProps);
            if (o.length > 0) {
                a.hasEvents = !0;
                const c = r.type?.displayName || r.type?.name || r.elementType?.name || "Unknown";
                a.events.push({
                    componentName: c,
                    eventNames: o,
                    props: r.memoizedProps
                })
            }
        }
        r = r.return || null
    }
    return a
}
function xg(u) {
    const a = Bs(u);
    return !a || !a.memoizedProps ? !1 : bg(a.memoizedProps)
}
function Cg(u=window) {
    u.__reactEventDetector__ = {
        hasReactInteractionEvents: Eg,
        getReactInteractionEventsDetail: _g,
        hasReactInteractionEventsOnSelf: xg,
        REACT_EVENT_PROPS: js
    },
    console.log("[ReactEventDetector] Injected to window.__reactEventDetector__")
}
typeof window < "u" && Cg(window);
function Tg(u) {
    return u ? Eg(u) || Hs(u) : !1
}
function Yv(u) {
    return u ? xg(u) || Hs(u) : !1
}
function qs(u) {
    const a = _g(u)
      , r = vg(u);
    return {
        hasEvents: a.hasEvents || r.hasEvents,
        react: a,
        native: r
    }
}
function Gs(u) {
    if (!u)
        return {
            error: "selector is required"
        };
    const a = document.querySelector(u);
    if (!a)
        return {
            error: "Element not found",
            selector: u
        };
    const r = qs(a);
    return {
        selector: u,
        hasEvents: r.hasEvents
    }
}
function Og(u, a) {
    if (typeof u != "number" || typeof a != "number")
        return {
            error: "x and y must be numbers"
        };
    const r = document.elementFromPoint(u, a);
    if (!r)
        return {
            error: "No element at point",
            x: u,
            y: a
        };
    const o = qs(r);
    return {
        x: u,
        y: a,
        hasEvents: o.hasEvents
    }
}
function Vv(u) {
    return u.map(a => ({
        element: a,
        hasEvents: Tg(a)
    }))
}
function Ag(u) {
    return u.map(a => ({
        selector: a,
        result: Gs(a)
    }))
}
const nm = "1.0.0";
function Qv() {
    window.__interactionDetector__ = {
        hasInteractionEvents: Tg,
        hasInteractionEventsOnSelf: Yv,
        getDetail: qs,
        checkBySelector: Gs,
        checkByPoint: Og,
        checkMultiple: Vv,
        checkMultipleSelectors: Ag,
        version: nm
    },
    console.log(`[InteractionDetector] Global API initialized (v${nm})`)
}
function Xv() {
    const u = new Kl(window.parent);
    u.on("checkInteraction", a => {
        const {selector: r, x: o, y: c} = a || {};
        return r ? Gs(r) : typeof o == "number" && typeof c == "number" ? Og(o, c) : {
            error: "Invalid params: need selector or (x, y)"
        }
    }
    ),
    u.on("checkMultipleSelectors", a => {
        const {selectors: r} = a || {};
        return !r || !Array.isArray(r) ? {
            error: "selectors array is required"
        } : Ag(r)
    }
    ),
    console.log("[InteractionDetector] PostMessage listener initialized")
}
function Zv() {
    Sg(),
    Cg(),
    Qv(),
    Xv(),
    console.log("[Continue] Module fully initialized")
}
function Kv(u) {
    return u && u.__esModule && Object.prototype.hasOwnProperty.call(u, "default") ? u.default : u
}
function kv(u) {
    if (Object.prototype.hasOwnProperty.call(u, "__esModule"))
        return u;
    var a = u.default;
    if (typeof a == "function") {
        var r = function o() {
            var c = !1;
            try {
                c = this instanceof o
            } catch {}
            return c ? Reflect.construct(a, arguments, this.constructor) : a.apply(this, arguments)
        };
        r.prototype = a.prototype
    } else
        r = {};
    return Object.defineProperty(r, "__esModule", {
        value: !0
    }),
    Object.keys(u).forEach(function(o) {
        var c = Object.getOwnPropertyDescriptor(u, o);
        Object.defineProperty(r, o, c.get ? c : {
            enumerable: !0,
            get: function() {
                return u[o]
            }
        })
    }),
    r
}
var Ya = {}, us = {}, rs = {}, os = {}, lm;
function Jv() {
    if (lm)
        return os;
    lm = 1;
    const u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    return os.encode = function(a) {
        if (0 <= a && a < u.length)
            return u[a];
        throw new TypeError("Must be between 0 and 63: " + a)
    }
    ,
    os
}
var am;
function Rg() {
    if (am)
        return rs;
    am = 1;
    const u = Jv()
      , a = 5
      , r = 1 << a
      , o = r - 1
      , c = r;
    function f(d) {
        return d < 0 ? (-d << 1) + 1 : (d << 1) + 0
    }
    return rs.encode = function(m) {
        let g = "", p, S = f(m);
        do
            p = S & o,
            S >>>= a,
            S > 0 && (p |= c),
            g += u.encode(p);
        while (S > 0);
        return g
    }
    ,
    rs
}
var Ut = {};
const $v = {}
  , Fv = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: $v
}, Symbol.toStringTag, {
    value: "Module"
}))
  , Wv = kv(Fv);
var ss, im;
function Iv() {
    return im || (im = 1,
    ss = typeof URL == "function" ? URL : Wv.URL),
    ss
}
var um;
function Uu() {
    if (um)
        return Ut;
    um = 1;
    const u = Iv();
    function a(V, X, K) {
        if (X in V)
            return V[X];
        if (arguments.length === 3)
            return K;
        throw new Error('"' + X + '" is a required argument.')
    }
    Ut.getArg = a;
    const r = (function() {
        return !("__proto__"in Object.create(null))
    }
    )();
    function o(V) {
        return V
    }
    function c(V) {
        return d(V) ? "$" + V : V
    }
    Ut.toSetString = r ? o : c;
    function f(V) {
        return d(V) ? V.slice(1) : V
    }
    Ut.fromSetString = r ? o : f;
    function d(V) {
        if (!V)
            return !1;
        const X = V.length;
        if (X < 9 || V.charCodeAt(X - 1) !== 95 || V.charCodeAt(X - 2) !== 95 || V.charCodeAt(X - 3) !== 111 || V.charCodeAt(X - 4) !== 116 || V.charCodeAt(X - 5) !== 111 || V.charCodeAt(X - 6) !== 114 || V.charCodeAt(X - 7) !== 112 || V.charCodeAt(X - 8) !== 95 || V.charCodeAt(X - 9) !== 95)
            return !1;
        for (let K = X - 10; K >= 0; K--)
            if (V.charCodeAt(K) !== 36)
                return !1;
        return !0
    }
    function m(V, X) {
        return V === X ? 0 : V === null ? 1 : X === null ? -1 : V > X ? 1 : -1
    }
    function g(V, X) {
        let K = V.generatedLine - X.generatedLine;
        return K !== 0 || (K = V.generatedColumn - X.generatedColumn,
        K !== 0) || (K = m(V.source, X.source),
        K !== 0) || (K = V.originalLine - X.originalLine,
        K !== 0) || (K = V.originalColumn - X.originalColumn,
        K !== 0) ? K : m(V.name, X.name)
    }
    Ut.compareByGeneratedPositionsInflated = g;
    function p(V) {
        return JSON.parse(V.replace(/^\)]}'[^\n]*\n/, ""))
    }
    Ut.parseSourceMapInput = p;
    const S = "http:"
      , v = `${S}//host`;
    function E(V) {
        return X => {
            const K = z(X)
              , te = A(X)
              , oe = new u(X,te);
            V(oe);
            const ce = oe.toString();
            return K === "absolute" ? ce : K === "scheme-relative" ? ce.slice(S.length) : K === "path-absolute" ? ce.slice(v.length) : q(te, ce)
        }
    }
    function b(V, X) {
        return new u(V,X).toString()
    }
    function _(V, X) {
        let K = 0;
        do {
            const te = V + K++;
            if (X.indexOf(te) === -1)
                return te
        } while (!0)
    }
    function A(V) {
        const X = V.split("..").length - 1
          , K = _("p", V);
        let te = `${v}/`;
        for (let oe = 0; oe < X; oe++)
            te += `${K}/`;
        return te
    }
    const x = /^[A-Za-z0-9\+\-\.]+:/;
    function z(V) {
        return V[0] === "/" ? V[1] === "/" ? "scheme-relative" : "path-absolute" : x.test(V) ? "absolute" : "path-relative"
    }
    function q(V, X) {
        typeof V == "string" && (V = new u(V)),
        typeof X == "string" && (X = new u(X));
        const K = X.pathname.split("/")
          , te = V.pathname.split("/");
        for (te.length > 0 && !te[te.length - 1] && te.pop(); K.length > 0 && te.length > 0 && K[0] === te[0]; )
            K.shift(),
            te.shift();
        return te.map( () => "..").concat(K).join("/") + X.search + X.hash
    }
    const Y = E(V => {
        V.pathname = V.pathname.replace(/\/?$/, "/")
    }
    )
      , k = E(V => {
        V.href = new u(".",V.toString()).toString()
    }
    )
      , F = E(V => {}
    );
    Ut.normalize = F;
    function re(V, X) {
        const K = z(X)
          , te = z(V);
        if (V = Y(V),
        K === "absolute")
            return b(X, void 0);
        if (te === "absolute")
            return b(X, V);
        if (K === "scheme-relative")
            return F(X);
        if (te === "scheme-relative")
            return b(X, b(V, v)).slice(S.length);
        if (K === "path-absolute")
            return F(X);
        if (te === "path-absolute")
            return b(X, b(V, v)).slice(v.length);
        const oe = A(X + V)
          , ce = b(X, b(V, oe));
        return q(oe, ce)
    }
    Ut.join = re;
    function W(V, X) {
        const K = pe(V, X);
        return typeof K == "string" ? K : F(X)
    }
    Ut.relative = W;
    function pe(V, X) {
        if (z(V) !== z(X))
            return null;
        const te = A(V + X)
          , oe = new u(V,te)
          , ce = new u(X,te);
        try {
            new u("",ce.toString())
        } catch {
            return null
        }
        return ce.protocol !== oe.protocol || ce.user !== oe.user || ce.password !== oe.password || ce.hostname !== oe.hostname || ce.port !== oe.port ? null : q(oe, ce)
    }
    function Ce(V, X, K) {
        V && z(X) === "path-absolute" && (X = X.replace(/^\//, ""));
        let te = F(X || "");
        return V && (te = re(V, te)),
        K && (te = re(k(K), te)),
        te
    }
    return Ut.computeSourceURL = Ce,
    Ut
}
var cs = {}, rm;
function wg() {
    if (rm)
        return cs;
    rm = 1;
    class u {
        constructor() {
            this._array = [],
            this._set = new Map
        }
        static fromArray(r, o) {
            const c = new u;
            for (let f = 0, d = r.length; f < d; f++)
                c.add(r[f], o);
            return c
        }
        size() {
            return this._set.size
        }
        add(r, o) {
            const c = this.has(r)
              , f = this._array.length;
            (!c || o) && this._array.push(r),
            c || this._set.set(r, f)
        }
        has(r) {
            return this._set.has(r)
        }
        indexOf(r) {
            const o = this._set.get(r);
            if (o >= 0)
                return o;
            throw new Error('"' + r + '" is not in the set.')
        }
        at(r) {
            if (r >= 0 && r < this._array.length)
                return this._array[r];
            throw new Error("No element indexed by " + r)
        }
        toArray() {
            return this._array.slice()
        }
    }
    return cs.ArraySet = u,
    cs
}
var fs = {}, om;
function Pv() {
    if (om)
        return fs;
    om = 1;
    const u = Uu();
    function a(o, c) {
        const f = o.generatedLine
          , d = c.generatedLine
          , m = o.generatedColumn
          , g = c.generatedColumn;
        return d > f || d == f && g >= m || u.compareByGeneratedPositionsInflated(o, c) <= 0
    }
    class r {
        constructor() {
            this._array = [],
            this._sorted = !0,
            this._last = {
                generatedLine: -1,
                generatedColumn: 0
            }
        }
        unsortedForEach(c, f) {
            this._array.forEach(c, f)
        }
        add(c) {
            a(this._last, c) ? (this._last = c,
            this._array.push(c)) : (this._sorted = !1,
            this._array.push(c))
        }
        toArray() {
            return this._sorted || (this._array.sort(u.compareByGeneratedPositionsInflated),
            this._sorted = !0),
            this._array
        }
    }
    return fs.MappingList = r,
    fs
}
var sm;
function Lg() {
    if (sm)
        return us;
    sm = 1;
    const u = Rg()
      , a = Uu()
      , r = wg().ArraySet
      , o = Pv().MappingList;
    class c {
        constructor(d) {
            d || (d = {}),
            this._file = a.getArg(d, "file", null),
            this._sourceRoot = a.getArg(d, "sourceRoot", null),
            this._skipValidation = a.getArg(d, "skipValidation", !1),
            this._sources = new r,
            this._names = new r,
            this._mappings = new o,
            this._sourcesContents = null
        }
        static fromSourceMap(d) {
            const m = d.sourceRoot
              , g = new c({
                file: d.file,
                sourceRoot: m
            });
            return d.eachMapping(function(p) {
                const S = {
                    generated: {
                        line: p.generatedLine,
                        column: p.generatedColumn
                    }
                };
                p.source != null && (S.source = p.source,
                m != null && (S.source = a.relative(m, S.source)),
                S.original = {
                    line: p.originalLine,
                    column: p.originalColumn
                },
                p.name != null && (S.name = p.name)),
                g.addMapping(S)
            }),
            d.sources.forEach(function(p) {
                let S = p;
                m != null && (S = a.relative(m, p)),
                g._sources.has(S) || g._sources.add(S);
                const v = d.sourceContentFor(p);
                v != null && g.setSourceContent(p, v)
            }),
            g
        }
        addMapping(d) {
            const m = a.getArg(d, "generated")
              , g = a.getArg(d, "original", null);
            let p = a.getArg(d, "source", null)
              , S = a.getArg(d, "name", null);
            this._skipValidation || this._validateMapping(m, g, p, S),
            p != null && (p = String(p),
            this._sources.has(p) || this._sources.add(p)),
            S != null && (S = String(S),
            this._names.has(S) || this._names.add(S)),
            this._mappings.add({
                generatedLine: m.line,
                generatedColumn: m.column,
                originalLine: g && g.line,
                originalColumn: g && g.column,
                source: p,
                name: S
            })
        }
        setSourceContent(d, m) {
            let g = d;
            this._sourceRoot != null && (g = a.relative(this._sourceRoot, g)),
            m != null ? (this._sourcesContents || (this._sourcesContents = Object.create(null)),
            this._sourcesContents[a.toSetString(g)] = m) : this._sourcesContents && (delete this._sourcesContents[a.toSetString(g)],
            Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null))
        }
        applySourceMap(d, m, g) {
            let p = m;
            if (m == null) {
                if (d.file == null)
                    throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
                p = d.file
            }
            const S = this._sourceRoot;
            S != null && (p = a.relative(S, p));
            const v = this._mappings.toArray().length > 0 ? new r : this._sources
              , E = new r;
            this._mappings.unsortedForEach(function(b) {
                if (b.source === p && b.originalLine != null) {
                    const x = d.originalPositionFor({
                        line: b.originalLine,
                        column: b.originalColumn
                    });
                    x.source != null && (b.source = x.source,
                    g != null && (b.source = a.join(g, b.source)),
                    S != null && (b.source = a.relative(S, b.source)),
                    b.originalLine = x.line,
                    b.originalColumn = x.column,
                    x.name != null && (b.name = x.name))
                }
                const _ = b.source;
                _ != null && !v.has(_) && v.add(_);
                const A = b.name;
                A != null && !E.has(A) && E.add(A)
            }, this),
            this._sources = v,
            this._names = E,
            d.sources.forEach(function(b) {
                const _ = d.sourceContentFor(b);
                _ != null && (g != null && (b = a.join(g, b)),
                S != null && (b = a.relative(S, b)),
                this.setSourceContent(b, _))
            }, this)
        }
        _validateMapping(d, m, g, p) {
            if (m && typeof m.line != "number" && typeof m.column != "number")
                throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
            if (!(d && "line"in d && "column"in d && d.line > 0 && d.column >= 0 && !m && !g && !p)) {
                if (!(d && "line"in d && "column"in d && m && "line"in m && "column"in m && d.line > 0 && d.column >= 0 && m.line > 0 && m.column >= 0 && g))
                    throw new Error("Invalid mapping: " + JSON.stringify({
                        generated: d,
                        source: g,
                        original: m,
                        name: p
                    }))
            }
        }
        _serializeMappings() {
            let d = 0, m = 1, g = 0, p = 0, S = 0, v = 0, E = "", b, _, A, x;
            const z = this._mappings.toArray();
            for (let q = 0, Y = z.length; q < Y; q++) {
                if (_ = z[q],
                b = "",
                _.generatedLine !== m)
                    for (d = 0; _.generatedLine !== m; )
                        b += ";",
                        m++;
                else if (q > 0) {
                    if (!a.compareByGeneratedPositionsInflated(_, z[q - 1]))
                        continue;
                    b += ","
                }
                b += u.encode(_.generatedColumn - d),
                d = _.generatedColumn,
                _.source != null && (x = this._sources.indexOf(_.source),
                b += u.encode(x - v),
                v = x,
                b += u.encode(_.originalLine - 1 - p),
                p = _.originalLine - 1,
                b += u.encode(_.originalColumn - g),
                g = _.originalColumn,
                _.name != null && (A = this._names.indexOf(_.name),
                b += u.encode(A - S),
                S = A)),
                E += b
            }
            return E
        }
        _generateSourcesContent(d, m) {
            return d.map(function(g) {
                if (!this._sourcesContents)
                    return null;
                m != null && (g = a.relative(m, g));
                const p = a.toSetString(g);
                return Object.prototype.hasOwnProperty.call(this._sourcesContents, p) ? this._sourcesContents[p] : null
            }, this)
        }
        toJSON() {
            const d = {
                version: this._version,
                sources: this._sources.toArray(),
                names: this._names.toArray(),
                mappings: this._serializeMappings()
            };
            return this._file != null && (d.file = this._file),
            this._sourceRoot != null && (d.sourceRoot = this._sourceRoot),
            this._sourcesContents && (d.sourcesContent = this._generateSourcesContent(d.sources, d.sourceRoot)),
            d
        }
        toString() {
            return JSON.stringify(this.toJSON())
        }
    }
    return c.prototype._version = 3,
    us.SourceMapGenerator = c,
    us
}
var Va = {}, ds = {}, cm;
function e0() {
    return cm || (cm = 1,
    (function(u) {
        u.GREATEST_LOWER_BOUND = 1,
        u.LEAST_UPPER_BOUND = 2;
        function a(r, o, c, f, d, m) {
            const g = Math.floor((o - r) / 2) + r
              , p = d(c, f[g], !0);
            return p === 0 ? g : p > 0 ? o - g > 1 ? a(g, o, c, f, d, m) : m === u.LEAST_UPPER_BOUND ? o < f.length ? o : -1 : g : g - r > 1 ? a(r, g, c, f, d, m) : m == u.LEAST_UPPER_BOUND ? g : r < 0 ? -1 : r
        }
        u.search = function(o, c, f, d) {
            if (c.length === 0)
                return -1;
            let m = a(-1, c.length, o, c, f, d || u.GREATEST_LOWER_BOUND);
            if (m < 0)
                return -1;
            for (; m - 1 >= 0 && f(c[m], c[m - 1], !0) === 0; )
                --m;
            return m
        }
    }
    )(ds)),
    ds
}
var _u = {
    exports: {}
}, fm;
function Mg() {
    if (fm)
        return _u.exports;
    fm = 1;
    let u = null;
    return _u.exports = function() {
        if (typeof u == "string")
            return fetch(u).then(r => r.arrayBuffer());
        if (u instanceof ArrayBuffer)
            return Promise.resolve(u);
        throw new Error("You must provide the string URL or ArrayBuffer contents of lib/mappings.wasm by calling SourceMapConsumer.initialize({ 'lib/mappings.wasm': ... }) before using SourceMapConsumer")
    }
    ,
    _u.exports.initialize = a => {
        u = a
    }
    ,
    _u.exports
}
var hs, dm;
function t0() {
    if (dm)
        return hs;
    dm = 1;
    const u = Mg();
    function a() {
        this.generatedLine = 0,
        this.generatedColumn = 0,
        this.lastGeneratedColumn = null,
        this.source = null,
        this.originalLine = null,
        this.originalColumn = null,
        this.name = null
    }
    let r = null;
    return hs = function() {
        if (r)
            return r;
        const c = [];
        return r = u().then(f => WebAssembly.instantiate(f, {
            env: {
                mapping_callback(d, m, g, p, S, v, E, b, _, A) {
                    const x = new a;
                    x.generatedLine = d + 1,
                    x.generatedColumn = m,
                    g && (x.lastGeneratedColumn = p - 1),
                    S && (x.source = v,
                    x.originalLine = E + 1,
                    x.originalColumn = b,
                    _ && (x.name = A)),
                    c[c.length - 1](x)
                },
                start_all_generated_locations_for() {
                    console.time("all_generated_locations_for")
                },
                end_all_generated_locations_for() {
                    console.timeEnd("all_generated_locations_for")
                },
                start_compute_column_spans() {
                    console.time("compute_column_spans")
                },
                end_compute_column_spans() {
                    console.timeEnd("compute_column_spans")
                },
                start_generated_location_for() {
                    console.time("generated_location_for")
                },
                end_generated_location_for() {
                    console.timeEnd("generated_location_for")
                },
                start_original_location_for() {
                    console.time("original_location_for")
                },
                end_original_location_for() {
                    console.timeEnd("original_location_for")
                },
                start_parse_mappings() {
                    console.time("parse_mappings")
                },
                end_parse_mappings() {
                    console.timeEnd("parse_mappings")
                },
                start_sort_by_generated_location() {
                    console.time("sort_by_generated_location")
                },
                end_sort_by_generated_location() {
                    console.timeEnd("sort_by_generated_location")
                },
                start_sort_by_original_location() {
                    console.time("sort_by_original_location")
                },
                end_sort_by_original_location() {
                    console.timeEnd("sort_by_original_location")
                }
            }
        })).then(f => ({
            exports: f.instance.exports,
            withMappingCallback: (d, m) => {
                c.push(d);
                try {
                    m()
                } finally {
                    c.pop()
                }
            }
        })).then(null, f => {
            throw r = null,
            f
        }
        ),
        r
    }
    ,
    hs
}
var hm;
function n0() {
    if (hm)
        return Va;
    hm = 1;
    const u = Uu()
      , a = e0()
      , r = wg().ArraySet;
    Rg();
    const o = Mg()
      , c = t0()
      , f = Symbol("smcInternal");
    class d {
        constructor(E, b) {
            return E == f ? Promise.resolve(this) : p(E, b)
        }
        static initialize(E) {
            o.initialize(E["lib/mappings.wasm"])
        }
        static fromSourceMap(E, b) {
            return S(E, b)
        }
        static async with(E, b, _) {
            const A = await new d(E,b);
            try {
                return await _(A)
            } finally {
                A.destroy()
            }
        }
        eachMapping(E, b, _) {
            throw new Error("Subclasses must implement eachMapping")
        }
        allGeneratedPositionsFor(E) {
            throw new Error("Subclasses must implement allGeneratedPositionsFor")
        }
        destroy() {
            throw new Error("Subclasses must implement destroy")
        }
    }
    d.prototype._version = 3,
    d.GENERATED_ORDER = 1,
    d.ORIGINAL_ORDER = 2,
    d.GREATEST_LOWER_BOUND = 1,
    d.LEAST_UPPER_BOUND = 2,
    Va.SourceMapConsumer = d;
    class m extends d {
        constructor(E, b) {
            return super(f).then(_ => {
                let A = E;
                typeof E == "string" && (A = u.parseSourceMapInput(E));
                const x = u.getArg(A, "version")
                  , z = u.getArg(A, "sources").map(String)
                  , q = u.getArg(A, "names", [])
                  , Y = u.getArg(A, "sourceRoot", null)
                  , k = u.getArg(A, "sourcesContent", null)
                  , F = u.getArg(A, "mappings")
                  , re = u.getArg(A, "file", null)
                  , W = u.getArg(A, "x_google_ignoreList", null);
                if (x != _._version)
                    throw new Error("Unsupported version: " + x);
                return _._sourceLookupCache = new Map,
                _._names = r.fromArray(q.map(String), !0),
                _._sources = r.fromArray(z, !0),
                _._absoluteSources = r.fromArray(_._sources.toArray().map(function(pe) {
                    return u.computeSourceURL(Y, pe, b)
                }), !0),
                _.sourceRoot = Y,
                _.sourcesContent = k,
                _._mappings = F,
                _._sourceMapURL = b,
                _.file = re,
                _.x_google_ignoreList = W,
                _._computedColumnSpans = !1,
                _._mappingsPtr = 0,
                _._wasm = null,
                c().then(pe => (_._wasm = pe,
                _))
            }
            )
        }
        _findSourceIndex(E) {
            const b = this._sourceLookupCache.get(E);
            if (typeof b == "number")
                return b;
            const _ = u.computeSourceURL(null, E, this._sourceMapURL);
            if (this._absoluteSources.has(_)) {
                const x = this._absoluteSources.indexOf(_);
                return this._sourceLookupCache.set(E, x),
                x
            }
            const A = u.computeSourceURL(this.sourceRoot, E, this._sourceMapURL);
            if (this._absoluteSources.has(A)) {
                const x = this._absoluteSources.indexOf(A);
                return this._sourceLookupCache.set(E, x),
                x
            }
            return -1
        }
        static fromSourceMap(E, b) {
            return new m(E.toString())
        }
        get sources() {
            return this._absoluteSources.toArray()
        }
        _getMappingsPtr() {
            return this._mappingsPtr === 0 && this._parseMappings(),
            this._mappingsPtr
        }
        _parseMappings() {
            const E = this._mappings
              , b = E.length
              , _ = this._wasm.exports.allocate_mappings(b) >>> 0
              , A = new Uint8Array(this._wasm.exports.memory.buffer,_,b);
            for (let z = 0; z < b; z++)
                A[z] = E.charCodeAt(z);
            const x = this._wasm.exports.parse_mappings(_);
            if (!x) {
                const z = this._wasm.exports.get_last_error();
                let q = `Error parsing mappings (code ${z}): `;
                switch (z) {
                case 1:
                    q += "the mappings contained a negative line, column, source index, or name index";
                    break;
                case 2:
                    q += "the mappings contained a number larger than 2**32";
                    break;
                case 3:
                    q += "reached EOF while in the middle of parsing a VLQ";
                    break;
                case 4:
                    q += "invalid base 64 character while parsing a VLQ";
                    break;
                default:
                    q += "unknown error code";
                    break
                }
                throw new Error(q)
            }
            this._mappingsPtr = x
        }
        eachMapping(E, b, _) {
            const A = b || null
              , x = _ || d.GENERATED_ORDER;
            this._wasm.withMappingCallback(z => {
                z.source !== null && (z.source = this._absoluteSources.at(z.source),
                z.name !== null && (z.name = this._names.at(z.name))),
                this._computedColumnSpans && z.lastGeneratedColumn === null && (z.lastGeneratedColumn = 1 / 0),
                E.call(A, z)
            }
            , () => {
                switch (x) {
                case d.GENERATED_ORDER:
                    this._wasm.exports.by_generated_location(this._getMappingsPtr());
                    break;
                case d.ORIGINAL_ORDER:
                    this._wasm.exports.by_original_location(this._getMappingsPtr());
                    break;
                default:
                    throw new Error("Unknown order of iteration.")
                }
            }
            )
        }
        allGeneratedPositionsFor(E) {
            let b = u.getArg(E, "source");
            const _ = u.getArg(E, "line")
              , A = E.column || 0;
            if (b = this._findSourceIndex(b),
            b < 0)
                return [];
            if (_ < 1)
                throw new Error("Line numbers must be >= 1");
            if (A < 0)
                throw new Error("Column numbers must be >= 0");
            const x = [];
            return this._wasm.withMappingCallback(z => {
                let q = z.lastGeneratedColumn;
                this._computedColumnSpans && q === null && (q = 1 / 0),
                x.push({
                    line: z.generatedLine,
                    column: z.generatedColumn,
                    lastColumn: q
                })
            }
            , () => {
                this._wasm.exports.all_generated_locations_for(this._getMappingsPtr(), b, _ - 1, "column"in E, A)
            }
            ),
            x
        }
        destroy() {
            this._mappingsPtr !== 0 && (this._wasm.exports.free_mappings(this._mappingsPtr),
            this._mappingsPtr = 0)
        }
        computeColumnSpans() {
            this._computedColumnSpans || (this._wasm.exports.compute_column_spans(this._getMappingsPtr()),
            this._computedColumnSpans = !0)
        }
        originalPositionFor(E) {
            const b = {
                generatedLine: u.getArg(E, "line"),
                generatedColumn: u.getArg(E, "column")
            };
            if (b.generatedLine < 1)
                throw new Error("Line numbers must be >= 1");
            if (b.generatedColumn < 0)
                throw new Error("Column numbers must be >= 0");
            let _ = u.getArg(E, "bias", d.GREATEST_LOWER_BOUND);
            _ == null && (_ = d.GREATEST_LOWER_BOUND);
            let A;
            if (this._wasm.withMappingCallback(x => A = x, () => {
                this._wasm.exports.original_location_for(this._getMappingsPtr(), b.generatedLine - 1, b.generatedColumn, _)
            }
            ),
            A && A.generatedLine === b.generatedLine) {
                let x = u.getArg(A, "source", null);
                x !== null && (x = this._absoluteSources.at(x));
                let z = u.getArg(A, "name", null);
                return z !== null && (z = this._names.at(z)),
                {
                    source: x,
                    line: u.getArg(A, "originalLine", null),
                    column: u.getArg(A, "originalColumn", null),
                    name: z
                }
            }
            return {
                source: null,
                line: null,
                column: null,
                name: null
            }
        }
        hasContentsOfAllSources() {
            return this.sourcesContent ? this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(E) {
                return E == null
            }) : !1
        }
        sourceContentFor(E, b) {
            if (!this.sourcesContent)
                return null;
            const _ = this._findSourceIndex(E);
            if (_ >= 0)
                return this.sourcesContent[_];
            if (b)
                return null;
            throw new Error('"' + E + '" is not in the SourceMap.')
        }
        generatedPositionFor(E) {
            let b = u.getArg(E, "source");
            if (b = this._findSourceIndex(b),
            b < 0)
                return {
                    line: null,
                    column: null,
                    lastColumn: null
                };
            const _ = {
                source: b,
                originalLine: u.getArg(E, "line"),
                originalColumn: u.getArg(E, "column")
            };
            if (_.originalLine < 1)
                throw new Error("Line numbers must be >= 1");
            if (_.originalColumn < 0)
                throw new Error("Column numbers must be >= 0");
            let A = u.getArg(E, "bias", d.GREATEST_LOWER_BOUND);
            A == null && (A = d.GREATEST_LOWER_BOUND);
            let x;
            if (this._wasm.withMappingCallback(z => x = z, () => {
                this._wasm.exports.generated_location_for(this._getMappingsPtr(), _.source, _.originalLine - 1, _.originalColumn, A)
            }
            ),
            x && x.source === _.source) {
                let z = x.lastGeneratedColumn;
                return this._computedColumnSpans && z === null && (z = 1 / 0),
                {
                    line: u.getArg(x, "generatedLine", null),
                    column: u.getArg(x, "generatedColumn", null),
                    lastColumn: z
                }
            }
            return {
                line: null,
                column: null,
                lastColumn: null
            }
        }
    }
    m.prototype.consumer = d,
    Va.BasicSourceMapConsumer = m;
    class g extends d {
        constructor(E, b) {
            return super(f).then(_ => {
                let A = E;
                typeof E == "string" && (A = u.parseSourceMapInput(E));
                const x = u.getArg(A, "version")
                  , z = u.getArg(A, "sections");
                if (x != _._version)
                    throw new Error("Unsupported version: " + x);
                let q = {
                    line: -1,
                    column: 0
                };
                return Promise.all(z.map(Y => {
                    if (Y.url)
                        throw new Error("Support for url field in sections not implemented.");
                    const k = u.getArg(Y, "offset")
                      , F = u.getArg(k, "line")
                      , re = u.getArg(k, "column");
                    if (F < q.line || F === q.line && re < q.column)
                        throw new Error("Section offsets must be ordered and non-overlapping.");
                    return q = k,
                    new d(u.getArg(Y, "map"),b).then(pe => ({
                        generatedOffset: {
                            generatedLine: F + 1,
                            generatedColumn: re + 1
                        },
                        consumer: pe
                    }))
                }
                )).then(Y => (_._sections = Y,
                _))
            }
            )
        }
        get sources() {
            const E = [];
            for (let b = 0; b < this._sections.length; b++)
                for (let _ = 0; _ < this._sections[b].consumer.sources.length; _++)
                    E.push(this._sections[b].consumer.sources[_]);
            return E
        }
        originalPositionFor(E) {
            const b = {
                generatedLine: u.getArg(E, "line"),
                generatedColumn: u.getArg(E, "column")
            }
              , _ = a.search(b, this._sections, function(x, z) {
                const q = x.generatedLine - z.generatedOffset.generatedLine;
                return q || x.generatedColumn - (z.generatedOffset.generatedColumn - 1)
            })
              , A = this._sections[_];
            return A ? A.consumer.originalPositionFor({
                line: b.generatedLine - (A.generatedOffset.generatedLine - 1),
                column: b.generatedColumn - (A.generatedOffset.generatedLine === b.generatedLine ? A.generatedOffset.generatedColumn - 1 : 0),
                bias: E.bias
            }) : {
                source: null,
                line: null,
                column: null,
                name: null
            }
        }
        hasContentsOfAllSources() {
            return this._sections.every(function(E) {
                return E.consumer.hasContentsOfAllSources()
            })
        }
        sourceContentFor(E, b) {
            for (let _ = 0; _ < this._sections.length; _++) {
                const x = this._sections[_].consumer.sourceContentFor(E, !0);
                if (x)
                    return x
            }
            if (b)
                return null;
            throw new Error('"' + E + '" is not in the SourceMap.')
        }
        _findSectionIndex(E) {
            for (let b = 0; b < this._sections.length; b++) {
                const {consumer: _} = this._sections[b];
                if (_._findSourceIndex(E) !== -1)
                    return b
            }
            return -1
        }
        generatedPositionFor(E) {
            const b = this._findSectionIndex(u.getArg(E, "source"))
              , _ = b >= 0 ? this._sections[b] : null
              , A = b >= 0 && b + 1 < this._sections.length ? this._sections[b + 1] : null
              , x = _ && _.consumer.generatedPositionFor(E);
            if (x && x.line !== null) {
                const z = _.generatedOffset.generatedLine - 1
                  , q = _.generatedOffset.generatedColumn - 1;
                return x.line === 1 && (x.column += q,
                typeof x.lastColumn == "number" && (x.lastColumn += q)),
                x.lastColumn === 1 / 0 && A && x.line === A.generatedOffset.generatedLine && (x.lastColumn = A.generatedOffset.generatedColumn - 2),
                x.line += z,
                x
            }
            return {
                line: null,
                column: null,
                lastColumn: null
            }
        }
        allGeneratedPositionsFor(E) {
            const b = this._findSectionIndex(u.getArg(E, "source"))
              , _ = b >= 0 ? this._sections[b] : null
              , A = b >= 0 && b + 1 < this._sections.length ? this._sections[b + 1] : null;
            return _ ? _.consumer.allGeneratedPositionsFor(E).map(x => {
                const z = _.generatedOffset.generatedLine - 1
                  , q = _.generatedOffset.generatedColumn - 1;
                return x.line === 1 && (x.column += q,
                typeof x.lastColumn == "number" && (x.lastColumn += q)),
                x.lastColumn === 1 / 0 && A && x.line === A.generatedOffset.generatedLine && (x.lastColumn = A.generatedOffset.generatedColumn - 2),
                x.line += z,
                x
            }
            ) : []
        }
        eachMapping(E, b, _) {
            this._sections.forEach( (A, x) => {
                const z = x + 1 < this._sections.length ? this._sections[x + 1] : null
                  , {generatedOffset: q} = A
                  , Y = q.generatedLine - 1
                  , k = q.generatedColumn - 1;
                A.consumer.eachMapping(function(F) {
                    F.generatedLine === 1 && (F.generatedColumn += k,
                    typeof F.lastGeneratedColumn == "number" && (F.lastGeneratedColumn += k)),
                    F.lastGeneratedColumn === 1 / 0 && z && F.generatedLine === z.generatedOffset.generatedLine && (F.lastGeneratedColumn = z.generatedOffset.generatedColumn - 2),
                    F.generatedLine += Y,
                    E.call(this, F)
                }, b, _)
            }
            )
        }
        computeColumnSpans() {
            for (let E = 0; E < this._sections.length; E++)
                this._sections[E].consumer.computeColumnSpans()
        }
        destroy() {
            for (let E = 0; E < this._sections.length; E++)
                this._sections[E].consumer.destroy()
        }
    }
    Va.IndexedSourceMapConsumer = g;
    function p(v, E) {
        let b = v;
        typeof v == "string" && (b = u.parseSourceMapInput(v));
        const _ = b.sections != null ? new g(b,E) : new m(b,E);
        return Promise.resolve(_)
    }
    function S(v, E) {
        return m.fromSourceMap(v, E)
    }
    return Va
}
var ms = {}, mm;
function l0() {
    if (mm)
        return ms;
    mm = 1;
    const u = Lg().SourceMapGenerator
      , a = Uu()
      , r = /(\r?\n)/
      , o = 10
      , c = "$$$isSourceNode$$$";
    class f {
        constructor(m, g, p, S, v) {
            this.children = [],
            this.sourceContents = {},
            this.line = m ?? null,
            this.column = g ?? null,
            this.source = p ?? null,
            this.name = v ?? null,
            this[c] = !0,
            S != null && this.add(S)
        }
        static fromStringWithSourceMap(m, g, p) {
            const S = new f
              , v = m.split(r);
            let E = 0;
            const b = function() {
                const Y = F()
                  , k = F() || "";
                return Y + k;
                function F() {
                    return E < v.length ? v[E++] : void 0
                }
            };
            let _ = 1, A = 0, x = null, z;
            return g.eachMapping(function(Y) {
                if (x !== null)
                    if (_ < Y.generatedLine)
                        q(x, b()),
                        _++,
                        A = 0;
                    else {
                        z = v[E] || "";
                        const k = z.substr(0, Y.generatedColumn - A);
                        v[E] = z.substr(Y.generatedColumn - A),
                        A = Y.generatedColumn,
                        q(x, k),
                        x = Y;
                        return
                    }
                for (; _ < Y.generatedLine; )
                    S.add(b()),
                    _++;
                A < Y.generatedColumn && (z = v[E] || "",
                S.add(z.substr(0, Y.generatedColumn)),
                v[E] = z.substr(Y.generatedColumn),
                A = Y.generatedColumn),
                x = Y
            }, this),
            E < v.length && (x && q(x, b()),
            S.add(v.splice(E).join(""))),
            g.sources.forEach(function(Y) {
                const k = g.sourceContentFor(Y);
                k != null && (p != null && (Y = a.join(p, Y)),
                S.setSourceContent(Y, k))
            }),
            S;
            function q(Y, k) {
                if (Y === null || Y.source === void 0)
                    S.add(k);
                else {
                    const F = p ? a.join(p, Y.source) : Y.source;
                    S.add(new f(Y.originalLine,Y.originalColumn,F,k,Y.name))
                }
            }
        }
        add(m) {
            if (Array.isArray(m))
                m.forEach(function(g) {
                    this.add(g)
                }, this);
            else if (m[c] || typeof m == "string")
                m && this.children.push(m);
            else
                throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + m);
            return this
        }
        prepend(m) {
            if (Array.isArray(m))
                for (let g = m.length - 1; g >= 0; g--)
                    this.prepend(m[g]);
            else if (m[c] || typeof m == "string")
                this.children.unshift(m);
            else
                throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + m);
            return this
        }
        walk(m) {
            let g;
            for (let p = 0, S = this.children.length; p < S; p++)
                g = this.children[p],
                g[c] ? g.walk(m) : g !== "" && m(g, {
                    source: this.source,
                    line: this.line,
                    column: this.column,
                    name: this.name
                })
        }
        join(m) {
            let g, p;
            const S = this.children.length;
            if (S > 0) {
                for (g = [],
                p = 0; p < S - 1; p++)
                    g.push(this.children[p]),
                    g.push(m);
                g.push(this.children[p]),
                this.children = g
            }
            return this
        }
        replaceRight(m, g) {
            const p = this.children[this.children.length - 1];
            return p[c] ? p.replaceRight(m, g) : typeof p == "string" ? this.children[this.children.length - 1] = p.replace(m, g) : this.children.push("".replace(m, g)),
            this
        }
        setSourceContent(m, g) {
            this.sourceContents[a.toSetString(m)] = g
        }
        walkSourceContents(m) {
            for (let p = 0, S = this.children.length; p < S; p++)
                this.children[p][c] && this.children[p].walkSourceContents(m);
            const g = Object.keys(this.sourceContents);
            for (let p = 0, S = g.length; p < S; p++)
                m(a.fromSetString(g[p]), this.sourceContents[g[p]])
        }
        toString() {
            let m = "";
            return this.walk(function(g) {
                m += g
            }),
            m
        }
        toStringWithSourceMap(m) {
            const g = {
                code: "",
                line: 1,
                column: 0
            }
              , p = new u(m);
            let S = !1
              , v = null
              , E = null
              , b = null
              , _ = null;
            return this.walk(function(A, x) {
                g.code += A,
                x.source !== null && x.line !== null && x.column !== null ? ((v !== x.source || E !== x.line || b !== x.column || _ !== x.name) && p.addMapping({
                    source: x.source,
                    original: {
                        line: x.line,
                        column: x.column
                    },
                    generated: {
                        line: g.line,
                        column: g.column
                    },
                    name: x.name
                }),
                v = x.source,
                E = x.line,
                b = x.column,
                _ = x.name,
                S = !0) : S && (p.addMapping({
                    generated: {
                        line: g.line,
                        column: g.column
                    }
                }),
                v = null,
                S = !1);
                for (let z = 0, q = A.length; z < q; z++)
                    A.charCodeAt(z) === o ? (g.line++,
                    g.column = 0,
                    z + 1 === q ? (v = null,
                    S = !1) : S && p.addMapping({
                        source: x.source,
                        original: {
                            line: x.line,
                            column: x.column
                        },
                        generated: {
                            line: g.line,
                            column: g.column
                        },
                        name: x.name
                    })) : g.column++
            }),
            this.walkSourceContents(function(A, x) {
                p.setSourceContent(A, x)
            }),
            {
                code: g.code,
                map: p
            }
        }
    }
    return ms.SourceNode = f,
    ms
}
var gm;
function a0() {
    return gm || (gm = 1,
    Ya.SourceMapGenerator = Lg().SourceMapGenerator,
    Ya.SourceMapConsumer = n0().SourceMapConsumer,
    Ya.SourceNode = l0().SourceNode),
    Ya
}
var Ms = a0();
function i0(u, a, r) {
    const o = u[a];
    if (!o)
        return {
            lineIndex: a,
            column: r
        };
    const c = o.trim()
      , f = /^<\/[A-Za-z][A-Za-z0-9\-_.]*\s*>$/.test(c)
      , d = /<\/[A-Za-z][A-Za-z0-9\-_.]*\s*>$/.test(c);
    let m = !1;
    if (r != null) {
        const g = o.substring(0, r);
        m = /<\/[A-Za-z][A-Za-z0-9\-_.]*\s*>$/.test(g)
    }
    if (f || d || m) {
        if (r != null) {
            const g = o.substring(r)
              , p = g.match(/<([A-Za-z][A-Za-z0-9\-_.]*)/);
            if (p && g[p.index + 1] !== "/")
                return {
                    lineIndex: a,
                    column: r + p.index + 1
                }
        }
        for (let g = a + 1; g < u.length && g < a + 50; g++) {
            const p = u[g]
              , S = p.match(/<([A-Za-z][A-Za-z0-9\-_.]*)/);
            if (S && p[S.index + 1] !== "/")
                return {
                    lineIndex: g,
                    column: S.index + 1
                }
        }
    }
    return {
        lineIndex: a,
        column: r
    }
}
function Ys(u, a, r) {
    let o = 0;
    for (let c = a; c < u.length; c++) {
        const f = u[c]
          , d = c === a ? r : 0;
        for (let m = d; m < f.length; m++) {
            const g = f[m];
            if (g === "{")
                o++;
            else if (g === "}")
                o--;
            else if (o === 0) {
                if (g === "/" && f[m + 1] === ">")
                    return {
                        lineIndex: c,
                        columnEnd: m + 2,
                        isSelfClosing: !0
                    };
                if (g === ">")
                    return {
                        lineIndex: c,
                        columnEnd: m + 1,
                        isSelfClosing: !1
                    }
            }
        }
    }
}
function zg(u, a, r, o) {
    let c = 1;
    const f = new RegExp(`<${a}(?=\\s|>|/>)`,"g")
      , d = new RegExp(`</${a}\\s*>`,"g");
    for (let m = r; m < u.length; m++) {
        const g = m === r ? o : 0
          , p = u[m].substring(g)
          , S = [];
        let v;
        for (f.lastIndex = 0; (v = f.exec(p)) !== null; ) {
            const E = Ys([p], 0, v.index + v[0].length);
            E && !E.isSelfClosing && S.push({
                type: "open",
                index: v.index,
                length: v[0].length
            })
        }
        for (d.lastIndex = 0; (v = d.exec(p)) !== null; )
            S.push({
                type: "close",
                index: v.index,
                length: v[0].length
            });
        S.sort( (E, b) => E.index - b.index);
        for (const E of S)
            if (E.type === "open")
                c++;
            else if (E.type === "close" && (c--,
            c === 0))
                return {
                    lineIndex: m,
                    columnEnd: g + E.index + E.length
                }
    }
}
function pm(u, a, r) {
    let o;
    for (let c = a; c >= 0; c--) {
        const f = u[c]
          , d = /<([A-Za-z][A-Za-z0-9\-_.]*)/g;
        let m;
        for (; (m = d.exec(f)) !== null; ) {
            const g = m.index
              , p = m[1];
            if (f[g + 1] === "/" || !(c < a || c === a && g <= (r ?? f.length)))
                continue;
            const v = g + m[0].length
              , E = Ys(u, c, v);
            if (!E)
                continue;
            let b = c
              , _ = E.columnEnd;
            if (!E.isSelfClosing) {
                const x = zg(u, p, c, E.columnEnd);
                if (!x)
                    continue;
                b = x.lineIndex,
                _ = x.columnEnd
            }
            (c < a || c === a && g <= (r ?? f.length)) && (b > a || b === a && _ >= (r ?? 0)) && (!o || b - c < o.closeLineIndex - o.lineIndex || b - c === o.closeLineIndex - o.lineIndex && _ - g < o.closeColumnEnd - o.columnStart) && (o = {
                tagName: p,
                lineIndex: c,
                columnStart: g,
                columnEnd: E.columnEnd,
                isSelfClosing: E.isSelfClosing,
                closeLineIndex: b,
                closeColumnEnd: _
            })
        }
    }
    return o
}
function u0(u, a, r) {
    const o = new RegExp(`<(${r})(?=\\s|>|/>)`,"i");
    for (let c = a + 1; c < u.length && c < a + 50; c++) {
        const f = u[c]
          , d = o.exec(f);
        if (d) {
            const m = d.index
              , g = d[1]
              , p = m + d[0].length
              , S = Ys(u, c, p);
            if (!S)
                continue;
            let v = c
              , E = S.columnEnd;
            if (!S.isSelfClosing) {
                const b = zg(u, g, c, S.columnEnd);
                if (!b)
                    continue;
                v = b.lineIndex,
                E = b.columnEnd
            }
            return {
                tagName: g,
                lineIndex: c,
                columnStart: m,
                columnEnd: S.columnEnd,
                isSelfClosing: S.isSelfClosing,
                closeLineIndex: v,
                closeColumnEnd: E
            }
        }
    }
}
function r0(u, a, r, o, c) {
    if (a === o)
        return u[a].substring(r, c);
    let f = u[a].substring(r);
    for (let d = a + 1; d < o; d++)
        f += `
` + u[d];
    return f += `
` + u[o].substring(0, c),
    f
}
function o0(u, a, r=10) {
    const o = u.split(`
`)
      , c = Math.max(0, a - r - 1)
      , f = Math.min(o.length - 1, a + r - 1)
      , d = [];
    for (let m = c; m <= f; m++) {
        const g = m + 1
          , v = `${g === a ? ">>>" : "   "} ${g.toString().padStart(4, " ")} | ${o[m] || ""}`;
        d.push(v)
    }
    return d.join(`
`)
}
async function s0(u) {
    try {
        const a = await fetch(u);
        if (!a.ok)
            throw new Error(`Failed to load source map: ${a.status}`);
        return await a.json()
    } catch (a) {
        const r = a instanceof Error ? a.message : String(a);
        console.warn("Error loading source map from", u, r)
    }
}
let gs = !1;
const Xl = new Map
  , c0 = 300 * 1e3
  , f0 = 1e3;
setInterval( () => {
    const u = Date.now();
    for (const [a,r] of Xl.entries())
        u - r.timestamp > c0 && Xl.delete(a)
}
, 6e4);
async function d0() {
    if (!gs)
        try {
            await Ms.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.6/lib/mappings.wasm"
            }),
            gs = !0
        } catch (u) {
            console.warn("Failed to initialize SourceMapConsumer:", u);
            try {
                await Ms.SourceMapConsumer.initialize({}),
                gs = !0
            } catch (a) {
                throw console.error("SourceMapConsumer initialization failed completely:", a),
                a
            }
        }
}
function h0(u) {
    if (!u || !u.stack)
        return `no-stack-${u?.message || "unknown"}`;
    const o = u.stack.split(`
`).slice(0, 6).map(c => c.replace(/\?t=\d+/g, "").replace(/\?v=[\w\d]+/g, "").replace(/\d{13,}/g, "TIMESTAMP"));
    return `${u.name || "Error"}-${u.message}-${o.join("|")}`
}
const m0 = "preview-inject/";
async function ka(u, a=10, r) {
    if (!u || !u.stack)
        return {
            errorMessage: u?.message || "",
            mappedStack: u?.stack || "",
            sourceContext: []
        };
    const o = h0(u);
    if (Xl.has(o)) {
        const v = Xl.get(o);
        return console.log("Using cached error mapping for:", o),
        v
    }
    if (Xl.size >= f0)
        return null;
    await d0();
    const c = u.stack.split(`
`)
      , f = []
      , d = []
      , m = new Map
      , g = new Map;
    let p = 0;
    for (const v of c) {
        const E = v.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)|at\s+(.+?):(\d+):(\d+)|([^@]*)@(.+?):(\d+):(\d+)/);
        if (!E) {
            f.push(v);
            continue
        }
        let b, _, A, x;
        E[1] ? (b = E[1],
        _ = E[2],
        A = parseInt(E[3]),
        x = parseInt(E[4])) : E[5] ? (b = "<anonymous>",
        _ = E[5],
        A = parseInt(E[6]),
        x = parseInt(E[7])) : (b = E[8],
        _ = E[9],
        A = parseInt(E[10]),
        x = parseInt(E[11]));
        try {
            const z = `${_}.map`;
            let q = m.get(z);
            if (!q) {
                const k = await s0(z);
                q = await new Ms.SourceMapConsumer(k),
                m.set(z, q)
            }
            const Y = q.originalPositionFor({
                line: A,
                column: x
            });
            if (Y.source) {
                if (Y.source.includes(m0))
                    continue;
                const k = Y.source.split("/").filter(W => W !== "..").join("/")
                  , re = `    at ${Y.name || b} (${k}:${Y.line}:${Y.column})`;
                if (f.push(re),
                Y.line && Y.column && p < a) {
                    p++;
                    try {
                        const W = await g0(q, Y.source, g);
                        if (W) {
                            const pe = k.includes("node_modules")
                              , Ce = /\.(tsx|jsx)$/.test(k);
                            let V;
                            if (!pe && Ce) {
                                const K = p0(W, Y.line, Y.column, r);
                                K && (V = {
                                    tagName: K.tagName,
                                    code: K.code,
                                    context: K.context,
                                    startLine: K.startLine,
                                    endLine: K.endLine
                                })
                            }
                            const X = o0(W, Y.line, pe ? 1 : 10);
                            d.push({
                                file: k,
                                line: Y.line,
                                column: Y.column,
                                context: X,
                                closedBlock: V
                            })
                        }
                    } catch (W) {
                        console.warn("Failed to extract source context:", W)
                    }
                }
            } else
                f.push(v)
        } catch (z) {
            console.warn("Failed to map stack line:", v, z),
            f.push(v)
        }
    }
    for (const v of m.values())
        v.destroy();
    const S = {
        errorMessage: u?.message || "",
        mappedStack: f.join(`
`),
        sourceContext: d
    };
    return S.timestamp = Date.now(),
    Xl.set(o, S),
    S
}
async function g0(u, a, r) {
    if (r.has(a))
        return r.get(a) || null;
    const o = u.sourceContentFor(a);
    return o ? (r.set(a, o),
    o) : null
}
function p0(u, a, r, o) {
    const c = u.split(`
`);
    let f = a - 1;
    if (f < 0 || f >= c.length)
        return;
    let d = pm(c, f, r);
    if (o && d) {
        const b = o.toLowerCase()
          , _ = d.tagName.toLowerCase();
        if (b !== _) {
            const A = u0(c, f, b);
            A && (d = A)
        }
    } else if (!d) {
        const b = i0(c, f, r);
        d = pm(c, b.lineIndex, b.column)
    }
    if (!d)
        return;
    const {tagName: m, lineIndex: g, columnStart: p, closeLineIndex: S, closeColumnEnd: v, isSelfClosing: E} = d;
    return {
        tagName: m,
        code: r0(c, g, p, S, v),
        context: c.slice(g, S + 1).join(`
`),
        startLine: g + 1,
        endLine: S + 1,
        isSelfClosing: E
    }
}
class y0 {
    client;
    originalConsoleError;
    constructor() {
        const a = Hv();
        a.length > 0 && a.forEach(r => {
            r.type === "console.error" ? this.handleConsoleError(r.args) : r.type === "runtime" && this.handleError(r.args)
        }
        ),
        this.client = new Kl(window.parent),
        this.originalConsoleError = console.error,
        this.initErrorHandlers()
    }
    initErrorHandlers() {
        window.addEventListener("error", this.handleError.bind(this)),
        window.addEventListener("unhandledrejection", this.handlePromiseRejection.bind(this)),
        this.interceptConsoleError()
    }
    async handleError(a) {
        const r = a.target;
        if (!(r && r instanceof HTMLElement && r.tagName && ["IMG", "SCRIPT", "LINK", "VIDEO", "AUDIO", "SOURCE", "IFRAME"].includes(r.tagName)) && a.error && a.error.stack)
            try {
                const o = await ka(a.error);
                this.sendError(o)
            } catch (o) {
                console.warn("Failed to map error stack:", o)
            }
    }
    async handlePromiseRejection(a) {
        const r = a.reason instanceof Error ? a.reason : new Error(String(a.reason));
        if (r.stack)
            try {
                const o = await ka(r);
                this.sendError(o)
            } catch (o) {
                console.warn("Failed to map promise rejection stack:", o)
            }
    }
    interceptConsoleError() {
        console.error = (...a) => {
            this.originalConsoleError.apply(console, a);
            const r = a.find(o => o instanceof Error);
            if (r && r.stack)
                this.handleConsoleError(r);
            else if (a.length > 0) {
                const o = a.map(f => typeof f == "object" ? JSON.stringify(f) : String(f)).join(" ")
                  , c = new Error(o);
                this.handleConsoleError(c)
            }
        }
    }
    async handleConsoleError(a) {
        try {
            const r = await ka(a);
            this.sendError(r)
        } catch (r) {
            console.warn("Failed to map console error stack:", r)
        }
    }
    reportError(a) {
        this.handleReactError(a)
    }
    async handleReactError(a) {
        try {
            const r = await ka(a);
            this.sendError(r)
        } catch (r) {
            console.warn("Failed to map React error stack:", r)
        }
    }
    async sendError(a) {
        if (!a) {
            console.warn("error is too many");
            return
        }
        if (a.sourceContext.length !== 0)
            try {
                await this.client.post("runtime-error", a)
            } catch (r) {
                console.warn("Failed to send error to parent:", r)
            }
    }
    destroy() {
        console.error = this.originalConsoleError,
        this.client.destroy()
    }
}
function v0() {
    const u = new y0;
    return window.runtimeErrorCollector = u,
    u
}
class S0 {
    _client;
    constructor() {
        this._client = new Kl(window.parent),
        this._domContentLoadedListener()
    }
    _domContentLoadedListener() {
        const a = () => {
            console.log("DOMContentLoaded"),
            this._client.post("DOMContentLoaded"),
            document.removeEventListener("DOMContentLoaded", a)
        }
        ;
        document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", a) : (console.log("DOMContentLoaded"),
        this._client.post("DOMContentLoaded"))
    }
}
function b0() {
    return new S0
}
const Vs = u => {
    const a = "/preview/7a1a7a1f-6f73-434a-abaa-6e0a1b446a92/7346929";
    return u.startsWith(a) ? u.replaceAll(a, "") || "/" : u || "/"
}
  , E0 = "modulepreload"
  , _0 = function(u) {
    return "/preview/7a1a7a1f-6f73-434a-abaa-6e0a1b446a92/7346929/" + u
}
  , ym = {}
  , nl = function(a, r, o) {
    let c = Promise.resolve();
    if (r && r.length > 0) {
        let g = function(p) {
            return Promise.all(p.map(S => Promise.resolve(S).then(v => ({
                status: "fulfilled",
                value: v
            }), v => ({
                status: "rejected",
                reason: v
            }))))
        };
        document.getElementsByTagName("link");
        const d = document.querySelector("meta[property=csp-nonce]")
          , m = d?.nonce || d?.getAttribute("nonce");
        c = g(r.map(p => {
            if (p = _0(p),
            p in ym)
                return;
            ym[p] = !0;
            const S = p.endsWith(".css")
              , v = S ? '[rel="stylesheet"]' : "";
            if (document.querySelector(`link[href="${p}"]${v}`))
                return;
            const E = document.createElement("link");
            if (E.rel = S ? "stylesheet" : E0,
            S || (E.as = "script"),
            E.crossOrigin = "",
            E.href = p,
            m && E.setAttribute("nonce", m),
            document.head.appendChild(E),
            S)
                return new Promise( (b, _) => {
                    E.addEventListener("load", b),
                    E.addEventListener("error", () => _(new Error(`Unable to preload CSS for ${p}`)))
                }
                )
        }
        ))
    }
    function f(d) {
        const m = new Event("vite:preloadError",{
            cancelable: !0
        });
        if (m.payload = d,
        window.dispatchEvent(m),
        !m.defaultPrevented)
            throw d
    }
    return c.then(d => {
        for (const m of d || [])
            m.status === "rejected" && f(m.reason);
        return a().catch(f)
    }
    )
};
async function x0() {
    await await nl( () => Promise.resolve().then( () => Ab), void 0).then(a => a.navigatePromise).catch(a => (console.error(a),
    Promise.resolve( () => {}
    ))),
    window.REACT_APP_ROUTER = {
        push: (a, r) => {
            window.REACT_APP_NAVIGATE(a, r)
        }
        ,
        replace: (a, r, o) => {
            window.REACT_APP_NAVIGATE(a, {
                replace: !0,
                ...o
            })
        }
        ,
        forward: () => {
            window.REACT_APP_NAVIGATE(1)
        }
        ,
        back: () => {
            window.REACT_APP_NAVIGATE(-1)
        }
        ,
        refresh: () => {
            window.REACT_APP_NAVIGATE(0)
        }
        ,
        prefetch: (a, r) => {
            window.REACT_APP_NAVIGATE(a, r)
        }
    }
}
const Dg = new Promise(u => {
    x0().then( () => {
        u(window.REACT_APP_ROUTER)
    }
    )
}
)
  , Qs = () => window.REACT_APP_ROUTER
  , Xs = new Kl(window.parent)
  , zs = async (u, a) => {
    await Xs.post("routeWillChange", {
        next: Vs(u)
    }, a)
}
;
function C0(u) {
    const a = document.querySelector(u);
    a && a.scrollIntoView({
        behavior: "smooth"
    })
}
function T0() {
    const u = window.open;
    return window.open = function(a, r, o) {
        return a && typeof a == "string" && a.startsWith("#") ? (C0(a),
        null) : (u(a, "_blank", o),
        null)
    }
    ,
    () => {
        window.open = u
    }
}
function O0() {
    const u = async a => {
        const o = a.target.closest("a");
        if (!o || o.tagName !== "A")
            return;
        const c = o.getAttribute("href");
        if (c && !["#", "javascript:void(0)", ""].includes(c) && !c.startsWith("#")) {
            if (a.preventDefault(),
            c.startsWith("/")) {
                const f = Qs();
                await zs(c, {
                    timeout: 500
                });
                const d = Vs(c);
                f.push(d);
                return
            }
            window.open(o.href, "_blank")
        }
    }
    ;
    return window.addEventListener("click", u, !0),
    () => {
        window.removeEventListener("click", u, !0)
    }
}
const vm = u => u.startsWith("http://") || u.startsWith("https://");
function A0(u) {
    return !u || typeof u != "string" ? !1 : u.indexOf("accounts.google.com") !== -1 || u.indexOf("googleapis.com/oauth") !== -1 || u.indexOf("/auth/") !== -1 && u.indexOf("provider=google") !== -1
}
function R0() {
    const u = () => {
        const a = Qs()
          , r = a.push;
        a.push = async function(c, f, d) {
            return vm(c) ? (window.open(c, "_blank"),
            Promise.resolve(!1)) : (await zs(c, {
                timeout: 500
            }),
            r.call(this, c, f, d))
        }
        ;
        const o = a.replace;
        a.replace = async function(c, f, d) {
            return vm(c) ? (window.open(c, "_blank"),
            Promise.resolve(!1)) : (await zs(c, {
                timeout: 500
            }),
            o.call(this, c, f, d))
        }
    }
    ;
    return window.addEventListener("load", u),
    () => {
        window.removeEventListener("load", u)
    }
}
function w0() {
    if (!("navigation"in window))
        return () => {}
        ;
    const u = a => {
        A0(a.destination.url) && Xs.post("google-auth-blocked", {
            url: a.destination.url || ""
        })
    }
    ;
    return window.navigation.addEventListener("navigate", u),
    () => {
        window.navigation.removeEventListener("navigate", u)
    }
}
async function L0() {
    await Dg;
    const u = T0()
      , a = O0()
      , r = R0()
      , o = w0();
    return () => {
        Xs.destroy(),
        u(),
        a(),
        r(),
        o()
    }
}
async function M0() {
    const u = await nl( () => Promise.resolve().then( () => Tb), void 0).then(f => f.default).catch(f => []);
    let a = []
      , r = 0;
    function o(f, d) {
        const {path: m="", children: g, index: p} = f;
        r++;
        const S = p === !0 || m === ""
          , v = m && m[0] === "/"
          , E = S ? d.path : `${d.path}/${m}`
          , b = v && !S ? m : E
          , _ = {
            id: r,
            parentId: d.id,
            path: "/" + b.split("/").filter(Boolean).join("/")
        };
        /\*/.test(_.path) || a.push(_),
        g && g.forEach(A => o(A, _))
    }
    u.forEach(f => o(f, {
        id: 0,
        path: ""
    }));
    const c = new Set;
    return a = a.filter(f => c.has(f.path) ? !1 : (c.add(f.path),
    !0)),
    a
}
async function z0() {
    const u = new Kl(window.parent)
      , a = await M0();
    window.REACT_APP_ROUTES = a,
    u.post("routes", {
        routes: a
    }),
    u.on("getRouteInfo", async v => a),
    await Dg,
    u.on("routeAction", async v => {
        const E = Qs()
          , {action: b, route: _} = v;
        switch (b) {
        case "goForward":
            E.forward();
            break;
        case "goBack":
            E.back();
            break;
        case "refresh":
            E.refresh();
            break;
        case "goTo":
            _ && E.push(_);
            break;
        default:
            console.warn("Unknown action:", b)
        }
    }
    );
    function r() {
        const v = window.history.state?.index ?? 0
          , E = window.history.length > v + 1
          , b = v > 0
          , _ = window.location.pathname;
        u.post("updateNavigationState", {
            canGoForward: E,
            canGoBack: b,
            currentRoute: Vs(_)
        })
    }
    function o() {
        const v = new MutationObserver(b => {
            b.forEach(_ => {
                (_.type === "childList" || _.type === "characterData") && u.post("titleChanged", {
                    title: document.title
                })
            }
            )
        }
        )
          , E = document.querySelector("title");
        return u.post("titleChanged", {
            title: document.title
        }),
        E && v.observe(E, {
            childList: !0,
            characterData: !0,
            subtree: !0
        }),
        v
    }
    let c = o();
    function f() {
        c.disconnect(),
        setTimeout( () => {
            c = o()
        }
        , 100)
    }
    const d = window.history.pushState
      , m = window.history.replaceState
      , g = window.history.go
      , p = window.history.back
      , S = window.history.forward;
    return window.history.pushState = function(v, E, b) {
        d.apply(this, arguments),
        r(),
        f()
    }
    ,
    window.history.replaceState = function(v, E, b) {
        m.apply(this, arguments),
        r(),
        f()
    }
    ,
    window.history.go = function(v) {
        g.apply(this, arguments),
        setTimeout( () => {
            r(),
            f()
        }
        , 100)
    }
    ,
    window.history.back = function() {
        p.apply(this, arguments),
        setTimeout( () => {
            r(),
            f()
        }
        , 100)
    }
    ,
    window.history.forward = function() {
        S.apply(this, arguments),
        setTimeout( () => {
            r(),
            f()
        }
        , 100)
    }
    ,
    {
        destroy: () => {
            u.destroy(),
            c.disconnect()
        }
    }
}
var ps = {
    exports: {}
}
  , ae = {};
var Sm;
function D0() {
    if (Sm)
        return ae;
    Sm = 1;
    var u = Symbol.for("react.transitional.element")
      , a = Symbol.for("react.portal")
      , r = Symbol.for("react.fragment")
      , o = Symbol.for("react.strict_mode")
      , c = Symbol.for("react.profiler")
      , f = Symbol.for("react.consumer")
      , d = Symbol.for("react.context")
      , m = Symbol.for("react.forward_ref")
      , g = Symbol.for("react.suspense")
      , p = Symbol.for("react.memo")
      , S = Symbol.for("react.lazy")
      , v = Symbol.for("react.activity")
      , E = Symbol.iterator;
    function b(T) {
        return T === null || typeof T != "object" ? null : (T = E && T[E] || T["@@iterator"],
        typeof T == "function" ? T : null)
    }
    var _ = {
        isMounted: function() {
            return !1
        },
        enqueueForceUpdate: function() {},
        enqueueReplaceState: function() {},
        enqueueSetState: function() {}
    }
      , A = Object.assign
      , x = {};
    function z(T, j, Z) {
        this.props = T,
        this.context = j,
        this.refs = x,
        this.updater = Z || _
    }
    z.prototype.isReactComponent = {},
    z.prototype.setState = function(T, j) {
        if (typeof T != "object" && typeof T != "function" && T != null)
            throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
        this.updater.enqueueSetState(this, T, j, "setState")
    }
    ,
    z.prototype.forceUpdate = function(T) {
        this.updater.enqueueForceUpdate(this, T, "forceUpdate")
    }
    ;
    function q() {}
    q.prototype = z.prototype;
    function Y(T, j, Z) {
        this.props = T,
        this.context = j,
        this.refs = x,
        this.updater = Z || _
    }
    var k = Y.prototype = new q;
    k.constructor = Y,
    A(k, z.prototype),
    k.isPureReactComponent = !0;
    var F = Array.isArray;
    function re() {}
    var W = {
        H: null,
        A: null,
        T: null,
        S: null
    }
      , pe = Object.prototype.hasOwnProperty;
    function Ce(T, j, Z) {
        var J = Z.ref;
        return {
            $$typeof: u,
            type: T,
            key: j,
            ref: J !== void 0 ? J : null,
            props: Z
        }
    }
    function V(T, j) {
        return Ce(T.type, j, T.props)
    }
    function X(T) {
        return typeof T == "object" && T !== null && T.$$typeof === u
    }
    function K(T) {
        var j = {
            "=": "=0",
            ":": "=2"
        };
        return "$" + T.replace(/[=:]/g, function(Z) {
            return j[Z]
        })
    }
    var te = /\/+/g;
    function oe(T, j) {
        return typeof T == "object" && T !== null && T.key != null ? K("" + T.key) : j.toString(36)
    }
    function ce(T) {
        switch (T.status) {
        case "fulfilled":
            return T.value;
        case "rejected":
            throw T.reason;
        default:
            switch (typeof T.status == "string" ? T.then(re, re) : (T.status = "pending",
            T.then(function(j) {
                T.status === "pending" && (T.status = "fulfilled",
                T.value = j)
            }, function(j) {
                T.status === "pending" && (T.status = "rejected",
                T.reason = j)
            })),
            T.status) {
            case "fulfilled":
                return T.value;
            case "rejected":
                throw T.reason
            }
        }
        throw T
    }
    function N(T, j, Z, J, ie) {
        var fe = typeof T;
        (fe === "undefined" || fe === "boolean") && (T = null);
        var xe = !1;
        if (T === null)
            xe = !0;
        else
            switch (fe) {
            case "bigint":
            case "string":
            case "number":
                xe = !0;
                break;
            case "object":
                switch (T.$$typeof) {
                case u:
                case a:
                    xe = !0;
                    break;
                case S:
                    return xe = T._init,
                    N(xe(T._payload), j, Z, J, ie)
                }
            }
        if (xe)
            return ie = ie(T),
            xe = J === "" ? "." + oe(T, 0) : J,
            F(ie) ? (Z = "",
            xe != null && (Z = xe.replace(te, "$&/") + "/"),
            N(ie, j, Z, "", function(Jl) {
                return Jl
            })) : ie != null && (X(ie) && (ie = V(ie, Z + (ie.key == null || T && T.key === ie.key ? "" : ("" + ie.key).replace(te, "$&/") + "/") + xe)),
            j.push(ie)),
            1;
        xe = 0;
        var tt = J === "" ? "." : J + ":";
        if (F(T))
            for (var He = 0; He < T.length; He++)
                J = T[He],
                fe = tt + oe(J, He),
                xe += N(J, j, Z, fe, ie);
        else if (He = b(T),
        typeof He == "function")
            for (T = He.call(T),
            He = 0; !(J = T.next()).done; )
                J = J.value,
                fe = tt + oe(J, He++),
                xe += N(J, j, Z, fe, ie);
        else if (fe === "object") {
            if (typeof T.then == "function")
                return N(ce(T), j, Z, J, ie);
            throw j = String(T),
            Error("Objects are not valid as a React child (found: " + (j === "[object Object]" ? "object with keys {" + Object.keys(T).join(", ") + "}" : j) + "). If you meant to render a collection of children, use an array instead.")
        }
        return xe
    }
    function Q(T, j, Z) {
        if (T == null)
            return T;
        var J = []
          , ie = 0;
        return N(T, J, "", "", function(fe) {
            return j.call(Z, fe, ie++)
        }),
        J
    }
    function ee(T) {
        if (T._status === -1) {
            var j = T._result;
            j = j(),
            j.then(function(Z) {
                (T._status === 0 || T._status === -1) && (T._status = 1,
                T._result = Z)
            }, function(Z) {
                (T._status === 0 || T._status === -1) && (T._status = 2,
                T._result = Z)
            }),
            T._status === -1 && (T._status = 0,
            T._result = j)
        }
        if (T._status === 1)
            return T._result.default;
        throw T._result
    }
    var ve = typeof reportError == "function" ? reportError : function(T) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var j = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof T == "object" && T !== null && typeof T.message == "string" ? String(T.message) : String(T),
                error: T
            });
            if (!window.dispatchEvent(j))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", T);
            return
        }
        console.error(T)
    }
      , _e = {
        map: Q,
        forEach: function(T, j, Z) {
            Q(T, function() {
                j.apply(this, arguments)
            }, Z)
        },
        count: function(T) {
            var j = 0;
            return Q(T, function() {
                j++
            }),
            j
        },
        toArray: function(T) {
            return Q(T, function(j) {
                return j
            }) || []
        },
        only: function(T) {
            if (!X(T))
                throw Error("React.Children.only expected to receive a single React element child.");
            return T
        }
    };
    return ae.Activity = v,
    ae.Children = _e,
    ae.Component = z,
    ae.Fragment = r,
    ae.Profiler = c,
    ae.PureComponent = Y,
    ae.StrictMode = o,
    ae.Suspense = g,
    ae.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = W,
    ae.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function(T) {
            return W.H.useMemoCache(T)
        }
    },
    ae.cache = function(T) {
        return function() {
            return T.apply(null, arguments)
        }
    }
    ,
    ae.cacheSignal = function() {
        return null
    }
    ,
    ae.cloneElement = function(T, j, Z) {
        if (T == null)
            throw Error("The argument must be a React element, but you passed " + T + ".");
        var J = A({}, T.props)
          , ie = T.key;
        if (j != null)
            for (fe in j.key !== void 0 && (ie = "" + j.key),
            j)
                !pe.call(j, fe) || fe === "key" || fe === "__self" || fe === "__source" || fe === "ref" && j.ref === void 0 || (J[fe] = j[fe]);
        var fe = arguments.length - 2;
        if (fe === 1)
            J.children = Z;
        else if (1 < fe) {
            for (var xe = Array(fe), tt = 0; tt < fe; tt++)
                xe[tt] = arguments[tt + 2];
            J.children = xe
        }
        return Ce(T.type, ie, J)
    }
    ,
    ae.createContext = function(T) {
        return T = {
            $$typeof: d,
            _currentValue: T,
            _currentValue2: T,
            _threadCount: 0,
            Provider: null,
            Consumer: null
        },
        T.Provider = T,
        T.Consumer = {
            $$typeof: f,
            _context: T
        },
        T
    }
    ,
    ae.createElement = function(T, j, Z) {
        var J, ie = {}, fe = null;
        if (j != null)
            for (J in j.key !== void 0 && (fe = "" + j.key),
            j)
                pe.call(j, J) && J !== "key" && J !== "__self" && J !== "__source" && (ie[J] = j[J]);
        var xe = arguments.length - 2;
        if (xe === 1)
            ie.children = Z;
        else if (1 < xe) {
            for (var tt = Array(xe), He = 0; He < xe; He++)
                tt[He] = arguments[He + 2];
            ie.children = tt
        }
        if (T && T.defaultProps)
            for (J in xe = T.defaultProps,
            xe)
                ie[J] === void 0 && (ie[J] = xe[J]);
        return Ce(T, fe, ie)
    }
    ,
    ae.createRef = function() {
        return {
            current: null
        }
    }
    ,
    ae.forwardRef = function(T) {
        return {
            $$typeof: m,
            render: T
        }
    }
    ,
    ae.isValidElement = X,
    ae.lazy = function(T) {
        return {
            $$typeof: S,
            _payload: {
                _status: -1,
                _result: T
            },
            _init: ee
        }
    }
    ,
    ae.memo = function(T, j) {
        return {
            $$typeof: p,
            type: T,
            compare: j === void 0 ? null : j
        }
    }
    ,
    ae.startTransition = function(T) {
        var j = W.T
          , Z = {};
        W.T = Z;
        try {
            var J = T()
              , ie = W.S;
            ie !== null && ie(Z, J),
            typeof J == "object" && J !== null && typeof J.then == "function" && J.then(re, ve)
        } catch (fe) {
            ve(fe)
        } finally {
            j !== null && Z.types !== null && (j.types = Z.types),
            W.T = j
        }
    }
    ,
    ae.unstable_useCacheRefresh = function() {
        return W.H.useCacheRefresh()
    }
    ,
    ae.use = function(T) {
        return W.H.use(T)
    }
    ,
    ae.useActionState = function(T, j, Z) {
        return W.H.useActionState(T, j, Z)
    }
    ,
    ae.useCallback = function(T, j) {
        return W.H.useCallback(T, j)
    }
    ,
    ae.useContext = function(T) {
        return W.H.useContext(T)
    }
    ,
    ae.useDebugValue = function() {}
    ,
    ae.useDeferredValue = function(T, j) {
        return W.H.useDeferredValue(T, j)
    }
    ,
    ae.useEffect = function(T, j) {
        return W.H.useEffect(T, j)
    }
    ,
    ae.useEffectEvent = function(T) {
        return W.H.useEffectEvent(T)
    }
    ,
    ae.useId = function() {
        return W.H.useId()
    }
    ,
    ae.useImperativeHandle = function(T, j, Z) {
        return W.H.useImperativeHandle(T, j, Z)
    }
    ,
    ae.useInsertionEffect = function(T, j) {
        return W.H.useInsertionEffect(T, j)
    }
    ,
    ae.useLayoutEffect = function(T, j) {
        return W.H.useLayoutEffect(T, j)
    }
    ,
    ae.useMemo = function(T, j) {
        return W.H.useMemo(T, j)
    }
    ,
    ae.useOptimistic = function(T, j) {
        return W.H.useOptimistic(T, j)
    }
    ,
    ae.useReducer = function(T, j, Z) {
        return W.H.useReducer(T, j, Z)
    }
    ,
    ae.useRef = function(T) {
        return W.H.useRef(T)
    }
    ,
    ae.useState = function(T) {
        return W.H.useState(T)
    }
    ,
    ae.useSyncExternalStore = function(T, j, Z) {
        return W.H.useSyncExternalStore(T, j, Z)
    }
    ,
    ae.useTransition = function() {
        return W.H.useTransition()
    }
    ,
    ae.version = "19.2.4",
    ae
}
var bm;
function Zs() {
    return bm || (bm = 1,
    ps.exports = D0()),
    ps.exports
}
var H = Zs();
const Em = Kv(H);
var ys = {
    exports: {}
}
  , Qa = {};
var _m;
function N0() {
    if (_m)
        return Qa;
    _m = 1;
    var u = Symbol.for("react.transitional.element")
      , a = Symbol.for("react.fragment");
    function r(o, c, f) {
        var d = null;
        if (f !== void 0 && (d = "" + f),
        c.key !== void 0 && (d = "" + c.key),
        "key"in c) {
            f = {};
            for (var m in c)
                m !== "key" && (f[m] = c[m])
        } else
            f = c;
        return c = f.ref,
        {
            $$typeof: u,
            type: o,
            key: d,
            ref: c !== void 0 ? c : null,
            props: f
        }
    }
    return Qa.Fragment = a,
    Qa.jsx = r,
    Qa.jsxs = r,
    Qa
}
var xm;
function U0() {
    return xm || (xm = 1,
    ys.exports = N0()),
    ys.exports
}
var ct = U0()
  , vs = {
    exports: {}
}
  , xu = {};
var Cm;
function H0() {
    if (Cm)
        return xu;
    Cm = 1;
    var u = Symbol.for("react.fragment");
    return xu.Fragment = u,
    xu.jsxDEV = void 0,
    xu
}
var Tm;
function j0() {
    return Tm || (Tm = 1,
    vs.exports = H0()),
    vs.exports
}
var Om = j0();
class Ng {
    static getFiberFromDOMNode(a) {
        if (!a)
            return null;
        const r = Object.keys(a).find(o => o.startsWith("__reactFiber$") || o.startsWith("__reactInternalInstance$"));
        return r ? a[r] : null
    }
}
const Ug = new WeakMap
  , Hg = new WeakMap
  , Am = new WeakMap
  , Ss = new WeakMap
  , Rm = new WeakMap
  , wm = new WeakMap
  , bs = (u, a) => {
    try {
        Hg.set(u, a);
        const r = Ng.getFiberFromDOMNode(u);
        r && Ug.set(r, a)
    } catch {}
}
  , Cu = (u, a) => {
    if (!u)
        return r => {
            r instanceof HTMLElement && bs(r, a)
        }
        ;
    if (typeof u == "function") {
        let r = Ss.get(u);
        r || (r = [],
        Ss.set(u, r)),
        r.push(a);
        let o = Am.get(u);
        return o || (o = c => {
            if (c instanceof HTMLElement) {
                const f = Ss.get(u);
                if (f && f.length > 0) {
                    const d = f.shift();
                    bs(c, d)
                }
            }
            u(c)
        }
        ,
        Am.set(u, o)),
        o
    }
    if (u && typeof u == "object" && "current"in u) {
        wm.set(u, a);
        let r = Rm.get(u);
        return r || (r = o => {
            if (o instanceof HTMLElement) {
                const c = wm.get(u);
                c && bs(o, c)
            }
            u.current = o
        }
        ,
        Rm.set(u, r)),
        r
    }
}
;
function B0() {
    const u = Em.createElement
      , a = ct.jsx
      , r = ct.jsxs
      , o = Om.jsxDEV
      , c = () => {
        const d = new Error;
        return () => d
    }
      , f = d => typeof d == "string";
    Em.createElement = function(d, m, ...g) {
        if (!f(d) && typeof d != "function")
            return u(d, m, ...g);
        const p = c()
          , S = m ? {
            ...m
        } : {}
          , v = Cu(S.ref, p);
        return v && (S.ref = v),
        u(d, S, ...g)
    }
    ,
    ct.jsx = function(d, m, g) {
        if (!f(d) && typeof d != "function")
            return a(d, m, g);
        const p = c()
          , S = m ? {
            ...m
        } : {}
          , v = Cu(S.ref, p);
        return v && (S.ref = v),
        a(d, S, g)
    }
    ,
    ct.jsxs = function(d, m, g) {
        if (!f(d) && typeof d != "function")
            return r(d, m, g);
        const p = c()
          , S = m ? {
            ...m
        } : {}
          , v = Cu(S.ref, p);
        return v && (S.ref = v),
        r(d, S, g)
    }
    ,
    o && (Om.jsxDEV = function(d, m, g, p, S, v) {
        if (!f(d) && typeof d != "function")
            return o(d, m, g, p, S, v);
        const E = c()
          , b = m ? {
            ...m
        } : {}
          , _ = Cu(b.ref, E);
        return _ && (b.ref = _),
        o(d, b, g, p, S, v)
    }
    )
}
function q0(u) {
    const a = document.querySelector(u);
    if (!a)
        return null;
    const r = a.tagName.toLowerCase()
      , o = Hg.get(a);
    if (o)
        return {
            element: a,
            tagName: r,
            debugError: o()
        };
    const c = Ng.getFiberFromDOMNode(a);
    if (c) {
        const f = Ug.get(c);
        if (f)
            return {
                element: a,
                tagName: r,
                debugError: f()
            }
    }
    return null
}
B0();
function G0() {
    const u = new WeakMap
      , a = new Kl(window.parent);
    return a.on("get-element-source", async ({selector: r}) => {
        const o = q0(r);
        if (!o)
            return null;
        const {element: c, tagName: f, debugError: d} = o;
        if (u.has(c))
            return u.get(c);
        const m = await ka(d, 10, f);
        if (!m)
            return null;
        const p = {
            ...m.sourceContext.filter(S => !S.file.includes("node_modules"))[0],
            domInfo: {
                tagName: c.tagName,
                textContent: c.textContent.slice(0, 300)
            }
        };
        return u.set(c, p),
        p
    }
    ),
    () => {
        a.destroy()
    }
}
const Y0 = !0;
console.log("Is preview build:", Y0);
async function V0() {
    Zv(),
    v0(),
    L0(),
    b0(),
    z0(),
    G0()
}
V0();
const Q0 = "phc_V7JMHB0fVJGRu8UHyrsj6pSL1BS76P5zD8qCi7lrTTV"
  , ke = {
    colors: {
        text: "#5D5D5D",
        white: "#FFFFFF",
        border: "rgba(0, 10, 36, 0.08)"
    },
    font: {
        family: '"Geist"',
        weight: "600",
        size: {
            normal: "14px",
            button: "18px"
        },
        lineHeight: "20px"
    },
    button: {
        gradient: "linear-gradient(180deg, #A797FF 0%, #7057FF 100%)"
    },
    shadow: "0px 8px 12px 0px rgba(9, 10, 20, 0.06)",
    zIndex: `${Number.MAX_SAFE_INTEGER}`
}
  , Lm = {
    close: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2D303D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>')}`,
    generate: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4.87 4.94c.227-.71 1.21-.723 1.456-.02l1.177 3.378 3.101 1.013c.708.231.714 1.216.01 1.455l-3.183 1.082-1.105 3.17c-.245.704-1.23.69-1.455-.02l-.989-3.107-3.367-1.203c-.702-.25-.68-1.234.04-1.455l3.282-1.016 1.043-3.277Z" fill="#FFF"/><path fill-rule="evenodd" d="M12.238 1.3c.167-.667 1.1-.667 1.266 0l.388 1.551 1.55.388c.666.166.667 1.1 0 1.266l-1.55.388-.388 1.55c-.167.666-1.1.667-1.266 0l-.388-1.55-1.55-.388c-.667-.166-.667-1.1 0-1.266l1.55-.388.388-1.551Z" fill="#FFF"/></svg>')}`
}
  
  , Mm = {
    en: {
        prefix: "This Website is Made with",
        suffix: ". You can also get one like this in minutes",
        button: "Get one for FREE"
    },
    zh: {
        prefix: "本网站来自",
        suffix: "你也可以在几分钟内拥有同样的页面",
        button: "立即免费拥有"
    }
}
  , X0 = () => navigator.language?.toLowerCase().startsWith("zh") ?? !1
  , Es = () => X0() ? Mm.zh : Mm.en
  , Z0 = () => window.innerWidth > 768 && !("ontouchstart"in window)
  , K0 = () => {
    
}
;
function k0() {
    if (window.posthog)
        return;
    const u = document.createElement("script");
    u.src = Ja.posthogCDN,
    u.async = !0,
    u.onload = () => {
        window.posthog?.init(Q0, {
            api_host: "https://us.i.posthog.com",
            autocapture: !1,
            capture_pageview: !1,
            capture_pageleave: !1,
            disable_session_recording: !0,
            disable_scroll_properties: !0,
            capture_performance: {
                web_vitals: !1
            },
            rageclick: !1,
            loaded: function(a) {
                a.sessionRecording && a.sessionRecording.stopRecording()
            }
        })
    }
    ,
    document.head.appendChild(u)
}
function zm(u, a) {
    window.posthog?.capture(u, {
        ...a,
        version: 2
    })
}
function Gt(u, a) {
    Object.assign(u.style, a)
}
function _s(u, a="0") {
    Gt(u, {
        color: ke.colors.text,
        fontFamily: ke.font.family,
        fontSize: ke.font.size.normal,
        lineHeight: ke.font.lineHeight,
        fontWeight: ke.font.weight,
        whiteSpace: "nowrap",
        marginRight: a
    })
}
function Tu(u, a="row") {
    Gt(u, {
        display: "flex",
        flexDirection: a,
        alignItems: "center",
        justifyContent: "center"
    })
}
function J0() {
    if (K0())
        return;
    
      , a = "7a1a7a1f-6f73-434a-abaa-6e0a1b446a92";
    async function r(b) {
        try {
            return !(await (await fetch(`${u}?projectId=${b}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })).json()).data.is_free
        } catch {
            return !0
        }
    }
    function o() {
        document.querySelector('link[rel="icon"]')?.remove();
        const b = document.createElement("link");
        b.type = "image/png",
        b.rel = "icon",
        
        document.head.appendChild(b);
        const _ = document.createElement("link");
        _.rel = "stylesheet",
        _.href = Ja.fontStylesheet,
        document.head.appendChild(_)
    }
    function c(b) {
        zm(b),
        
    }
    function f() {
        const b = document.createElement("div");
        b.id = "close-button",
        Gt(b, {
            position: "absolute",
            top: "-12px",
            right: "-12px",
            width: "32px",
            height: "32px",
            backgroundColor: ke.colors.white,
            borderRadius: "50%",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: ke.colors.border,
            cursor: "pointer",
            boxShadow: ke.shadow
        }),
        Tu(b);
        const _ = document.createElement("img");
        return _.src = Lm.close,
        Gt(_, {
            width: "24px",
            height: "24px"
        }),
        b.appendChild(_),
        b.addEventListener("click", A => {
            A.stopPropagation(),
            zm("watermark_close_button_click"),
            document.getElementById("watermark")?.remove()
        }
        ),
        b
    }
    function d(b) {
        const _ = document.createElement("div");
        _.id = "generate-button",
        Gt(_, {
            padding: b ? "8px 16px" : "10px 20px",
            background: ke.button.gradient,
            borderRadius: "999px",
            border: "none",
            gap: "6px",
            cursor: "pointer",
            marginLeft: b ? "12px" : "0",
            whiteSpace: "nowrap",
            width: b ? "auto" : "100%"
        }),
        Tu(_);
        const A = document.createElement("img");
        A.src = Lm.generate,
        Gt(A, {
            width: "16px",
            height: "16px",
            flexShrink: "0"
        });
        const x = document.createElement("span");
        return x.textContent = Es().button,
        Gt(x, {
            color: ke.colors.white,
            fontFamily: ke.font.family,
            fontSize: ke.font.size.button,
            fontWeight: ke.font.weight,
            lineHeight: ke.font.lineHeight
        }),
        _.append(A, x),
        _.addEventListener("click", z => {
            z.stopPropagation(),
            c("watermark_create_button_click")
        }
        ),
        _
    }
    function m() {
        const b = document.createElement("img");
        return b.src = Ja.watermarkLogo,
        Gt(b, {
            width: "92px",
            height: "auto",
            paddingLeft: "8px",
            flexShrink: "0"
        }),
        b
    }
    function g(b) {
        const _ = Es()
          , A = document.createElement("div");
        A.textContent = _.prefix,
        _s(A);
        const x = m()
          , z = document.createElement("div");
        z.textContent = _.suffix,
        _s(z, "12px"),
        b.append(A, x, z, d(!0))
    }
    function p(b, _) {
        const A = document.createElement("div");
        return A.textContent = b,
        _s(A),
        _ && Gt(A, _),
        A
    }
    function S(b) {
        const {prefix: _, suffix: A} = Es()
          , [x,z] = A.startsWith(".") ? [".", A.slice(1).trim()] : ["", A]
          , q = document.createElement("div");
        Tu(q),
        q.style.marginBottom = "4px",
        q.append(p(_, {
            marginRight: "6px"
        }), m(), ...x ? [p(x)] : []),
        b.append(q, p(z, {
            textAlign: "center",
            marginBottom: "12px"
        }), d(!1))
    }
    function v() {
        const b = Z0()
          , _ = document.createElement("div");
        return _.id = "watermark",
        Gt(_, {
            zIndex: ke.zIndex,
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            width: b ? "fit-content" : "calc(100% - 32px)",
            maxWidth: b ? "none" : "100%",
            backgroundColor: ke.colors.white,
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: b ? "999px" : "36px",
            borderColor: ke.colors.border,
            padding: b ? "12px 20px" : "16px",
            boxShadow: ke.shadow,
            cursor: "pointer"
        }),
        Tu(_, b ? "row" : "column"),
        _.appendChild(f()),
        b ? g(_) : S(_),
        _.addEventListener("click", A => {
            A.target.closest("#generate-button, #close-button") || c("watermark_create_button_click")
        }
        ),
        _
    }
    function E(b) {
        const _ = document.getElementById("watermark");
        !_ && !b ? (document.body.appendChild(v()),
        o(),
        k0()) : b && _ && _.remove()
    }
    r(a).then(E)
}
J0();
const le = u => typeof u == "string"
  , Xa = () => {
    let u, a;
    const r = new Promise( (o, c) => {
        u = o,
        a = c
    }
    );
    return r.resolve = u,
    r.reject = a,
    r
}
  , Dm = u => u == null ? "" : "" + u
  , $0 = (u, a, r) => {
    u.forEach(o => {
        a[o] && (r[o] = a[o])
    }
    )
}
  , F0 = /###/g
  , Nm = u => u && u.indexOf("###") > -1 ? u.replace(F0, ".") : u
  , Um = u => !u || le(u)
  , Fa = (u, a, r) => {
    const o = le(a) ? a.split(".") : a;
    let c = 0;
    for (; c < o.length - 1; ) {
        if (Um(u))
            return {};
        const f = Nm(o[c]);
        !u[f] && r && (u[f] = new r),
        Object.prototype.hasOwnProperty.call(u, f) ? u = u[f] : u = {},
        ++c
    }
    return Um(u) ? {} : {
        obj: u,
        k: Nm(o[c])
    }
}
  , Hm = (u, a, r) => {
    const {obj: o, k: c} = Fa(u, a, Object);
    if (o !== void 0 || a.length === 1) {
        o[c] = r;
        return
    }
    let f = a[a.length - 1]
      , d = a.slice(0, a.length - 1)
      , m = Fa(u, d, Object);
    for (; m.obj === void 0 && d.length; )
        f = `${d[d.length - 1]}.${f}`,
        d = d.slice(0, d.length - 1),
        m = Fa(u, d, Object),
        m?.obj && typeof m.obj[`${m.k}.${f}`] < "u" && (m.obj = void 0);
    m.obj[`${m.k}.${f}`] = r
}
  , W0 = (u, a, r, o) => {
    const {obj: c, k: f} = Fa(u, a, Object);
    c[f] = c[f] || [],
    c[f].push(r)
}
  , Mu = (u, a) => {
    const {obj: r, k: o} = Fa(u, a);
    if (r && Object.prototype.hasOwnProperty.call(r, o))
        return r[o]
}
  , I0 = (u, a, r) => {
    const o = Mu(u, r);
    return o !== void 0 ? o : Mu(a, r)
}
  , jg = (u, a, r) => {
    for (const o in a)
        o !== "__proto__" && o !== "constructor" && (o in u ? le(u[o]) || u[o]instanceof String || le(a[o]) || a[o]instanceof String ? r && (u[o] = a[o]) : jg(u[o], a[o], r) : u[o] = a[o]);
    return u
}
  , Yl = u => u.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var P0 = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;"
};
const e1 = u => le(u) ? u.replace(/[&<>"'\/]/g, a => P0[a]) : u;
class t1 {
    constructor(a) {
        this.capacity = a,
        this.regExpMap = new Map,
        this.regExpQueue = []
    }
    getRegExp(a) {
        const r = this.regExpMap.get(a);
        if (r !== void 0)
            return r;
        const o = new RegExp(a);
        return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()),
        this.regExpMap.set(a, o),
        this.regExpQueue.push(a),
        o
    }
}
const n1 = [" ", ",", "?", "!", ";"]
  , l1 = new t1(20)
  , a1 = (u, a, r) => {
    a = a || "",
    r = r || "";
    const o = n1.filter(d => a.indexOf(d) < 0 && r.indexOf(d) < 0);
    if (o.length === 0)
        return !0;
    const c = l1.getRegExp(`(${o.map(d => d === "?" ? "\\?" : d).join("|")})`);
    let f = !c.test(u);
    if (!f) {
        const d = u.indexOf(r);
        d > 0 && !c.test(u.substring(0, d)) && (f = !0)
    }
    return f
}
  , Ds = (u, a, r=".") => {
    if (!u)
        return;
    if (u[a])
        return Object.prototype.hasOwnProperty.call(u, a) ? u[a] : void 0;
    const o = a.split(r);
    let c = u;
    for (let f = 0; f < o.length; ) {
        if (!c || typeof c != "object")
            return;
        let d, m = "";
        for (let g = f; g < o.length; ++g)
            if (g !== f && (m += r),
            m += o[g],
            d = c[m],
            d !== void 0) {
                if (["string", "number", "boolean"].indexOf(typeof d) > -1 && g < o.length - 1)
                    continue;
                f += g - f + 1;
                break
            }
        c = d
    }
    return c
}
  , Wa = u => u?.replace("_", "-")
  , i1 = {
    type: "logger",
    log(u) {
        this.output("log", u)
    },
    warn(u) {
        this.output("warn", u)
    },
    error(u) {
        this.output("error", u)
    },
    output(u, a) {
        console?.[u]?.apply?.(console, a)
    }
};
class zu {
    constructor(a, r={}) {
        this.init(a, r)
    }
    init(a, r={}) {
        this.prefix = r.prefix || "i18next:",
        this.logger = a || i1,
        this.options = r,
        this.debug = r.debug
    }
    log(...a) {
        return this.forward(a, "log", "", !0)
    }
    warn(...a) {
        return this.forward(a, "warn", "", !0)
    }
    error(...a) {
        return this.forward(a, "error", "")
    }
    deprecate(...a) {
        return this.forward(a, "warn", "WARNING DEPRECATED: ", !0)
    }
    forward(a, r, o, c) {
        return c && !this.debug ? null : (le(a[0]) && (a[0] = `${o}${this.prefix} ${a[0]}`),
        this.logger[r](a))
    }
    create(a) {
        return new zu(this.logger,{
            prefix: `${this.prefix}:${a}:`,
            ...this.options
        })
    }
    clone(a) {
        return a = a || this.options,
        a.prefix = a.prefix || this.prefix,
        new zu(this.logger,a)
    }
}
var Yt = new zu;
class Hu {
    constructor() {
        this.observers = {}
    }
    on(a, r) {
        return a.split(" ").forEach(o => {
            this.observers[o] || (this.observers[o] = new Map);
            const c = this.observers[o].get(r) || 0;
            this.observers[o].set(r, c + 1)
        }
        ),
        this
    }
    off(a, r) {
        if (this.observers[a]) {
            if (!r) {
                delete this.observers[a];
                return
            }
            this.observers[a].delete(r)
        }
    }
    emit(a, ...r) {
        this.observers[a] && Array.from(this.observers[a].entries()).forEach( ([c,f]) => {
            for (let d = 0; d < f; d++)
                c(...r)
        }
        ),
        this.observers["*"] && Array.from(this.observers["*"].entries()).forEach( ([c,f]) => {
            for (let d = 0; d < f; d++)
                c.apply(c, [a, ...r])
        }
        )
    }
}
class jm extends Hu {
    constructor(a, r={
        ns: ["translation"],
        defaultNS: "translation"
    }) {
        super(),
        this.data = a || {},
        this.options = r,
        this.options.keySeparator === void 0 && (this.options.keySeparator = "."),
        this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0)
    }
    addNamespaces(a) {
        this.options.ns.indexOf(a) < 0 && this.options.ns.push(a)
    }
    removeNamespaces(a) {
        const r = this.options.ns.indexOf(a);
        r > -1 && this.options.ns.splice(r, 1)
    }
    getResource(a, r, o, c={}) {
        const f = c.keySeparator !== void 0 ? c.keySeparator : this.options.keySeparator
          , d = c.ignoreJSONStructure !== void 0 ? c.ignoreJSONStructure : this.options.ignoreJSONStructure;
        let m;
        a.indexOf(".") > -1 ? m = a.split(".") : (m = [a, r],
        o && (Array.isArray(o) ? m.push(...o) : le(o) && f ? m.push(...o.split(f)) : m.push(o)));
        const g = Mu(this.data, m);
        return !g && !r && !o && a.indexOf(".") > -1 && (a = m[0],
        r = m[1],
        o = m.slice(2).join(".")),
        g || !d || !le(o) ? g : Ds(this.data?.[a]?.[r], o, f)
    }
    addResource(a, r, o, c, f={
        silent: !1
    }) {
        const d = f.keySeparator !== void 0 ? f.keySeparator : this.options.keySeparator;
        let m = [a, r];
        o && (m = m.concat(d ? o.split(d) : o)),
        a.indexOf(".") > -1 && (m = a.split("."),
        c = r,
        r = m[1]),
        this.addNamespaces(r),
        Hm(this.data, m, c),
        f.silent || this.emit("added", a, r, o, c)
    }
    addResources(a, r, o, c={
        silent: !1
    }) {
        for (const f in o)
            (le(o[f]) || Array.isArray(o[f])) && this.addResource(a, r, f, o[f], {
                silent: !0
            });
        c.silent || this.emit("added", a, r, o)
    }
    addResourceBundle(a, r, o, c, f, d={
        silent: !1,
        skipCopy: !1
    }) {
        let m = [a, r];
        a.indexOf(".") > -1 && (m = a.split("."),
        c = o,
        o = r,
        r = m[1]),
        this.addNamespaces(r);
        let g = Mu(this.data, m) || {};
        d.skipCopy || (o = JSON.parse(JSON.stringify(o))),
        c ? jg(g, o, f) : g = {
            ...g,
            ...o
        },
        Hm(this.data, m, g),
        d.silent || this.emit("added", a, r, o)
    }
    removeResourceBundle(a, r) {
        this.hasResourceBundle(a, r) && delete this.data[a][r],
        this.removeNamespaces(r),
        this.emit("removed", a, r)
    }
    hasResourceBundle(a, r) {
        return this.getResource(a, r) !== void 0
    }
    getResourceBundle(a, r) {
        return r || (r = this.options.defaultNS),
        this.getResource(a, r)
    }
    getDataByLanguage(a) {
        return this.data[a]
    }
    hasLanguageSomeTranslations(a) {
        const r = this.getDataByLanguage(a);
        return !!(r && Object.keys(r) || []).find(c => r[c] && Object.keys(r[c]).length > 0)
    }
    toJSON() {
        return this.data
    }
}
var Bg = {
    processors: {},
    addPostProcessor(u) {
        this.processors[u.name] = u
    },
    handle(u, a, r, o, c) {
        return u.forEach(f => {
            a = this.processors[f]?.process(a, r, o, c) ?? a
        }
        ),
        a
    }
};
const qg = Symbol("i18next/PATH_KEY");
function u1() {
    const u = []
      , a = Object.create(null);
    let r;
    return a.get = (o, c) => (r?.revoke?.(),
    c === qg ? u : (u.push(c),
    r = Proxy.revocable(o, a),
    r.proxy)),
    Proxy.revocable(Object.create(null), a).proxy
}
function Ns(u, a) {
    const {[qg]: r} = u(u1());
    return r.join(a?.keySeparator ?? ".")
}
const Bm = {}
  , qm = u => !le(u) && typeof u != "boolean" && typeof u != "number";
class Du extends Hu {
    constructor(a, r={}) {
        super(),
        $0(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], a, this),
        this.options = r,
        this.options.keySeparator === void 0 && (this.options.keySeparator = "."),
        this.logger = Yt.create("translator")
    }
    changeLanguage(a) {
        a && (this.language = a)
    }
    exists(a, r={
        interpolation: {}
    }) {
        const o = {
            ...r
        };
        return a == null ? !1 : this.resolve(a, o)?.res !== void 0
    }
    extractFromKey(a, r) {
        let o = r.nsSeparator !== void 0 ? r.nsSeparator : this.options.nsSeparator;
        o === void 0 && (o = ":");
        const c = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator;
        let f = r.ns || this.options.defaultNS || [];
        const d = o && a.indexOf(o) > -1
          , m = !this.options.userDefinedKeySeparator && !r.keySeparator && !this.options.userDefinedNsSeparator && !r.nsSeparator && !a1(a, o, c);
        if (d && !m) {
            const g = a.match(this.interpolator.nestingRegexp);
            if (g && g.length > 0)
                return {
                    key: a,
                    namespaces: le(f) ? [f] : f
                };
            const p = a.split(o);
            (o !== c || o === c && this.options.ns.indexOf(p[0]) > -1) && (f = p.shift()),
            a = p.join(c)
        }
        return {
            key: a,
            namespaces: le(f) ? [f] : f
        }
    }
    translate(a, r, o) {
        let c = typeof r == "object" ? {
            ...r
        } : r;
        if (typeof c != "object" && this.options.overloadTranslationOptionHandler && (c = this.options.overloadTranslationOptionHandler(arguments)),
        typeof options == "object" && (c = {
            ...c
        }),
        c || (c = {}),
        a == null)
            return "";
        typeof a == "function" && (a = Ns(a, c)),
        Array.isArray(a) || (a = [String(a)]);
        const f = c.returnDetails !== void 0 ? c.returnDetails : this.options.returnDetails
          , d = c.keySeparator !== void 0 ? c.keySeparator : this.options.keySeparator
          , {key: m, namespaces: g} = this.extractFromKey(a[a.length - 1], c)
          , p = g[g.length - 1];
        let S = c.nsSeparator !== void 0 ? c.nsSeparator : this.options.nsSeparator;
        S === void 0 && (S = ":");
        const v = c.lng || this.language
          , E = c.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
        if (v?.toLowerCase() === "cimode")
            return E ? f ? {
                res: `${p}${S}${m}`,
                usedKey: m,
                exactUsedKey: m,
                usedLng: v,
                usedNS: p,
                usedParams: this.getUsedParamsDetails(c)
            } : `${p}${S}${m}` : f ? {
                res: m,
                usedKey: m,
                exactUsedKey: m,
                usedLng: v,
                usedNS: p,
                usedParams: this.getUsedParamsDetails(c)
            } : m;
        const b = this.resolve(a, c);
        let _ = b?.res;
        const A = b?.usedKey || m
          , x = b?.exactUsedKey || m
          , z = ["[object Number]", "[object Function]", "[object RegExp]"]
          , q = c.joinArrays !== void 0 ? c.joinArrays : this.options.joinArrays
          , Y = !this.i18nFormat || this.i18nFormat.handleAsObject
          , k = c.count !== void 0 && !le(c.count)
          , F = Du.hasDefaultValue(c)
          , re = k ? this.pluralResolver.getSuffix(v, c.count, c) : ""
          , W = c.ordinal && k ? this.pluralResolver.getSuffix(v, c.count, {
            ordinal: !1
        }) : ""
          , pe = k && !c.ordinal && c.count === 0
          , Ce = pe && c[`defaultValue${this.options.pluralSeparator}zero`] || c[`defaultValue${re}`] || c[`defaultValue${W}`] || c.defaultValue;
        let V = _;
        Y && !_ && F && (V = Ce);
        const X = qm(V)
          , K = Object.prototype.toString.apply(V);
        if (Y && V && X && z.indexOf(K) < 0 && !(le(q) && Array.isArray(V))) {
            if (!c.returnObjects && !this.options.returnObjects) {
                this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
                const te = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(A, V, {
                    ...c,
                    ns: g
                }) : `key '${m} (${this.language})' returned an object instead of string.`;
                return f ? (b.res = te,
                b.usedParams = this.getUsedParamsDetails(c),
                b) : te
            }
            if (d) {
                const te = Array.isArray(V)
                  , oe = te ? [] : {}
                  , ce = te ? x : A;
                for (const N in V)
                    if (Object.prototype.hasOwnProperty.call(V, N)) {
                        const Q = `${ce}${d}${N}`;
                        F && !_ ? oe[N] = this.translate(Q, {
                            ...c,
                            defaultValue: qm(Ce) ? Ce[N] : void 0,
                            joinArrays: !1,
                            ns: g
                        }) : oe[N] = this.translate(Q, {
                            ...c,
                            joinArrays: !1,
                            ns: g
                        }),
                        oe[N] === Q && (oe[N] = V[N])
                    }
                _ = oe
            }
        } else if (Y && le(q) && Array.isArray(_))
            _ = _.join(q),
            _ && (_ = this.extendTranslation(_, a, c, o));
        else {
            let te = !1
              , oe = !1;
            !this.isValidLookup(_) && F && (te = !0,
            _ = Ce),
            this.isValidLookup(_) || (oe = !0,
            _ = m);
            const N = (c.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && oe ? void 0 : _
              , Q = F && Ce !== _ && this.options.updateMissing;
            if (oe || te || Q) {
                if (this.logger.log(Q ? "updateKey" : "missingKey", v, p, m, Q ? Ce : _),
                d) {
                    const T = this.resolve(m, {
                        ...c,
                        keySeparator: !1
                    });
                    T && T.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.")
                }
                let ee = [];
                const ve = this.languageUtils.getFallbackCodes(this.options.fallbackLng, c.lng || this.language);
                if (this.options.saveMissingTo === "fallback" && ve && ve[0])
                    for (let T = 0; T < ve.length; T++)
                        ee.push(ve[T]);
                else
                    this.options.saveMissingTo === "all" ? ee = this.languageUtils.toResolveHierarchy(c.lng || this.language) : ee.push(c.lng || this.language);
                const _e = (T, j, Z) => {
                    const J = F && Z !== _ ? Z : N;
                    this.options.missingKeyHandler ? this.options.missingKeyHandler(T, p, j, J, Q, c) : this.backendConnector?.saveMissing && this.backendConnector.saveMissing(T, p, j, J, Q, c),
                    this.emit("missingKey", T, p, j, _)
                }
                ;
                this.options.saveMissing && (this.options.saveMissingPlurals && k ? ee.forEach(T => {
                    const j = this.pluralResolver.getSuffixes(T, c);
                    pe && c[`defaultValue${this.options.pluralSeparator}zero`] && j.indexOf(`${this.options.pluralSeparator}zero`) < 0 && j.push(`${this.options.pluralSeparator}zero`),
                    j.forEach(Z => {
                        _e([T], m + Z, c[`defaultValue${Z}`] || Ce)
                    }
                    )
                }
                ) : _e(ee, m, Ce))
            }
            _ = this.extendTranslation(_, a, c, b, o),
            oe && _ === m && this.options.appendNamespaceToMissingKey && (_ = `${p}${S}${m}`),
            (oe || te) && this.options.parseMissingKeyHandler && (_ = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${p}${S}${m}` : m, te ? _ : void 0, c))
        }
        return f ? (b.res = _,
        b.usedParams = this.getUsedParamsDetails(c),
        b) : _
    }
    extendTranslation(a, r, o, c, f) {
        if (this.i18nFormat?.parse)
            a = this.i18nFormat.parse(a, {
                ...this.options.interpolation.defaultVariables,
                ...o
            }, o.lng || this.language || c.usedLng, c.usedNS, c.usedKey, {
                resolved: c
            });
        else if (!o.skipInterpolation) {
            o.interpolation && this.interpolator.init({
                ...o,
                interpolation: {
                    ...this.options.interpolation,
                    ...o.interpolation
                }
            });
            const g = le(a) && (o?.interpolation?.skipOnVariables !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
            let p;
            if (g) {
                const v = a.match(this.interpolator.nestingRegexp);
                p = v && v.length
            }
            let S = o.replace && !le(o.replace) ? o.replace : o;
            if (this.options.interpolation.defaultVariables && (S = {
                ...this.options.interpolation.defaultVariables,
                ...S
            }),
            a = this.interpolator.interpolate(a, S, o.lng || this.language || c.usedLng, o),
            g) {
                const v = a.match(this.interpolator.nestingRegexp)
                  , E = v && v.length;
                p < E && (o.nest = !1)
            }
            !o.lng && c && c.res && (o.lng = this.language || c.usedLng),
            o.nest !== !1 && (a = this.interpolator.nest(a, (...v) => f?.[0] === v[0] && !o.context ? (this.logger.warn(`It seems you are nesting recursively key: ${v[0]} in key: ${r[0]}`),
            null) : this.translate(...v, r), o)),
            o.interpolation && this.interpolator.reset()
        }
        const d = o.postProcess || this.options.postProcess
          , m = le(d) ? [d] : d;
        return a != null && m?.length && o.applyPostProcessor !== !1 && (a = Bg.handle(m, a, r, this.options && this.options.postProcessPassResolved ? {
            i18nResolved: {
                ...c,
                usedParams: this.getUsedParamsDetails(o)
            },
            ...o
        } : o, this)),
        a
    }
    resolve(a, r={}) {
        let o, c, f, d, m;
        return le(a) && (a = [a]),
        a.forEach(g => {
            if (this.isValidLookup(o))
                return;
            const p = this.extractFromKey(g, r)
              , S = p.key;
            c = S;
            let v = p.namespaces;
            this.options.fallbackNS && (v = v.concat(this.options.fallbackNS));
            const E = r.count !== void 0 && !le(r.count)
              , b = E && !r.ordinal && r.count === 0
              , _ = r.context !== void 0 && (le(r.context) || typeof r.context == "number") && r.context !== ""
              , A = r.lngs ? r.lngs : this.languageUtils.toResolveHierarchy(r.lng || this.language, r.fallbackLng);
            v.forEach(x => {
                this.isValidLookup(o) || (m = x,
                !Bm[`${A[0]}-${x}`] && this.utils?.hasLoadedNamespace && !this.utils?.hasLoadedNamespace(m) && (Bm[`${A[0]}-${x}`] = !0,
                this.logger.warn(`key "${c}" for languages "${A.join(", ")}" won't get resolved as namespace "${m}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")),
                A.forEach(z => {
                    if (this.isValidLookup(o))
                        return;
                    d = z;
                    const q = [S];
                    if (this.i18nFormat?.addLookupKeys)
                        this.i18nFormat.addLookupKeys(q, S, z, x, r);
                    else {
                        let k;
                        E && (k = this.pluralResolver.getSuffix(z, r.count, r));
                        const F = `${this.options.pluralSeparator}zero`
                          , re = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
                        if (E && (r.ordinal && k.indexOf(re) === 0 && q.push(S + k.replace(re, this.options.pluralSeparator)),
                        q.push(S + k),
                        b && q.push(S + F)),
                        _) {
                            const W = `${S}${this.options.contextSeparator || "_"}${r.context}`;
                            q.push(W),
                            E && (r.ordinal && k.indexOf(re) === 0 && q.push(W + k.replace(re, this.options.pluralSeparator)),
                            q.push(W + k),
                            b && q.push(W + F))
                        }
                    }
                    let Y;
                    for (; Y = q.pop(); )
                        this.isValidLookup(o) || (f = Y,
                        o = this.getResource(z, x, Y, r))
                }
                ))
            }
            )
        }
        ),
        {
            res: o,
            usedKey: c,
            exactUsedKey: f,
            usedLng: d,
            usedNS: m
        }
    }
    isValidLookup(a) {
        return a !== void 0 && !(!this.options.returnNull && a === null) && !(!this.options.returnEmptyString && a === "")
    }
    getResource(a, r, o, c={}) {
        return this.i18nFormat?.getResource ? this.i18nFormat.getResource(a, r, o, c) : this.resourceStore.getResource(a, r, o, c)
    }
    getUsedParamsDetails(a={}) {
        const r = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"]
          , o = a.replace && !le(a.replace);
        let c = o ? a.replace : a;
        if (o && typeof a.count < "u" && (c.count = a.count),
        this.options.interpolation.defaultVariables && (c = {
            ...this.options.interpolation.defaultVariables,
            ...c
        }),
        !o) {
            c = {
                ...c
            };
            for (const f of r)
                delete c[f]
        }
        return c
    }
    static hasDefaultValue(a) {
        const r = "defaultValue";
        for (const o in a)
            if (Object.prototype.hasOwnProperty.call(a, o) && r === o.substring(0, r.length) && a[o] !== void 0)
                return !0;
        return !1
    }
}
class Gm {
    constructor(a) {
        this.options = a,
        this.supportedLngs = this.options.supportedLngs || !1,
        this.logger = Yt.create("languageUtils")
    }
    getScriptPartFromCode(a) {
        if (a = Wa(a),
        !a || a.indexOf("-") < 0)
            return null;
        const r = a.split("-");
        return r.length === 2 || (r.pop(),
        r[r.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(r.join("-"))
    }
    getLanguagePartFromCode(a) {
        if (a = Wa(a),
        !a || a.indexOf("-") < 0)
            return a;
        const r = a.split("-");
        return this.formatLanguageCode(r[0])
    }
    formatLanguageCode(a) {
        if (le(a) && a.indexOf("-") > -1) {
            let r;
            try {
                r = Intl.getCanonicalLocales(a)[0]
            } catch {}
            return r && this.options.lowerCaseLng && (r = r.toLowerCase()),
            r || (this.options.lowerCaseLng ? a.toLowerCase() : a)
        }
        return this.options.cleanCode || this.options.lowerCaseLng ? a.toLowerCase() : a
    }
    isSupportedCode(a) {
        return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (a = this.getLanguagePartFromCode(a)),
        !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(a) > -1
    }
    getBestMatchFromCodes(a) {
        if (!a)
            return null;
        let r;
        return a.forEach(o => {
            if (r)
                return;
            const c = this.formatLanguageCode(o);
            (!this.options.supportedLngs || this.isSupportedCode(c)) && (r = c)
        }
        ),
        !r && this.options.supportedLngs && a.forEach(o => {
            if (r)
                return;
            const c = this.getScriptPartFromCode(o);
            if (this.isSupportedCode(c))
                return r = c;
            const f = this.getLanguagePartFromCode(o);
            if (this.isSupportedCode(f))
                return r = f;
            r = this.options.supportedLngs.find(d => {
                if (d === f)
                    return d;
                if (!(d.indexOf("-") < 0 && f.indexOf("-") < 0) && (d.indexOf("-") > 0 && f.indexOf("-") < 0 && d.substring(0, d.indexOf("-")) === f || d.indexOf(f) === 0 && f.length > 1))
                    return d
            }
            )
        }
        ),
        r || (r = this.getFallbackCodes(this.options.fallbackLng)[0]),
        r
    }
    getFallbackCodes(a, r) {
        if (!a)
            return [];
        if (typeof a == "function" && (a = a(r)),
        le(a) && (a = [a]),
        Array.isArray(a))
            return a;
        if (!r)
            return a.default || [];
        let o = a[r];
        return o || (o = a[this.getScriptPartFromCode(r)]),
        o || (o = a[this.formatLanguageCode(r)]),
        o || (o = a[this.getLanguagePartFromCode(r)]),
        o || (o = a.default),
        o || []
    }
    toResolveHierarchy(a, r) {
        const o = this.getFallbackCodes((r === !1 ? [] : r) || this.options.fallbackLng || [], a)
          , c = []
          , f = d => {
            d && (this.isSupportedCode(d) ? c.push(d) : this.logger.warn(`rejecting language code not found in supportedLngs: ${d}`))
        }
        ;
        return le(a) && (a.indexOf("-") > -1 || a.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && f(this.formatLanguageCode(a)),
        this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && f(this.getScriptPartFromCode(a)),
        this.options.load !== "currentOnly" && f(this.getLanguagePartFromCode(a))) : le(a) && f(this.formatLanguageCode(a)),
        o.forEach(d => {
            c.indexOf(d) < 0 && f(this.formatLanguageCode(d))
        }
        ),
        c
    }
}
const Ym = {
    zero: 0,
    one: 1,
    two: 2,
    few: 3,
    many: 4,
    other: 5
}
  , Vm = {
    select: u => u === 1 ? "one" : "other",
    resolvedOptions: () => ({
        pluralCategories: ["one", "other"]
    })
};
class r1 {
    constructor(a, r={}) {
        this.languageUtils = a,
        this.options = r,
        this.logger = Yt.create("pluralResolver"),
        this.pluralRulesCache = {}
    }
    addRule(a, r) {
        this.rules[a] = r
    }
    clearCache() {
        this.pluralRulesCache = {}
    }
    getRule(a, r={}) {
        const o = Wa(a === "dev" ? "en" : a)
          , c = r.ordinal ? "ordinal" : "cardinal"
          , f = JSON.stringify({
            cleanedCode: o,
            type: c
        });
        if (f in this.pluralRulesCache)
            return this.pluralRulesCache[f];
        let d;
        try {
            d = new Intl.PluralRules(o,{
                type: c
            })
        } catch {
            if (!Intl)
                return this.logger.error("No Intl support, please use an Intl polyfill!"),
                Vm;
            if (!a.match(/-|_/))
                return Vm;
            const g = this.languageUtils.getLanguagePartFromCode(a);
            d = this.getRule(g, r)
        }
        return this.pluralRulesCache[f] = d,
        d
    }
    needsPlural(a, r={}) {
        let o = this.getRule(a, r);
        return o || (o = this.getRule("dev", r)),
        o?.resolvedOptions().pluralCategories.length > 1
    }
    getPluralFormsOfKey(a, r, o={}) {
        return this.getSuffixes(a, o).map(c => `${r}${c}`)
    }
    getSuffixes(a, r={}) {
        let o = this.getRule(a, r);
        return o || (o = this.getRule("dev", r)),
        o ? o.resolvedOptions().pluralCategories.sort( (c, f) => Ym[c] - Ym[f]).map(c => `${this.options.prepend}${r.ordinal ? `ordinal${this.options.prepend}` : ""}${c}`) : []
    }
    getSuffix(a, r, o={}) {
        const c = this.getRule(a, o);
        return c ? `${this.options.prepend}${o.ordinal ? `ordinal${this.options.prepend}` : ""}${c.select(r)}` : (this.logger.warn(`no plural rule found for: ${a}`),
        this.getSuffix("dev", r, o))
    }
}
const Qm = (u, a, r, o=".", c=!0) => {
    let f = I0(u, a, r);
    return !f && c && le(r) && (f = Ds(u, r, o),
    f === void 0 && (f = Ds(a, r, o))),
    f
}
  , xs = u => u.replace(/\$/g, "$$$$");
class o1 {
    constructor(a={}) {
        this.logger = Yt.create("interpolator"),
        this.options = a,
        this.format = a?.interpolation?.format || (r => r),
        this.init(a)
    }
    init(a={}) {
        a.interpolation || (a.interpolation = {
            escapeValue: !0
        });
        const {escape: r, escapeValue: o, useRawValueToEscape: c, prefix: f, prefixEscaped: d, suffix: m, suffixEscaped: g, formatSeparator: p, unescapeSuffix: S, unescapePrefix: v, nestingPrefix: E, nestingPrefixEscaped: b, nestingSuffix: _, nestingSuffixEscaped: A, nestingOptionsSeparator: x, maxReplaces: z, alwaysFormat: q} = a.interpolation;
        this.escape = r !== void 0 ? r : e1,
        this.escapeValue = o !== void 0 ? o : !0,
        this.useRawValueToEscape = c !== void 0 ? c : !1,
        this.prefix = f ? Yl(f) : d || "{{",
        this.suffix = m ? Yl(m) : g || "}}",
        this.formatSeparator = p || ",",
        this.unescapePrefix = S ? "" : v || "-",
        this.unescapeSuffix = this.unescapePrefix ? "" : S || "",
        this.nestingPrefix = E ? Yl(E) : b || Yl("$t("),
        this.nestingSuffix = _ ? Yl(_) : A || Yl(")"),
        this.nestingOptionsSeparator = x || ",",
        this.maxReplaces = z || 1e3,
        this.alwaysFormat = q !== void 0 ? q : !1,
        this.resetRegExp()
    }
    reset() {
        this.options && this.init(this.options)
    }
    resetRegExp() {
        const a = (r, o) => r?.source === o ? (r.lastIndex = 0,
        r) : new RegExp(o,"g");
        this.regexp = a(this.regexp, `${this.prefix}(.+?)${this.suffix}`),
        this.regexpUnescape = a(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`),
        this.nestingRegexp = a(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`)
    }
    interpolate(a, r, o, c) {
        let f, d, m;
        const g = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}
          , p = b => {
            if (b.indexOf(this.formatSeparator) < 0) {
                const z = Qm(r, g, b, this.options.keySeparator, this.options.ignoreJSONStructure);
                return this.alwaysFormat ? this.format(z, void 0, o, {
                    ...c,
                    ...r,
                    interpolationkey: b
                }) : z
            }
            const _ = b.split(this.formatSeparator)
              , A = _.shift().trim()
              , x = _.join(this.formatSeparator).trim();
            return this.format(Qm(r, g, A, this.options.keySeparator, this.options.ignoreJSONStructure), x, o, {
                ...c,
                ...r,
                interpolationkey: A
            })
        }
        ;
        this.resetRegExp();
        const S = c?.missingInterpolationHandler || this.options.missingInterpolationHandler
          , v = c?.interpolation?.skipOnVariables !== void 0 ? c.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
        return [{
            regex: this.regexpUnescape,
            safeValue: b => xs(b)
        }, {
            regex: this.regexp,
            safeValue: b => this.escapeValue ? xs(this.escape(b)) : xs(b)
        }].forEach(b => {
            for (m = 0; f = b.regex.exec(a); ) {
                const _ = f[1].trim();
                if (d = p(_),
                d === void 0)
                    if (typeof S == "function") {
                        const x = S(a, f, c);
                        d = le(x) ? x : ""
                    } else if (c && Object.prototype.hasOwnProperty.call(c, _))
                        d = "";
                    else if (v) {
                        d = f[0];
                        continue
                    } else
                        this.logger.warn(`missed to pass in variable ${_} for interpolating ${a}`),
                        d = "";
                else
                    !le(d) && !this.useRawValueToEscape && (d = Dm(d));
                const A = b.safeValue(d);
                if (a = a.replace(f[0], A),
                v ? (b.regex.lastIndex += d.length,
                b.regex.lastIndex -= f[0].length) : b.regex.lastIndex = 0,
                m++,
                m >= this.maxReplaces)
                    break
            }
        }
        ),
        a
    }
    nest(a, r, o={}) {
        let c, f, d;
        const m = (g, p) => {
            const S = this.nestingOptionsSeparator;
            if (g.indexOf(S) < 0)
                return g;
            const v = g.split(new RegExp(`${S}[ ]*{`));
            let E = `{${v[1]}`;
            g = v[0],
            E = this.interpolate(E, d);
            const b = E.match(/'/g)
              , _ = E.match(/"/g);
            ((b?.length ?? 0) % 2 === 0 && !_ || _.length % 2 !== 0) && (E = E.replace(/'/g, '"'));
            try {
                d = JSON.parse(E),
                p && (d = {
                    ...p,
                    ...d
                })
            } catch (A) {
                return this.logger.warn(`failed parsing options string in nesting for key ${g}`, A),
                `${g}${S}${E}`
            }
            return d.defaultValue && d.defaultValue.indexOf(this.prefix) > -1 && delete d.defaultValue,
            g
        }
        ;
        for (; c = this.nestingRegexp.exec(a); ) {
            let g = [];
            d = {
                ...o
            },
            d = d.replace && !le(d.replace) ? d.replace : d,
            d.applyPostProcessor = !1,
            delete d.defaultValue;
            const p = /{.*}/.test(c[1]) ? c[1].lastIndexOf("}") + 1 : c[1].indexOf(this.formatSeparator);
            if (p !== -1 && (g = c[1].slice(p).split(this.formatSeparator).map(S => S.trim()).filter(Boolean),
            c[1] = c[1].slice(0, p)),
            f = r(m.call(this, c[1].trim(), d), d),
            f && c[0] === a && !le(f))
                return f;
            le(f) || (f = Dm(f)),
            f || (this.logger.warn(`missed to resolve ${c[1]} for nesting ${a}`),
            f = ""),
            g.length && (f = g.reduce( (S, v) => this.format(S, v, o.lng, {
                ...o,
                interpolationkey: c[1].trim()
            }), f.trim())),
            a = a.replace(c[0], f),
            this.regexp.lastIndex = 0
        }
        return a
    }
}
const s1 = u => {
    let a = u.toLowerCase().trim();
    const r = {};
    if (u.indexOf("(") > -1) {
        const o = u.split("(");
        a = o[0].toLowerCase().trim();
        const c = o[1].substring(0, o[1].length - 1);
        a === "currency" && c.indexOf(":") < 0 ? r.currency || (r.currency = c.trim()) : a === "relativetime" && c.indexOf(":") < 0 ? r.range || (r.range = c.trim()) : c.split(";").forEach(d => {
            if (d) {
                const [m,...g] = d.split(":")
                  , p = g.join(":").trim().replace(/^'+|'+$/g, "")
                  , S = m.trim();
                r[S] || (r[S] = p),
                p === "false" && (r[S] = !1),
                p === "true" && (r[S] = !0),
                isNaN(p) || (r[S] = parseInt(p, 10))
            }
        }
        )
    }
    return {
        formatName: a,
        formatOptions: r
    }
}
  , Xm = u => {
    const a = {};
    return (r, o, c) => {
        let f = c;
        c && c.interpolationkey && c.formatParams && c.formatParams[c.interpolationkey] && c[c.interpolationkey] && (f = {
            ...f,
            [c.interpolationkey]: void 0
        });
        const d = o + JSON.stringify(f);
        let m = a[d];
        return m || (m = u(Wa(o), c),
        a[d] = m),
        m(r)
    }
}
  , c1 = u => (a, r, o) => u(Wa(r), o)(a);
class f1 {
    constructor(a={}) {
        this.logger = Yt.create("formatter"),
        this.options = a,
        this.init(a)
    }
    init(a, r={
        interpolation: {}
    }) {
        this.formatSeparator = r.interpolation.formatSeparator || ",";
        const o = r.cacheInBuiltFormats ? Xm : c1;
        this.formats = {
            number: o( (c, f) => {
                const d = new Intl.NumberFormat(c,{
                    ...f
                });
                return m => d.format(m)
            }
            ),
            currency: o( (c, f) => {
                const d = new Intl.NumberFormat(c,{
                    ...f,
                    style: "currency"
                });
                return m => d.format(m)
            }
            ),
            datetime: o( (c, f) => {
                const d = new Intl.DateTimeFormat(c,{
                    ...f
                });
                return m => d.format(m)
            }
            ),
            relativetime: o( (c, f) => {
                const d = new Intl.RelativeTimeFormat(c,{
                    ...f
                });
                return m => d.format(m, f.range || "day")
            }
            ),
            list: o( (c, f) => {
                const d = new Intl.ListFormat(c,{
                    ...f
                });
                return m => d.format(m)
            }
            )
        }
    }
    add(a, r) {
        this.formats[a.toLowerCase().trim()] = r
    }
    addCached(a, r) {
        this.formats[a.toLowerCase().trim()] = Xm(r)
    }
    format(a, r, o, c={}) {
        const f = r.split(this.formatSeparator);
        if (f.length > 1 && f[0].indexOf("(") > 1 && f[0].indexOf(")") < 0 && f.find(m => m.indexOf(")") > -1)) {
            const m = f.findIndex(g => g.indexOf(")") > -1);
            f[0] = [f[0], ...f.splice(1, m)].join(this.formatSeparator)
        }
        return f.reduce( (m, g) => {
            const {formatName: p, formatOptions: S} = s1(g);
            if (this.formats[p]) {
                let v = m;
                try {
                    const E = c?.formatParams?.[c.interpolationkey] || {}
                      , b = E.locale || E.lng || c.locale || c.lng || o;
                    v = this.formats[p](m, b, {
                        ...S,
                        ...c,
                        ...E
                    })
                } catch (E) {
                    this.logger.warn(E)
                }
                return v
            } else
                this.logger.warn(`there was no format function for ${p}`);
            return m
        }
        , a)
    }
}
const d1 = (u, a) => {
    u.pending[a] !== void 0 && (delete u.pending[a],
    u.pendingCount--)
}
;
class h1 extends Hu {
    constructor(a, r, o, c={}) {
        super(),
        this.backend = a,
        this.store = r,
        this.services = o,
        this.languageUtils = o.languageUtils,
        this.options = c,
        this.logger = Yt.create("backendConnector"),
        this.waitingReads = [],
        this.maxParallelReads = c.maxParallelReads || 10,
        this.readingCalls = 0,
        this.maxRetries = c.maxRetries >= 0 ? c.maxRetries : 5,
        this.retryTimeout = c.retryTimeout >= 1 ? c.retryTimeout : 350,
        this.state = {},
        this.queue = [],
        this.backend?.init?.(o, c.backend, c)
    }
    queueLoad(a, r, o, c) {
        const f = {}
          , d = {}
          , m = {}
          , g = {};
        return a.forEach(p => {
            let S = !0;
            r.forEach(v => {
                const E = `${p}|${v}`;
                !o.reload && this.store.hasResourceBundle(p, v) ? this.state[E] = 2 : this.state[E] < 0 || (this.state[E] === 1 ? d[E] === void 0 && (d[E] = !0) : (this.state[E] = 1,
                S = !1,
                d[E] === void 0 && (d[E] = !0),
                f[E] === void 0 && (f[E] = !0),
                g[v] === void 0 && (g[v] = !0)))
            }
            ),
            S || (m[p] = !0)
        }
        ),
        (Object.keys(f).length || Object.keys(d).length) && this.queue.push({
            pending: d,
            pendingCount: Object.keys(d).length,
            loaded: {},
            errors: [],
            callback: c
        }),
        {
            toLoad: Object.keys(f),
            pending: Object.keys(d),
            toLoadLanguages: Object.keys(m),
            toLoadNamespaces: Object.keys(g)
        }
    }
    loaded(a, r, o) {
        const c = a.split("|")
          , f = c[0]
          , d = c[1];
        r && this.emit("failedLoading", f, d, r),
        !r && o && this.store.addResourceBundle(f, d, o, void 0, void 0, {
            skipCopy: !0
        }),
        this.state[a] = r ? -1 : 2,
        r && o && (this.state[a] = 0);
        const m = {};
        this.queue.forEach(g => {
            W0(g.loaded, [f], d),
            d1(g, a),
            r && g.errors.push(r),
            g.pendingCount === 0 && !g.done && (Object.keys(g.loaded).forEach(p => {
                m[p] || (m[p] = {});
                const S = g.loaded[p];
                S.length && S.forEach(v => {
                    m[p][v] === void 0 && (m[p][v] = !0)
                }
                )
            }
            ),
            g.done = !0,
            g.errors.length ? g.callback(g.errors) : g.callback())
        }
        ),
        this.emit("loaded", m),
        this.queue = this.queue.filter(g => !g.done)
    }
    read(a, r, o, c=0, f=this.retryTimeout, d) {
        if (!a.length)
            return d(null, {});
        if (this.readingCalls >= this.maxParallelReads) {
            this.waitingReads.push({
                lng: a,
                ns: r,
                fcName: o,
                tried: c,
                wait: f,
                callback: d
            });
            return
        }
        this.readingCalls++;
        const m = (p, S) => {
            if (this.readingCalls--,
            this.waitingReads.length > 0) {
                const v = this.waitingReads.shift();
                this.read(v.lng, v.ns, v.fcName, v.tried, v.wait, v.callback)
            }
            if (p && S && c < this.maxRetries) {
                setTimeout( () => {
                    this.read.call(this, a, r, o, c + 1, f * 2, d)
                }
                , f);
                return
            }
            d(p, S)
        }
          , g = this.backend[o].bind(this.backend);
        if (g.length === 2) {
            try {
                const p = g(a, r);
                p && typeof p.then == "function" ? p.then(S => m(null, S)).catch(m) : m(null, p)
            } catch (p) {
                m(p)
            }
            return
        }
        return g(a, r, m)
    }
    prepareLoading(a, r, o={}, c) {
        if (!this.backend)
            return this.logger.warn("No backend was added via i18next.use. Will not load resources."),
            c && c();
        le(a) && (a = this.languageUtils.toResolveHierarchy(a)),
        le(r) && (r = [r]);
        const f = this.queueLoad(a, r, o, c);
        if (!f.toLoad.length)
            return f.pending.length || c(),
            null;
        f.toLoad.forEach(d => {
            this.loadOne(d)
        }
        )
    }
    load(a, r, o) {
        this.prepareLoading(a, r, {}, o)
    }
    reload(a, r, o) {
        this.prepareLoading(a, r, {
            reload: !0
        }, o)
    }
    loadOne(a, r="") {
        const o = a.split("|")
          , c = o[0]
          , f = o[1];
        this.read(c, f, "read", void 0, void 0, (d, m) => {
            d && this.logger.warn(`${r}loading namespace ${f} for language ${c} failed`, d),
            !d && m && this.logger.log(`${r}loaded namespace ${f} for language ${c}`, m),
            this.loaded(a, d, m)
        }
        )
    }
    saveMissing(a, r, o, c, f, d={}, m= () => {}
    ) {
        if (this.services?.utils?.hasLoadedNamespace && !this.services?.utils?.hasLoadedNamespace(r)) {
            this.logger.warn(`did not save key "${o}" as the namespace "${r}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
            return
        }
        if (!(o == null || o === "")) {
            if (this.backend?.create) {
                const g = {
                    ...d,
                    isUpdate: f
                }
                  , p = this.backend.create.bind(this.backend);
                if (p.length < 6)
                    try {
                        let S;
                        p.length === 5 ? S = p(a, r, o, c, g) : S = p(a, r, o, c),
                        S && typeof S.then == "function" ? S.then(v => m(null, v)).catch(m) : m(null, S)
                    } catch (S) {
                        m(S)
                    }
                else
                    p(a, r, o, c, m, g)
            }
            !a || !a[0] || this.store.addResource(a[0], r, o, c)
        }
    }
}
const Zm = () => ({
    debug: !1,
    initAsync: !0,
    ns: ["translation"],
    defaultNS: ["translation"],
    fallbackLng: ["dev"],
    fallbackNS: !1,
    supportedLngs: !1,
    nonExplicitSupportedLngs: !1,
    load: "all",
    preload: !1,
    simplifyPluralSuffix: !0,
    keySeparator: ".",
    nsSeparator: ":",
    pluralSeparator: "_",
    contextSeparator: "_",
    partialBundledLanguages: !1,
    saveMissing: !1,
    updateMissing: !1,
    saveMissingTo: "fallback",
    saveMissingPlurals: !0,
    missingKeyHandler: !1,
    missingInterpolationHandler: !1,
    postProcess: !1,
    postProcessPassResolved: !1,
    returnNull: !1,
    returnEmptyString: !0,
    returnObjects: !1,
    joinArrays: !1,
    returnedObjectHandler: !1,
    parseMissingKeyHandler: !1,
    appendNamespaceToMissingKey: !1,
    appendNamespaceToCIMode: !1,
    overloadTranslationOptionHandler: u => {
        let a = {};
        if (typeof u[1] == "object" && (a = u[1]),
        le(u[1]) && (a.defaultValue = u[1]),
        le(u[2]) && (a.tDescription = u[2]),
        typeof u[2] == "object" || typeof u[3] == "object") {
            const r = u[3] || u[2];
            Object.keys(r).forEach(o => {
                a[o] = r[o]
            }
            )
        }
        return a
    }
    ,
    interpolation: {
        escapeValue: !0,
        format: u => u,
        prefix: "{{",
        suffix: "}}",
        formatSeparator: ",",
        unescapePrefix: "-",
        nestingPrefix: "$t(",
        nestingSuffix: ")",
        nestingOptionsSeparator: ",",
        maxReplaces: 1e3,
        skipOnVariables: !0
    },
    cacheInBuiltFormats: !0
})
  , Km = u => (le(u.ns) && (u.ns = [u.ns]),
le(u.fallbackLng) && (u.fallbackLng = [u.fallbackLng]),
le(u.fallbackNS) && (u.fallbackNS = [u.fallbackNS]),
u.supportedLngs?.indexOf?.("cimode") < 0 && (u.supportedLngs = u.supportedLngs.concat(["cimode"])),
typeof u.initImmediate == "boolean" && (u.initAsync = u.initImmediate),
u)
  , Ou = () => {}
  , m1 = u => {
    Object.getOwnPropertyNames(Object.getPrototypeOf(u)).forEach(r => {
        typeof u[r] == "function" && (u[r] = u[r].bind(u))
    }
    )
}
;
class Ia extends Hu {
    constructor(a={}, r) {
        if (super(),
        this.options = Km(a),
        this.services = {},
        this.logger = Yt,
        this.modules = {
            external: []
        },
        m1(this),
        r && !this.isInitialized && !a.isClone) {
            if (!this.options.initAsync)
                return this.init(a, r),
                this;
            setTimeout( () => {
                this.init(a, r)
            }
            , 0)
        }
    }
    init(a={}, r) {
        this.isInitializing = !0,
        typeof a == "function" && (r = a,
        a = {}),
        a.defaultNS == null && a.ns && (le(a.ns) ? a.defaultNS = a.ns : a.ns.indexOf("translation") < 0 && (a.defaultNS = a.ns[0]));
        const o = Zm();
        this.options = {
            ...o,
            ...this.options,
            ...Km(a)
        },
        this.options.interpolation = {
            ...o.interpolation,
            ...this.options.interpolation
        },
        a.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = a.keySeparator),
        a.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = a.nsSeparator);
        const c = p => p ? typeof p == "function" ? new p : p : null;
        if (!this.options.isClone) {
            this.modules.logger ? Yt.init(c(this.modules.logger), this.options) : Yt.init(null, this.options);
            let p;
            this.modules.formatter ? p = this.modules.formatter : p = f1;
            const S = new Gm(this.options);
            this.store = new jm(this.options.resources,this.options);
            const v = this.services;
            v.logger = Yt,
            v.resourceStore = this.store,
            v.languageUtils = S,
            v.pluralResolver = new r1(S,{
                prepend: this.options.pluralSeparator,
                simplifyPluralSuffix: this.options.simplifyPluralSuffix
            }),
            this.options.interpolation.format && this.options.interpolation.format !== o.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"),
            p && (!this.options.interpolation.format || this.options.interpolation.format === o.interpolation.format) && (v.formatter = c(p),
            v.formatter.init && v.formatter.init(v, this.options),
            this.options.interpolation.format = v.formatter.format.bind(v.formatter)),
            v.interpolator = new o1(this.options),
            v.utils = {
                hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
            },
            v.backendConnector = new h1(c(this.modules.backend),v.resourceStore,v,this.options),
            v.backendConnector.on("*", (b, ..._) => {
                this.emit(b, ..._)
            }
            ),
            this.modules.languageDetector && (v.languageDetector = c(this.modules.languageDetector),
            v.languageDetector.init && v.languageDetector.init(v, this.options.detection, this.options)),
            this.modules.i18nFormat && (v.i18nFormat = c(this.modules.i18nFormat),
            v.i18nFormat.init && v.i18nFormat.init(this)),
            this.translator = new Du(this.services,this.options),
            this.translator.on("*", (b, ..._) => {
                this.emit(b, ..._)
            }
            ),
            this.modules.external.forEach(b => {
                b.init && b.init(this)
            }
            )
        }
        if (this.format = this.options.interpolation.format,
        r || (r = Ou),
        this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
            const p = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
            p.length > 0 && p[0] !== "dev" && (this.options.lng = p[0])
        }
        !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"),
        ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach(p => {
            this[p] = (...S) => this.store[p](...S)
        }
        ),
        ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach(p => {
            this[p] = (...S) => (this.store[p](...S),
            this)
        }
        );
        const m = Xa()
          , g = () => {
            const p = (S, v) => {
                this.isInitializing = !1,
                this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"),
                this.isInitialized = !0,
                this.options.isClone || this.logger.log("initialized", this.options),
                this.emit("initialized", this.options),
                m.resolve(v),
                r(S, v)
            }
            ;
            if (this.languages && !this.isInitialized)
                return p(null, this.t.bind(this));
            this.changeLanguage(this.options.lng, p)
        }
        ;
        return this.options.resources || !this.options.initAsync ? g() : setTimeout(g, 0),
        m
    }
    loadResources(a, r=Ou) {
        let o = r;
        const c = le(a) ? a : this.language;
        if (typeof a == "function" && (o = a),
        !this.options.resources || this.options.partialBundledLanguages) {
            if (c?.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0))
                return o();
            const f = []
              , d = m => {
                if (!m || m === "cimode")
                    return;
                this.services.languageUtils.toResolveHierarchy(m).forEach(p => {
                    p !== "cimode" && f.indexOf(p) < 0 && f.push(p)
                }
                )
            }
            ;
            c ? d(c) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach(g => d(g)),
            this.options.preload?.forEach?.(m => d(m)),
            this.services.backendConnector.load(f, this.options.ns, m => {
                !m && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language),
                o(m)
            }
            )
        } else
            o(null)
    }
    reloadResources(a, r, o) {
        const c = Xa();
        return typeof a == "function" && (o = a,
        a = void 0),
        typeof r == "function" && (o = r,
        r = void 0),
        a || (a = this.languages),
        r || (r = this.options.ns),
        o || (o = Ou),
        this.services.backendConnector.reload(a, r, f => {
            c.resolve(),
            o(f)
        }
        ),
        c
    }
    use(a) {
        if (!a)
            throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
        if (!a.type)
            throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
        return a.type === "backend" && (this.modules.backend = a),
        (a.type === "logger" || a.log && a.warn && a.error) && (this.modules.logger = a),
        a.type === "languageDetector" && (this.modules.languageDetector = a),
        a.type === "i18nFormat" && (this.modules.i18nFormat = a),
        a.type === "postProcessor" && Bg.addPostProcessor(a),
        a.type === "formatter" && (this.modules.formatter = a),
        a.type === "3rdParty" && this.modules.external.push(a),
        this
    }
    setResolvedLanguage(a) {
        if (!(!a || !this.languages) && !(["cimode", "dev"].indexOf(a) > -1)) {
            for (let r = 0; r < this.languages.length; r++) {
                const o = this.languages[r];
                if (!(["cimode", "dev"].indexOf(o) > -1) && this.store.hasLanguageSomeTranslations(o)) {
                    this.resolvedLanguage = o;
                    break
                }
            }
            !this.resolvedLanguage && this.languages.indexOf(a) < 0 && this.store.hasLanguageSomeTranslations(a) && (this.resolvedLanguage = a,
            this.languages.unshift(a))
        }
    }
    changeLanguage(a, r) {
        this.isLanguageChangingTo = a;
        const o = Xa();
        this.emit("languageChanging", a);
        const c = m => {
            this.language = m,
            this.languages = this.services.languageUtils.toResolveHierarchy(m),
            this.resolvedLanguage = void 0,
            this.setResolvedLanguage(m)
        }
          , f = (m, g) => {
            g ? this.isLanguageChangingTo === a && (c(g),
            this.translator.changeLanguage(g),
            this.isLanguageChangingTo = void 0,
            this.emit("languageChanged", g),
            this.logger.log("languageChanged", g)) : this.isLanguageChangingTo = void 0,
            o.resolve( (...p) => this.t(...p)),
            r && r(m, (...p) => this.t(...p))
        }
          , d = m => {
            !a && !m && this.services.languageDetector && (m = []);
            const g = le(m) ? m : m && m[0]
              , p = this.store.hasLanguageSomeTranslations(g) ? g : this.services.languageUtils.getBestMatchFromCodes(le(m) ? [m] : m);
            p && (this.language || c(p),
            this.translator.language || this.translator.changeLanguage(p),
            this.services.languageDetector?.cacheUserLanguage?.(p)),
            this.loadResources(p, S => {
                f(S, p)
            }
            )
        }
        ;
        return !a && this.services.languageDetector && !this.services.languageDetector.async ? d(this.services.languageDetector.detect()) : !a && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(d) : this.services.languageDetector.detect(d) : d(a),
        o
    }
    getFixedT(a, r, o) {
        const c = (f, d, ...m) => {
            let g;
            typeof d != "object" ? g = this.options.overloadTranslationOptionHandler([f, d].concat(m)) : g = {
                ...d
            },
            g.lng = g.lng || c.lng,
            g.lngs = g.lngs || c.lngs,
            g.ns = g.ns || c.ns,
            g.keyPrefix !== "" && (g.keyPrefix = g.keyPrefix || o || c.keyPrefix);
            const p = this.options.keySeparator || ".";
            let S;
            return g.keyPrefix && Array.isArray(f) ? S = f.map(v => (typeof v == "function" && (v = Ns(v, d)),
            `${g.keyPrefix}${p}${v}`)) : (typeof f == "function" && (f = Ns(f, d)),
            S = g.keyPrefix ? `${g.keyPrefix}${p}${f}` : f),
            this.t(S, g)
        }
        ;
        return le(a) ? c.lng = a : c.lngs = a,
        c.ns = r,
        c.keyPrefix = o,
        c
    }
    t(...a) {
        return this.translator?.translate(...a)
    }
    exists(...a) {
        return this.translator?.exists(...a)
    }
    setDefaultNamespace(a) {
        this.options.defaultNS = a
    }
    hasLoadedNamespace(a, r={}) {
        if (!this.isInitialized)
            return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages),
            !1;
        if (!this.languages || !this.languages.length)
            return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages),
            !1;
        const o = r.lng || this.resolvedLanguage || this.languages[0]
          , c = this.options ? this.options.fallbackLng : !1
          , f = this.languages[this.languages.length - 1];
        if (o.toLowerCase() === "cimode")
            return !0;
        const d = (m, g) => {
            const p = this.services.backendConnector.state[`${m}|${g}`];
            return p === -1 || p === 0 || p === 2
        }
        ;
        if (r.precheck) {
            const m = r.precheck(this, d);
            if (m !== void 0)
                return m
        }
        return !!(this.hasResourceBundle(o, a) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || d(o, a) && (!c || d(f, a)))
    }
    loadNamespaces(a, r) {
        const o = Xa();
        return this.options.ns ? (le(a) && (a = [a]),
        a.forEach(c => {
            this.options.ns.indexOf(c) < 0 && this.options.ns.push(c)
        }
        ),
        this.loadResources(c => {
            o.resolve(),
            r && r(c)
        }
        ),
        o) : (r && r(),
        Promise.resolve())
    }
    loadLanguages(a, r) {
        const o = Xa();
        le(a) && (a = [a]);
        const c = this.options.preload || []
          , f = a.filter(d => c.indexOf(d) < 0 && this.services.languageUtils.isSupportedCode(d));
        return f.length ? (this.options.preload = c.concat(f),
        this.loadResources(d => {
            o.resolve(),
            r && r(d)
        }
        ),
        o) : (r && r(),
        Promise.resolve())
    }
    dir(a) {
        if (a || (a = this.resolvedLanguage || (this.languages?.length > 0 ? this.languages[0] : this.language)),
        !a)
            return "rtl";
        try {
            const c = new Intl.Locale(a);
            if (c && c.getTextInfo) {
                const f = c.getTextInfo();
                if (f && f.direction)
                    return f.direction
            }
        } catch {}
        const r = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"]
          , o = this.services?.languageUtils || new Gm(Zm());
        return a.toLowerCase().indexOf("-latn") > 1 ? "ltr" : r.indexOf(o.getLanguagePartFromCode(a)) > -1 || a.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr"
    }
    static createInstance(a={}, r) {
        return new Ia(a,r)
    }
    cloneInstance(a={}, r=Ou) {
        const o = a.forkResourceStore;
        o && delete a.forkResourceStore;
        const c = {
            ...this.options,
            ...a,
            isClone: !0
        }
          , f = new Ia(c);
        if ((a.debug !== void 0 || a.prefix !== void 0) && (f.logger = f.logger.clone(a)),
        ["store", "services", "language"].forEach(m => {
            f[m] = this[m]
        }
        ),
        f.services = {
            ...this.services
        },
        f.services.utils = {
            hasLoadedNamespace: f.hasLoadedNamespace.bind(f)
        },
        o) {
            const m = Object.keys(this.store.data).reduce( (g, p) => (g[p] = {
                ...this.store.data[p]
            },
            g[p] = Object.keys(g[p]).reduce( (S, v) => (S[v] = {
                ...g[p][v]
            },
            S), g[p]),
            g), {});
            f.store = new jm(m,c),
            f.services.resourceStore = f.store
        }
        return f.translator = new Du(f.services,c),
        f.translator.on("*", (m, ...g) => {
            f.emit(m, ...g)
        }
        ),
        f.init(c, r),
        f.translator.options = c,
        f.translator.backendConnector.services.utils = {
            hasLoadedNamespace: f.hasLoadedNamespace.bind(f)
        },
        f
    }
    toJSON() {
        return {
            options: this.options,
            store: this.store,
            language: this.language,
            languages: this.languages,
            resolvedLanguage: this.resolvedLanguage
        }
    }
}
const Pe = Ia.createInstance();
Pe.createInstance = Ia.createInstance;
Pe.createInstance;
Pe.dir;
Pe.init;
Pe.loadResources;
Pe.reloadResources;
Pe.use;
Pe.changeLanguage;
Pe.getFixedT;
Pe.t;
Pe.exists;
Pe.setDefaultNamespace;
Pe.hasLoadedNamespace;
Pe.loadNamespaces;
Pe.loadLanguages;
const g1 = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g
  , p1 = {
    "&amp;": "&",
    "&#38;": "&",
    "&lt;": "<",
    "&#60;": "<",
    "&gt;": ">",
    "&#62;": ">",
    "&apos;": "'",
    "&#39;": "'",
    "&quot;": '"',
    "&#34;": '"',
    "&nbsp;": " ",
    "&#160;": " ",
    "&copy;": "©",
    "&#169;": "©",
    "&reg;": "®",
    "&#174;": "®",
    "&hellip;": "…",
    "&#8230;": "…",
    "&#x2F;": "/",
    "&#47;": "/"
}
  , y1 = u => p1[u]
  , v1 = u => u.replace(g1, y1);
let km = {
    bindI18n: "languageChanged",
    bindI18nStore: "",
    transEmptyNodeValue: "",
    transSupportBasicHtmlNodes: !0,
    transWrapTextNodes: "",
    transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
    useSuspense: !0,
    unescape: v1
};
const S1 = (u={}) => {
    km = {
        ...km,
        ...u
    }
}
  , b1 = {
    type: "3rdParty",
    init(u) {
        S1(u.options.react)
    }
}
  , E1 = H.createContext();
function _1({i18n: u, defaultNS: a, children: r}) {
    const o = H.useMemo( () => ({
        i18n: u,
        defaultNS: a
    }), [u, a]);
    return H.createElement(E1.Provider, {
        value: o
    }, r)
}
const {slice: x1, forEach: C1} = [];
function T1(u) {
    return C1.call(x1.call(arguments, 1), a => {
        if (a)
            for (const r in a)
                u[r] === void 0 && (u[r] = a[r])
    }
    ),
    u
}
function O1(u) {
    return typeof u != "string" ? !1 : [/<\s*script.*?>/i, /<\s*\/\s*script\s*>/i, /<\s*img.*?on\w+\s*=/i, /<\s*\w+\s*on\w+\s*=.*?>/i, /javascript\s*:/i, /vbscript\s*:/i, /expression\s*\(/i, /eval\s*\(/i, /alert\s*\(/i, /document\.cookie/i, /document\.write\s*\(/i, /window\.location/i, /innerHTML/i].some(r => r.test(u))
}
const Jm = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/
  , A1 = function(u, a) {
    const o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        path: "/"
    }
      , c = encodeURIComponent(a);
    let f = `${u}=${c}`;
    if (o.maxAge > 0) {
        const d = o.maxAge - 0;
        if (Number.isNaN(d))
            throw new Error("maxAge should be a Number");
        f += `; Max-Age=${Math.floor(d)}`
    }
    if (o.domain) {
        if (!Jm.test(o.domain))
            throw new TypeError("option domain is invalid");
        f += `; Domain=${o.domain}`
    }
    if (o.path) {
        if (!Jm.test(o.path))
            throw new TypeError("option path is invalid");
        f += `; Path=${o.path}`
    }
    if (o.expires) {
        if (typeof o.expires.toUTCString != "function")
            throw new TypeError("option expires is invalid");
        f += `; Expires=${o.expires.toUTCString()}`
    }
    if (o.httpOnly && (f += "; HttpOnly"),
    o.secure && (f += "; Secure"),
    o.sameSite)
        switch (typeof o.sameSite == "string" ? o.sameSite.toLowerCase() : o.sameSite) {
        case !0:
            f += "; SameSite=Strict";
            break;
        case "lax":
            f += "; SameSite=Lax";
            break;
        case "strict":
            f += "; SameSite=Strict";
            break;
        case "none":
            f += "; SameSite=None";
            break;
        default:
            throw new TypeError("option sameSite is invalid")
        }
    return o.partitioned && (f += "; Partitioned"),
    f
}
  , $m = {
    create(u, a, r, o) {
        let c = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
            path: "/",
            sameSite: "strict"
        };
        r && (c.expires = new Date,
        c.expires.setTime(c.expires.getTime() + r * 60 * 1e3)),
        o && (c.domain = o),
        document.cookie = A1(u, a, c)
    },
    read(u) {
        const a = `${u}=`
          , r = document.cookie.split(";");
        for (let o = 0; o < r.length; o++) {
            let c = r[o];
            for (; c.charAt(0) === " "; )
                c = c.substring(1, c.length);
            if (c.indexOf(a) === 0)
                return c.substring(a.length, c.length)
        }
        return null
    },
    remove(u, a) {
        this.create(u, "", -1, a)
    }
};
var R1 = {
    name: "cookie",
    lookup(u) {
        let {lookupCookie: a} = u;
        if (a && typeof document < "u")
            return $m.read(a) || void 0
    },
    cacheUserLanguage(u, a) {
        let {lookupCookie: r, cookieMinutes: o, cookieDomain: c, cookieOptions: f} = a;
        r && typeof document < "u" && $m.create(r, u, o, c, f)
    }
}
  , w1 = {
    name: "querystring",
    lookup(u) {
        let {lookupQuerystring: a} = u, r;
        if (typeof window < "u") {
            let {search: o} = window.location;
            !window.location.search && window.location.hash?.indexOf("?") > -1 && (o = window.location.hash.substring(window.location.hash.indexOf("?")));
            const f = o.substring(1).split("&");
            for (let d = 0; d < f.length; d++) {
                const m = f[d].indexOf("=");
                m > 0 && f[d].substring(0, m) === a && (r = f[d].substring(m + 1))
            }
        }
        return r
    }
}
  , L1 = {
    name: "hash",
    lookup(u) {
        let {lookupHash: a, lookupFromHashIndex: r} = u, o;
        if (typeof window < "u") {
            const {hash: c} = window.location;
            if (c && c.length > 2) {
                const f = c.substring(1);
                if (a) {
                    const d = f.split("&");
                    for (let m = 0; m < d.length; m++) {
                        const g = d[m].indexOf("=");
                        g > 0 && d[m].substring(0, g) === a && (o = d[m].substring(g + 1))
                    }
                }
                if (o)
                    return o;
                if (!o && r > -1) {
                    const d = c.match(/\/([a-zA-Z-]*)/g);
                    return Array.isArray(d) ? d[typeof r == "number" ? r : 0]?.replace("/", "") : void 0
                }
            }
        }
        return o
    }
};
let Vl = null;
const Fm = () => {
    if (Vl !== null)
        return Vl;
    try {
        if (Vl = typeof window < "u" && window.localStorage !== null,
        !Vl)
            return !1;
        const u = "i18next.translate.boo";
        window.localStorage.setItem(u, "foo"),
        window.localStorage.removeItem(u)
    } catch {
        Vl = !1
    }
    return Vl
}
;
var M1 = {
    name: "localStorage",
    lookup(u) {
        let {lookupLocalStorage: a} = u;
        if (a && Fm())
            return window.localStorage.getItem(a) || void 0
    },
    cacheUserLanguage(u, a) {
        let {lookupLocalStorage: r} = a;
        r && Fm() && window.localStorage.setItem(r, u)
    }
};
let Ql = null;
const Wm = () => {
    if (Ql !== null)
        return Ql;
    try {
        if (Ql = typeof window < "u" && window.sessionStorage !== null,
        !Ql)
            return !1;
        const u = "i18next.translate.boo";
        window.sessionStorage.setItem(u, "foo"),
        window.sessionStorage.removeItem(u)
    } catch {
        Ql = !1
    }
    return Ql
}
;
var z1 = {
    name: "sessionStorage",
    lookup(u) {
        let {lookupSessionStorage: a} = u;
        if (a && Wm())
            return window.sessionStorage.getItem(a) || void 0
    },
    cacheUserLanguage(u, a) {
        let {lookupSessionStorage: r} = a;
        r && Wm() && window.sessionStorage.setItem(r, u)
    }
}
  , D1 = {
    name: "navigator",
    lookup(u) {
        const a = [];
        if (typeof navigator < "u") {
            const {languages: r, userLanguage: o, language: c} = navigator;
            if (r)
                for (let f = 0; f < r.length; f++)
                    a.push(r[f]);
            o && a.push(o),
            c && a.push(c)
        }
        return a.length > 0 ? a : void 0
    }
}
  , N1 = {
    name: "htmlTag",
    lookup(u) {
        let {htmlTag: a} = u, r;
        const o = a || (typeof document < "u" ? document.documentElement : null);
        return o && typeof o.getAttribute == "function" && (r = o.getAttribute("lang")),
        r
    }
}
  , U1 = {
    name: "path",
    lookup(u) {
        let {lookupFromPathIndex: a} = u;
        if (typeof window > "u")
            return;
        const r = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
        return Array.isArray(r) ? r[typeof a == "number" ? a : 0]?.replace("/", "") : void 0
    }
}
  , H1 = {
    name: "subdomain",
    lookup(u) {
        let {lookupFromSubdomainIndex: a} = u;
        const r = typeof a == "number" ? a + 1 : 1
          , o = typeof window < "u" && window.location?.hostname?.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i);
        if (o)
            return o[r]
    }
};
let Gg = !1;
try {
    document.cookie,
    Gg = !0
} catch {}
const Yg = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
Gg || Yg.splice(1, 1);
const j1 = () => ({
    order: Yg,
    lookupQuerystring: "lng",
    lookupCookie: "i18next",
    lookupLocalStorage: "i18nextLng",
    lookupSessionStorage: "i18nextLng",
    caches: ["localStorage"],
    excludeCacheFor: ["cimode"],
    convertDetectedLanguage: u => u
});
class Vg {
    constructor(a) {
        let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        this.type = "languageDetector",
        this.detectors = {},
        this.init(a, r)
    }
    init() {
        let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
            languageUtils: {}
        }
          , r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
          , o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        this.services = a,
        this.options = T1(r, this.options || {}, j1()),
        typeof this.options.convertDetectedLanguage == "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1 && (this.options.convertDetectedLanguage = c => c.replace("-", "_")),
        this.options.lookupFromUrlIndex && (this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex),
        this.i18nOptions = o,
        this.addDetector(R1),
        this.addDetector(w1),
        this.addDetector(M1),
        this.addDetector(z1),
        this.addDetector(D1),
        this.addDetector(N1),
        this.addDetector(U1),
        this.addDetector(H1),
        this.addDetector(L1)
    }
    addDetector(a) {
        return this.detectors[a.name] = a,
        this
    }
    detect() {
        let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order
          , r = [];
        return a.forEach(o => {
            if (this.detectors[o]) {
                let c = this.detectors[o].lookup(this.options);
                c && typeof c == "string" && (c = [c]),
                c && (r = r.concat(c))
            }
        }
        ),
        r = r.filter(o => o != null && !O1(o)).map(o => this.options.convertDetectedLanguage(o)),
        this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes ? r : r.length > 0 ? r[0] : null
    }
    cacheUserLanguage(a) {
        let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
        r && (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(a) > -1 || r.forEach(o => {
            this.detectors[o] && this.detectors[o].cacheUserLanguage(a, this.options)
        }
        ))
    }
}
Vg.type = "languageDetector";
const Im = Object.assign({})
  , $a = {};
Object.keys(Im).forEach(u => {
    const a = u.match(/\.\/([^/]+)\/([^/]+)\.ts$/);
    if (a) {
        const [,r] = a
          , o = Im[u];
        $a[r] || ($a[r] = {
            translation: {}
        }),
        o.default && ($a[r].translation = {
            ...$a[r].translation,
            ...o.default
        })
    }
}
);
Pe.use(Vg).use(b1).init({
    lng: "en",
    fallbackLng: "en",
    debug: !1,
    resources: $a,
    interpolation: {
        escapeValue: !1
    }
});
var Cs = {
    exports: {}
}
  , Za = {}
  , Ts = {
    exports: {}
}
  , Os = {};
var Pm;
function B1() {
    return Pm || (Pm = 1,
    (function(u) {
        function a(N, Q) {
            var ee = N.length;
            N.push(Q);
            e: for (; 0 < ee; ) {
                var ve = ee - 1 >>> 1
                  , _e = N[ve];
                if (0 < c(_e, Q))
                    N[ve] = Q,
                    N[ee] = _e,
                    ee = ve;
                else
                    break e
            }
        }
        function r(N) {
            return N.length === 0 ? null : N[0]
        }
        function o(N) {
            if (N.length === 0)
                return null;
            var Q = N[0]
              , ee = N.pop();
            if (ee !== Q) {
                N[0] = ee;
                e: for (var ve = 0, _e = N.length, T = _e >>> 1; ve < T; ) {
                    var j = 2 * (ve + 1) - 1
                      , Z = N[j]
                      , J = j + 1
                      , ie = N[J];
                    if (0 > c(Z, ee))
                        J < _e && 0 > c(ie, Z) ? (N[ve] = ie,
                        N[J] = ee,
                        ve = J) : (N[ve] = Z,
                        N[j] = ee,
                        ve = j);
                    else if (J < _e && 0 > c(ie, ee))
                        N[ve] = ie,
                        N[J] = ee,
                        ve = J;
                    else
                        break e
                }
            }
            return Q
        }
        function c(N, Q) {
            var ee = N.sortIndex - Q.sortIndex;
            return ee !== 0 ? ee : N.id - Q.id
        }
        if (u.unstable_now = void 0,
        typeof performance == "object" && typeof performance.now == "function") {
            var f = performance;
            u.unstable_now = function() {
                return f.now()
            }
        } else {
            var d = Date
              , m = d.now();
            u.unstable_now = function() {
                return d.now() - m
            }
        }
        var g = []
          , p = []
          , S = 1
          , v = null
          , E = 3
          , b = !1
          , _ = !1
          , A = !1
          , x = !1
          , z = typeof setTimeout == "function" ? setTimeout : null
          , q = typeof clearTimeout == "function" ? clearTimeout : null
          , Y = typeof setImmediate < "u" ? setImmediate : null;
        function k(N) {
            for (var Q = r(p); Q !== null; ) {
                if (Q.callback === null)
                    o(p);
                else if (Q.startTime <= N)
                    o(p),
                    Q.sortIndex = Q.expirationTime,
                    a(g, Q);
                else
                    break;
                Q = r(p)
            }
        }
        function F(N) {
            if (A = !1,
            k(N),
            !_)
                if (r(g) !== null)
                    _ = !0,
                    re || (re = !0,
                    K());
                else {
                    var Q = r(p);
                    Q !== null && ce(F, Q.startTime - N)
                }
        }
        var re = !1
          , W = -1
          , pe = 5
          , Ce = -1;
        function V() {
            return x ? !0 : !(u.unstable_now() - Ce < pe)
        }
        function X() {
            if (x = !1,
            re) {
                var N = u.unstable_now();
                Ce = N;
                var Q = !0;
                try {
                    e: {
                        _ = !1,
                        A && (A = !1,
                        q(W),
                        W = -1),
                        b = !0;
                        var ee = E;
                        try {
                            t: {
                                for (k(N),
                                v = r(g); v !== null && !(v.expirationTime > N && V()); ) {
                                    var ve = v.callback;
                                    if (typeof ve == "function") {
                                        v.callback = null,
                                        E = v.priorityLevel;
                                        var _e = ve(v.expirationTime <= N);
                                        if (N = u.unstable_now(),
                                        typeof _e == "function") {
                                            v.callback = _e,
                                            k(N),
                                            Q = !0;
                                            break t
                                        }
                                        v === r(g) && o(g),
                                        k(N)
                                    } else
                                        o(g);
                                    v = r(g)
                                }
                                if (v !== null)
                                    Q = !0;
                                else {
                                    var T = r(p);
                                    T !== null && ce(F, T.startTime - N),
                                    Q = !1
                                }
                            }
                            break e
                        } finally {
                            v = null,
                            E = ee,
                            b = !1
                        }
                        Q = void 0
                    }
                } finally {
                    Q ? K() : re = !1
                }
            }
        }
        var K;
        if (typeof Y == "function")
            K = function() {
                Y(X)
            }
            ;
        else if (typeof MessageChannel < "u") {
            var te = new MessageChannel
              , oe = te.port2;
            te.port1.onmessage = X,
            K = function() {
                oe.postMessage(null)
            }
        } else
            K = function() {
                z(X, 0)
            }
            ;
        function ce(N, Q) {
            W = z(function() {
                N(u.unstable_now())
            }, Q)
        }
        u.unstable_IdlePriority = 5,
        u.unstable_ImmediatePriority = 1,
        u.unstable_LowPriority = 4,
        u.unstable_NormalPriority = 3,
        u.unstable_Profiling = null,
        u.unstable_UserBlockingPriority = 2,
        u.unstable_cancelCallback = function(N) {
            N.callback = null
        }
        ,
        u.unstable_forceFrameRate = function(N) {
            0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : pe = 0 < N ? Math.floor(1e3 / N) : 5
        }
        ,
        u.unstable_getCurrentPriorityLevel = function() {
            return E
        }
        ,
        u.unstable_next = function(N) {
            switch (E) {
            case 1:
            case 2:
            case 3:
                var Q = 3;
                break;
            default:
                Q = E
            }
            var ee = E;
            E = Q;
            try {
                return N()
            } finally {
                E = ee
            }
        }
        ,
        u.unstable_requestPaint = function() {
            x = !0
        }
        ,
        u.unstable_runWithPriority = function(N, Q) {
            switch (N) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                break;
            default:
                N = 3
            }
            var ee = E;
            E = N;
            try {
                return Q()
            } finally {
                E = ee
            }
        }
        ,
        u.unstable_scheduleCallback = function(N, Q, ee) {
            var ve = u.unstable_now();
            switch (typeof ee == "object" && ee !== null ? (ee = ee.delay,
            ee = typeof ee == "number" && 0 < ee ? ve + ee : ve) : ee = ve,
            N) {
            case 1:
                var _e = -1;
                break;
            case 2:
                _e = 250;
                break;
            case 5:
                _e = 1073741823;
                break;
            case 4:
                _e = 1e4;
                break;
            default:
                _e = 5e3
            }
            return _e = ee + _e,
            N = {
                id: S++,
                callback: Q,
                priorityLevel: N,
                startTime: ee,
                expirationTime: _e,
                sortIndex: -1
            },
            ee > ve ? (N.sortIndex = ee,
            a(p, N),
            r(g) === null && N === r(p) && (A ? (q(W),
            W = -1) : A = !0,
            ce(F, ee - ve))) : (N.sortIndex = _e,
            a(g, N),
            _ || b || (_ = !0,
            re || (re = !0,
            K()))),
            N
        }
        ,
        u.unstable_shouldYield = V,
        u.unstable_wrapCallback = function(N) {
            var Q = E;
            return function() {
                var ee = E;
                E = Q;
                try {
                    return N.apply(this, arguments)
                } finally {
                    E = ee
                }
            }
        }
    }
    )(Os)),
    Os
}
var eg;
function q1() {
    return eg || (eg = 1,
    Ts.exports = B1()),
    Ts.exports
}
var As = {
    exports: {}
}
  , et = {};
var tg;
function G1() {
    if (tg)
        return et;
    tg = 1;
    var u = Zs();
    function a(g) {
        var p = "https://react.dev/errors/" + g;
        if (1 < arguments.length) {
            p += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var S = 2; S < arguments.length; S++)
                p += "&args[]=" + encodeURIComponent(arguments[S])
        }
        return "Minified React error #" + g + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function r() {}
    var o = {
        d: {
            f: r,
            r: function() {
                throw Error(a(522))
            },
            D: r,
            C: r,
            L: r,
            m: r,
            X: r,
            S: r,
            M: r
        },
        p: 0,
        findDOMNode: null
    }
      , c = Symbol.for("react.portal");
    function f(g, p, S) {
        var v = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
        return {
            $$typeof: c,
            key: v == null ? null : "" + v,
            children: g,
            containerInfo: p,
            implementation: S
        }
    }
    var d = u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function m(g, p) {
        if (g === "font")
            return "";
        if (typeof p == "string")
            return p === "use-credentials" ? p : ""
    }
    return et.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o,
    et.createPortal = function(g, p) {
        var S = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
        if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
            throw Error(a(299));
        return f(g, p, null, S)
    }
    ,
    et.flushSync = function(g) {
        var p = d.T
          , S = o.p;
        try {
            if (d.T = null,
            o.p = 2,
            g)
                return g()
        } finally {
            d.T = p,
            o.p = S,
            o.d.f()
        }
    }
    ,
    et.preconnect = function(g, p) {
        typeof g == "string" && (p ? (p = p.crossOrigin,
        p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null,
        o.d.C(g, p))
    }
    ,
    et.prefetchDNS = function(g) {
        typeof g == "string" && o.d.D(g)
    }
    ,
    et.preinit = function(g, p) {
        if (typeof g == "string" && p && typeof p.as == "string") {
            var S = p.as
              , v = m(S, p.crossOrigin)
              , E = typeof p.integrity == "string" ? p.integrity : void 0
              , b = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
            S === "style" ? o.d.S(g, typeof p.precedence == "string" ? p.precedence : void 0, {
                crossOrigin: v,
                integrity: E,
                fetchPriority: b
            }) : S === "script" && o.d.X(g, {
                crossOrigin: v,
                integrity: E,
                fetchPriority: b,
                nonce: typeof p.nonce == "string" ? p.nonce : void 0
            })
        }
    }
    ,
    et.preinitModule = function(g, p) {
        if (typeof g == "string")
            if (typeof p == "object" && p !== null) {
                if (p.as == null || p.as === "script") {
                    var S = m(p.as, p.crossOrigin);
                    o.d.M(g, {
                        crossOrigin: S,
                        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
                        nonce: typeof p.nonce == "string" ? p.nonce : void 0
                    })
                }
            } else
                p == null && o.d.M(g)
    }
    ,
    et.preload = function(g, p) {
        if (typeof g == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
            var S = p.as
              , v = m(S, p.crossOrigin);
            o.d.L(g, S, {
                crossOrigin: v,
                integrity: typeof p.integrity == "string" ? p.integrity : void 0,
                nonce: typeof p.nonce == "string" ? p.nonce : void 0,
                type: typeof p.type == "string" ? p.type : void 0,
                fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
                referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
                imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
                imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
                media: typeof p.media == "string" ? p.media : void 0
            })
        }
    }
    ,
    et.preloadModule = function(g, p) {
        if (typeof g == "string")
            if (p) {
                var S = m(p.as, p.crossOrigin);
                o.d.m(g, {
                    as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
                    crossOrigin: S,
                    integrity: typeof p.integrity == "string" ? p.integrity : void 0
                })
            } else
                o.d.m(g)
    }
    ,
    et.requestFormReset = function(g) {
        o.d.r(g)
    }
    ,
    et.unstable_batchedUpdates = function(g, p) {
        return g(p)
    }
    ,
    et.useFormState = function(g, p, S) {
        return d.H.useFormState(g, p, S)
    }
    ,
    et.useFormStatus = function() {
        return d.H.useHostTransitionStatus()
    }
    ,
    et.version = "19.2.4",
    et
}
var ng;
function Y1() {
    if (ng)
        return As.exports;
    ng = 1;
    function u() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)
            } catch (a) {
                console.error(a)
            }
    }
    return u(),
    As.exports = G1(),
    As.exports
}
var lg;
function V1() {
    if (lg)
        return Za;
    lg = 1;
    var u = q1()
      , a = Zs()
      , r = Y1();
    function o(e) {
        var t = "https://react.dev/errors/" + e;
        if (1 < arguments.length) {
            t += "?args[]=" + encodeURIComponent(arguments[1]);
            for (var n = 2; n < arguments.length; n++)
                t += "&args[]=" + encodeURIComponent(arguments[n])
        }
        return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    }
    function c(e) {
        return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
    }
    function f(e) {
        var t = e
          , n = e;
        if (e.alternate)
            for (; t.return; )
                t = t.return;
        else {
            e = t;
            do
                t = e,
                (t.flags & 4098) !== 0 && (n = t.return),
                e = t.return;
            while (e)
        }
        return t.tag === 3 ? n : null
    }
    function d(e) {
        if (e.tag === 13) {
            var t = e.memoizedState;
            if (t === null && (e = e.alternate,
            e !== null && (t = e.memoizedState)),
            t !== null)
                return t.dehydrated
        }
        return null
    }
    function m(e) {
        if (e.tag === 31) {
            var t = e.memoizedState;
            if (t === null && (e = e.alternate,
            e !== null && (t = e.memoizedState)),
            t !== null)
                return t.dehydrated
        }
        return null
    }
    function g(e) {
        if (f(e) !== e)
            throw Error(o(188))
    }
    function p(e) {
        var t = e.alternate;
        if (!t) {
            if (t = f(e),
            t === null)
                throw Error(o(188));
            return t !== e ? null : e
        }
        for (var n = e, l = t; ; ) {
            var i = n.return;
            if (i === null)
                break;
            var s = i.alternate;
            if (s === null) {
                if (l = i.return,
                l !== null) {
                    n = l;
                    continue
                }
                break
            }
            if (i.child === s.child) {
                for (s = i.child; s; ) {
                    if (s === n)
                        return g(i),
                        e;
                    if (s === l)
                        return g(i),
                        t;
                    s = s.sibling
                }
                throw Error(o(188))
            }
            if (n.return !== l.return)
                n = i,
                l = s;
            else {
                for (var h = !1, y = i.child; y; ) {
                    if (y === n) {
                        h = !0,
                        n = i,
                        l = s;
                        break
                    }
                    if (y === l) {
                        h = !0,
                        l = i,
                        n = s;
                        break
                    }
                    y = y.sibling
                }
                if (!h) {
                    for (y = s.child; y; ) {
                        if (y === n) {
                            h = !0,
                            n = s,
                            l = i;
                            break
                        }
                        if (y === l) {
                            h = !0,
                            l = s,
                            n = i;
                            break
                        }
                        y = y.sibling
                    }
                    if (!h)
                        throw Error(o(189))
                }
            }
            if (n.alternate !== l)
                throw Error(o(190))
        }
        if (n.tag !== 3)
            throw Error(o(188));
        return n.stateNode.current === n ? e : t
    }
    function S(e) {
        var t = e.tag;
        if (t === 5 || t === 26 || t === 27 || t === 6)
            return e;
        for (e = e.child; e !== null; ) {
            if (t = S(e),
            t !== null)
                return t;
            e = e.sibling
        }
        return null
    }
    var v = Object.assign
      , E = Symbol.for("react.element")
      , b = Symbol.for("react.transitional.element")
      , _ = Symbol.for("react.portal")
      , A = Symbol.for("react.fragment")
      , x = Symbol.for("react.strict_mode")
      , z = Symbol.for("react.profiler")
      , q = Symbol.for("react.consumer")
      , Y = Symbol.for("react.context")
      , k = Symbol.for("react.forward_ref")
      , F = Symbol.for("react.suspense")
      , re = Symbol.for("react.suspense_list")
      , W = Symbol.for("react.memo")
      , pe = Symbol.for("react.lazy")
      , Ce = Symbol.for("react.activity")
      , V = Symbol.for("react.memo_cache_sentinel")
      , X = Symbol.iterator;
    function K(e) {
        return e === null || typeof e != "object" ? null : (e = X && e[X] || e["@@iterator"],
        typeof e == "function" ? e : null)
    }
    var te = Symbol.for("react.client.reference");
    function oe(e) {
        if (e == null)
            return null;
        if (typeof e == "function")
            return e.$$typeof === te ? null : e.displayName || e.name || null;
        if (typeof e == "string")
            return e;
        switch (e) {
        case A:
            return "Fragment";
        case z:
            return "Profiler";
        case x:
            return "StrictMode";
        case F:
            return "Suspense";
        case re:
            return "SuspenseList";
        case Ce:
            return "Activity"
        }
        if (typeof e == "object")
            switch (e.$$typeof) {
            case _:
                return "Portal";
            case Y:
                return e.displayName || "Context";
            case q:
                return (e._context.displayName || "Context") + ".Consumer";
            case k:
                var t = e.render;
                return e = e.displayName,
                e || (e = t.displayName || t.name || "",
                e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"),
                e;
            case W:
                return t = e.displayName || null,
                t !== null ? t : oe(e.type) || "Memo";
            case pe:
                t = e._payload,
                e = e._init;
                try {
                    return oe(e(t))
                } catch {}
            }
        return null
    }
    var ce = Array.isArray
      , N = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , Q = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
      , ee = {
        pending: !1,
        data: null,
        method: null,
        action: null
    }
      , ve = []
      , _e = -1;
    function T(e) {
        return {
            current: e
        }
    }
    function j(e) {
        0 > _e || (e.current = ve[_e],
        ve[_e] = null,
        _e--)
    }
    function Z(e, t) {
        _e++,
        ve[_e] = e.current,
        e.current = t
    }
    var J = T(null)
      , ie = T(null)
      , fe = T(null)
      , xe = T(null);
    function tt(e, t) {
        switch (Z(fe, t),
        Z(ie, e),
        Z(J, null),
        t.nodeType) {
        case 9:
        case 11:
            e = (e = t.documentElement) && (e = e.namespaceURI) ? xh(e) : 0;
            break;
        default:
            if (e = t.tagName,
            t = t.namespaceURI)
                t = xh(t),
                e = Ch(t, e);
            else
                switch (e) {
                case "svg":
                    e = 1;
                    break;
                case "math":
                    e = 2;
                    break;
                default:
                    e = 0
                }
        }
        j(J),
        Z(J, e)
    }
    function He() {
        j(J),
        j(ie),
        j(fe)
    }
    function Jl(e) {
        e.memoizedState !== null && Z(xe, e);
        var t = J.current
          , n = Ch(t, e.type);
        t !== n && (Z(ie, e),
        Z(J, n))
    }
    function li(e) {
        ie.current === e && (j(J),
        j(ie)),
        xe.current === e && (j(xe),
        ja._currentValue = ee)
    }
    var Gu, Is;
    function jn(e) {
        if (Gu === void 0)
            try {
                throw Error()
            } catch (n) {
                var t = n.stack.trim().match(/\n( *(at )?)/);
                Gu = t && t[1] || "",
                Is = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : ""
            }
        return `
` + Gu + e + Is
    }
    var Yu = !1;
    function Vu(e, t) {
        if (!e || Yu)
            return "";
        Yu = !0;
        var n = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            var l = {
                DetermineComponentFrameRoot: function() {
                    try {
                        if (t) {
                            var G = function() {
                                throw Error()
                            };
                            if (Object.defineProperty(G.prototype, "props", {
                                set: function() {
                                    throw Error()
                                }
                            }),
                            typeof Reflect == "object" && Reflect.construct) {
                                try {
                                    Reflect.construct(G, [])
                                } catch (D) {
                                    var M = D
                                }
                                Reflect.construct(e, [], G)
                            } else {
                                try {
                                    G.call()
                                } catch (D) {
                                    M = D
                                }
                                e.call(G.prototype)
                            }
                        } else {
                            try {
                                throw Error()
                            } catch (D) {
                                M = D
                            }
                            (G = e()) && typeof G.catch == "function" && G.catch(function() {})
                        }
                    } catch (D) {
                        if (D && M && typeof D.stack == "string")
                            return [D.stack, M.stack]
                    }
                    return [null, null]
                }
            };
            l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var i = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, "name");
            i && i.configurable && Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
                value: "DetermineComponentFrameRoot"
            });
            var s = l.DetermineComponentFrameRoot()
              , h = s[0]
              , y = s[1];
            if (h && y) {
                var C = h.split(`
`)
                  , L = y.split(`
`);
                for (i = l = 0; l < C.length && !C[l].includes("DetermineComponentFrameRoot"); )
                    l++;
                for (; i < L.length && !L[i].includes("DetermineComponentFrameRoot"); )
                    i++;
                if (l === C.length || i === L.length)
                    for (l = C.length - 1,
                    i = L.length - 1; 1 <= l && 0 <= i && C[l] !== L[i]; )
                        i--;
                for (; 1 <= l && 0 <= i; l--,
                i--)
                    if (C[l] !== L[i]) {
                        if (l !== 1 || i !== 1)
                            do
                                if (l--,
                                i--,
                                0 > i || C[l] !== L[i]) {
                                    var U = `
` + C[l].replace(" at new ", " at ");
                                    return e.displayName && U.includes("<anonymous>") && (U = U.replace("<anonymous>", e.displayName)),
                                    U
                                }
                            while (1 <= l && 0 <= i);
                        break
                    }
            }
        } finally {
            Yu = !1,
            Error.prepareStackTrace = n
        }
        return (n = e ? e.displayName || e.name : "") ? jn(n) : ""
    }
    function dp(e, t) {
        switch (e.tag) {
        case 26:
        case 27:
        case 5:
            return jn(e.type);
        case 16:
            return jn("Lazy");
        case 13:
            return e.child !== t && t !== null ? jn("Suspense Fallback") : jn("Suspense");
        case 19:
            return jn("SuspenseList");
        case 0:
        case 15:
            return Vu(e.type, !1);
        case 11:
            return Vu(e.type.render, !1);
        case 1:
            return Vu(e.type, !0);
        case 31:
            return jn("Activity");
        default:
            return ""
        }
    }
    function Ps(e) {
        try {
            var t = ""
              , n = null;
            do
                t += dp(e, n),
                n = e,
                e = e.return;
            while (e);
            return t
        } catch (l) {
            return `
Error generating stack: ` + l.message + `
` + l.stack
        }
    }
    var Qu = Object.prototype.hasOwnProperty
      , Xu = u.unstable_scheduleCallback
      , Zu = u.unstable_cancelCallback
      , hp = u.unstable_shouldYield
      , mp = u.unstable_requestPaint
      , ft = u.unstable_now
      , gp = u.unstable_getCurrentPriorityLevel
      , ec = u.unstable_ImmediatePriority
      , tc = u.unstable_UserBlockingPriority
      , ai = u.unstable_NormalPriority
      , pp = u.unstable_LowPriority
      , nc = u.unstable_IdlePriority
      , yp = u.log
      , vp = u.unstable_setDisableYieldValue
      , $l = null
      , dt = null;
    function fn(e) {
        if (typeof yp == "function" && vp(e),
        dt && typeof dt.setStrictMode == "function")
            try {
                dt.setStrictMode($l, e)
            } catch {}
    }
    var ht = Math.clz32 ? Math.clz32 : Ep
      , Sp = Math.log
      , bp = Math.LN2;
    function Ep(e) {
        return e >>>= 0,
        e === 0 ? 32 : 31 - (Sp(e) / bp | 0) | 0
    }
    var ii = 256
      , ui = 262144
      , ri = 4194304;
    function Bn(e) {
        var t = e & 42;
        if (t !== 0)
            return t;
        switch (e & -e) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
            return 64;
        case 128:
            return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
            return e & 261888;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return e & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return e & 62914560;
        case 67108864:
            return 67108864;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 0;
        default:
            return e
        }
    }
    function oi(e, t, n) {
        var l = e.pendingLanes;
        if (l === 0)
            return 0;
        var i = 0
          , s = e.suspendedLanes
          , h = e.pingedLanes;
        e = e.warmLanes;
        var y = l & 134217727;
        return y !== 0 ? (l = y & ~s,
        l !== 0 ? i = Bn(l) : (h &= y,
        h !== 0 ? i = Bn(h) : n || (n = y & ~e,
        n !== 0 && (i = Bn(n))))) : (y = l & ~s,
        y !== 0 ? i = Bn(y) : h !== 0 ? i = Bn(h) : n || (n = l & ~e,
        n !== 0 && (i = Bn(n)))),
        i === 0 ? 0 : t !== 0 && t !== i && (t & s) === 0 && (s = i & -i,
        n = t & -t,
        s >= n || s === 32 && (n & 4194048) !== 0) ? t : i
    }
    function Fl(e, t) {
        return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0
    }
    function _p(e, t) {
        switch (e) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
            return t + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return t + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
            return -1;
        default:
            return -1
        }
    }
    function lc() {
        var e = ri;
        return ri <<= 1,
        (ri & 62914560) === 0 && (ri = 4194304),
        e
    }
    function Ku(e) {
        for (var t = [], n = 0; 31 > n; n++)
            t.push(e);
        return t
    }
    function Wl(e, t) {
        e.pendingLanes |= t,
        t !== 268435456 && (e.suspendedLanes = 0,
        e.pingedLanes = 0,
        e.warmLanes = 0)
    }
    function xp(e, t, n, l, i, s) {
        var h = e.pendingLanes;
        e.pendingLanes = n,
        e.suspendedLanes = 0,
        e.pingedLanes = 0,
        e.warmLanes = 0,
        e.expiredLanes &= n,
        e.entangledLanes &= n,
        e.errorRecoveryDisabledLanes &= n,
        e.shellSuspendCounter = 0;
        var y = e.entanglements
          , C = e.expirationTimes
          , L = e.hiddenUpdates;
        for (n = h & ~n; 0 < n; ) {
            var U = 31 - ht(n)
              , G = 1 << U;
            y[U] = 0,
            C[U] = -1;
            var M = L[U];
            if (M !== null)
                for (L[U] = null,
                U = 0; U < M.length; U++) {
                    var D = M[U];
                    D !== null && (D.lane &= -536870913)
                }
            n &= ~G
        }
        l !== 0 && ac(e, l, 0),
        s !== 0 && i === 0 && e.tag !== 0 && (e.suspendedLanes |= s & ~(h & ~t))
    }
    function ac(e, t, n) {
        e.pendingLanes |= t,
        e.suspendedLanes &= ~t;
        var l = 31 - ht(t);
        e.entangledLanes |= t,
        e.entanglements[l] = e.entanglements[l] | 1073741824 | n & 261930
    }
    function ic(e, t) {
        var n = e.entangledLanes |= t;
        for (e = e.entanglements; n; ) {
            var l = 31 - ht(n)
              , i = 1 << l;
            i & t | e[l] & t && (e[l] |= t),
            n &= ~i
        }
    }
    function uc(e, t) {
        var n = t & -t;
        return n = (n & 42) !== 0 ? 1 : ku(n),
        (n & (e.suspendedLanes | t)) !== 0 ? 0 : n
    }
    function ku(e) {
        switch (e) {
        case 2:
            e = 1;
            break;
        case 8:
            e = 4;
            break;
        case 32:
            e = 16;
            break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            e = 128;
            break;
        case 268435456:
            e = 134217728;
            break;
        default:
            e = 0
        }
        return e
    }
    function Ju(e) {
        return e &= -e,
        2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2
    }
    function rc() {
        var e = Q.p;
        return e !== 0 ? e : (e = window.event,
        e === void 0 ? 32 : kh(e.type))
    }
    function oc(e, t) {
        var n = Q.p;
        try {
            return Q.p = e,
            t()
        } finally {
            Q.p = n
        }
    }
    var dn = Math.random().toString(36).slice(2)
      , Je = "__reactFiber$" + dn
      , lt = "__reactProps$" + dn
      , ll = "__reactContainer$" + dn
      , $u = "__reactEvents$" + dn
      , Cp = "__reactListeners$" + dn
      , Tp = "__reactHandles$" + dn
      , sc = "__reactResources$" + dn
      , Il = "__reactMarker$" + dn;
    function Fu(e) {
        delete e[Je],
        delete e[lt],
        delete e[$u],
        delete e[Cp],
        delete e[Tp]
    }
    function al(e) {
        var t = e[Je];
        if (t)
            return t;
        for (var n = e.parentNode; n; ) {
            if (t = n[ll] || n[Je]) {
                if (n = t.alternate,
                t.child !== null || n !== null && n.child !== null)
                    for (e = Mh(e); e !== null; ) {
                        if (n = e[Je])
                            return n;
                        e = Mh(e)
                    }
                return t
            }
            e = n,
            n = e.parentNode
        }
        return null
    }
    function il(e) {
        if (e = e[Je] || e[ll]) {
            var t = e.tag;
            if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
                return e
        }
        return null
    }
    function Pl(e) {
        var t = e.tag;
        if (t === 5 || t === 26 || t === 27 || t === 6)
            return e.stateNode;
        throw Error(o(33))
    }
    function ul(e) {
        var t = e[sc];
        return t || (t = e[sc] = {
            hoistableStyles: new Map,
            hoistableScripts: new Map
        }),
        t
    }
    function Ze(e) {
        e[Il] = !0
    }
    var cc = new Set
      , fc = {};
    function qn(e, t) {
        rl(e, t),
        rl(e + "Capture", t)
    }
    function rl(e, t) {
        for (fc[e] = t,
        e = 0; e < t.length; e++)
            cc.add(t[e])
    }
    var Op = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$")
      , dc = {}
      , hc = {};
    function Ap(e) {
        return Qu.call(hc, e) ? !0 : Qu.call(dc, e) ? !1 : Op.test(e) ? hc[e] = !0 : (dc[e] = !0,
        !1)
    }
    function si(e, t, n) {
        if (Ap(t))
            if (n === null)
                e.removeAttribute(t);
            else {
                switch (typeof n) {
                case "undefined":
                case "function":
                case "symbol":
                    e.removeAttribute(t);
                    return;
                case "boolean":
                    var l = t.toLowerCase().slice(0, 5);
                    if (l !== "data-" && l !== "aria-") {
                        e.removeAttribute(t);
                        return
                    }
                }
                e.setAttribute(t, "" + n)
            }
    }
    function ci(e, t, n) {
        if (n === null)
            e.removeAttribute(t);
        else {
            switch (typeof n) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                e.removeAttribute(t);
                return
            }
            e.setAttribute(t, "" + n)
        }
    }
    function Xt(e, t, n, l) {
        if (l === null)
            e.removeAttribute(n);
        else {
            switch (typeof l) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                e.removeAttribute(n);
                return
            }
            e.setAttributeNS(t, n, "" + l)
        }
    }
    function Et(e) {
        switch (typeof e) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
            return e;
        case "object":
            return e;
        default:
            return ""
        }
    }
    function mc(e) {
        var t = e.type;
        return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio")
    }
    function Rp(e, t, n) {
        var l = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
        if (!e.hasOwnProperty(t) && typeof l < "u" && typeof l.get == "function" && typeof l.set == "function") {
            var i = l.get
              , s = l.set;
            return Object.defineProperty(e, t, {
                configurable: !0,
                get: function() {
                    return i.call(this)
                },
                set: function(h) {
                    n = "" + h,
                    s.call(this, h)
                }
            }),
            Object.defineProperty(e, t, {
                enumerable: l.enumerable
            }),
            {
                getValue: function() {
                    return n
                },
                setValue: function(h) {
                    n = "" + h
                },
                stopTracking: function() {
                    e._valueTracker = null,
                    delete e[t]
                }
            }
        }
    }
    function Wu(e) {
        if (!e._valueTracker) {
            var t = mc(e) ? "checked" : "value";
            e._valueTracker = Rp(e, t, "" + e[t])
        }
    }
    function gc(e) {
        if (!e)
            return !1;
        var t = e._valueTracker;
        if (!t)
            return !0;
        var n = t.getValue()
          , l = "";
        return e && (l = mc(e) ? e.checked ? "true" : "false" : e.value),
        e = l,
        e !== n ? (t.setValue(e),
        !0) : !1
    }
    function fi(e) {
        if (e = e || (typeof document < "u" ? document : void 0),
        typeof e > "u")
            return null;
        try {
            return e.activeElement || e.body
        } catch {
            return e.body
        }
    }
    var wp = /[\n"\\]/g;
    function _t(e) {
        return e.replace(wp, function(t) {
            return "\\" + t.charCodeAt(0).toString(16) + " "
        })
    }
    function Iu(e, t, n, l, i, s, h, y) {
        e.name = "",
        h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? e.type = h : e.removeAttribute("type"),
        t != null ? h === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Et(t)) : e.value !== "" + Et(t) && (e.value = "" + Et(t)) : h !== "submit" && h !== "reset" || e.removeAttribute("value"),
        t != null ? Pu(e, h, Et(t)) : n != null ? Pu(e, h, Et(n)) : l != null && e.removeAttribute("value"),
        i == null && s != null && (e.defaultChecked = !!s),
        i != null && (e.checked = i && typeof i != "function" && typeof i != "symbol"),
        y != null && typeof y != "function" && typeof y != "symbol" && typeof y != "boolean" ? e.name = "" + Et(y) : e.removeAttribute("name")
    }
    function pc(e, t, n, l, i, s, h, y) {
        if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (e.type = s),
        t != null || n != null) {
            if (!(s !== "submit" && s !== "reset" || t != null)) {
                Wu(e);
                return
            }
            n = n != null ? "" + Et(n) : "",
            t = t != null ? "" + Et(t) : n,
            y || t === e.value || (e.value = t),
            e.defaultValue = t
        }
        l = l ?? i,
        l = typeof l != "function" && typeof l != "symbol" && !!l,
        e.checked = y ? e.checked : !!l,
        e.defaultChecked = !!l,
        h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" && (e.name = h),
        Wu(e)
    }
    function Pu(e, t, n) {
        t === "number" && fi(e.ownerDocument) === e || e.defaultValue === "" + n || (e.defaultValue = "" + n)
    }
    function ol(e, t, n, l) {
        if (e = e.options,
        t) {
            t = {};
            for (var i = 0; i < n.length; i++)
                t["$" + n[i]] = !0;
            for (n = 0; n < e.length; n++)
                i = t.hasOwnProperty("$" + e[n].value),
                e[n].selected !== i && (e[n].selected = i),
                i && l && (e[n].defaultSelected = !0)
        } else {
            for (n = "" + Et(n),
            t = null,
            i = 0; i < e.length; i++) {
                if (e[i].value === n) {
                    e[i].selected = !0,
                    l && (e[i].defaultSelected = !0);
                    return
                }
                t !== null || e[i].disabled || (t = e[i])
            }
            t !== null && (t.selected = !0)
        }
    }
    function yc(e, t, n) {
        if (t != null && (t = "" + Et(t),
        t !== e.value && (e.value = t),
        n == null)) {
            e.defaultValue !== t && (e.defaultValue = t);
            return
        }
        e.defaultValue = n != null ? "" + Et(n) : ""
    }
    function vc(e, t, n, l) {
        if (t == null) {
            if (l != null) {
                if (n != null)
                    throw Error(o(92));
                if (ce(l)) {
                    if (1 < l.length)
                        throw Error(o(93));
                    l = l[0]
                }
                n = l
            }
            n == null && (n = ""),
            t = n
        }
        n = Et(t),
        e.defaultValue = n,
        l = e.textContent,
        l === n && l !== "" && l !== null && (e.value = l),
        Wu(e)
    }
    function sl(e, t) {
        if (t) {
            var n = e.firstChild;
            if (n && n === e.lastChild && n.nodeType === 3) {
                n.nodeValue = t;
                return
            }
        }
        e.textContent = t
    }
    var Lp = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function Sc(e, t, n) {
        var l = t.indexOf("--") === 0;
        n == null || typeof n == "boolean" || n === "" ? l ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : l ? e.setProperty(t, n) : typeof n != "number" || n === 0 || Lp.has(t) ? t === "float" ? e.cssFloat = n : e[t] = ("" + n).trim() : e[t] = n + "px"
    }
    function bc(e, t, n) {
        if (t != null && typeof t != "object")
            throw Error(o(62));
        if (e = e.style,
        n != null) {
            for (var l in n)
                !n.hasOwnProperty(l) || t != null && t.hasOwnProperty(l) || (l.indexOf("--") === 0 ? e.setProperty(l, "") : l === "float" ? e.cssFloat = "" : e[l] = "");
            for (var i in t)
                l = t[i],
                t.hasOwnProperty(i) && n[i] !== l && Sc(e, i, l)
        } else
            for (var s in t)
                t.hasOwnProperty(s) && Sc(e, s, t[s])
    }
    function er(e) {
        if (e.indexOf("-") === -1)
            return !1;
        switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return !1;
        default:
            return !0
        }
    }
    var Mp = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]])
      , zp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function di(e) {
        return zp.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e
    }
    function Zt() {}
    var tr = null;
    function nr(e) {
        return e = e.target || e.srcElement || window,
        e.correspondingUseElement && (e = e.correspondingUseElement),
        e.nodeType === 3 ? e.parentNode : e
    }
    var cl = null
      , fl = null;
    function Ec(e) {
        var t = il(e);
        if (t && (e = t.stateNode)) {
            var n = e[lt] || null;
            e: switch (e = t.stateNode,
            t.type) {
            case "input":
                if (Iu(e, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name),
                t = n.name,
                n.type === "radio" && t != null) {
                    for (n = e; n.parentNode; )
                        n = n.parentNode;
                    for (n = n.querySelectorAll('input[name="' + _t("" + t) + '"][type="radio"]'),
                    t = 0; t < n.length; t++) {
                        var l = n[t];
                        if (l !== e && l.form === e.form) {
                            var i = l[lt] || null;
                            if (!i)
                                throw Error(o(90));
                            Iu(l, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name)
                        }
                    }
                    for (t = 0; t < n.length; t++)
                        l = n[t],
                        l.form === e.form && gc(l)
                }
                break e;
            case "textarea":
                yc(e, n.value, n.defaultValue);
                break e;
            case "select":
                t = n.value,
                t != null && ol(e, !!n.multiple, t, !1)
            }
        }
    }
    var lr = !1;
    function _c(e, t, n) {
        if (lr)
            return e(t, n);
        lr = !0;
        try {
            var l = e(t);
            return l
        } finally {
            if (lr = !1,
            (cl !== null || fl !== null) && (Pi(),
            cl && (t = cl,
            e = fl,
            fl = cl = null,
            Ec(t),
            e)))
                for (t = 0; t < e.length; t++)
                    Ec(e[t])
        }
    }
    function ea(e, t) {
        var n = e.stateNode;
        if (n === null)
            return null;
        var l = n[lt] || null;
        if (l === null)
            return null;
        n = l[t];
        e: switch (t) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (l = !l.disabled) || (e = e.type,
            l = !(e === "button" || e === "input" || e === "select" || e === "textarea")),
            e = !l;
            break e;
        default:
            e = !1
        }
        if (e)
            return null;
        if (n && typeof n != "function")
            throw Error(o(231, t, typeof n));
        return n
    }
    var Kt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u")
      , ar = !1;
    if (Kt)
        try {
            var ta = {};
            Object.defineProperty(ta, "passive", {
                get: function() {
                    ar = !0
                }
            }),
            window.addEventListener("test", ta, ta),
            window.removeEventListener("test", ta, ta)
        } catch {
            ar = !1
        }
    var hn = null
      , ir = null
      , hi = null;
    function xc() {
        if (hi)
            return hi;
        var e, t = ir, n = t.length, l, i = "value"in hn ? hn.value : hn.textContent, s = i.length;
        for (e = 0; e < n && t[e] === i[e]; e++)
            ;
        var h = n - e;
        for (l = 1; l <= h && t[n - l] === i[s - l]; l++)
            ;
        return hi = i.slice(e, 1 < l ? 1 - l : void 0)
    }
    function mi(e) {
        var t = e.keyCode;
        return "charCode"in e ? (e = e.charCode,
        e === 0 && t === 13 && (e = 13)) : e = t,
        e === 10 && (e = 13),
        32 <= e || e === 13 ? e : 0
    }
    function gi() {
        return !0
    }
    function Cc() {
        return !1
    }
    function at(e) {
        function t(n, l, i, s, h) {
            this._reactName = n,
            this._targetInst = i,
            this.type = l,
            this.nativeEvent = s,
            this.target = h,
            this.currentTarget = null;
            for (var y in e)
                e.hasOwnProperty(y) && (n = e[y],
                this[y] = n ? n(s) : s[y]);
            return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? gi : Cc,
            this.isPropagationStopped = Cc,
            this
        }
        return v(t.prototype, {
            preventDefault: function() {
                this.defaultPrevented = !0;
                var n = this.nativeEvent;
                n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1),
                this.isDefaultPrevented = gi)
            },
            stopPropagation: function() {
                var n = this.nativeEvent;
                n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
                this.isPropagationStopped = gi)
            },
            persist: function() {},
            isPersistent: gi
        }),
        t
    }
    var Gn = {
        eventPhase: 0,
        bubbles: 0,
        cancelable: 0,
        timeStamp: function(e) {
            return e.timeStamp || Date.now()
        },
        defaultPrevented: 0,
        isTrusted: 0
    }, pi = at(Gn), na = v({}, Gn, {
        view: 0,
        detail: 0
    }), Dp = at(na), ur, rr, la, yi = v({}, na, {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        pageX: 0,
        pageY: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        getModifierState: sr,
        button: 0,
        buttons: 0,
        relatedTarget: function(e) {
            return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget
        },
        movementX: function(e) {
            return "movementX"in e ? e.movementX : (e !== la && (la && e.type === "mousemove" ? (ur = e.screenX - la.screenX,
            rr = e.screenY - la.screenY) : rr = ur = 0,
            la = e),
            ur)
        },
        movementY: function(e) {
            return "movementY"in e ? e.movementY : rr
        }
    }), Tc = at(yi), Np = v({}, yi, {
        dataTransfer: 0
    }), Up = at(Np), Hp = v({}, na, {
        relatedTarget: 0
    }), or = at(Hp), jp = v({}, Gn, {
        animationName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    }), Bp = at(jp), qp = v({}, Gn, {
        clipboardData: function(e) {
            return "clipboardData"in e ? e.clipboardData : window.clipboardData
        }
    }), Gp = at(qp), Yp = v({}, Gn, {
        data: 0
    }), Oc = at(Yp), Vp = {
        Esc: "Escape",
        Spacebar: " ",
        Left: "ArrowLeft",
        Up: "ArrowUp",
        Right: "ArrowRight",
        Down: "ArrowDown",
        Del: "Delete",
        Win: "OS",
        Menu: "ContextMenu",
        Apps: "ContextMenu",
        Scroll: "ScrollLock",
        MozPrintableKey: "Unidentified"
    }, Qp = {
        8: "Backspace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Escape",
        32: " ",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "ArrowLeft",
        38: "ArrowUp",
        39: "ArrowRight",
        40: "ArrowDown",
        45: "Insert",
        46: "Delete",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        145: "ScrollLock",
        224: "Meta"
    }, Xp = {
        Alt: "altKey",
        Control: "ctrlKey",
        Meta: "metaKey",
        Shift: "shiftKey"
    };
    function Zp(e) {
        var t = this.nativeEvent;
        return t.getModifierState ? t.getModifierState(e) : (e = Xp[e]) ? !!t[e] : !1
    }
    function sr() {
        return Zp
    }
    var Kp = v({}, na, {
        key: function(e) {
            if (e.key) {
                var t = Vp[e.key] || e.key;
                if (t !== "Unidentified")
                    return t
            }
            return e.type === "keypress" ? (e = mi(e),
            e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Qp[e.keyCode] || "Unidentified" : ""
        },
        code: 0,
        location: 0,
        ctrlKey: 0,
        shiftKey: 0,
        altKey: 0,
        metaKey: 0,
        repeat: 0,
        locale: 0,
        getModifierState: sr,
        charCode: function(e) {
            return e.type === "keypress" ? mi(e) : 0
        },
        keyCode: function(e) {
            return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
        },
        which: function(e) {
            return e.type === "keypress" ? mi(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
        }
    })
      , kp = at(Kp)
      , Jp = v({}, yi, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0
    })
      , Ac = at(Jp)
      , $p = v({}, na, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: sr
    })
      , Fp = at($p)
      , Wp = v({}, Gn, {
        propertyName: 0,
        elapsedTime: 0,
        pseudoElement: 0
    })
      , Ip = at(Wp)
      , Pp = v({}, yi, {
        deltaX: function(e) {
            return "deltaX"in e ? e.deltaX : "wheelDeltaX"in e ? -e.wheelDeltaX : 0
        },
        deltaY: function(e) {
            return "deltaY"in e ? e.deltaY : "wheelDeltaY"in e ? -e.wheelDeltaY : "wheelDelta"in e ? -e.wheelDelta : 0
        },
        deltaZ: 0,
        deltaMode: 0
    })
      , ey = at(Pp)
      , ty = v({}, Gn, {
        newState: 0,
        oldState: 0
    })
      , ny = at(ty)
      , ly = [9, 13, 27, 32]
      , cr = Kt && "CompositionEvent"in window
      , aa = null;
    Kt && "documentMode"in document && (aa = document.documentMode);
    var ay = Kt && "TextEvent"in window && !aa
      , Rc = Kt && (!cr || aa && 8 < aa && 11 >= aa)
      , wc = " "
      , Lc = !1;
    function Mc(e, t) {
        switch (e) {
        case "keyup":
            return ly.indexOf(t.keyCode) !== -1;
        case "keydown":
            return t.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return !0;
        default:
            return !1
        }
    }
    function zc(e) {
        return e = e.detail,
        typeof e == "object" && "data"in e ? e.data : null
    }
    var dl = !1;
    function iy(e, t) {
        switch (e) {
        case "compositionend":
            return zc(t);
        case "keypress":
            return t.which !== 32 ? null : (Lc = !0,
            wc);
        case "textInput":
            return e = t.data,
            e === wc && Lc ? null : e;
        default:
            return null
        }
    }
    function uy(e, t) {
        if (dl)
            return e === "compositionend" || !cr && Mc(e, t) ? (e = xc(),
            hi = ir = hn = null,
            dl = !1,
            e) : null;
        switch (e) {
        case "paste":
            return null;
        case "keypress":
            if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
                if (t.char && 1 < t.char.length)
                    return t.char;
                if (t.which)
                    return String.fromCharCode(t.which)
            }
            return null;
        case "compositionend":
            return Rc && t.locale !== "ko" ? null : t.data;
        default:
            return null
        }
    }
    var ry = {
        color: !0,
        date: !0,
        datetime: !0,
        "datetime-local": !0,
        email: !0,
        month: !0,
        number: !0,
        password: !0,
        range: !0,
        search: !0,
        tel: !0,
        text: !0,
        time: !0,
        url: !0,
        week: !0
    };
    function Dc(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return t === "input" ? !!ry[e.type] : t === "textarea"
    }
    function Nc(e, t, n, l) {
        cl ? fl ? fl.push(l) : fl = [l] : cl = l,
        t = uu(t, "onChange"),
        0 < t.length && (n = new pi("onChange","change",null,n,l),
        e.push({
            event: n,
            listeners: t
        }))
    }
    var ia = null
      , ua = null;
    function oy(e) {
        yh(e, 0)
    }
    function vi(e) {
        var t = Pl(e);
        if (gc(t))
            return e
    }
    function Uc(e, t) {
        if (e === "change")
            return t
    }
    var Hc = !1;
    if (Kt) {
        var fr;
        if (Kt) {
            var dr = "oninput"in document;
            if (!dr) {
                var jc = document.createElement("div");
                jc.setAttribute("oninput", "return;"),
                dr = typeof jc.oninput == "function"
            }
            fr = dr
        } else
            fr = !1;
        Hc = fr && (!document.documentMode || 9 < document.documentMode)
    }
    function Bc() {
        ia && (ia.detachEvent("onpropertychange", qc),
        ua = ia = null)
    }
    function qc(e) {
        if (e.propertyName === "value" && vi(ua)) {
            var t = [];
            Nc(t, ua, e, nr(e)),
            _c(oy, t)
        }
    }
    function sy(e, t, n) {
        e === "focusin" ? (Bc(),
        ia = t,
        ua = n,
        ia.attachEvent("onpropertychange", qc)) : e === "focusout" && Bc()
    }
    function cy(e) {
        if (e === "selectionchange" || e === "keyup" || e === "keydown")
            return vi(ua)
    }
    function fy(e, t) {
        if (e === "click")
            return vi(t)
    }
    function dy(e, t) {
        if (e === "input" || e === "change")
            return vi(t)
    }
    function hy(e, t) {
        return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
    }
    var mt = typeof Object.is == "function" ? Object.is : hy;
    function ra(e, t) {
        if (mt(e, t))
            return !0;
        if (typeof e != "object" || e === null || typeof t != "object" || t === null)
            return !1;
        var n = Object.keys(e)
          , l = Object.keys(t);
        if (n.length !== l.length)
            return !1;
        for (l = 0; l < n.length; l++) {
            var i = n[l];
            if (!Qu.call(t, i) || !mt(e[i], t[i]))
                return !1
        }
        return !0
    }
    function Gc(e) {
        for (; e && e.firstChild; )
            e = e.firstChild;
        return e
    }
    function Yc(e, t) {
        var n = Gc(e);
        e = 0;
        for (var l; n; ) {
            if (n.nodeType === 3) {
                if (l = e + n.textContent.length,
                e <= t && l >= t)
                    return {
                        node: n,
                        offset: t - e
                    };
                e = l
            }
            e: {
                for (; n; ) {
                    if (n.nextSibling) {
                        n = n.nextSibling;
                        break e
                    }
                    n = n.parentNode
                }
                n = void 0
            }
            n = Gc(n)
        }
    }
    function Vc(e, t) {
        return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Vc(e, t.parentNode) : "contains"in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1
    }
    function Qc(e) {
        e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
        for (var t = fi(e.document); t instanceof e.HTMLIFrameElement; ) {
            try {
                var n = typeof t.contentWindow.location.href == "string"
            } catch {
                n = !1
            }
            if (n)
                e = t.contentWindow;
            else
                break;
            t = fi(e.document)
        }
        return t
    }
    function hr(e) {
        var t = e && e.nodeName && e.nodeName.toLowerCase();
        return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true")
    }
    var my = Kt && "documentMode"in document && 11 >= document.documentMode
      , hl = null
      , mr = null
      , oa = null
      , gr = !1;
    function Xc(e, t, n) {
        var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
        gr || hl == null || hl !== fi(l) || (l = hl,
        "selectionStart"in l && hr(l) ? l = {
            start: l.selectionStart,
            end: l.selectionEnd
        } : (l = (l.ownerDocument && l.ownerDocument.defaultView || window).getSelection(),
        l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset
        }),
        oa && ra(oa, l) || (oa = l,
        l = uu(mr, "onSelect"),
        0 < l.length && (t = new pi("onSelect","select",null,t,n),
        e.push({
            event: t,
            listeners: l
        }),
        t.target = hl)))
    }
    function Yn(e, t) {
        var n = {};
        return n[e.toLowerCase()] = t.toLowerCase(),
        n["Webkit" + e] = "webkit" + t,
        n["Moz" + e] = "moz" + t,
        n
    }
    var ml = {
        animationend: Yn("Animation", "AnimationEnd"),
        animationiteration: Yn("Animation", "AnimationIteration"),
        animationstart: Yn("Animation", "AnimationStart"),
        transitionrun: Yn("Transition", "TransitionRun"),
        transitionstart: Yn("Transition", "TransitionStart"),
        transitioncancel: Yn("Transition", "TransitionCancel"),
        transitionend: Yn("Transition", "TransitionEnd")
    }
      , pr = {}
      , Zc = {};
    Kt && (Zc = document.createElement("div").style,
    "AnimationEvent"in window || (delete ml.animationend.animation,
    delete ml.animationiteration.animation,
    delete ml.animationstart.animation),
    "TransitionEvent"in window || delete ml.transitionend.transition);
    function Vn(e) {
        if (pr[e])
            return pr[e];
        if (!ml[e])
            return e;
        var t = ml[e], n;
        for (n in t)
            if (t.hasOwnProperty(n) && n in Zc)
                return pr[e] = t[n];
        return e
    }
    var Kc = Vn("animationend")
      , kc = Vn("animationiteration")
      , Jc = Vn("animationstart")
      , gy = Vn("transitionrun")
      , py = Vn("transitionstart")
      , yy = Vn("transitioncancel")
      , $c = Vn("transitionend")
      , Fc = new Map
      , yr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    yr.push("scrollEnd");
    function zt(e, t) {
        Fc.set(e, t),
        qn(t, [e])
    }
    var Si = typeof reportError == "function" ? reportError : function(e) {
        if (typeof window == "object" && typeof window.ErrorEvent == "function") {
            var t = new window.ErrorEvent("error",{
                bubbles: !0,
                cancelable: !0,
                message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
                error: e
            });
            if (!window.dispatchEvent(t))
                return
        } else if (typeof process == "object" && typeof process.emit == "function") {
            process.emit("uncaughtException", e);
            return
        }
        console.error(e)
    }
      , xt = []
      , gl = 0
      , vr = 0;
    function bi() {
        for (var e = gl, t = vr = gl = 0; t < e; ) {
            var n = xt[t];
            xt[t++] = null;
            var l = xt[t];
            xt[t++] = null;
            var i = xt[t];
            xt[t++] = null;
            var s = xt[t];
            if (xt[t++] = null,
            l !== null && i !== null) {
                var h = l.pending;
                h === null ? i.next = i : (i.next = h.next,
                h.next = i),
                l.pending = i
            }
            s !== 0 && Wc(n, i, s)
        }
    }
    function Ei(e, t, n, l) {
        xt[gl++] = e,
        xt[gl++] = t,
        xt[gl++] = n,
        xt[gl++] = l,
        vr |= l,
        e.lanes |= l,
        e = e.alternate,
        e !== null && (e.lanes |= l)
    }
    function Sr(e, t, n, l) {
        return Ei(e, t, n, l),
        _i(e)
    }
    function Qn(e, t) {
        return Ei(e, null, null, t),
        _i(e)
    }
    function Wc(e, t, n) {
        e.lanes |= n;
        var l = e.alternate;
        l !== null && (l.lanes |= n);
        for (var i = !1, s = e.return; s !== null; )
            s.childLanes |= n,
            l = s.alternate,
            l !== null && (l.childLanes |= n),
            s.tag === 22 && (e = s.stateNode,
            e === null || e._visibility & 1 || (i = !0)),
            e = s,
            s = s.return;
        return e.tag === 3 ? (s = e.stateNode,
        i && t !== null && (i = 31 - ht(n),
        e = s.hiddenUpdates,
        l = e[i],
        l === null ? e[i] = [t] : l.push(t),
        t.lane = n | 536870912),
        s) : null
    }
    function _i(e) {
        if (50 < La)
            throw La = 0,
            wo = null,
            Error(o(185));
        for (var t = e.return; t !== null; )
            e = t,
            t = e.return;
        return e.tag === 3 ? e.stateNode : null
    }
    var pl = {};
    function vy(e, t, n, l) {
        this.tag = e,
        this.key = n,
        this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null,
        this.index = 0,
        this.refCleanup = this.ref = null,
        this.pendingProps = t,
        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null,
        this.mode = l,
        this.subtreeFlags = this.flags = 0,
        this.deletions = null,
        this.childLanes = this.lanes = 0,
        this.alternate = null
    }
    function gt(e, t, n, l) {
        return new vy(e,t,n,l)
    }
    function br(e) {
        return e = e.prototype,
        !(!e || !e.isReactComponent)
    }
    function kt(e, t) {
        var n = e.alternate;
        return n === null ? (n = gt(e.tag, t, e.key, e.mode),
        n.elementType = e.elementType,
        n.type = e.type,
        n.stateNode = e.stateNode,
        n.alternate = e,
        e.alternate = n) : (n.pendingProps = t,
        n.type = e.type,
        n.flags = 0,
        n.subtreeFlags = 0,
        n.deletions = null),
        n.flags = e.flags & 65011712,
        n.childLanes = e.childLanes,
        n.lanes = e.lanes,
        n.child = e.child,
        n.memoizedProps = e.memoizedProps,
        n.memoizedState = e.memoizedState,
        n.updateQueue = e.updateQueue,
        t = e.dependencies,
        n.dependencies = t === null ? null : {
            lanes: t.lanes,
            firstContext: t.firstContext
        },
        n.sibling = e.sibling,
        n.index = e.index,
        n.ref = e.ref,
        n.refCleanup = e.refCleanup,
        n
    }
    function Ic(e, t) {
        e.flags &= 65011714;
        var n = e.alternate;
        return n === null ? (e.childLanes = 0,
        e.lanes = t,
        e.child = null,
        e.subtreeFlags = 0,
        e.memoizedProps = null,
        e.memoizedState = null,
        e.updateQueue = null,
        e.dependencies = null,
        e.stateNode = null) : (e.childLanes = n.childLanes,
        e.lanes = n.lanes,
        e.child = n.child,
        e.subtreeFlags = 0,
        e.deletions = null,
        e.memoizedProps = n.memoizedProps,
        e.memoizedState = n.memoizedState,
        e.updateQueue = n.updateQueue,
        e.type = n.type,
        t = n.dependencies,
        e.dependencies = t === null ? null : {
            lanes: t.lanes,
            firstContext: t.firstContext
        }),
        e
    }
    function xi(e, t, n, l, i, s) {
        var h = 0;
        if (l = e,
        typeof e == "function")
            br(e) && (h = 1);
        else if (typeof e == "string")
            h = xv(e, n, J.current) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
        else
            e: switch (e) {
            case Ce:
                return e = gt(31, n, t, i),
                e.elementType = Ce,
                e.lanes = s,
                e;
            case A:
                return Xn(n.children, i, s, t);
            case x:
                h = 8,
                i |= 24;
                break;
            case z:
                return e = gt(12, n, t, i | 2),
                e.elementType = z,
                e.lanes = s,
                e;
            case F:
                return e = gt(13, n, t, i),
                e.elementType = F,
                e.lanes = s,
                e;
            case re:
                return e = gt(19, n, t, i),
                e.elementType = re,
                e.lanes = s,
                e;
            default:
                if (typeof e == "object" && e !== null)
                    switch (e.$$typeof) {
                    case Y:
                        h = 10;
                        break e;
                    case q:
                        h = 9;
                        break e;
                    case k:
                        h = 11;
                        break e;
                    case W:
                        h = 14;
                        break e;
                    case pe:
                        h = 16,
                        l = null;
                        break e
                    }
                h = 29,
                n = Error(o(130, e === null ? "null" : typeof e, "")),
                l = null
            }
        return t = gt(h, n, t, i),
        t.elementType = e,
        t.type = l,
        t.lanes = s,
        t
    }
    function Xn(e, t, n, l) {
        return e = gt(7, e, l, t),
        e.lanes = n,
        e
    }
    function Er(e, t, n) {
        return e = gt(6, e, null, t),
        e.lanes = n,
        e
    }
    function Pc(e) {
        var t = gt(18, null, null, 0);
        return t.stateNode = e,
        t
    }
    function _r(e, t, n) {
        return t = gt(4, e.children !== null ? e.children : [], e.key, t),
        t.lanes = n,
        t.stateNode = {
            containerInfo: e.containerInfo,
            pendingChildren: null,
            implementation: e.implementation
        },
        t
    }
    var ef = new WeakMap;
    function Ct(e, t) {
        if (typeof e == "object" && e !== null) {
            var n = ef.get(e);
            return n !== void 0 ? n : (t = {
                value: e,
                source: t,
                stack: Ps(t)
            },
            ef.set(e, t),
            t)
        }
        return {
            value: e,
            source: t,
            stack: Ps(t)
        }
    }
    var yl = []
      , vl = 0
      , Ci = null
      , sa = 0
      , Tt = []
      , Ot = 0
      , mn = null
      , Ht = 1
      , jt = "";
    function Jt(e, t) {
        yl[vl++] = sa,
        yl[vl++] = Ci,
        Ci = e,
        sa = t
    }
    function tf(e, t, n) {
        Tt[Ot++] = Ht,
        Tt[Ot++] = jt,
        Tt[Ot++] = mn,
        mn = e;
        var l = Ht;
        e = jt;
        var i = 32 - ht(l) - 1;
        l &= ~(1 << i),
        n += 1;
        var s = 32 - ht(t) + i;
        if (30 < s) {
            var h = i - i % 5;
            s = (l & (1 << h) - 1).toString(32),
            l >>= h,
            i -= h,
            Ht = 1 << 32 - ht(t) + i | n << i | l,
            jt = s + e
        } else
            Ht = 1 << s | n << i | l,
            jt = e
    }
    function xr(e) {
        e.return !== null && (Jt(e, 1),
        tf(e, 1, 0))
    }
    function Cr(e) {
        for (; e === Ci; )
            Ci = yl[--vl],
            yl[vl] = null,
            sa = yl[--vl],
            yl[vl] = null;
        for (; e === mn; )
            mn = Tt[--Ot],
            Tt[Ot] = null,
            jt = Tt[--Ot],
            Tt[Ot] = null,
            Ht = Tt[--Ot],
            Tt[Ot] = null
    }
    function nf(e, t) {
        Tt[Ot++] = Ht,
        Tt[Ot++] = jt,
        Tt[Ot++] = mn,
        Ht = t.id,
        jt = t.overflow,
        mn = e
    }
    var $e = null
      , Me = null
      , ye = !1
      , gn = null
      , At = !1
      , Tr = Error(o(519));
    function pn(e) {
        var t = Error(o(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
        throw ca(Ct(t, e)),
        Tr
    }
    function lf(e) {
        var t = e.stateNode
          , n = e.type
          , l = e.memoizedProps;
        switch (t[Je] = e,
        t[lt] = l,
        n) {
        case "dialog":
            he("cancel", t),
            he("close", t);
            break;
        case "iframe":
        case "object":
        case "embed":
            he("load", t);
            break;
        case "video":
        case "audio":
            for (n = 0; n < za.length; n++)
                he(za[n], t);
            break;
        case "source":
            he("error", t);
            break;
        case "img":
        case "image":
        case "link":
            he("error", t),
            he("load", t);
            break;
        case "details":
            he("toggle", t);
            break;
        case "input":
            he("invalid", t),
            pc(t, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0);
            break;
        case "select":
            he("invalid", t);
            break;
        case "textarea":
            he("invalid", t),
            vc(t, l.value, l.defaultValue, l.children)
        }
        n = l.children,
        typeof n != "string" && typeof n != "number" && typeof n != "bigint" || t.textContent === "" + n || l.suppressHydrationWarning === !0 || Eh(t.textContent, n) ? (l.popover != null && (he("beforetoggle", t),
        he("toggle", t)),
        l.onScroll != null && he("scroll", t),
        l.onScrollEnd != null && he("scrollend", t),
        l.onClick != null && (t.onclick = Zt),
        t = !0) : t = !1,
        t || pn(e, !0)
    }
    function af(e) {
        for ($e = e.return; $e; )
            switch ($e.tag) {
            case 5:
            case 31:
            case 13:
                At = !1;
                return;
            case 27:
            case 3:
                At = !0;
                return;
            default:
                $e = $e.return
            }
    }
    function Sl(e) {
        if (e !== $e)
            return !1;
        if (!ye)
            return af(e),
            ye = !0,
            !1;
        var t = e.tag, n;
        if ((n = t !== 3 && t !== 27) && ((n = t === 5) && (n = e.type,
        n = !(n !== "form" && n !== "button") || Xo(e.type, e.memoizedProps)),
        n = !n),
        n && Me && pn(e),
        af(e),
        t === 13) {
            if (e = e.memoizedState,
            e = e !== null ? e.dehydrated : null,
            !e)
                throw Error(o(317));
            Me = Lh(e)
        } else if (t === 31) {
            if (e = e.memoizedState,
            e = e !== null ? e.dehydrated : null,
            !e)
                throw Error(o(317));
            Me = Lh(e)
        } else
            t === 27 ? (t = Me,
            Ln(e.type) ? (e = $o,
            $o = null,
            Me = e) : Me = t) : Me = $e ? wt(e.stateNode.nextSibling) : null;
        return !0
    }
    function Zn() {
        Me = $e = null,
        ye = !1
    }
    function Or() {
        var e = gn;
        return e !== null && (ot === null ? ot = e : ot.push.apply(ot, e),
        gn = null),
        e
    }
    function ca(e) {
        gn === null ? gn = [e] : gn.push(e)
    }
    var Ar = T(null)
      , Kn = null
      , $t = null;
    function yn(e, t, n) {
        Z(Ar, t._currentValue),
        t._currentValue = n
    }
    function Ft(e) {
        e._currentValue = Ar.current,
        j(Ar)
    }
    function Rr(e, t, n) {
        for (; e !== null; ) {
            var l = e.alternate;
            if ((e.childLanes & t) !== t ? (e.childLanes |= t,
            l !== null && (l.childLanes |= t)) : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t),
            e === n)
                break;
            e = e.return
        }
    }
    function wr(e, t, n, l) {
        var i = e.child;
        for (i !== null && (i.return = e); i !== null; ) {
            var s = i.dependencies;
            if (s !== null) {
                var h = i.child;
                s = s.firstContext;
                e: for (; s !== null; ) {
                    var y = s;
                    s = i;
                    for (var C = 0; C < t.length; C++)
                        if (y.context === t[C]) {
                            s.lanes |= n,
                            y = s.alternate,
                            y !== null && (y.lanes |= n),
                            Rr(s.return, n, e),
                            l || (h = null);
                            break e
                        }
                    s = y.next
                }
            } else if (i.tag === 18) {
                if (h = i.return,
                h === null)
                    throw Error(o(341));
                h.lanes |= n,
                s = h.alternate,
                s !== null && (s.lanes |= n),
                Rr(h, n, e),
                h = null
            } else
                h = i.child;
            if (h !== null)
                h.return = i;
            else
                for (h = i; h !== null; ) {
                    if (h === e) {
                        h = null;
                        break
                    }
                    if (i = h.sibling,
                    i !== null) {
                        i.return = h.return,
                        h = i;
                        break
                    }
                    h = h.return
                }
            i = h
        }
    }
    function bl(e, t, n, l) {
        e = null;
        for (var i = t, s = !1; i !== null; ) {
            if (!s) {
                if ((i.flags & 524288) !== 0)
                    s = !0;
                else if ((i.flags & 262144) !== 0)
                    break
            }
            if (i.tag === 10) {
                var h = i.alternate;
                if (h === null)
                    throw Error(o(387));
                if (h = h.memoizedProps,
                h !== null) {
                    var y = i.type;
                    mt(i.pendingProps.value, h.value) || (e !== null ? e.push(y) : e = [y])
                }
            } else if (i === xe.current) {
                if (h = i.alternate,
                h === null)
                    throw Error(o(387));
                h.memoizedState.memoizedState !== i.memoizedState.memoizedState && (e !== null ? e.push(ja) : e = [ja])
            }
            i = i.return
        }
        e !== null && wr(t, e, n, l),
        t.flags |= 262144
    }
    function Ti(e) {
        for (e = e.firstContext; e !== null; ) {
            if (!mt(e.context._currentValue, e.memoizedValue))
                return !0;
            e = e.next
        }
        return !1
    }
    function kn(e) {
        Kn = e,
        $t = null,
        e = e.dependencies,
        e !== null && (e.firstContext = null)
    }
    function Fe(e) {
        return uf(Kn, e)
    }
    function Oi(e, t) {
        return Kn === null && kn(e),
        uf(e, t)
    }
    function uf(e, t) {
        var n = t._currentValue;
        if (t = {
            context: t,
            memoizedValue: n,
            next: null
        },
        $t === null) {
            if (e === null)
                throw Error(o(308));
            $t = t,
            e.dependencies = {
                lanes: 0,
                firstContext: t
            },
            e.flags |= 524288
        } else
            $t = $t.next = t;
        return n
    }
    var Sy = typeof AbortController < "u" ? AbortController : function() {
        var e = []
          , t = this.signal = {
            aborted: !1,
            addEventListener: function(n, l) {
                e.push(l)
            }
        };
        this.abort = function() {
            t.aborted = !0,
            e.forEach(function(n) {
                return n()
            })
        }
    }
      , by = u.unstable_scheduleCallback
      , Ey = u.unstable_NormalPriority
      , qe = {
        $$typeof: Y,
        Consumer: null,
        Provider: null,
        _currentValue: null,
        _currentValue2: null,
        _threadCount: 0
    };
    function Lr() {
        return {
            controller: new Sy,
            data: new Map,
            refCount: 0
        }
    }
    function fa(e) {
        e.refCount--,
        e.refCount === 0 && by(Ey, function() {
            e.controller.abort()
        })
    }
    var da = null
      , Mr = 0
      , El = 0
      , _l = null;
    function _y(e, t) {
        if (da === null) {
            var n = da = [];
            Mr = 0,
            El = Uo(),
            _l = {
                status: "pending",
                value: void 0,
                then: function(l) {
                    n.push(l)
                }
            }
        }
        return Mr++,
        t.then(rf, rf),
        t
    }
    function rf() {
        if (--Mr === 0 && da !== null) {
            _l !== null && (_l.status = "fulfilled");
            var e = da;
            da = null,
            El = 0,
            _l = null;
            for (var t = 0; t < e.length; t++)
                (0,
                e[t])()
        }
    }
    function xy(e, t) {
        var n = []
          , l = {
            status: "pending",
            value: null,
            reason: null,
            then: function(i) {
                n.push(i)
            }
        };
        return e.then(function() {
            l.status = "fulfilled",
            l.value = t;
            for (var i = 0; i < n.length; i++)
                (0,
                n[i])(t)
        }, function(i) {
            for (l.status = "rejected",
            l.reason = i,
            i = 0; i < n.length; i++)
                (0,
                n[i])(void 0)
        }),
        l
    }
    var of = N.S;
    N.S = function(e, t) {
        Zd = ft(),
        typeof t == "object" && t !== null && typeof t.then == "function" && _y(e, t),
        of !== null && of(e, t)
    }
    ;
    var Jn = T(null);
    function zr() {
        var e = Jn.current;
        return e !== null ? e : Le.pooledCache
    }
    function Ai(e, t) {
        t === null ? Z(Jn, Jn.current) : Z(Jn, t.pool)
    }
    function sf() {
        var e = zr();
        return e === null ? null : {
            parent: qe._currentValue,
            pool: e
        }
    }
    var xl = Error(o(460))
      , Dr = Error(o(474))
      , Ri = Error(o(542))
      , wi = {
        then: function() {}
    };
    function cf(e) {
        return e = e.status,
        e === "fulfilled" || e === "rejected"
    }
    function ff(e, t, n) {
        switch (n = e[n],
        n === void 0 ? e.push(t) : n !== t && (t.then(Zt, Zt),
        t = n),
        t.status) {
        case "fulfilled":
            return t.value;
        case "rejected":
            throw e = t.reason,
            hf(e),
            e;
        default:
            if (typeof t.status == "string")
                t.then(Zt, Zt);
            else {
                if (e = Le,
                e !== null && 100 < e.shellSuspendCounter)
                    throw Error(o(482));
                e = t,
                e.status = "pending",
                e.then(function(l) {
                    if (t.status === "pending") {
                        var i = t;
                        i.status = "fulfilled",
                        i.value = l
                    }
                }, function(l) {
                    if (t.status === "pending") {
                        var i = t;
                        i.status = "rejected",
                        i.reason = l
                    }
                })
            }
            switch (t.status) {
            case "fulfilled":
                return t.value;
            case "rejected":
                throw e = t.reason,
                hf(e),
                e
            }
            throw Fn = t,
            xl
        }
    }
    function $n(e) {
        try {
            var t = e._init;
            return t(e._payload)
        } catch (n) {
            throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Fn = n,
            xl) : n
        }
    }
    var Fn = null;
    function df() {
        if (Fn === null)
            throw Error(o(459));
        var e = Fn;
        return Fn = null,
        e
    }
    function hf(e) {
        if (e === xl || e === Ri)
            throw Error(o(483))
    }
    var Cl = null
      , ha = 0;
    function Li(e) {
        var t = ha;
        return ha += 1,
        Cl === null && (Cl = []),
        ff(Cl, e, t)
    }
    function ma(e, t) {
        t = t.props.ref,
        e.ref = t !== void 0 ? t : null
    }
    function Mi(e, t) {
        throw t.$$typeof === E ? Error(o(525)) : (e = Object.prototype.toString.call(t),
        Error(o(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e)))
    }
    function mf(e) {
        function t(R, O) {
            if (e) {
                var w = R.deletions;
                w === null ? (R.deletions = [O],
                R.flags |= 16) : w.push(O)
            }
        }
        function n(R, O) {
            if (!e)
                return null;
            for (; O !== null; )
                t(R, O),
                O = O.sibling;
            return null
        }
        function l(R) {
            for (var O = new Map; R !== null; )
                R.key !== null ? O.set(R.key, R) : O.set(R.index, R),
                R = R.sibling;
            return O
        }
        function i(R, O) {
            return R = kt(R, O),
            R.index = 0,
            R.sibling = null,
            R
        }
        function s(R, O, w) {
            return R.index = w,
            e ? (w = R.alternate,
            w !== null ? (w = w.index,
            w < O ? (R.flags |= 67108866,
            O) : w) : (R.flags |= 67108866,
            O)) : (R.flags |= 1048576,
            O)
        }
        function h(R) {
            return e && R.alternate === null && (R.flags |= 67108866),
            R
        }
        function y(R, O, w, B) {
            return O === null || O.tag !== 6 ? (O = Er(w, R.mode, B),
            O.return = R,
            O) : (O = i(O, w),
            O.return = R,
            O)
        }
        function C(R, O, w, B) {
            var P = w.type;
            return P === A ? U(R, O, w.props.children, B, w.key) : O !== null && (O.elementType === P || typeof P == "object" && P !== null && P.$$typeof === pe && $n(P) === O.type) ? (O = i(O, w.props),
            ma(O, w),
            O.return = R,
            O) : (O = xi(w.type, w.key, w.props, null, R.mode, B),
            ma(O, w),
            O.return = R,
            O)
        }
        function L(R, O, w, B) {
            return O === null || O.tag !== 4 || O.stateNode.containerInfo !== w.containerInfo || O.stateNode.implementation !== w.implementation ? (O = _r(w, R.mode, B),
            O.return = R,
            O) : (O = i(O, w.children || []),
            O.return = R,
            O)
        }
        function U(R, O, w, B, P) {
            return O === null || O.tag !== 7 ? (O = Xn(w, R.mode, B, P),
            O.return = R,
            O) : (O = i(O, w),
            O.return = R,
            O)
        }
        function G(R, O, w) {
            if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
                return O = Er("" + O, R.mode, w),
                O.return = R,
                O;
            if (typeof O == "object" && O !== null) {
                switch (O.$$typeof) {
                case b:
                    return w = xi(O.type, O.key, O.props, null, R.mode, w),
                    ma(w, O),
                    w.return = R,
                    w;
                case _:
                    return O = _r(O, R.mode, w),
                    O.return = R,
                    O;
                case pe:
                    return O = $n(O),
                    G(R, O, w)
                }
                if (ce(O) || K(O))
                    return O = Xn(O, R.mode, w, null),
                    O.return = R,
                    O;
                if (typeof O.then == "function")
                    return G(R, Li(O), w);
                if (O.$$typeof === Y)
                    return G(R, Oi(R, O), w);
                Mi(R, O)
            }
            return null
        }
        function M(R, O, w, B) {
            var P = O !== null ? O.key : null;
            if (typeof w == "string" && w !== "" || typeof w == "number" || typeof w == "bigint")
                return P !== null ? null : y(R, O, "" + w, B);
            if (typeof w == "object" && w !== null) {
                switch (w.$$typeof) {
                case b:
                    return w.key === P ? C(R, O, w, B) : null;
                case _:
                    return w.key === P ? L(R, O, w, B) : null;
                case pe:
                    return w = $n(w),
                    M(R, O, w, B)
                }
                if (ce(w) || K(w))
                    return P !== null ? null : U(R, O, w, B, null);
                if (typeof w.then == "function")
                    return M(R, O, Li(w), B);
                if (w.$$typeof === Y)
                    return M(R, O, Oi(R, w), B);
                Mi(R, w)
            }
            return null
        }
        function D(R, O, w, B, P) {
            if (typeof B == "string" && B !== "" || typeof B == "number" || typeof B == "bigint")
                return R = R.get(w) || null,
                y(O, R, "" + B, P);
            if (typeof B == "object" && B !== null) {
                switch (B.$$typeof) {
                case b:
                    return R = R.get(B.key === null ? w : B.key) || null,
                    C(O, R, B, P);
                case _:
                    return R = R.get(B.key === null ? w : B.key) || null,
                    L(O, R, B, P);
                case pe:
                    return B = $n(B),
                    D(R, O, w, B, P)
                }
                if (ce(B) || K(B))
                    return R = R.get(w) || null,
                    U(O, R, B, P, null);
                if (typeof B.then == "function")
                    return D(R, O, w, Li(B), P);
                if (B.$$typeof === Y)
                    return D(R, O, w, Oi(O, B), P);
                Mi(O, B)
            }
            return null
        }
        function $(R, O, w, B) {
            for (var P = null, Se = null, I = O, se = O = 0, ge = null; I !== null && se < w.length; se++) {
                I.index > se ? (ge = I,
                I = null) : ge = I.sibling;
                var be = M(R, I, w[se], B);
                if (be === null) {
                    I === null && (I = ge);
                    break
                }
                e && I && be.alternate === null && t(R, I),
                O = s(be, O, se),
                Se === null ? P = be : Se.sibling = be,
                Se = be,
                I = ge
            }
            if (se === w.length)
                return n(R, I),
                ye && Jt(R, se),
                P;
            if (I === null) {
                for (; se < w.length; se++)
                    I = G(R, w[se], B),
                    I !== null && (O = s(I, O, se),
                    Se === null ? P = I : Se.sibling = I,
                    Se = I);
                return ye && Jt(R, se),
                P
            }
            for (I = l(I); se < w.length; se++)
                ge = D(I, R, se, w[se], B),
                ge !== null && (e && ge.alternate !== null && I.delete(ge.key === null ? se : ge.key),
                O = s(ge, O, se),
                Se === null ? P = ge : Se.sibling = ge,
                Se = ge);
            return e && I.forEach(function(Un) {
                return t(R, Un)
            }),
            ye && Jt(R, se),
            P
        }
        function ne(R, O, w, B) {
            if (w == null)
                throw Error(o(151));
            for (var P = null, Se = null, I = O, se = O = 0, ge = null, be = w.next(); I !== null && !be.done; se++,
            be = w.next()) {
                I.index > se ? (ge = I,
                I = null) : ge = I.sibling;
                var Un = M(R, I, be.value, B);
                if (Un === null) {
                    I === null && (I = ge);
                    break
                }
                e && I && Un.alternate === null && t(R, I),
                O = s(Un, O, se),
                Se === null ? P = Un : Se.sibling = Un,
                Se = Un,
                I = ge
            }
            if (be.done)
                return n(R, I),
                ye && Jt(R, se),
                P;
            if (I === null) {
                for (; !be.done; se++,
                be = w.next())
                    be = G(R, be.value, B),
                    be !== null && (O = s(be, O, se),
                    Se === null ? P = be : Se.sibling = be,
                    Se = be);
                return ye && Jt(R, se),
                P
            }
            for (I = l(I); !be.done; se++,
            be = w.next())
                be = D(I, R, se, be.value, B),
                be !== null && (e && be.alternate !== null && I.delete(be.key === null ? se : be.key),
                O = s(be, O, se),
                Se === null ? P = be : Se.sibling = be,
                Se = be);
            return e && I.forEach(function(Nv) {
                return t(R, Nv)
            }),
            ye && Jt(R, se),
            P
        }
        function we(R, O, w, B) {
            if (typeof w == "object" && w !== null && w.type === A && w.key === null && (w = w.props.children),
            typeof w == "object" && w !== null) {
                switch (w.$$typeof) {
                case b:
                    e: {
                        for (var P = w.key; O !== null; ) {
                            if (O.key === P) {
                                if (P = w.type,
                                P === A) {
                                    if (O.tag === 7) {
                                        n(R, O.sibling),
                                        B = i(O, w.props.children),
                                        B.return = R,
                                        R = B;
                                        break e
                                    }
                                } else if (O.elementType === P || typeof P == "object" && P !== null && P.$$typeof === pe && $n(P) === O.type) {
                                    n(R, O.sibling),
                                    B = i(O, w.props),
                                    ma(B, w),
                                    B.return = R,
                                    R = B;
                                    break e
                                }
                                n(R, O);
                                break
                            } else
                                t(R, O);
                            O = O.sibling
                        }
                        w.type === A ? (B = Xn(w.props.children, R.mode, B, w.key),
                        B.return = R,
                        R = B) : (B = xi(w.type, w.key, w.props, null, R.mode, B),
                        ma(B, w),
                        B.return = R,
                        R = B)
                    }
                    return h(R);
                case _:
                    e: {
                        for (P = w.key; O !== null; ) {
                            if (O.key === P)
                                if (O.tag === 4 && O.stateNode.containerInfo === w.containerInfo && O.stateNode.implementation === w.implementation) {
                                    n(R, O.sibling),
                                    B = i(O, w.children || []),
                                    B.return = R,
                                    R = B;
                                    break e
                                } else {
                                    n(R, O);
                                    break
                                }
                            else
                                t(R, O);
                            O = O.sibling
                        }
                        B = _r(w, R.mode, B),
                        B.return = R,
                        R = B
                    }
                    return h(R);
                case pe:
                    return w = $n(w),
                    we(R, O, w, B)
                }
                if (ce(w))
                    return $(R, O, w, B);
                if (K(w)) {
                    if (P = K(w),
                    typeof P != "function")
                        throw Error(o(150));
                    return w = P.call(w),
                    ne(R, O, w, B)
                }
                if (typeof w.then == "function")
                    return we(R, O, Li(w), B);
                if (w.$$typeof === Y)
                    return we(R, O, Oi(R, w), B);
                Mi(R, w)
            }
            return typeof w == "string" && w !== "" || typeof w == "number" || typeof w == "bigint" ? (w = "" + w,
            O !== null && O.tag === 6 ? (n(R, O.sibling),
            B = i(O, w),
            B.return = R,
            R = B) : (n(R, O),
            B = Er(w, R.mode, B),
            B.return = R,
            R = B),
            h(R)) : n(R, O)
        }
        return function(R, O, w, B) {
            try {
                ha = 0;
                var P = we(R, O, w, B);
                return Cl = null,
                P
            } catch (I) {
                if (I === xl || I === Ri)
                    throw I;
                var Se = gt(29, I, null, R.mode);
                return Se.lanes = B,
                Se.return = R,
                Se
            }
        }
    }
    var Wn = mf(!0)
      , gf = mf(!1)
      , vn = !1;
    function Nr(e) {
        e.updateQueue = {
            baseState: e.memoizedState,
            firstBaseUpdate: null,
            lastBaseUpdate: null,
            shared: {
                pending: null,
                lanes: 0,
                hiddenCallbacks: null
            },
            callbacks: null
        }
    }
    function Ur(e, t) {
        e = e.updateQueue,
        t.updateQueue === e && (t.updateQueue = {
            baseState: e.baseState,
            firstBaseUpdate: e.firstBaseUpdate,
            lastBaseUpdate: e.lastBaseUpdate,
            shared: e.shared,
            callbacks: null
        })
    }
    function Sn(e) {
        return {
            lane: e,
            tag: 0,
            payload: null,
            callback: null,
            next: null
        }
    }
    function bn(e, t, n) {
        var l = e.updateQueue;
        if (l === null)
            return null;
        if (l = l.shared,
        (Ee & 2) !== 0) {
            var i = l.pending;
            return i === null ? t.next = t : (t.next = i.next,
            i.next = t),
            l.pending = t,
            t = _i(e),
            Wc(e, null, n),
            t
        }
        return Ei(e, l, t, n),
        _i(e)
    }
    function ga(e, t, n) {
        if (t = t.updateQueue,
        t !== null && (t = t.shared,
        (n & 4194048) !== 0)) {
            var l = t.lanes;
            l &= e.pendingLanes,
            n |= l,
            t.lanes = n,
            ic(e, n)
        }
    }
    function Hr(e, t) {
        var n = e.updateQueue
          , l = e.alternate;
        if (l !== null && (l = l.updateQueue,
        n === l)) {
            var i = null
              , s = null;
            if (n = n.firstBaseUpdate,
            n !== null) {
                do {
                    var h = {
                        lane: n.lane,
                        tag: n.tag,
                        payload: n.payload,
                        callback: null,
                        next: null
                    };
                    s === null ? i = s = h : s = s.next = h,
                    n = n.next
                } while (n !== null);
                s === null ? i = s = t : s = s.next = t
            } else
                i = s = t;
            n = {
                baseState: l.baseState,
                firstBaseUpdate: i,
                lastBaseUpdate: s,
                shared: l.shared,
                callbacks: l.callbacks
            },
            e.updateQueue = n;
            return
        }
        e = n.lastBaseUpdate,
        e === null ? n.firstBaseUpdate = t : e.next = t,
        n.lastBaseUpdate = t
    }
    var jr = !1;
    function pa() {
        if (jr) {
            var e = _l;
            if (e !== null)
                throw e
        }
    }
    function ya(e, t, n, l) {
        jr = !1;
        var i = e.updateQueue;
        vn = !1;
        var s = i.firstBaseUpdate
          , h = i.lastBaseUpdate
          , y = i.shared.pending;
        if (y !== null) {
            i.shared.pending = null;
            var C = y
              , L = C.next;
            C.next = null,
            h === null ? s = L : h.next = L,
            h = C;
            var U = e.alternate;
            U !== null && (U = U.updateQueue,
            y = U.lastBaseUpdate,
            y !== h && (y === null ? U.firstBaseUpdate = L : y.next = L,
            U.lastBaseUpdate = C))
        }
        if (s !== null) {
            var G = i.baseState;
            h = 0,
            U = L = C = null,
            y = s;
            do {
                var M = y.lane & -536870913
                  , D = M !== y.lane;
                if (D ? (me & M) === M : (l & M) === M) {
                    M !== 0 && M === El && (jr = !0),
                    U !== null && (U = U.next = {
                        lane: 0,
                        tag: y.tag,
                        payload: y.payload,
                        callback: null,
                        next: null
                    });
                    e: {
                        var $ = e
                          , ne = y;
                        M = t;
                        var we = n;
                        switch (ne.tag) {
                        case 1:
                            if ($ = ne.payload,
                            typeof $ == "function") {
                                G = $.call(we, G, M);
                                break e
                            }
                            G = $;
                            break e;
                        case 3:
                            $.flags = $.flags & -65537 | 128;
                        case 0:
                            if ($ = ne.payload,
                            M = typeof $ == "function" ? $.call(we, G, M) : $,
                            M == null)
                                break e;
                            G = v({}, G, M);
                            break e;
                        case 2:
                            vn = !0
                        }
                    }
                    M = y.callback,
                    M !== null && (e.flags |= 64,
                    D && (e.flags |= 8192),
                    D = i.callbacks,
                    D === null ? i.callbacks = [M] : D.push(M))
                } else
                    D = {
                        lane: M,
                        tag: y.tag,
                        payload: y.payload,
                        callback: y.callback,
                        next: null
                    },
                    U === null ? (L = U = D,
                    C = G) : U = U.next = D,
                    h |= M;
                if (y = y.next,
                y === null) {
                    if (y = i.shared.pending,
                    y === null)
                        break;
                    D = y,
                    y = D.next,
                    D.next = null,
                    i.lastBaseUpdate = D,
                    i.shared.pending = null
                }
            } while (!0);
            U === null && (C = G),
            i.baseState = C,
            i.firstBaseUpdate = L,
            i.lastBaseUpdate = U,
            s === null && (i.shared.lanes = 0),
            Tn |= h,
            e.lanes = h,
            e.memoizedState = G
        }
    }
    function pf(e, t) {
        if (typeof e != "function")
            throw Error(o(191, e));
        e.call(t)
    }
    function yf(e, t) {
        var n = e.callbacks;
        if (n !== null)
            for (e.callbacks = null,
            e = 0; e < n.length; e++)
                pf(n[e], t)
    }
    var Tl = T(null)
      , zi = T(0);
    function vf(e, t) {
        e = un,
        Z(zi, e),
        Z(Tl, t),
        un = e | t.baseLanes
    }
    function Br() {
        Z(zi, un),
        Z(Tl, Tl.current)
    }
    function qr() {
        un = zi.current,
        j(Tl),
        j(zi)
    }
    var pt = T(null)
      , Rt = null;
    function En(e) {
        var t = e.alternate;
        Z(je, je.current & 1),
        Z(pt, e),
        Rt === null && (t === null || Tl.current !== null || t.memoizedState !== null) && (Rt = e)
    }
    function Gr(e) {
        Z(je, je.current),
        Z(pt, e),
        Rt === null && (Rt = e)
    }
    function Sf(e) {
        e.tag === 22 ? (Z(je, je.current),
        Z(pt, e),
        Rt === null && (Rt = e)) : _n()
    }
    function _n() {
        Z(je, je.current),
        Z(pt, pt.current)
    }
    function yt(e) {
        j(pt),
        Rt === e && (Rt = null),
        j(je)
    }
    var je = T(0);
    function Di(e) {
        for (var t = e; t !== null; ) {
            if (t.tag === 13) {
                var n = t.memoizedState;
                if (n !== null && (n = n.dehydrated,
                n === null || ko(n) || Jo(n)))
                    return t
            } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
                if ((t.flags & 128) !== 0)
                    return t
            } else if (t.child !== null) {
                t.child.return = t,
                t = t.child;
                continue
            }
            if (t === e)
                break;
            for (; t.sibling === null; ) {
                if (t.return === null || t.return === e)
                    return null;
                t = t.return
            }
            t.sibling.return = t.return,
            t = t.sibling
        }
        return null
    }
    var Wt = 0
      , ue = null
      , Ae = null
      , Ge = null
      , Ni = !1
      , Ol = !1
      , In = !1
      , Ui = 0
      , va = 0
      , Al = null
      , Cy = 0;
    function Ne() {
        throw Error(o(321))
    }
    function Yr(e, t) {
        if (t === null)
            return !1;
        for (var n = 0; n < t.length && n < e.length; n++)
            if (!mt(e[n], t[n]))
                return !1;
        return !0
    }
    function Vr(e, t, n, l, i, s) {
        return Wt = s,
        ue = t,
        t.memoizedState = null,
        t.updateQueue = null,
        t.lanes = 0,
        N.H = e === null || e.memoizedState === null ? nd : lo,
        In = !1,
        s = n(l, i),
        In = !1,
        Ol && (s = Ef(t, n, l, i)),
        bf(e),
        s
    }
    function bf(e) {
        N.H = Ea;
        var t = Ae !== null && Ae.next !== null;
        if (Wt = 0,
        Ge = Ae = ue = null,
        Ni = !1,
        va = 0,
        Al = null,
        t)
            throw Error(o(300));
        e === null || Ye || (e = e.dependencies,
        e !== null && Ti(e) && (Ye = !0))
    }
    function Ef(e, t, n, l) {
        ue = e;
        var i = 0;
        do {
            if (Ol && (Al = null),
            va = 0,
            Ol = !1,
            25 <= i)
                throw Error(o(301));
            if (i += 1,
            Ge = Ae = null,
            e.updateQueue != null) {
                var s = e.updateQueue;
                s.lastEffect = null,
                s.events = null,
                s.stores = null,
                s.memoCache != null && (s.memoCache.index = 0)
            }
            N.H = ld,
            s = t(n, l)
        } while (Ol);
        return s
    }
    function Ty() {
        var e = N.H
          , t = e.useState()[0];
        return t = typeof t.then == "function" ? Sa(t) : t,
        e = e.useState()[0],
        (Ae !== null ? Ae.memoizedState : null) !== e && (ue.flags |= 1024),
        t
    }
    function Qr() {
        var e = Ui !== 0;
        return Ui = 0,
        e
    }
    function Xr(e, t, n) {
        t.updateQueue = e.updateQueue,
        t.flags &= -2053,
        e.lanes &= ~n
    }
    function Zr(e) {
        if (Ni) {
            for (e = e.memoizedState; e !== null; ) {
                var t = e.queue;
                t !== null && (t.pending = null),
                e = e.next
            }
            Ni = !1
        }
        Wt = 0,
        Ge = Ae = ue = null,
        Ol = !1,
        va = Ui = 0,
        Al = null
    }
    function nt() {
        var e = {
            memoizedState: null,
            baseState: null,
            baseQueue: null,
            queue: null,
            next: null
        };
        return Ge === null ? ue.memoizedState = Ge = e : Ge = Ge.next = e,
        Ge
    }
    function Be() {
        if (Ae === null) {
            var e = ue.alternate;
            e = e !== null ? e.memoizedState : null
        } else
            e = Ae.next;
        var t = Ge === null ? ue.memoizedState : Ge.next;
        if (t !== null)
            Ge = t,
            Ae = e;
        else {
            if (e === null)
                throw ue.alternate === null ? Error(o(467)) : Error(o(310));
            Ae = e,
            e = {
                memoizedState: Ae.memoizedState,
                baseState: Ae.baseState,
                baseQueue: Ae.baseQueue,
                queue: Ae.queue,
                next: null
            },
            Ge === null ? ue.memoizedState = Ge = e : Ge = Ge.next = e
        }
        return Ge
    }
    function Hi() {
        return {
            lastEffect: null,
            events: null,
            stores: null,
            memoCache: null
        }
    }
    function Sa(e) {
        var t = va;
        return va += 1,
        Al === null && (Al = []),
        e = ff(Al, e, t),
        t = ue,
        (Ge === null ? t.memoizedState : Ge.next) === null && (t = t.alternate,
        N.H = t === null || t.memoizedState === null ? nd : lo),
        e
    }
    function ji(e) {
        if (e !== null && typeof e == "object") {
            if (typeof e.then == "function")
                return Sa(e);
            if (e.$$typeof === Y)
                return Fe(e)
        }
        throw Error(o(438, String(e)))
    }
    function Kr(e) {
        var t = null
          , n = ue.updateQueue;
        if (n !== null && (t = n.memoCache),
        t == null) {
            var l = ue.alternate;
            l !== null && (l = l.updateQueue,
            l !== null && (l = l.memoCache,
            l != null && (t = {
                data: l.data.map(function(i) {
                    return i.slice()
                }),
                index: 0
            })))
        }
        if (t == null && (t = {
            data: [],
            index: 0
        }),
        n === null && (n = Hi(),
        ue.updateQueue = n),
        n.memoCache = t,
        n = t.data[t.index],
        n === void 0)
            for (n = t.data[t.index] = Array(e),
            l = 0; l < e; l++)
                n[l] = V;
        return t.index++,
        n
    }
    function It(e, t) {
        return typeof t == "function" ? t(e) : t
    }
    function Bi(e) {
        var t = Be();
        return kr(t, Ae, e)
    }
    function kr(e, t, n) {
        var l = e.queue;
        if (l === null)
            throw Error(o(311));
        l.lastRenderedReducer = n;
        var i = e.baseQueue
          , s = l.pending;
        if (s !== null) {
            if (i !== null) {
                var h = i.next;
                i.next = s.next,
                s.next = h
            }
            t.baseQueue = i = s,
            l.pending = null
        }
        if (s = e.baseState,
        i === null)
            e.memoizedState = s;
        else {
            t = i.next;
            var y = h = null
              , C = null
              , L = t
              , U = !1;
            do {
                var G = L.lane & -536870913;
                if (G !== L.lane ? (me & G) === G : (Wt & G) === G) {
                    var M = L.revertLane;
                    if (M === 0)
                        C !== null && (C = C.next = {
                            lane: 0,
                            revertLane: 0,
                            gesture: null,
                            action: L.action,
                            hasEagerState: L.hasEagerState,
                            eagerState: L.eagerState,
                            next: null
                        }),
                        G === El && (U = !0);
                    else if ((Wt & M) === M) {
                        L = L.next,
                        M === El && (U = !0);
                        continue
                    } else
                        G = {
                            lane: 0,
                            revertLane: L.revertLane,
                            gesture: null,
                            action: L.action,
                            hasEagerState: L.hasEagerState,
                            eagerState: L.eagerState,
                            next: null
                        },
                        C === null ? (y = C = G,
                        h = s) : C = C.next = G,
                        ue.lanes |= M,
                        Tn |= M;
                    G = L.action,
                    In && n(s, G),
                    s = L.hasEagerState ? L.eagerState : n(s, G)
                } else
                    M = {
                        lane: G,
                        revertLane: L.revertLane,
                        gesture: L.gesture,
                        action: L.action,
                        hasEagerState: L.hasEagerState,
                        eagerState: L.eagerState,
                        next: null
                    },
                    C === null ? (y = C = M,
                    h = s) : C = C.next = M,
                    ue.lanes |= G,
                    Tn |= G;
                L = L.next
            } while (L !== null && L !== t);
            if (C === null ? h = s : C.next = y,
            !mt(s, e.memoizedState) && (Ye = !0,
            U && (n = _l,
            n !== null)))
                throw n;
            e.memoizedState = s,
            e.baseState = h,
            e.baseQueue = C,
            l.lastRenderedState = s
        }
        return i === null && (l.lanes = 0),
        [e.memoizedState, l.dispatch]
    }
    function Jr(e) {
        var t = Be()
          , n = t.queue;
        if (n === null)
            throw Error(o(311));
        n.lastRenderedReducer = e;
        var l = n.dispatch
          , i = n.pending
          , s = t.memoizedState;
        if (i !== null) {
            n.pending = null;
            var h = i = i.next;
            do
                s = e(s, h.action),
                h = h.next;
            while (h !== i);
            mt(s, t.memoizedState) || (Ye = !0),
            t.memoizedState = s,
            t.baseQueue === null && (t.baseState = s),
            n.lastRenderedState = s
        }
        return [s, l]
    }
    function _f(e, t, n) {
        var l = ue
          , i = Be()
          , s = ye;
        if (s) {
            if (n === void 0)
                throw Error(o(407));
            n = n()
        } else
            n = t();
        var h = !mt((Ae || i).memoizedState, n);
        if (h && (i.memoizedState = n,
        Ye = !0),
        i = i.queue,
        Wr(Tf.bind(null, l, i, e), [e]),
        i.getSnapshot !== t || h || Ge !== null && Ge.memoizedState.tag & 1) {
            if (l.flags |= 2048,
            Rl(9, {
                destroy: void 0
            }, Cf.bind(null, l, i, n, t), null),
            Le === null)
                throw Error(o(349));
            s || (Wt & 127) !== 0 || xf(l, t, n)
        }
        return n
    }
    function xf(e, t, n) {
        e.flags |= 16384,
        e = {
            getSnapshot: t,
            value: n
        },
        t = ue.updateQueue,
        t === null ? (t = Hi(),
        ue.updateQueue = t,
        t.stores = [e]) : (n = t.stores,
        n === null ? t.stores = [e] : n.push(e))
    }
    function Cf(e, t, n, l) {
        t.value = n,
        t.getSnapshot = l,
        Of(t) && Af(e)
    }
    function Tf(e, t, n) {
        return n(function() {
            Of(t) && Af(e)
        })
    }
    function Of(e) {
        var t = e.getSnapshot;
        e = e.value;
        try {
            var n = t();
            return !mt(e, n)
        } catch {
            return !0
        }
    }
    function Af(e) {
        var t = Qn(e, 2);
        t !== null && st(t, e, 2)
    }
    function $r(e) {
        var t = nt();
        if (typeof e == "function") {
            var n = e;
            if (e = n(),
            In) {
                fn(!0);
                try {
                    n()
                } finally {
                    fn(!1)
                }
            }
        }
        return t.memoizedState = t.baseState = e,
        t.queue = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: It,
            lastRenderedState: e
        },
        t
    }
    function Rf(e, t, n, l) {
        return e.baseState = n,
        kr(e, Ae, typeof l == "function" ? l : It)
    }
    function Oy(e, t, n, l, i) {
        if (Yi(e))
            throw Error(o(485));
        if (e = t.action,
        e !== null) {
            var s = {
                payload: i,
                action: e,
                next: null,
                isTransition: !0,
                status: "pending",
                value: null,
                reason: null,
                listeners: [],
                then: function(h) {
                    s.listeners.push(h)
                }
            };
            N.T !== null ? n(!0) : s.isTransition = !1,
            l(s),
            n = t.pending,
            n === null ? (s.next = t.pending = s,
            wf(t, s)) : (s.next = n.next,
            t.pending = n.next = s)
        }
    }
    function wf(e, t) {
        var n = t.action
          , l = t.payload
          , i = e.state;
        if (t.isTransition) {
            var s = N.T
              , h = {};
            N.T = h;
            try {
                var y = n(i, l)
                  , C = N.S;
                C !== null && C(h, y),
                Lf(e, t, y)
            } catch (L) {
                Fr(e, t, L)
            } finally {
                s !== null && h.types !== null && (s.types = h.types),
                N.T = s
            }
        } else
            try {
                s = n(i, l),
                Lf(e, t, s)
            } catch (L) {
                Fr(e, t, L)
            }
    }
    function Lf(e, t, n) {
        n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(function(l) {
            Mf(e, t, l)
        }, function(l) {
            return Fr(e, t, l)
        }) : Mf(e, t, n)
    }
    function Mf(e, t, n) {
        t.status = "fulfilled",
        t.value = n,
        zf(t),
        e.state = n,
        t = e.pending,
        t !== null && (n = t.next,
        n === t ? e.pending = null : (n = n.next,
        t.next = n,
        wf(e, n)))
    }
    function Fr(e, t, n) {
        var l = e.pending;
        if (e.pending = null,
        l !== null) {
            l = l.next;
            do
                t.status = "rejected",
                t.reason = n,
                zf(t),
                t = t.next;
            while (t !== l)
        }
        e.action = null
    }
    function zf(e) {
        e = e.listeners;
        for (var t = 0; t < e.length; t++)
            (0,
            e[t])()
    }
    function Df(e, t) {
        return t
    }
    function Nf(e, t) {
        if (ye) {
            var n = Le.formState;
            if (n !== null) {
                e: {
                    var l = ue;
                    if (ye) {
                        if (Me) {
                            t: {
                                for (var i = Me, s = At; i.nodeType !== 8; ) {
                                    if (!s) {
                                        i = null;
                                        break t
                                    }
                                    if (i = wt(i.nextSibling),
                                    i === null) {
                                        i = null;
                                        break t
                                    }
                                }
                                s = i.data,
                                i = s === "F!" || s === "F" ? i : null
                            }
                            if (i) {
                                Me = wt(i.nextSibling),
                                l = i.data === "F!";
                                break e
                            }
                        }
                        pn(l)
                    }
                    l = !1
                }
                l && (t = n[0])
            }
        }
        return n = nt(),
        n.memoizedState = n.baseState = t,
        l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: Df,
            lastRenderedState: t
        },
        n.queue = l,
        n = Pf.bind(null, ue, l),
        l.dispatch = n,
        l = $r(!1),
        s = no.bind(null, ue, !1, l.queue),
        l = nt(),
        i = {
            state: t,
            dispatch: null,
            action: e,
            pending: null
        },
        l.queue = i,
        n = Oy.bind(null, ue, i, s, n),
        i.dispatch = n,
        l.memoizedState = e,
        [t, n, !1]
    }
    function Uf(e) {
        var t = Be();
        return Hf(t, Ae, e)
    }
    function Hf(e, t, n) {
        if (t = kr(e, t, Df)[0],
        e = Bi(It)[0],
        typeof t == "object" && t !== null && typeof t.then == "function")
            try {
                var l = Sa(t)
            } catch (h) {
                throw h === xl ? Ri : h
            }
        else
            l = t;
        t = Be();
        var i = t.queue
          , s = i.dispatch;
        return n !== t.memoizedState && (ue.flags |= 2048,
        Rl(9, {
            destroy: void 0
        }, Ay.bind(null, i, n), null)),
        [l, s, e]
    }
    function Ay(e, t) {
        e.action = t
    }
    function jf(e) {
        var t = Be()
          , n = Ae;
        if (n !== null)
            return Hf(t, n, e);
        Be(),
        t = t.memoizedState,
        n = Be();
        var l = n.queue.dispatch;
        return n.memoizedState = e,
        [t, l, !1]
    }
    function Rl(e, t, n, l) {
        return e = {
            tag: e,
            create: n,
            deps: l,
            inst: t,
            next: null
        },
        t = ue.updateQueue,
        t === null && (t = Hi(),
        ue.updateQueue = t),
        n = t.lastEffect,
        n === null ? t.lastEffect = e.next = e : (l = n.next,
        n.next = e,
        e.next = l,
        t.lastEffect = e),
        e
    }
    function Bf() {
        return Be().memoizedState
    }
    function qi(e, t, n, l) {
        var i = nt();
        ue.flags |= e,
        i.memoizedState = Rl(1 | t, {
            destroy: void 0
        }, n, l === void 0 ? null : l)
    }
    function Gi(e, t, n, l) {
        var i = Be();
        l = l === void 0 ? null : l;
        var s = i.memoizedState.inst;
        Ae !== null && l !== null && Yr(l, Ae.memoizedState.deps) ? i.memoizedState = Rl(t, s, n, l) : (ue.flags |= e,
        i.memoizedState = Rl(1 | t, s, n, l))
    }
    function qf(e, t) {
        qi(8390656, 8, e, t)
    }
    function Wr(e, t) {
        Gi(2048, 8, e, t)
    }
    function Ry(e) {
        ue.flags |= 4;
        var t = ue.updateQueue;
        if (t === null)
            t = Hi(),
            ue.updateQueue = t,
            t.events = [e];
        else {
            var n = t.events;
            n === null ? t.events = [e] : n.push(e)
        }
    }
    function Gf(e) {
        var t = Be().memoizedState;
        return Ry({
            ref: t,
            nextImpl: e
        }),
        function() {
            if ((Ee & 2) !== 0)
                throw Error(o(440));
            return t.impl.apply(void 0, arguments)
        }
    }
    function Yf(e, t) {
        return Gi(4, 2, e, t)
    }
    function Vf(e, t) {
        return Gi(4, 4, e, t)
    }
    function Qf(e, t) {
        if (typeof t == "function") {
            e = e();
            var n = t(e);
            return function() {
                typeof n == "function" ? n() : t(null)
            }
        }
        if (t != null)
            return e = e(),
            t.current = e,
            function() {
                t.current = null
            }
    }
    function Xf(e, t, n) {
        n = n != null ? n.concat([e]) : null,
        Gi(4, 4, Qf.bind(null, t, e), n)
    }
    function Ir() {}
    function Zf(e, t) {
        var n = Be();
        t = t === void 0 ? null : t;
        var l = n.memoizedState;
        return t !== null && Yr(t, l[1]) ? l[0] : (n.memoizedState = [e, t],
        e)
    }
    function Kf(e, t) {
        var n = Be();
        t = t === void 0 ? null : t;
        var l = n.memoizedState;
        if (t !== null && Yr(t, l[1]))
            return l[0];
        if (l = e(),
        In) {
            fn(!0);
            try {
                e()
            } finally {
                fn(!1)
            }
        }
        return n.memoizedState = [l, t],
        l
    }
    function Pr(e, t, n) {
        return n === void 0 || (Wt & 1073741824) !== 0 && (me & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = n,
        e = kd(),
        ue.lanes |= e,
        Tn |= e,
        n)
    }
    function kf(e, t, n, l) {
        return mt(n, t) ? n : Tl.current !== null ? (e = Pr(e, n, l),
        mt(e, t) || (Ye = !0),
        e) : (Wt & 42) === 0 || (Wt & 1073741824) !== 0 && (me & 261930) === 0 ? (Ye = !0,
        e.memoizedState = n) : (e = kd(),
        ue.lanes |= e,
        Tn |= e,
        t)
    }
    function Jf(e, t, n, l, i) {
        var s = Q.p;
        Q.p = s !== 0 && 8 > s ? s : 8;
        var h = N.T
          , y = {};
        N.T = y,
        no(e, !1, t, n);
        try {
            var C = i()
              , L = N.S;
            if (L !== null && L(y, C),
            C !== null && typeof C == "object" && typeof C.then == "function") {
                var U = xy(C, l);
                ba(e, t, U, bt(e))
            } else
                ba(e, t, l, bt(e))
        } catch (G) {
            ba(e, t, {
                then: function() {},
                status: "rejected",
                reason: G
            }, bt())
        } finally {
            Q.p = s,
            h !== null && y.types !== null && (h.types = y.types),
            N.T = h
        }
    }
    function wy() {}
    function eo(e, t, n, l) {
        if (e.tag !== 5)
            throw Error(o(476));
        var i = $f(e).queue;
        Jf(e, i, t, ee, n === null ? wy : function() {
            return Ff(e),
            n(l)
        }
        )
    }
    function $f(e) {
        var t = e.memoizedState;
        if (t !== null)
            return t;
        t = {
            memoizedState: ee,
            baseState: ee,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: It,
                lastRenderedState: ee
            },
            next: null
        };
        var n = {};
        return t.next = {
            memoizedState: n,
            baseState: n,
            baseQueue: null,
            queue: {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: It,
                lastRenderedState: n
            },
            next: null
        },
        e.memoizedState = t,
        e = e.alternate,
        e !== null && (e.memoizedState = t),
        t
    }
    function Ff(e) {
        var t = $f(e);
        t.next === null && (t = e.alternate.memoizedState),
        ba(e, t.next.queue, {}, bt())
    }
    function to() {
        return Fe(ja)
    }
    function Wf() {
        return Be().memoizedState
    }
    function If() {
        return Be().memoizedState
    }
    function Ly(e) {
        for (var t = e.return; t !== null; ) {
            switch (t.tag) {
            case 24:
            case 3:
                var n = bt();
                e = Sn(n);
                var l = bn(t, e, n);
                l !== null && (st(l, t, n),
                ga(l, t, n)),
                t = {
                    cache: Lr()
                },
                e.payload = t;
                return
            }
            t = t.return
        }
    }
    function My(e, t, n) {
        var l = bt();
        n = {
            lane: l,
            revertLane: 0,
            gesture: null,
            action: n,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        Yi(e) ? ed(t, n) : (n = Sr(e, t, n, l),
        n !== null && (st(n, e, l),
        td(n, t, l)))
    }
    function Pf(e, t, n) {
        var l = bt();
        ba(e, t, n, l)
    }
    function ba(e, t, n, l) {
        var i = {
            lane: l,
            revertLane: 0,
            gesture: null,
            action: n,
            hasEagerState: !1,
            eagerState: null,
            next: null
        };
        if (Yi(e))
            ed(t, i);
        else {
            var s = e.alternate;
            if (e.lanes === 0 && (s === null || s.lanes === 0) && (s = t.lastRenderedReducer,
            s !== null))
                try {
                    var h = t.lastRenderedState
                      , y = s(h, n);
                    if (i.hasEagerState = !0,
                    i.eagerState = y,
                    mt(y, h))
                        return Ei(e, t, i, 0),
                        Le === null && bi(),
                        !1
                } catch {}
            if (n = Sr(e, t, i, l),
            n !== null)
                return st(n, e, l),
                td(n, t, l),
                !0
        }
        return !1
    }
    function no(e, t, n, l) {
        if (l = {
            lane: 2,
            revertLane: Uo(),
            gesture: null,
            action: l,
            hasEagerState: !1,
            eagerState: null,
            next: null
        },
        Yi(e)) {
            if (t)
                throw Error(o(479))
        } else
            t = Sr(e, n, l, 2),
            t !== null && st(t, e, 2)
    }
    function Yi(e) {
        var t = e.alternate;
        return e === ue || t !== null && t === ue
    }
    function ed(e, t) {
        Ol = Ni = !0;
        var n = e.pending;
        n === null ? t.next = t : (t.next = n.next,
        n.next = t),
        e.pending = t
    }
    function td(e, t, n) {
        if ((n & 4194048) !== 0) {
            var l = t.lanes;
            l &= e.pendingLanes,
            n |= l,
            t.lanes = n,
            ic(e, n)
        }
    }
    var Ea = {
        readContext: Fe,
        use: ji,
        useCallback: Ne,
        useContext: Ne,
        useEffect: Ne,
        useImperativeHandle: Ne,
        useLayoutEffect: Ne,
        useInsertionEffect: Ne,
        useMemo: Ne,
        useReducer: Ne,
        useRef: Ne,
        useState: Ne,
        useDebugValue: Ne,
        useDeferredValue: Ne,
        useTransition: Ne,
        useSyncExternalStore: Ne,
        useId: Ne,
        useHostTransitionStatus: Ne,
        useFormState: Ne,
        useActionState: Ne,
        useOptimistic: Ne,
        useMemoCache: Ne,
        useCacheRefresh: Ne
    };
    Ea.useEffectEvent = Ne;
    var nd = {
        readContext: Fe,
        use: ji,
        useCallback: function(e, t) {
            return nt().memoizedState = [e, t === void 0 ? null : t],
            e
        },
        useContext: Fe,
        useEffect: qf,
        useImperativeHandle: function(e, t, n) {
            n = n != null ? n.concat([e]) : null,
            qi(4194308, 4, Qf.bind(null, t, e), n)
        },
        useLayoutEffect: function(e, t) {
            return qi(4194308, 4, e, t)
        },
        useInsertionEffect: function(e, t) {
            qi(4, 2, e, t)
        },
        useMemo: function(e, t) {
            var n = nt();
            t = t === void 0 ? null : t;
            var l = e();
            if (In) {
                fn(!0);
                try {
                    e()
                } finally {
                    fn(!1)
                }
            }
            return n.memoizedState = [l, t],
            l
        },
        useReducer: function(e, t, n) {
            var l = nt();
            if (n !== void 0) {
                var i = n(t);
                if (In) {
                    fn(!0);
                    try {
                        n(t)
                    } finally {
                        fn(!1)
                    }
                }
            } else
                i = t;
            return l.memoizedState = l.baseState = i,
            e = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: e,
                lastRenderedState: i
            },
            l.queue = e,
            e = e.dispatch = My.bind(null, ue, e),
            [l.memoizedState, e]
        },
        useRef: function(e) {
            var t = nt();
            return e = {
                current: e
            },
            t.memoizedState = e
        },
        useState: function(e) {
            e = $r(e);
            var t = e.queue
              , n = Pf.bind(null, ue, t);
            return t.dispatch = n,
            [e.memoizedState, n]
        },
        useDebugValue: Ir,
        useDeferredValue: function(e, t) {
            var n = nt();
            return Pr(n, e, t)
        },
        useTransition: function() {
            var e = $r(!1);
            return e = Jf.bind(null, ue, e.queue, !0, !1),
            nt().memoizedState = e,
            [!1, e]
        },
        useSyncExternalStore: function(e, t, n) {
            var l = ue
              , i = nt();
            if (ye) {
                if (n === void 0)
                    throw Error(o(407));
                n = n()
            } else {
                if (n = t(),
                Le === null)
                    throw Error(o(349));
                (me & 127) !== 0 || xf(l, t, n)
            }
            i.memoizedState = n;
            var s = {
                value: n,
                getSnapshot: t
            };
            return i.queue = s,
            qf(Tf.bind(null, l, s, e), [e]),
            l.flags |= 2048,
            Rl(9, {
                destroy: void 0
            }, Cf.bind(null, l, s, n, t), null),
            n
        },
        useId: function() {
            var e = nt()
              , t = Le.identifierPrefix;
            if (ye) {
                var n = jt
                  , l = Ht;
                n = (l & ~(1 << 32 - ht(l) - 1)).toString(32) + n,
                t = "_" + t + "R_" + n,
                n = Ui++,
                0 < n && (t += "H" + n.toString(32)),
                t += "_"
            } else
                n = Cy++,
                t = "_" + t + "r_" + n.toString(32) + "_";
            return e.memoizedState = t
        },
        useHostTransitionStatus: to,
        useFormState: Nf,
        useActionState: Nf,
        useOptimistic: function(e) {
            var t = nt();
            t.memoizedState = t.baseState = e;
            var n = {
                pending: null,
                lanes: 0,
                dispatch: null,
                lastRenderedReducer: null,
                lastRenderedState: null
            };
            return t.queue = n,
            t = no.bind(null, ue, !0, n),
            n.dispatch = t,
            [e, t]
        },
        useMemoCache: Kr,
        useCacheRefresh: function() {
            return nt().memoizedState = Ly.bind(null, ue)
        },
        useEffectEvent: function(e) {
            var t = nt()
              , n = {
                impl: e
            };
            return t.memoizedState = n,
            function() {
                if ((Ee & 2) !== 0)
                    throw Error(o(440));
                return n.impl.apply(void 0, arguments)
            }
        }
    }
      , lo = {
        readContext: Fe,
        use: ji,
        useCallback: Zf,
        useContext: Fe,
        useEffect: Wr,
        useImperativeHandle: Xf,
        useInsertionEffect: Yf,
        useLayoutEffect: Vf,
        useMemo: Kf,
        useReducer: Bi,
        useRef: Bf,
        useState: function() {
            return Bi(It)
        },
        useDebugValue: Ir,
        useDeferredValue: function(e, t) {
            var n = Be();
            return kf(n, Ae.memoizedState, e, t)
        },
        useTransition: function() {
            var e = Bi(It)[0]
              , t = Be().memoizedState;
            return [typeof e == "boolean" ? e : Sa(e), t]
        },
        useSyncExternalStore: _f,
        useId: Wf,
        useHostTransitionStatus: to,
        useFormState: Uf,
        useActionState: Uf,
        useOptimistic: function(e, t) {
            var n = Be();
            return Rf(n, Ae, e, t)
        },
        useMemoCache: Kr,
        useCacheRefresh: If
    };
    lo.useEffectEvent = Gf;
    var ld = {
        readContext: Fe,
        use: ji,
        useCallback: Zf,
        useContext: Fe,
        useEffect: Wr,
        useImperativeHandle: Xf,
        useInsertionEffect: Yf,
        useLayoutEffect: Vf,
        useMemo: Kf,
        useReducer: Jr,
        useRef: Bf,
        useState: function() {
            return Jr(It)
        },
        useDebugValue: Ir,
        useDeferredValue: function(e, t) {
            var n = Be();
            return Ae === null ? Pr(n, e, t) : kf(n, Ae.memoizedState, e, t)
        },
        useTransition: function() {
            var e = Jr(It)[0]
              , t = Be().memoizedState;
            return [typeof e == "boolean" ? e : Sa(e), t]
        },
        useSyncExternalStore: _f,
        useId: Wf,
        useHostTransitionStatus: to,
        useFormState: jf,
        useActionState: jf,
        useOptimistic: function(e, t) {
            var n = Be();
            return Ae !== null ? Rf(n, Ae, e, t) : (n.baseState = e,
            [e, n.queue.dispatch])
        },
        useMemoCache: Kr,
        useCacheRefresh: If
    };
    ld.useEffectEvent = Gf;
    function ao(e, t, n, l) {
        t = e.memoizedState,
        n = n(l, t),
        n = n == null ? t : v({}, t, n),
        e.memoizedState = n,
        e.lanes === 0 && (e.updateQueue.baseState = n)
    }
    var io = {
        enqueueSetState: function(e, t, n) {
            e = e._reactInternals;
            var l = bt()
              , i = Sn(l);
            i.payload = t,
            n != null && (i.callback = n),
            t = bn(e, i, l),
            t !== null && (st(t, e, l),
            ga(t, e, l))
        },
        enqueueReplaceState: function(e, t, n) {
            e = e._reactInternals;
            var l = bt()
              , i = Sn(l);
            i.tag = 1,
            i.payload = t,
            n != null && (i.callback = n),
            t = bn(e, i, l),
            t !== null && (st(t, e, l),
            ga(t, e, l))
        },
        enqueueForceUpdate: function(e, t) {
            e = e._reactInternals;
            var n = bt()
              , l = Sn(n);
            l.tag = 2,
            t != null && (l.callback = t),
            t = bn(e, l, n),
            t !== null && (st(t, e, n),
            ga(t, e, n))
        }
    };
    function ad(e, t, n, l, i, s, h) {
        return e = e.stateNode,
        typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(l, s, h) : t.prototype && t.prototype.isPureReactComponent ? !ra(n, l) || !ra(i, s) : !0
    }
    function id(e, t, n, l) {
        e = t.state,
        typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, l),
        typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, l),
        t.state !== e && io.enqueueReplaceState(t, t.state, null)
    }
    function Pn(e, t) {
        var n = t;
        if ("ref"in t) {
            n = {};
            for (var l in t)
                l !== "ref" && (n[l] = t[l])
        }
        if (e = e.defaultProps) {
            n === t && (n = v({}, n));
            for (var i in e)
                n[i] === void 0 && (n[i] = e[i])
        }
        return n
    }
    function ud(e) {
        Si(e)
    }
    function rd(e) {
        console.error(e)
    }
    function od(e) {
        Si(e)
    }
    function Vi(e, t) {
        try {
            var n = e.onUncaughtError;
            n(t.value, {
                componentStack: t.stack
            })
        } catch (l) {
            setTimeout(function() {
                throw l
            })
        }
    }
    function sd(e, t, n) {
        try {
            var l = e.onCaughtError;
            l(n.value, {
                componentStack: n.stack,
                errorBoundary: t.tag === 1 ? t.stateNode : null
            })
        } catch (i) {
            setTimeout(function() {
                throw i
            })
        }
    }
    function uo(e, t, n) {
        return n = Sn(n),
        n.tag = 3,
        n.payload = {
            element: null
        },
        n.callback = function() {
            Vi(e, t)
        }
        ,
        n
    }
    function cd(e) {
        return e = Sn(e),
        e.tag = 3,
        e
    }
    function fd(e, t, n, l) {
        var i = n.type.getDerivedStateFromError;
        if (typeof i == "function") {
            var s = l.value;
            e.payload = function() {
                return i(s)
            }
            ,
            e.callback = function() {
                sd(t, n, l)
            }
        }
        var h = n.stateNode;
        h !== null && typeof h.componentDidCatch == "function" && (e.callback = function() {
            sd(t, n, l),
            typeof i != "function" && (On === null ? On = new Set([this]) : On.add(this));
            var y = l.stack;
            this.componentDidCatch(l.value, {
                componentStack: y !== null ? y : ""
            })
        }
        )
    }
    function zy(e, t, n, l, i) {
        if (n.flags |= 32768,
        l !== null && typeof l == "object" && typeof l.then == "function") {
            if (t = n.alternate,
            t !== null && bl(t, n, i, !0),
            n = pt.current,
            n !== null) {
                switch (n.tag) {
                case 31:
                case 13:
                    return Rt === null ? eu() : n.alternate === null && Ue === 0 && (Ue = 3),
                    n.flags &= -257,
                    n.flags |= 65536,
                    n.lanes = i,
                    l === wi ? n.flags |= 16384 : (t = n.updateQueue,
                    t === null ? n.updateQueue = new Set([l]) : t.add(l),
                    zo(e, l, i)),
                    !1;
                case 22:
                    return n.flags |= 65536,
                    l === wi ? n.flags |= 16384 : (t = n.updateQueue,
                    t === null ? (t = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([l])
                    },
                    n.updateQueue = t) : (n = t.retryQueue,
                    n === null ? t.retryQueue = new Set([l]) : n.add(l)),
                    zo(e, l, i)),
                    !1
                }
                throw Error(o(435, n.tag))
            }
            return zo(e, l, i),
            eu(),
            !1
        }
        if (ye)
            return t = pt.current,
            t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            t.flags |= 65536,
            t.lanes = i,
            l !== Tr && (e = Error(o(422), {
                cause: l
            }),
            ca(Ct(e, n)))) : (l !== Tr && (t = Error(o(423), {
                cause: l
            }),
            ca(Ct(t, n))),
            e = e.current.alternate,
            e.flags |= 65536,
            i &= -i,
            e.lanes |= i,
            l = Ct(l, n),
            i = uo(e.stateNode, l, i),
            Hr(e, i),
            Ue !== 4 && (Ue = 2)),
            !1;
        var s = Error(o(520), {
            cause: l
        });
        if (s = Ct(s, n),
        wa === null ? wa = [s] : wa.push(s),
        Ue !== 4 && (Ue = 2),
        t === null)
            return !0;
        l = Ct(l, n),
        n = t;
        do {
            switch (n.tag) {
            case 3:
                return n.flags |= 65536,
                e = i & -i,
                n.lanes |= e,
                e = uo(n.stateNode, l, e),
                Hr(n, e),
                !1;
            case 1:
                if (t = n.type,
                s = n.stateNode,
                (n.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (On === null || !On.has(s))))
                    return n.flags |= 65536,
                    i &= -i,
                    n.lanes |= i,
                    i = cd(i),
                    fd(i, e, n, l),
                    Hr(n, i),
                    !1
            }
            n = n.return
        } while (n !== null);
        return !1
    }
    var ro = Error(o(461))
      , Ye = !1;
    function We(e, t, n, l) {
        t.child = e === null ? gf(t, null, n, l) : Wn(t, e.child, n, l)
    }
    function dd(e, t, n, l, i) {
        n = n.render;
        var s = t.ref;
        if ("ref"in l) {
            var h = {};
            for (var y in l)
                y !== "ref" && (h[y] = l[y])
        } else
            h = l;
        return kn(t),
        l = Vr(e, t, n, h, s, i),
        y = Qr(),
        e !== null && !Ye ? (Xr(e, t, i),
        Pt(e, t, i)) : (ye && y && xr(t),
        t.flags |= 1,
        We(e, t, l, i),
        t.child)
    }
    function hd(e, t, n, l, i) {
        if (e === null) {
            var s = n.type;
            return typeof s == "function" && !br(s) && s.defaultProps === void 0 && n.compare === null ? (t.tag = 15,
            t.type = s,
            md(e, t, s, l, i)) : (e = xi(n.type, null, l, t, t.mode, i),
            e.ref = t.ref,
            e.return = t,
            t.child = e)
        }
        if (s = e.child,
        !po(e, i)) {
            var h = s.memoizedProps;
            if (n = n.compare,
            n = n !== null ? n : ra,
            n(h, l) && e.ref === t.ref)
                return Pt(e, t, i)
        }
        return t.flags |= 1,
        e = kt(s, l),
        e.ref = t.ref,
        e.return = t,
        t.child = e
    }
    function md(e, t, n, l, i) {
        if (e !== null) {
            var s = e.memoizedProps;
            if (ra(s, l) && e.ref === t.ref)
                if (Ye = !1,
                t.pendingProps = l = s,
                po(e, i))
                    (e.flags & 131072) !== 0 && (Ye = !0);
                else
                    return t.lanes = e.lanes,
                    Pt(e, t, i)
        }
        return oo(e, t, n, l, i)
    }
    function gd(e, t, n, l) {
        var i = l.children
          , s = e !== null ? e.memoizedState : null;
        if (e === null && t.stateNode === null && (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null
        }),
        l.mode === "hidden") {
            if ((t.flags & 128) !== 0) {
                if (s = s !== null ? s.baseLanes | n : n,
                e !== null) {
                    for (l = t.child = e.child,
                    i = 0; l !== null; )
                        i = i | l.lanes | l.childLanes,
                        l = l.sibling;
                    l = i & ~s
                } else
                    l = 0,
                    t.child = null;
                return pd(e, t, s, n, l)
            }
            if ((n & 536870912) !== 0)
                t.memoizedState = {
                    baseLanes: 0,
                    cachePool: null
                },
                e !== null && Ai(t, s !== null ? s.cachePool : null),
                s !== null ? vf(t, s) : Br(),
                Sf(t);
            else
                return l = t.lanes = 536870912,
                pd(e, t, s !== null ? s.baseLanes | n : n, n, l)
        } else
            s !== null ? (Ai(t, s.cachePool),
            vf(t, s),
            _n(),
            t.memoizedState = null) : (e !== null && Ai(t, null),
            Br(),
            _n());
        return We(e, t, i, n),
        t.child
    }
    function _a(e, t) {
        return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
            _visibility: 1,
            _pendingMarkers: null,
            _retryCache: null,
            _transitions: null
        }),
        t.sibling
    }
    function pd(e, t, n, l, i) {
        var s = zr();
        return s = s === null ? null : {
            parent: qe._currentValue,
            pool: s
        },
        t.memoizedState = {
            baseLanes: n,
            cachePool: s
        },
        e !== null && Ai(t, null),
        Br(),
        Sf(t),
        e !== null && bl(e, t, l, !0),
        t.childLanes = i,
        null
    }
    function Qi(e, t) {
        return t = Zi({
            mode: t.mode,
            children: t.children
        }, e.mode),
        t.ref = e.ref,
        e.child = t,
        t.return = e,
        t
    }
    function yd(e, t, n) {
        return Wn(t, e.child, null, n),
        e = Qi(t, t.pendingProps),
        e.flags |= 2,
        yt(t),
        t.memoizedState = null,
        e
    }
    function Dy(e, t, n) {
        var l = t.pendingProps
          , i = (t.flags & 128) !== 0;
        if (t.flags &= -129,
        e === null) {
            if (ye) {
                if (l.mode === "hidden")
                    return e = Qi(t, l),
                    t.lanes = 536870912,
                    _a(null, e);
                if (Gr(t),
                (e = Me) ? (e = wh(e, At),
                e = e !== null && e.data === "&" ? e : null,
                e !== null && (t.memoizedState = {
                    dehydrated: e,
                    treeContext: mn !== null ? {
                        id: Ht,
                        overflow: jt
                    } : null,
                    retryLane: 536870912,
                    hydrationErrors: null
                },
                n = Pc(e),
                n.return = t,
                t.child = n,
                $e = t,
                Me = null)) : e = null,
                e === null)
                    throw pn(t);
                return t.lanes = 536870912,
                null
            }
            return Qi(t, l)
        }
        var s = e.memoizedState;
        if (s !== null) {
            var h = s.dehydrated;
            if (Gr(t),
            i)
                if (t.flags & 256)
                    t.flags &= -257,
                    t = yd(e, t, n);
                else if (t.memoizedState !== null)
                    t.child = e.child,
                    t.flags |= 128,
                    t = null;
                else
                    throw Error(o(558));
            else if (Ye || bl(e, t, n, !1),
            i = (n & e.childLanes) !== 0,
            Ye || i) {
                if (l = Le,
                l !== null && (h = uc(l, n),
                h !== 0 && h !== s.retryLane))
                    throw s.retryLane = h,
                    Qn(e, h),
                    st(l, e, h),
                    ro;
                eu(),
                t = yd(e, t, n)
            } else
                e = s.treeContext,
                Me = wt(h.nextSibling),
                $e = t,
                ye = !0,
                gn = null,
                At = !1,
                e !== null && nf(t, e),
                t = Qi(t, l),
                t.flags |= 4096;
            return t
        }
        return e = kt(e.child, {
            mode: l.mode,
            children: l.children
        }),
        e.ref = t.ref,
        t.child = e,
        e.return = t,
        e
    }
    function Xi(e, t) {
        var n = t.ref;
        if (n === null)
            e !== null && e.ref !== null && (t.flags |= 4194816);
        else {
            if (typeof n != "function" && typeof n != "object")
                throw Error(o(284));
            (e === null || e.ref !== n) && (t.flags |= 4194816)
        }
    }
    function oo(e, t, n, l, i) {
        return kn(t),
        n = Vr(e, t, n, l, void 0, i),
        l = Qr(),
        e !== null && !Ye ? (Xr(e, t, i),
        Pt(e, t, i)) : (ye && l && xr(t),
        t.flags |= 1,
        We(e, t, n, i),
        t.child)
    }
    function vd(e, t, n, l, i, s) {
        return kn(t),
        t.updateQueue = null,
        n = Ef(t, l, n, i),
        bf(e),
        l = Qr(),
        e !== null && !Ye ? (Xr(e, t, s),
        Pt(e, t, s)) : (ye && l && xr(t),
        t.flags |= 1,
        We(e, t, n, s),
        t.child)
    }
    function Sd(e, t, n, l, i) {
        if (kn(t),
        t.stateNode === null) {
            var s = pl
              , h = n.contextType;
            typeof h == "object" && h !== null && (s = Fe(h)),
            s = new n(l,s),
            t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null,
            s.updater = io,
            t.stateNode = s,
            s._reactInternals = t,
            s = t.stateNode,
            s.props = l,
            s.state = t.memoizedState,
            s.refs = {},
            Nr(t),
            h = n.contextType,
            s.context = typeof h == "object" && h !== null ? Fe(h) : pl,
            s.state = t.memoizedState,
            h = n.getDerivedStateFromProps,
            typeof h == "function" && (ao(t, n, h, l),
            s.state = t.memoizedState),
            typeof n.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (h = s.state,
            typeof s.componentWillMount == "function" && s.componentWillMount(),
            typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(),
            h !== s.state && io.enqueueReplaceState(s, s.state, null),
            ya(t, l, s, i),
            pa(),
            s.state = t.memoizedState),
            typeof s.componentDidMount == "function" && (t.flags |= 4194308),
            l = !0
        } else if (e === null) {
            s = t.stateNode;
            var y = t.memoizedProps
              , C = Pn(n, y);
            s.props = C;
            var L = s.context
              , U = n.contextType;
            h = pl,
            typeof U == "object" && U !== null && (h = Fe(U));
            var G = n.getDerivedStateFromProps;
            U = typeof G == "function" || typeof s.getSnapshotBeforeUpdate == "function",
            y = t.pendingProps !== y,
            U || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (y || L !== h) && id(t, s, l, h),
            vn = !1;
            var M = t.memoizedState;
            s.state = M,
            ya(t, l, s, i),
            pa(),
            L = t.memoizedState,
            y || M !== L || vn ? (typeof G == "function" && (ao(t, n, G, l),
            L = t.memoizedState),
            (C = vn || ad(t, n, C, l, M, L, h)) ? (U || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(),
            typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()),
            typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
            t.memoizedProps = l,
            t.memoizedState = L),
            s.props = l,
            s.state = L,
            s.context = h,
            l = C) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308),
            l = !1)
        } else {
            s = t.stateNode,
            Ur(e, t),
            h = t.memoizedProps,
            U = Pn(n, h),
            s.props = U,
            G = t.pendingProps,
            M = s.context,
            L = n.contextType,
            C = pl,
            typeof L == "object" && L !== null && (C = Fe(L)),
            y = n.getDerivedStateFromProps,
            (L = typeof y == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (h !== G || M !== C) && id(t, s, l, C),
            vn = !1,
            M = t.memoizedState,
            s.state = M,
            ya(t, l, s, i),
            pa();
            var D = t.memoizedState;
            h !== G || M !== D || vn || e !== null && e.dependencies !== null && Ti(e.dependencies) ? (typeof y == "function" && (ao(t, n, y, l),
            D = t.memoizedState),
            (U = vn || ad(t, n, U, l, M, D, C) || e !== null && e.dependencies !== null && Ti(e.dependencies)) ? (L || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(l, D, C),
            typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(l, D, C)),
            typeof s.componentDidUpdate == "function" && (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || h === e.memoizedProps && M === e.memoizedState || (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate != "function" || h === e.memoizedProps && M === e.memoizedState || (t.flags |= 1024),
            t.memoizedProps = l,
            t.memoizedState = D),
            s.props = l,
            s.state = D,
            s.context = C,
            l = U) : (typeof s.componentDidUpdate != "function" || h === e.memoizedProps && M === e.memoizedState || (t.flags |= 4),
            typeof s.getSnapshotBeforeUpdate != "function" || h === e.memoizedProps && M === e.memoizedState || (t.flags |= 1024),
            l = !1)
        }
        return s = l,
        Xi(e, t),
        l = (t.flags & 128) !== 0,
        s || l ? (s = t.stateNode,
        n = l && typeof n.getDerivedStateFromError != "function" ? null : s.render(),
        t.flags |= 1,
        e !== null && l ? (t.child = Wn(t, e.child, null, i),
        t.child = Wn(t, null, n, i)) : We(e, t, n, i),
        t.memoizedState = s.state,
        e = t.child) : e = Pt(e, t, i),
        e
    }
    function bd(e, t, n, l) {
        return Zn(),
        t.flags |= 256,
        We(e, t, n, l),
        t.child
    }
    var so = {
        dehydrated: null,
        treeContext: null,
        retryLane: 0,
        hydrationErrors: null
    };
    function co(e) {
        return {
            baseLanes: e,
            cachePool: sf()
        }
    }
    function fo(e, t, n) {
        return e = e !== null ? e.childLanes & ~n : 0,
        t && (e |= St),
        e
    }
    function Ed(e, t, n) {
        var l = t.pendingProps, i = !1, s = (t.flags & 128) !== 0, h;
        if ((h = s) || (h = e !== null && e.memoizedState === null ? !1 : (je.current & 2) !== 0),
        h && (i = !0,
        t.flags &= -129),
        h = (t.flags & 32) !== 0,
        t.flags &= -33,
        e === null) {
            if (ye) {
                if (i ? En(t) : _n(),
                (e = Me) ? (e = wh(e, At),
                e = e !== null && e.data !== "&" ? e : null,
                e !== null && (t.memoizedState = {
                    dehydrated: e,
                    treeContext: mn !== null ? {
                        id: Ht,
                        overflow: jt
                    } : null,
                    retryLane: 536870912,
                    hydrationErrors: null
                },
                n = Pc(e),
                n.return = t,
                t.child = n,
                $e = t,
                Me = null)) : e = null,
                e === null)
                    throw pn(t);
                return Jo(e) ? t.lanes = 32 : t.lanes = 536870912,
                null
            }
            var y = l.children;
            return l = l.fallback,
            i ? (_n(),
            i = t.mode,
            y = Zi({
                mode: "hidden",
                children: y
            }, i),
            l = Xn(l, i, n, null),
            y.return = t,
            l.return = t,
            y.sibling = l,
            t.child = y,
            l = t.child,
            l.memoizedState = co(n),
            l.childLanes = fo(e, h, n),
            t.memoizedState = so,
            _a(null, l)) : (En(t),
            ho(t, y))
        }
        var C = e.memoizedState;
        if (C !== null && (y = C.dehydrated,
        y !== null)) {
            if (s)
                t.flags & 256 ? (En(t),
                t.flags &= -257,
                t = mo(e, t, n)) : t.memoizedState !== null ? (_n(),
                t.child = e.child,
                t.flags |= 128,
                t = null) : (_n(),
                y = l.fallback,
                i = t.mode,
                l = Zi({
                    mode: "visible",
                    children: l.children
                }, i),
                y = Xn(y, i, n, null),
                y.flags |= 2,
                l.return = t,
                y.return = t,
                l.sibling = y,
                t.child = l,
                Wn(t, e.child, null, n),
                l = t.child,
                l.memoizedState = co(n),
                l.childLanes = fo(e, h, n),
                t.memoizedState = so,
                t = _a(null, l));
            else if (En(t),
            Jo(y)) {
                if (h = y.nextSibling && y.nextSibling.dataset,
                h)
                    var L = h.dgst;
                h = L,
                l = Error(o(419)),
                l.stack = "",
                l.digest = h,
                ca({
                    value: l,
                    source: null,
                    stack: null
                }),
                t = mo(e, t, n)
            } else if (Ye || bl(e, t, n, !1),
            h = (n & e.childLanes) !== 0,
            Ye || h) {
                if (h = Le,
                h !== null && (l = uc(h, n),
                l !== 0 && l !== C.retryLane))
                    throw C.retryLane = l,
                    Qn(e, l),
                    st(h, e, l),
                    ro;
                ko(y) || eu(),
                t = mo(e, t, n)
            } else
                ko(y) ? (t.flags |= 192,
                t.child = e.child,
                t = null) : (e = C.treeContext,
                Me = wt(y.nextSibling),
                $e = t,
                ye = !0,
                gn = null,
                At = !1,
                e !== null && nf(t, e),
                t = ho(t, l.children),
                t.flags |= 4096);
            return t
        }
        return i ? (_n(),
        y = l.fallback,
        i = t.mode,
        C = e.child,
        L = C.sibling,
        l = kt(C, {
            mode: "hidden",
            children: l.children
        }),
        l.subtreeFlags = C.subtreeFlags & 65011712,
        L !== null ? y = kt(L, y) : (y = Xn(y, i, n, null),
        y.flags |= 2),
        y.return = t,
        l.return = t,
        l.sibling = y,
        t.child = l,
        _a(null, l),
        l = t.child,
        y = e.child.memoizedState,
        y === null ? y = co(n) : (i = y.cachePool,
        i !== null ? (C = qe._currentValue,
        i = i.parent !== C ? {
            parent: C,
            pool: C
        } : i) : i = sf(),
        y = {
            baseLanes: y.baseLanes | n,
            cachePool: i
        }),
        l.memoizedState = y,
        l.childLanes = fo(e, h, n),
        t.memoizedState = so,
        _a(e.child, l)) : (En(t),
        n = e.child,
        e = n.sibling,
        n = kt(n, {
            mode: "visible",
            children: l.children
        }),
        n.return = t,
        n.sibling = null,
        e !== null && (h = t.deletions,
        h === null ? (t.deletions = [e],
        t.flags |= 16) : h.push(e)),
        t.child = n,
        t.memoizedState = null,
        n)
    }
    function ho(e, t) {
        return t = Zi({
            mode: "visible",
            children: t
        }, e.mode),
        t.return = e,
        e.child = t
    }
    function Zi(e, t) {
        return e = gt(22, e, null, t),
        e.lanes = 0,
        e
    }
    function mo(e, t, n) {
        return Wn(t, e.child, null, n),
        e = ho(t, t.pendingProps.children),
        e.flags |= 2,
        t.memoizedState = null,
        e
    }
    function _d(e, t, n) {
        e.lanes |= t;
        var l = e.alternate;
        l !== null && (l.lanes |= t),
        Rr(e.return, t, n)
    }
    function go(e, t, n, l, i, s) {
        var h = e.memoizedState;
        h === null ? e.memoizedState = {
            isBackwards: t,
            rendering: null,
            renderingStartTime: 0,
            last: l,
            tail: n,
            tailMode: i,
            treeForkCount: s
        } : (h.isBackwards = t,
        h.rendering = null,
        h.renderingStartTime = 0,
        h.last = l,
        h.tail = n,
        h.tailMode = i,
        h.treeForkCount = s)
    }
    function xd(e, t, n) {
        var l = t.pendingProps
          , i = l.revealOrder
          , s = l.tail;
        l = l.children;
        var h = je.current
          , y = (h & 2) !== 0;
        if (y ? (h = h & 1 | 2,
        t.flags |= 128) : h &= 1,
        Z(je, h),
        We(e, t, l, n),
        l = ye ? sa : 0,
        !y && e !== null && (e.flags & 128) !== 0)
            e: for (e = t.child; e !== null; ) {
                if (e.tag === 13)
                    e.memoizedState !== null && _d(e, n, t);
                else if (e.tag === 19)
                    _d(e, n, t);
                else if (e.child !== null) {
                    e.child.return = e,
                    e = e.child;
                    continue
                }
                if (e === t)
                    break e;
                for (; e.sibling === null; ) {
                    if (e.return === null || e.return === t)
                        break e;
                    e = e.return
                }
                e.sibling.return = e.return,
                e = e.sibling
            }
        switch (i) {
        case "forwards":
            for (n = t.child,
            i = null; n !== null; )
                e = n.alternate,
                e !== null && Di(e) === null && (i = n),
                n = n.sibling;
            n = i,
            n === null ? (i = t.child,
            t.child = null) : (i = n.sibling,
            n.sibling = null),
            go(t, !1, i, n, s, l);
            break;
        case "backwards":
        case "unstable_legacy-backwards":
            for (n = null,
            i = t.child,
            t.child = null; i !== null; ) {
                if (e = i.alternate,
                e !== null && Di(e) === null) {
                    t.child = i;
                    break
                }
                e = i.sibling,
                i.sibling = n,
                n = i,
                i = e
            }
            go(t, !0, n, null, s, l);
            break;
        case "together":
            go(t, !1, null, null, void 0, l);
            break;
        default:
            t.memoizedState = null
        }
        return t.child
    }
    function Pt(e, t, n) {
        if (e !== null && (t.dependencies = e.dependencies),
        Tn |= t.lanes,
        (n & t.childLanes) === 0)
            if (e !== null) {
                if (bl(e, t, n, !1),
                (n & t.childLanes) === 0)
                    return null
            } else
                return null;
        if (e !== null && t.child !== e.child)
            throw Error(o(153));
        if (t.child !== null) {
            for (e = t.child,
            n = kt(e, e.pendingProps),
            t.child = n,
            n.return = t; e.sibling !== null; )
                e = e.sibling,
                n = n.sibling = kt(e, e.pendingProps),
                n.return = t;
            n.sibling = null
        }
        return t.child
    }
    function po(e, t) {
        return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies,
        !!(e !== null && Ti(e)))
    }
    function Ny(e, t, n) {
        switch (t.tag) {
        case 3:
            tt(t, t.stateNode.containerInfo),
            yn(t, qe, e.memoizedState.cache),
            Zn();
            break;
        case 27:
        case 5:
            Jl(t);
            break;
        case 4:
            tt(t, t.stateNode.containerInfo);
            break;
        case 10:
            yn(t, t.type, t.memoizedProps.value);
            break;
        case 31:
            if (t.memoizedState !== null)
                return t.flags |= 128,
                Gr(t),
                null;
            break;
        case 13:
            var l = t.memoizedState;
            if (l !== null)
                return l.dehydrated !== null ? (En(t),
                t.flags |= 128,
                null) : (n & t.child.childLanes) !== 0 ? Ed(e, t, n) : (En(t),
                e = Pt(e, t, n),
                e !== null ? e.sibling : null);
            En(t);
            break;
        case 19:
            var i = (e.flags & 128) !== 0;
            if (l = (n & t.childLanes) !== 0,
            l || (bl(e, t, n, !1),
            l = (n & t.childLanes) !== 0),
            i) {
                if (l)
                    return xd(e, t, n);
                t.flags |= 128
            }
            if (i = t.memoizedState,
            i !== null && (i.rendering = null,
            i.tail = null,
            i.lastEffect = null),
            Z(je, je.current),
            l)
                break;
            return null;
        case 22:
            return t.lanes = 0,
            gd(e, t, n, t.pendingProps);
        case 24:
            yn(t, qe, e.memoizedState.cache)
        }
        return Pt(e, t, n)
    }
    function Cd(e, t, n) {
        if (e !== null)
            if (e.memoizedProps !== t.pendingProps)
                Ye = !0;
            else {
                if (!po(e, n) && (t.flags & 128) === 0)
                    return Ye = !1,
                    Ny(e, t, n);
                Ye = (e.flags & 131072) !== 0
            }
        else
            Ye = !1,
            ye && (t.flags & 1048576) !== 0 && tf(t, sa, t.index);
        switch (t.lanes = 0,
        t.tag) {
        case 16:
            e: {
                var l = t.pendingProps;
                if (e = $n(t.elementType),
                t.type = e,
                typeof e == "function")
                    br(e) ? (l = Pn(e, l),
                    t.tag = 1,
                    t = Sd(null, t, e, l, n)) : (t.tag = 0,
                    t = oo(null, t, e, l, n));
                else {
                    if (e != null) {
                        var i = e.$$typeof;
                        if (i === k) {
                            t.tag = 11,
                            t = dd(null, t, e, l, n);
                            break e
                        } else if (i === W) {
                            t.tag = 14,
                            t = hd(null, t, e, l, n);
                            break e
                        }
                    }
                    throw t = oe(e) || e,
                    Error(o(306, t, ""))
                }
            }
            return t;
        case 0:
            return oo(e, t, t.type, t.pendingProps, n);
        case 1:
            return l = t.type,
            i = Pn(l, t.pendingProps),
            Sd(e, t, l, i, n);
        case 3:
            e: {
                if (tt(t, t.stateNode.containerInfo),
                e === null)
                    throw Error(o(387));
                l = t.pendingProps;
                var s = t.memoizedState;
                i = s.element,
                Ur(e, t),
                ya(t, l, null, n);
                var h = t.memoizedState;
                if (l = h.cache,
                yn(t, qe, l),
                l !== s.cache && wr(t, [qe], n, !0),
                pa(),
                l = h.element,
                s.isDehydrated)
                    if (s = {
                        element: l,
                        isDehydrated: !1,
                        cache: h.cache
                    },
                    t.updateQueue.baseState = s,
                    t.memoizedState = s,
                    t.flags & 256) {
                        t = bd(e, t, l, n);
                        break e
                    } else if (l !== i) {
                        i = Ct(Error(o(424)), t),
                        ca(i),
                        t = bd(e, t, l, n);
                        break e
                    } else
                        for (e = t.stateNode.containerInfo,
                        e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e,
                        Me = wt(e.firstChild),
                        $e = t,
                        ye = !0,
                        gn = null,
                        At = !0,
                        n = gf(t, null, l, n),
                        t.child = n; n; )
                            n.flags = n.flags & -3 | 4096,
                            n = n.sibling;
                else {
                    if (Zn(),
                    l === i) {
                        t = Pt(e, t, n);
                        break e
                    }
                    We(e, t, l, n)
                }
                t = t.child
            }
            return t;
        case 26:
            return Xi(e, t),
            e === null ? (n = Uh(t.type, null, t.pendingProps, null)) ? t.memoizedState = n : ye || (n = t.type,
            e = t.pendingProps,
            l = ru(fe.current).createElement(n),
            l[Je] = t,
            l[lt] = e,
            Ie(l, n, e),
            Ze(l),
            t.stateNode = l) : t.memoizedState = Uh(t.type, e.memoizedProps, t.pendingProps, e.memoizedState),
            null;
        case 27:
            return Jl(t),
            e === null && ye && (l = t.stateNode = zh(t.type, t.pendingProps, fe.current),
            $e = t,
            At = !0,
            i = Me,
            Ln(t.type) ? ($o = i,
            Me = wt(l.firstChild)) : Me = i),
            We(e, t, t.pendingProps.children, n),
            Xi(e, t),
            e === null && (t.flags |= 4194304),
            t.child;
        case 5:
            return e === null && ye && ((i = l = Me) && (l = cv(l, t.type, t.pendingProps, At),
            l !== null ? (t.stateNode = l,
            $e = t,
            Me = wt(l.firstChild),
            At = !1,
            i = !0) : i = !1),
            i || pn(t)),
            Jl(t),
            i = t.type,
            s = t.pendingProps,
            h = e !== null ? e.memoizedProps : null,
            l = s.children,
            Xo(i, s) ? l = null : h !== null && Xo(i, h) && (t.flags |= 32),
            t.memoizedState !== null && (i = Vr(e, t, Ty, null, null, n),
            ja._currentValue = i),
            Xi(e, t),
            We(e, t, l, n),
            t.child;
        case 6:
            return e === null && ye && ((e = n = Me) && (n = fv(n, t.pendingProps, At),
            n !== null ? (t.stateNode = n,
            $e = t,
            Me = null,
            e = !0) : e = !1),
            e || pn(t)),
            null;
        case 13:
            return Ed(e, t, n);
        case 4:
            return tt(t, t.stateNode.containerInfo),
            l = t.pendingProps,
            e === null ? t.child = Wn(t, null, l, n) : We(e, t, l, n),
            t.child;
        case 11:
            return dd(e, t, t.type, t.pendingProps, n);
        case 7:
            return We(e, t, t.pendingProps, n),
            t.child;
        case 8:
            return We(e, t, t.pendingProps.children, n),
            t.child;
        case 12:
            return We(e, t, t.pendingProps.children, n),
            t.child;
        case 10:
            return l = t.pendingProps,
            yn(t, t.type, l.value),
            We(e, t, l.children, n),
            t.child;
        case 9:
            return i = t.type._context,
            l = t.pendingProps.children,
            kn(t),
            i = Fe(i),
            l = l(i),
            t.flags |= 1,
            We(e, t, l, n),
            t.child;
        case 14:
            return hd(e, t, t.type, t.pendingProps, n);
        case 15:
            return md(e, t, t.type, t.pendingProps, n);
        case 19:
            return xd(e, t, n);
        case 31:
            return Dy(e, t, n);
        case 22:
            return gd(e, t, n, t.pendingProps);
        case 24:
            return kn(t),
            l = Fe(qe),
            e === null ? (i = zr(),
            i === null && (i = Le,
            s = Lr(),
            i.pooledCache = s,
            s.refCount++,
            s !== null && (i.pooledCacheLanes |= n),
            i = s),
            t.memoizedState = {
                parent: l,
                cache: i
            },
            Nr(t),
            yn(t, qe, i)) : ((e.lanes & n) !== 0 && (Ur(e, t),
            ya(t, null, null, n),
            pa()),
            i = e.memoizedState,
            s = t.memoizedState,
            i.parent !== l ? (i = {
                parent: l,
                cache: l
            },
            t.memoizedState = i,
            t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = i),
            yn(t, qe, l)) : (l = s.cache,
            yn(t, qe, l),
            l !== i.cache && wr(t, [qe], n, !0))),
            We(e, t, t.pendingProps.children, n),
            t.child;
        case 29:
            throw t.pendingProps
        }
        throw Error(o(156, t.tag))
    }
    function en(e) {
        e.flags |= 4
    }
    function yo(e, t, n, l, i) {
        if ((t = (e.mode & 32) !== 0) && (t = !1),
        t) {
            if (e.flags |= 16777216,
            (i & 335544128) === i)
                if (e.stateNode.complete)
                    e.flags |= 8192;
                else if (Wd())
                    e.flags |= 8192;
                else
                    throw Fn = wi,
                    Dr
        } else
            e.flags &= -16777217
    }
    function Td(e, t) {
        if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
            e.flags &= -16777217;
        else if (e.flags |= 16777216,
        !Gh(t))
            if (Wd())
                e.flags |= 8192;
            else
                throw Fn = wi,
                Dr
    }
    function Ki(e, t) {
        t !== null && (e.flags |= 4),
        e.flags & 16384 && (t = e.tag !== 22 ? lc() : 536870912,
        e.lanes |= t,
        zl |= t)
    }
    function xa(e, t) {
        if (!ye)
            switch (e.tailMode) {
            case "hidden":
                t = e.tail;
                for (var n = null; t !== null; )
                    t.alternate !== null && (n = t),
                    t = t.sibling;
                n === null ? e.tail = null : n.sibling = null;
                break;
            case "collapsed":
                n = e.tail;
                for (var l = null; n !== null; )
                    n.alternate !== null && (l = n),
                    n = n.sibling;
                l === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : l.sibling = null
            }
    }
    function ze(e) {
        var t = e.alternate !== null && e.alternate.child === e.child
          , n = 0
          , l = 0;
        if (t)
            for (var i = e.child; i !== null; )
                n |= i.lanes | i.childLanes,
                l |= i.subtreeFlags & 65011712,
                l |= i.flags & 65011712,
                i.return = e,
                i = i.sibling;
        else
            for (i = e.child; i !== null; )
                n |= i.lanes | i.childLanes,
                l |= i.subtreeFlags,
                l |= i.flags,
                i.return = e,
                i = i.sibling;
        return e.subtreeFlags |= l,
        e.childLanes = n,
        t
    }
    function Uy(e, t, n) {
        var l = t.pendingProps;
        switch (Cr(t),
        t.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return ze(t),
            null;
        case 1:
            return ze(t),
            null;
        case 3:
            return n = t.stateNode,
            l = null,
            e !== null && (l = e.memoizedState.cache),
            t.memoizedState.cache !== l && (t.flags |= 2048),
            Ft(qe),
            He(),
            n.pendingContext && (n.context = n.pendingContext,
            n.pendingContext = null),
            (e === null || e.child === null) && (Sl(t) ? en(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024,
            Or())),
            ze(t),
            null;
        case 26:
            var i = t.type
              , s = t.memoizedState;
            return e === null ? (en(t),
            s !== null ? (ze(t),
            Td(t, s)) : (ze(t),
            yo(t, i, null, l, n))) : s ? s !== e.memoizedState ? (en(t),
            ze(t),
            Td(t, s)) : (ze(t),
            t.flags &= -16777217) : (e = e.memoizedProps,
            e !== l && en(t),
            ze(t),
            yo(t, i, e, l, n)),
            null;
        case 27:
            if (li(t),
            n = fe.current,
            i = t.type,
            e !== null && t.stateNode != null)
                e.memoizedProps !== l && en(t);
            else {
                if (!l) {
                    if (t.stateNode === null)
                        throw Error(o(166));
                    return ze(t),
                    null
                }
                e = J.current,
                Sl(t) ? lf(t) : (e = zh(i, l, n),
                t.stateNode = e,
                en(t))
            }
            return ze(t),
            null;
        case 5:
            if (li(t),
            i = t.type,
            e !== null && t.stateNode != null)
                e.memoizedProps !== l && en(t);
            else {
                if (!l) {
                    if (t.stateNode === null)
                        throw Error(o(166));
                    return ze(t),
                    null
                }
                if (s = J.current,
                Sl(t))
                    lf(t);
                else {
                    var h = ru(fe.current);
                    switch (s) {
                    case 1:
                        s = h.createElementNS("http://www.w3.org/2000/svg", i);
                        break;
                    case 2:
                        s = h.createElementNS("http://www.w3.org/1998/Math/MathML", i);
                        break;
                    default:
                        switch (i) {
                        case "svg":
                            s = h.createElementNS("http://www.w3.org/2000/svg", i);
                            break;
                        case "math":
                            s = h.createElementNS("http://www.w3.org/1998/Math/MathML", i);
                            break;
                        case "script":
                            s = h.createElement("div"),
                            s.innerHTML = "<script><\/script>",
                            s = s.removeChild(s.firstChild);
                            break;
                        case "select":
                            s = typeof l.is == "string" ? h.createElement("select", {
                                is: l.is
                            }) : h.createElement("select"),
                            l.multiple ? s.multiple = !0 : l.size && (s.size = l.size);
                            break;
                        default:
                            s = typeof l.is == "string" ? h.createElement(i, {
                                is: l.is
                            }) : h.createElement(i)
                        }
                    }
                    s[Je] = t,
                    s[lt] = l;
                    e: for (h = t.child; h !== null; ) {
                        if (h.tag === 5 || h.tag === 6)
                            s.appendChild(h.stateNode);
                        else if (h.tag !== 4 && h.tag !== 27 && h.child !== null) {
                            h.child.return = h,
                            h = h.child;
                            continue
                        }
                        if (h === t)
                            break e;
                        for (; h.sibling === null; ) {
                            if (h.return === null || h.return === t)
                                break e;
                            h = h.return
                        }
                        h.sibling.return = h.return,
                        h = h.sibling
                    }
                    t.stateNode = s;
                    e: switch (Ie(s, i, l),
                    i) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                        l = !!l.autoFocus;
                        break e;
                    case "img":
                        l = !0;
                        break e;
                    default:
                        l = !1
                    }
                    l && en(t)
                }
            }
            return ze(t),
            yo(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n),
            null;
        case 6:
            if (e && t.stateNode != null)
                e.memoizedProps !== l && en(t);
            else {
                if (typeof l != "string" && t.stateNode === null)
                    throw Error(o(166));
                if (e = fe.current,
                Sl(t)) {
                    if (e = t.stateNode,
                    n = t.memoizedProps,
                    l = null,
                    i = $e,
                    i !== null)
                        switch (i.tag) {
                        case 27:
                        case 5:
                            l = i.memoizedProps
                        }
                    e[Je] = t,
                    e = !!(e.nodeValue === n || l !== null && l.suppressHydrationWarning === !0 || Eh(e.nodeValue, n)),
                    e || pn(t, !0)
                } else
                    e = ru(e).createTextNode(l),
                    e[Je] = t,
                    t.stateNode = e
            }
            return ze(t),
            null;
        case 31:
            if (n = t.memoizedState,
            e === null || e.memoizedState !== null) {
                if (l = Sl(t),
                n !== null) {
                    if (e === null) {
                        if (!l)
                            throw Error(o(318));
                        if (e = t.memoizedState,
                        e = e !== null ? e.dehydrated : null,
                        !e)
                            throw Error(o(557));
                        e[Je] = t
                    } else
                        Zn(),
                        (t.flags & 128) === 0 && (t.memoizedState = null),
                        t.flags |= 4;
                    ze(t),
                    e = !1
                } else
                    n = Or(),
                    e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n),
                    e = !0;
                if (!e)
                    return t.flags & 256 ? (yt(t),
                    t) : (yt(t),
                    null);
                if ((t.flags & 128) !== 0)
                    throw Error(o(558))
            }
            return ze(t),
            null;
        case 13:
            if (l = t.memoizedState,
            e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
                if (i = Sl(t),
                l !== null && l.dehydrated !== null) {
                    if (e === null) {
                        if (!i)
                            throw Error(o(318));
                        if (i = t.memoizedState,
                        i = i !== null ? i.dehydrated : null,
                        !i)
                            throw Error(o(317));
                        i[Je] = t
                    } else
                        Zn(),
                        (t.flags & 128) === 0 && (t.memoizedState = null),
                        t.flags |= 4;
                    ze(t),
                    i = !1
                } else
                    i = Or(),
                    e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = i),
                    i = !0;
                if (!i)
                    return t.flags & 256 ? (yt(t),
                    t) : (yt(t),
                    null)
            }
            return yt(t),
            (t.flags & 128) !== 0 ? (t.lanes = n,
            t) : (n = l !== null,
            e = e !== null && e.memoizedState !== null,
            n && (l = t.child,
            i = null,
            l.alternate !== null && l.alternate.memoizedState !== null && l.alternate.memoizedState.cachePool !== null && (i = l.alternate.memoizedState.cachePool.pool),
            s = null,
            l.memoizedState !== null && l.memoizedState.cachePool !== null && (s = l.memoizedState.cachePool.pool),
            s !== i && (l.flags |= 2048)),
            n !== e && n && (t.child.flags |= 8192),
            Ki(t, t.updateQueue),
            ze(t),
            null);
        case 4:
            return He(),
            e === null && qo(t.stateNode.containerInfo),
            ze(t),
            null;
        case 10:
            return Ft(t.type),
            ze(t),
            null;
        case 19:
            if (j(je),
            l = t.memoizedState,
            l === null)
                return ze(t),
                null;
            if (i = (t.flags & 128) !== 0,
            s = l.rendering,
            s === null)
                if (i)
                    xa(l, !1);
                else {
                    if (Ue !== 0 || e !== null && (e.flags & 128) !== 0)
                        for (e = t.child; e !== null; ) {
                            if (s = Di(e),
                            s !== null) {
                                for (t.flags |= 128,
                                xa(l, !1),
                                e = s.updateQueue,
                                t.updateQueue = e,
                                Ki(t, e),
                                t.subtreeFlags = 0,
                                e = n,
                                n = t.child; n !== null; )
                                    Ic(n, e),
                                    n = n.sibling;
                                return Z(je, je.current & 1 | 2),
                                ye && Jt(t, l.treeForkCount),
                                t.child
                            }
                            e = e.sibling
                        }
                    l.tail !== null && ft() > Wi && (t.flags |= 128,
                    i = !0,
                    xa(l, !1),
                    t.lanes = 4194304)
                }
            else {
                if (!i)
                    if (e = Di(s),
                    e !== null) {
                        if (t.flags |= 128,
                        i = !0,
                        e = e.updateQueue,
                        t.updateQueue = e,
                        Ki(t, e),
                        xa(l, !0),
                        l.tail === null && l.tailMode === "hidden" && !s.alternate && !ye)
                            return ze(t),
                            null
                    } else
                        2 * ft() - l.renderingStartTime > Wi && n !== 536870912 && (t.flags |= 128,
                        i = !0,
                        xa(l, !1),
                        t.lanes = 4194304);
                l.isBackwards ? (s.sibling = t.child,
                t.child = s) : (e = l.last,
                e !== null ? e.sibling = s : t.child = s,
                l.last = s)
            }
            return l.tail !== null ? (e = l.tail,
            l.rendering = e,
            l.tail = e.sibling,
            l.renderingStartTime = ft(),
            e.sibling = null,
            n = je.current,
            Z(je, i ? n & 1 | 2 : n & 1),
            ye && Jt(t, l.treeForkCount),
            e) : (ze(t),
            null);
        case 22:
        case 23:
            return yt(t),
            qr(),
            l = t.memoizedState !== null,
            e !== null ? e.memoizedState !== null !== l && (t.flags |= 8192) : l && (t.flags |= 8192),
            l ? (n & 536870912) !== 0 && (t.flags & 128) === 0 && (ze(t),
            t.subtreeFlags & 6 && (t.flags |= 8192)) : ze(t),
            n = t.updateQueue,
            n !== null && Ki(t, n.retryQueue),
            n = null,
            e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool),
            l = null,
            t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool),
            l !== n && (t.flags |= 2048),
            e !== null && j(Jn),
            null;
        case 24:
            return n = null,
            e !== null && (n = e.memoizedState.cache),
            t.memoizedState.cache !== n && (t.flags |= 2048),
            Ft(qe),
            ze(t),
            null;
        case 25:
            return null;
        case 30:
            return null
        }
        throw Error(o(156, t.tag))
    }
    function Hy(e, t) {
        switch (Cr(t),
        t.tag) {
        case 1:
            return e = t.flags,
            e & 65536 ? (t.flags = e & -65537 | 128,
            t) : null;
        case 3:
            return Ft(qe),
            He(),
            e = t.flags,
            (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128,
            t) : null;
        case 26:
        case 27:
        case 5:
            return li(t),
            null;
        case 31:
            if (t.memoizedState !== null) {
                if (yt(t),
                t.alternate === null)
                    throw Error(o(340));
                Zn()
            }
            return e = t.flags,
            e & 65536 ? (t.flags = e & -65537 | 128,
            t) : null;
        case 13:
            if (yt(t),
            e = t.memoizedState,
            e !== null && e.dehydrated !== null) {
                if (t.alternate === null)
                    throw Error(o(340));
                Zn()
            }
            return e = t.flags,
            e & 65536 ? (t.flags = e & -65537 | 128,
            t) : null;
        case 19:
            return j(je),
            null;
        case 4:
            return He(),
            null;
        case 10:
            return Ft(t.type),
            null;
        case 22:
        case 23:
            return yt(t),
            qr(),
            e !== null && j(Jn),
            e = t.flags,
            e & 65536 ? (t.flags = e & -65537 | 128,
            t) : null;
        case 24:
            return Ft(qe),
            null;
        case 25:
            return null;
        default:
            return null
        }
    }
    function Od(e, t) {
        switch (Cr(t),
        t.tag) {
        case 3:
            Ft(qe),
            He();
            break;
        case 26:
        case 27:
        case 5:
            li(t);
            break;
        case 4:
            He();
            break;
        case 31:
            t.memoizedState !== null && yt(t);
            break;
        case 13:
            yt(t);
            break;
        case 19:
            j(je);
            break;
        case 10:
            Ft(t.type);
            break;
        case 22:
        case 23:
            yt(t),
            qr(),
            e !== null && j(Jn);
            break;
        case 24:
            Ft(qe)
        }
    }
    function Ca(e, t) {
        try {
            var n = t.updateQueue
              , l = n !== null ? n.lastEffect : null;
            if (l !== null) {
                var i = l.next;
                n = i;
                do {
                    if ((n.tag & e) === e) {
                        l = void 0;
                        var s = n.create
                          , h = n.inst;
                        l = s(),
                        h.destroy = l
                    }
                    n = n.next
                } while (n !== i)
            }
        } catch (y) {
            Oe(t, t.return, y)
        }
    }
    function xn(e, t, n) {
        try {
            var l = t.updateQueue
              , i = l !== null ? l.lastEffect : null;
            if (i !== null) {
                var s = i.next;
                l = s;
                do {
                    if ((l.tag & e) === e) {
                        var h = l.inst
                          , y = h.destroy;
                        if (y !== void 0) {
                            h.destroy = void 0,
                            i = t;
                            var C = n
                              , L = y;
                            try {
                                L()
                            } catch (U) {
                                Oe(i, C, U)
                            }
                        }
                    }
                    l = l.next
                } while (l !== s)
            }
        } catch (U) {
            Oe(t, t.return, U)
        }
    }
    function Ad(e) {
        var t = e.updateQueue;
        if (t !== null) {
            var n = e.stateNode;
            try {
                yf(t, n)
            } catch (l) {
                Oe(e, e.return, l)
            }
        }
    }
    function Rd(e, t, n) {
        n.props = Pn(e.type, e.memoizedProps),
        n.state = e.memoizedState;
        try {
            n.componentWillUnmount()
        } catch (l) {
            Oe(e, t, l)
        }
    }
    function Ta(e, t) {
        try {
            var n = e.ref;
            if (n !== null) {
                switch (e.tag) {
                case 26:
                case 27:
                case 5:
                    var l = e.stateNode;
                    break;
                case 30:
                    l = e.stateNode;
                    break;
                default:
                    l = e.stateNode
                }
                typeof n == "function" ? e.refCleanup = n(l) : n.current = l
            }
        } catch (i) {
            Oe(e, t, i)
        }
    }
    function Bt(e, t) {
        var n = e.ref
          , l = e.refCleanup;
        if (n !== null)
            if (typeof l == "function")
                try {
                    l()
                } catch (i) {
                    Oe(e, t, i)
                } finally {
                    e.refCleanup = null,
                    e = e.alternate,
                    e != null && (e.refCleanup = null)
                }
            else if (typeof n == "function")
                try {
                    n(null)
                } catch (i) {
                    Oe(e, t, i)
                }
            else
                n.current = null
    }
    function wd(e) {
        var t = e.type
          , n = e.memoizedProps
          , l = e.stateNode;
        try {
            e: switch (t) {
            case "button":
            case "input":
            case "select":
            case "textarea":
                n.autoFocus && l.focus();
                break e;
            case "img":
                n.src ? l.src = n.src : n.srcSet && (l.srcset = n.srcSet)
            }
        } catch (i) {
            Oe(e, e.return, i)
        }
    }
    function vo(e, t, n) {
        try {
            var l = e.stateNode;
            av(l, e.type, n, t),
            l[lt] = t
        } catch (i) {
            Oe(e, e.return, i)
        }
    }
    function Ld(e) {
        return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Ln(e.type) || e.tag === 4
    }
    function So(e) {
        e: for (; ; ) {
            for (; e.sibling === null; ) {
                if (e.return === null || Ld(e.return))
                    return null;
                e = e.return
            }
            for (e.sibling.return = e.return,
            e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
                if (e.tag === 27 && Ln(e.type) || e.flags & 2 || e.child === null || e.tag === 4)
                    continue e;
                e.child.return = e,
                e = e.child
            }
            if (!(e.flags & 2))
                return e.stateNode
        }
    }
    function bo(e, t, n) {
        var l = e.tag;
        if (l === 5 || l === 6)
            e = e.stateNode,
            t ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(e, t) : (t = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n,
            t.appendChild(e),
            n = n._reactRootContainer,
            n != null || t.onclick !== null || (t.onclick = Zt));
        else if (l !== 4 && (l === 27 && Ln(e.type) && (n = e.stateNode,
        t = null),
        e = e.child,
        e !== null))
            for (bo(e, t, n),
            e = e.sibling; e !== null; )
                bo(e, t, n),
                e = e.sibling
    }
    function ki(e, t, n) {
        var l = e.tag;
        if (l === 5 || l === 6)
            e = e.stateNode,
            t ? n.insertBefore(e, t) : n.appendChild(e);
        else if (l !== 4 && (l === 27 && Ln(e.type) && (n = e.stateNode),
        e = e.child,
        e !== null))
            for (ki(e, t, n),
            e = e.sibling; e !== null; )
                ki(e, t, n),
                e = e.sibling
    }
    function Md(e) {
        var t = e.stateNode
          , n = e.memoizedProps;
        try {
            for (var l = e.type, i = t.attributes; i.length; )
                t.removeAttributeNode(i[0]);
            Ie(t, l, n),
            t[Je] = e,
            t[lt] = n
        } catch (s) {
            Oe(e, e.return, s)
        }
    }
    var tn = !1
      , Ve = !1
      , Eo = !1
      , zd = typeof WeakSet == "function" ? WeakSet : Set
      , Ke = null;
    function jy(e, t) {
        if (e = e.containerInfo,
        Vo = mu,
        e = Qc(e),
        hr(e)) {
            if ("selectionStart"in e)
                var n = {
                    start: e.selectionStart,
                    end: e.selectionEnd
                };
            else
                e: {
                    n = (n = e.ownerDocument) && n.defaultView || window;
                    var l = n.getSelection && n.getSelection();
                    if (l && l.rangeCount !== 0) {
                        n = l.anchorNode;
                        var i = l.anchorOffset
                          , s = l.focusNode;
                        l = l.focusOffset;
                        try {
                            n.nodeType,
                            s.nodeType
                        } catch {
                            n = null;
                            break e
                        }
                        var h = 0
                          , y = -1
                          , C = -1
                          , L = 0
                          , U = 0
                          , G = e
                          , M = null;
                        t: for (; ; ) {
                            for (var D; G !== n || i !== 0 && G.nodeType !== 3 || (y = h + i),
                            G !== s || l !== 0 && G.nodeType !== 3 || (C = h + l),
                            G.nodeType === 3 && (h += G.nodeValue.length),
                            (D = G.firstChild) !== null; )
                                M = G,
                                G = D;
                            for (; ; ) {
                                if (G === e)
                                    break t;
                                if (M === n && ++L === i && (y = h),
                                M === s && ++U === l && (C = h),
                                (D = G.nextSibling) !== null)
                                    break;
                                G = M,
                                M = G.parentNode
                            }
                            G = D
                        }
                        n = y === -1 || C === -1 ? null : {
                            start: y,
                            end: C
                        }
                    } else
                        n = null
                }
            n = n || {
                start: 0,
                end: 0
            }
        } else
            n = null;
        for (Qo = {
            focusedElem: e,
            selectionRange: n
        },
        mu = !1,
        Ke = t; Ke !== null; )
            if (t = Ke,
            e = t.child,
            (t.subtreeFlags & 1028) !== 0 && e !== null)
                e.return = t,
                Ke = e;
            else
                for (; Ke !== null; ) {
                    switch (t = Ke,
                    s = t.alternate,
                    e = t.flags,
                    t.tag) {
                    case 0:
                        if ((e & 4) !== 0 && (e = t.updateQueue,
                        e = e !== null ? e.events : null,
                        e !== null))
                            for (n = 0; n < e.length; n++)
                                i = e[n],
                                i.ref.impl = i.nextImpl;
                        break;
                    case 11:
                    case 15:
                        break;
                    case 1:
                        if ((e & 1024) !== 0 && s !== null) {
                            e = void 0,
                            n = t,
                            i = s.memoizedProps,
                            s = s.memoizedState,
                            l = n.stateNode;
                            try {
                                var $ = Pn(n.type, i);
                                e = l.getSnapshotBeforeUpdate($, s),
                                l.__reactInternalSnapshotBeforeUpdate = e
                            } catch (ne) {
                                Oe(n, n.return, ne)
                            }
                        }
                        break;
                    case 3:
                        if ((e & 1024) !== 0) {
                            if (e = t.stateNode.containerInfo,
                            n = e.nodeType,
                            n === 9)
                                Ko(e);
                            else if (n === 1)
                                switch (e.nodeName) {
                                case "HEAD":
                                case "HTML":
                                case "BODY":
                                    Ko(e);
                                    break;
                                default:
                                    e.textContent = ""
                                }
                        }
                        break;
                    case 5:
                    case 26:
                    case 27:
                    case 6:
                    case 4:
                    case 17:
                        break;
                    default:
                        if ((e & 1024) !== 0)
                            throw Error(o(163))
                    }
                    if (e = t.sibling,
                    e !== null) {
                        e.return = t.return,
                        Ke = e;
                        break
                    }
                    Ke = t.return
                }
    }
    function Dd(e, t, n) {
        var l = n.flags;
        switch (n.tag) {
        case 0:
        case 11:
        case 15:
            ln(e, n),
            l & 4 && Ca(5, n);
            break;
        case 1:
            if (ln(e, n),
            l & 4)
                if (e = n.stateNode,
                t === null)
                    try {
                        e.componentDidMount()
                    } catch (h) {
                        Oe(n, n.return, h)
                    }
                else {
                    var i = Pn(n.type, t.memoizedProps);
                    t = t.memoizedState;
                    try {
                        e.componentDidUpdate(i, t, e.__reactInternalSnapshotBeforeUpdate)
                    } catch (h) {
                        Oe(n, n.return, h)
                    }
                }
            l & 64 && Ad(n),
            l & 512 && Ta(n, n.return);
            break;
        case 3:
            if (ln(e, n),
            l & 64 && (e = n.updateQueue,
            e !== null)) {
                if (t = null,
                n.child !== null)
                    switch (n.child.tag) {
                    case 27:
                    case 5:
                        t = n.child.stateNode;
                        break;
                    case 1:
                        t = n.child.stateNode
                    }
                try {
                    yf(e, t)
                } catch (h) {
                    Oe(n, n.return, h)
                }
            }
            break;
        case 27:
            t === null && l & 4 && Md(n);
        case 26:
        case 5:
            ln(e, n),
            t === null && l & 4 && wd(n),
            l & 512 && Ta(n, n.return);
            break;
        case 12:
            ln(e, n);
            break;
        case 31:
            ln(e, n),
            l & 4 && Hd(e, n);
            break;
        case 13:
            ln(e, n),
            l & 4 && jd(e, n),
            l & 64 && (e = n.memoizedState,
            e !== null && (e = e.dehydrated,
            e !== null && (n = Ky.bind(null, n),
            dv(e, n))));
            break;
        case 22:
            if (l = n.memoizedState !== null || tn,
            !l) {
                t = t !== null && t.memoizedState !== null || Ve,
                i = tn;
                var s = Ve;
                tn = l,
                (Ve = t) && !s ? an(e, n, (n.subtreeFlags & 8772) !== 0) : ln(e, n),
                tn = i,
                Ve = s
            }
            break;
        case 30:
            break;
        default:
            ln(e, n)
        }
    }
    function Nd(e) {
        var t = e.alternate;
        t !== null && (e.alternate = null,
        Nd(t)),
        e.child = null,
        e.deletions = null,
        e.sibling = null,
        e.tag === 5 && (t = e.stateNode,
        t !== null && Fu(t)),
        e.stateNode = null,
        e.return = null,
        e.dependencies = null,
        e.memoizedProps = null,
        e.memoizedState = null,
        e.pendingProps = null,
        e.stateNode = null,
        e.updateQueue = null
    }
    var De = null
      , it = !1;
    function nn(e, t, n) {
        for (n = n.child; n !== null; )
            Ud(e, t, n),
            n = n.sibling
    }
    function Ud(e, t, n) {
        if (dt && typeof dt.onCommitFiberUnmount == "function")
            try {
                dt.onCommitFiberUnmount($l, n)
            } catch {}
        switch (n.tag) {
        case 26:
            Ve || Bt(n, t),
            nn(e, t, n),
            n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode,
            n.parentNode.removeChild(n));
            break;
        case 27:
            Ve || Bt(n, t);
            var l = De
              , i = it;
            Ln(n.type) && (De = n.stateNode,
            it = !1),
            nn(e, t, n),
            Na(n.stateNode),
            De = l,
            it = i;
            break;
        case 5:
            Ve || Bt(n, t);
        case 6:
            if (l = De,
            i = it,
            De = null,
            nn(e, t, n),
            De = l,
            it = i,
            De !== null)
                if (it)
                    try {
                        (De.nodeType === 9 ? De.body : De.nodeName === "HTML" ? De.ownerDocument.body : De).removeChild(n.stateNode)
                    } catch (s) {
                        Oe(n, t, s)
                    }
                else
                    try {
                        De.removeChild(n.stateNode)
                    } catch (s) {
                        Oe(n, t, s)
                    }
            break;
        case 18:
            De !== null && (it ? (e = De,
            Ah(e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, n.stateNode),
            Gl(e)) : Ah(De, n.stateNode));
            break;
        case 4:
            l = De,
            i = it,
            De = n.stateNode.containerInfo,
            it = !0,
            nn(e, t, n),
            De = l,
            it = i;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            xn(2, n, t),
            Ve || xn(4, n, t),
            nn(e, t, n);
            break;
        case 1:
            Ve || (Bt(n, t),
            l = n.stateNode,
            typeof l.componentWillUnmount == "function" && Rd(n, t, l)),
            nn(e, t, n);
            break;
        case 21:
            nn(e, t, n);
            break;
        case 22:
            Ve = (l = Ve) || n.memoizedState !== null,
            nn(e, t, n),
            Ve = l;
            break;
        default:
            nn(e, t, n)
        }
    }
    function Hd(e, t) {
        if (t.memoizedState === null && (e = t.alternate,
        e !== null && (e = e.memoizedState,
        e !== null))) {
            e = e.dehydrated;
            try {
                Gl(e)
            } catch (n) {
                Oe(t, t.return, n)
            }
        }
    }
    function jd(e, t) {
        if (t.memoizedState === null && (e = t.alternate,
        e !== null && (e = e.memoizedState,
        e !== null && (e = e.dehydrated,
        e !== null))))
            try {
                Gl(e)
            } catch (n) {
                Oe(t, t.return, n)
            }
    }
    function By(e) {
        switch (e.tag) {
        case 31:
        case 13:
        case 19:
            var t = e.stateNode;
            return t === null && (t = e.stateNode = new zd),
            t;
        case 22:
            return e = e.stateNode,
            t = e._retryCache,
            t === null && (t = e._retryCache = new zd),
            t;
        default:
            throw Error(o(435, e.tag))
        }
    }
    function Ji(e, t) {
        var n = By(e);
        t.forEach(function(l) {
            if (!n.has(l)) {
                n.add(l);
                var i = ky.bind(null, e, l);
                l.then(i, i)
            }
        })
    }
    function ut(e, t) {
        var n = t.deletions;
        if (n !== null)
            for (var l = 0; l < n.length; l++) {
                var i = n[l]
                  , s = e
                  , h = t
                  , y = h;
                e: for (; y !== null; ) {
                    switch (y.tag) {
                    case 27:
                        if (Ln(y.type)) {
                            De = y.stateNode,
                            it = !1;
                            break e
                        }
                        break;
                    case 5:
                        De = y.stateNode,
                        it = !1;
                        break e;
                    case 3:
                    case 4:
                        De = y.stateNode.containerInfo,
                        it = !0;
                        break e
                    }
                    y = y.return
                }
                if (De === null)
                    throw Error(o(160));
                Ud(s, h, i),
                De = null,
                it = !1,
                s = i.alternate,
                s !== null && (s.return = null),
                i.return = null
            }
        if (t.subtreeFlags & 13886)
            for (t = t.child; t !== null; )
                Bd(t, e),
                t = t.sibling
    }
    var Dt = null;
    function Bd(e, t) {
        var n = e.alternate
          , l = e.flags;
        switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            ut(t, e),
            rt(e),
            l & 4 && (xn(3, e, e.return),
            Ca(3, e),
            xn(5, e, e.return));
            break;
        case 1:
            ut(t, e),
            rt(e),
            l & 512 && (Ve || n === null || Bt(n, n.return)),
            l & 64 && tn && (e = e.updateQueue,
            e !== null && (l = e.callbacks,
            l !== null && (n = e.shared.hiddenCallbacks,
            e.shared.hiddenCallbacks = n === null ? l : n.concat(l))));
            break;
        case 26:
            var i = Dt;
            if (ut(t, e),
            rt(e),
            l & 512 && (Ve || n === null || Bt(n, n.return)),
            l & 4) {
                var s = n !== null ? n.memoizedState : null;
                if (l = e.memoizedState,
                n === null)
                    if (l === null)
                        if (e.stateNode === null) {
                            e: {
                                l = e.type,
                                n = e.memoizedProps,
                                i = i.ownerDocument || i;
                                t: switch (l) {
                                case "title":
                                    s = i.getElementsByTagName("title")[0],
                                    (!s || s[Il] || s[Je] || s.namespaceURI === "http://www.w3.org/2000/svg" || s.hasAttribute("itemprop")) && (s = i.createElement(l),
                                    i.head.insertBefore(s, i.querySelector("head > title"))),
                                    Ie(s, l, n),
                                    s[Je] = e,
                                    Ze(s),
                                    l = s;
                                    break e;
                                case "link":
                                    var h = Bh("link", "href", i).get(l + (n.href || ""));
                                    if (h) {
                                        for (var y = 0; y < h.length; y++)
                                            if (s = h[y],
                                            s.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && s.getAttribute("rel") === (n.rel == null ? null : n.rel) && s.getAttribute("title") === (n.title == null ? null : n.title) && s.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                                                h.splice(y, 1);
                                                break t
                                            }
                                    }
                                    s = i.createElement(l),
                                    Ie(s, l, n),
                                    i.head.appendChild(s);
                                    break;
                                case "meta":
                                    if (h = Bh("meta", "content", i).get(l + (n.content || ""))) {
                                        for (y = 0; y < h.length; y++)
                                            if (s = h[y],
                                            s.getAttribute("content") === (n.content == null ? null : "" + n.content) && s.getAttribute("name") === (n.name == null ? null : n.name) && s.getAttribute("property") === (n.property == null ? null : n.property) && s.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && s.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                                                h.splice(y, 1);
                                                break t
                                            }
                                    }
                                    s = i.createElement(l),
                                    Ie(s, l, n),
                                    i.head.appendChild(s);
                                    break;
                                default:
                                    throw Error(o(468, l))
                                }
                                s[Je] = e,
                                Ze(s),
                                l = s
                            }
                            e.stateNode = l
                        } else
                            qh(i, e.type, e.stateNode);
                    else
                        e.stateNode = jh(i, l, e.memoizedProps);
                else
                    s !== l ? (s === null ? n.stateNode !== null && (n = n.stateNode,
                    n.parentNode.removeChild(n)) : s.count--,
                    l === null ? qh(i, e.type, e.stateNode) : jh(i, l, e.memoizedProps)) : l === null && e.stateNode !== null && vo(e, e.memoizedProps, n.memoizedProps)
            }
            break;
        case 27:
            ut(t, e),
            rt(e),
            l & 512 && (Ve || n === null || Bt(n, n.return)),
            n !== null && l & 4 && vo(e, e.memoizedProps, n.memoizedProps);
            break;
        case 5:
            if (ut(t, e),
            rt(e),
            l & 512 && (Ve || n === null || Bt(n, n.return)),
            e.flags & 32) {
                i = e.stateNode;
                try {
                    sl(i, "")
                } catch ($) {
                    Oe(e, e.return, $)
                }
            }
            l & 4 && e.stateNode != null && (i = e.memoizedProps,
            vo(e, i, n !== null ? n.memoizedProps : i)),
            l & 1024 && (Eo = !0);
            break;
        case 6:
            if (ut(t, e),
            rt(e),
            l & 4) {
                if (e.stateNode === null)
                    throw Error(o(162));
                l = e.memoizedProps,
                n = e.stateNode;
                try {
                    n.nodeValue = l
                } catch ($) {
                    Oe(e, e.return, $)
                }
            }
            break;
        case 3:
            if (cu = null,
            i = Dt,
            Dt = ou(t.containerInfo),
            ut(t, e),
            Dt = i,
            rt(e),
            l & 4 && n !== null && n.memoizedState.isDehydrated)
                try {
                    Gl(t.containerInfo)
                } catch ($) {
                    Oe(e, e.return, $)
                }
            Eo && (Eo = !1,
            qd(e));
            break;
        case 4:
            l = Dt,
            Dt = ou(e.stateNode.containerInfo),
            ut(t, e),
            rt(e),
            Dt = l;
            break;
        case 12:
            ut(t, e),
            rt(e);
            break;
        case 31:
            ut(t, e),
            rt(e),
            l & 4 && (l = e.updateQueue,
            l !== null && (e.updateQueue = null,
            Ji(e, l)));
            break;
        case 13:
            ut(t, e),
            rt(e),
            e.child.flags & 8192 && e.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Fi = ft()),
            l & 4 && (l = e.updateQueue,
            l !== null && (e.updateQueue = null,
            Ji(e, l)));
            break;
        case 22:
            i = e.memoizedState !== null;
            var C = n !== null && n.memoizedState !== null
              , L = tn
              , U = Ve;
            if (tn = L || i,
            Ve = U || C,
            ut(t, e),
            Ve = U,
            tn = L,
            rt(e),
            l & 8192)
                e: for (t = e.stateNode,
                t._visibility = i ? t._visibility & -2 : t._visibility | 1,
                i && (n === null || C || tn || Ve || el(e)),
                n = null,
                t = e; ; ) {
                    if (t.tag === 5 || t.tag === 26) {
                        if (n === null) {
                            C = n = t;
                            try {
                                if (s = C.stateNode,
                                i)
                                    h = s.style,
                                    typeof h.setProperty == "function" ? h.setProperty("display", "none", "important") : h.display = "none";
                                else {
                                    y = C.stateNode;
                                    var G = C.memoizedProps.style
                                      , M = G != null && G.hasOwnProperty("display") ? G.display : null;
                                    y.style.display = M == null || typeof M == "boolean" ? "" : ("" + M).trim()
                                }
                            } catch ($) {
                                Oe(C, C.return, $)
                            }
                        }
                    } else if (t.tag === 6) {
                        if (n === null) {
                            C = t;
                            try {
                                C.stateNode.nodeValue = i ? "" : C.memoizedProps
                            } catch ($) {
                                Oe(C, C.return, $)
                            }
                        }
                    } else if (t.tag === 18) {
                        if (n === null) {
                            C = t;
                            try {
                                var D = C.stateNode;
                                i ? Rh(D, !0) : Rh(C.stateNode, !1)
                            } catch ($) {
                                Oe(C, C.return, $)
                            }
                        }
                    } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
                        t.child.return = t,
                        t = t.child;
                        continue
                    }
                    if (t === e)
                        break e;
                    for (; t.sibling === null; ) {
                        if (t.return === null || t.return === e)
                            break e;
                        n === t && (n = null),
                        t = t.return
                    }
                    n === t && (n = null),
                    t.sibling.return = t.return,
                    t = t.sibling
                }
            l & 4 && (l = e.updateQueue,
            l !== null && (n = l.retryQueue,
            n !== null && (l.retryQueue = null,
            Ji(e, n))));
            break;
        case 19:
            ut(t, e),
            rt(e),
            l & 4 && (l = e.updateQueue,
            l !== null && (e.updateQueue = null,
            Ji(e, l)));
            break;
        case 30:
            break;
        case 21:
            break;
        default:
            ut(t, e),
            rt(e)
        }
    }
    function rt(e) {
        var t = e.flags;
        if (t & 2) {
            try {
                for (var n, l = e.return; l !== null; ) {
                    if (Ld(l)) {
                        n = l;
                        break
                    }
                    l = l.return
                }
                if (n == null)
                    throw Error(o(160));
                switch (n.tag) {
                case 27:
                    var i = n.stateNode
                      , s = So(e);
                    ki(e, s, i);
                    break;
                case 5:
                    var h = n.stateNode;
                    n.flags & 32 && (sl(h, ""),
                    n.flags &= -33);
                    var y = So(e);
                    ki(e, y, h);
                    break;
                case 3:
                case 4:
                    var C = n.stateNode.containerInfo
                      , L = So(e);
                    bo(e, L, C);
                    break;
                default:
                    throw Error(o(161))
                }
            } catch (U) {
                Oe(e, e.return, U)
            }
            e.flags &= -3
        }
        t & 4096 && (e.flags &= -4097)
    }
    function qd(e) {
        if (e.subtreeFlags & 1024)
            for (e = e.child; e !== null; ) {
                var t = e;
                qd(t),
                t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
                e = e.sibling
            }
    }
    function ln(e, t) {
        if (t.subtreeFlags & 8772)
            for (t = t.child; t !== null; )
                Dd(e, t.alternate, t),
                t = t.sibling
    }
    function el(e) {
        for (e = e.child; e !== null; ) {
            var t = e;
            switch (t.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                xn(4, t, t.return),
                el(t);
                break;
            case 1:
                Bt(t, t.return);
                var n = t.stateNode;
                typeof n.componentWillUnmount == "function" && Rd(t, t.return, n),
                el(t);
                break;
            case 27:
                Na(t.stateNode);
            case 26:
            case 5:
                Bt(t, t.return),
                el(t);
                break;
            case 22:
                t.memoizedState === null && el(t);
                break;
            case 30:
                el(t);
                break;
            default:
                el(t)
            }
            e = e.sibling
        }
    }
    function an(e, t, n) {
        for (n = n && (t.subtreeFlags & 8772) !== 0,
        t = t.child; t !== null; ) {
            var l = t.alternate
              , i = e
              , s = t
              , h = s.flags;
            switch (s.tag) {
            case 0:
            case 11:
            case 15:
                an(i, s, n),
                Ca(4, s);
                break;
            case 1:
                if (an(i, s, n),
                l = s,
                i = l.stateNode,
                typeof i.componentDidMount == "function")
                    try {
                        i.componentDidMount()
                    } catch (L) {
                        Oe(l, l.return, L)
                    }
                if (l = s,
                i = l.updateQueue,
                i !== null) {
                    var y = l.stateNode;
                    try {
                        var C = i.shared.hiddenCallbacks;
                        if (C !== null)
                            for (i.shared.hiddenCallbacks = null,
                            i = 0; i < C.length; i++)
                                pf(C[i], y)
                    } catch (L) {
                        Oe(l, l.return, L)
                    }
                }
                n && h & 64 && Ad(s),
                Ta(s, s.return);
                break;
            case 27:
                Md(s);
            case 26:
            case 5:
                an(i, s, n),
                n && l === null && h & 4 && wd(s),
                Ta(s, s.return);
                break;
            case 12:
                an(i, s, n);
                break;
            case 31:
                an(i, s, n),
                n && h & 4 && Hd(i, s);
                break;
            case 13:
                an(i, s, n),
                n && h & 4 && jd(i, s);
                break;
            case 22:
                s.memoizedState === null && an(i, s, n),
                Ta(s, s.return);
                break;
            case 30:
                break;
            default:
                an(i, s, n)
            }
            t = t.sibling
        }
    }
    function _o(e, t) {
        var n = null;
        e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (n = e.memoizedState.cachePool.pool),
        e = null,
        t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool),
        e !== n && (e != null && e.refCount++,
        n != null && fa(n))
    }
    function xo(e, t) {
        e = null,
        t.alternate !== null && (e = t.alternate.memoizedState.cache),
        t = t.memoizedState.cache,
        t !== e && (t.refCount++,
        e != null && fa(e))
    }
    function Nt(e, t, n, l) {
        if (t.subtreeFlags & 10256)
            for (t = t.child; t !== null; )
                Gd(e, t, n, l),
                t = t.sibling
    }
    function Gd(e, t, n, l) {
        var i = t.flags;
        switch (t.tag) {
        case 0:
        case 11:
        case 15:
            Nt(e, t, n, l),
            i & 2048 && Ca(9, t);
            break;
        case 1:
            Nt(e, t, n, l);
            break;
        case 3:
            Nt(e, t, n, l),
            i & 2048 && (e = null,
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            t = t.memoizedState.cache,
            t !== e && (t.refCount++,
            e != null && fa(e)));
            break;
        case 12:
            if (i & 2048) {
                Nt(e, t, n, l),
                e = t.stateNode;
                try {
                    var s = t.memoizedProps
                      , h = s.id
                      , y = s.onPostCommit;
                    typeof y == "function" && y(h, t.alternate === null ? "mount" : "update", e.passiveEffectDuration, -0)
                } catch (C) {
                    Oe(t, t.return, C)
                }
            } else
                Nt(e, t, n, l);
            break;
        case 31:
            Nt(e, t, n, l);
            break;
        case 13:
            Nt(e, t, n, l);
            break;
        case 23:
            break;
        case 22:
            s = t.stateNode,
            h = t.alternate,
            t.memoizedState !== null ? s._visibility & 2 ? Nt(e, t, n, l) : Oa(e, t) : s._visibility & 2 ? Nt(e, t, n, l) : (s._visibility |= 2,
            wl(e, t, n, l, (t.subtreeFlags & 10256) !== 0 || !1)),
            i & 2048 && _o(h, t);
            break;
        case 24:
            Nt(e, t, n, l),
            i & 2048 && xo(t.alternate, t);
            break;
        default:
            Nt(e, t, n, l)
        }
    }
    function wl(e, t, n, l, i) {
        for (i = i && ((t.subtreeFlags & 10256) !== 0 || !1),
        t = t.child; t !== null; ) {
            var s = e
              , h = t
              , y = n
              , C = l
              , L = h.flags;
            switch (h.tag) {
            case 0:
            case 11:
            case 15:
                wl(s, h, y, C, i),
                Ca(8, h);
                break;
            case 23:
                break;
            case 22:
                var U = h.stateNode;
                h.memoizedState !== null ? U._visibility & 2 ? wl(s, h, y, C, i) : Oa(s, h) : (U._visibility |= 2,
                wl(s, h, y, C, i)),
                i && L & 2048 && _o(h.alternate, h);
                break;
            case 24:
                wl(s, h, y, C, i),
                i && L & 2048 && xo(h.alternate, h);
                break;
            default:
                wl(s, h, y, C, i)
            }
            t = t.sibling
        }
    }
    function Oa(e, t) {
        if (t.subtreeFlags & 10256)
            for (t = t.child; t !== null; ) {
                var n = e
                  , l = t
                  , i = l.flags;
                switch (l.tag) {
                case 22:
                    Oa(n, l),
                    i & 2048 && _o(l.alternate, l);
                    break;
                case 24:
                    Oa(n, l),
                    i & 2048 && xo(l.alternate, l);
                    break;
                default:
                    Oa(n, l)
                }
                t = t.sibling
            }
    }
    var Aa = 8192;
    function Ll(e, t, n) {
        if (e.subtreeFlags & Aa)
            for (e = e.child; e !== null; )
                Yd(e, t, n),
                e = e.sibling
    }
    function Yd(e, t, n) {
        switch (e.tag) {
        case 26:
            Ll(e, t, n),
            e.flags & Aa && e.memoizedState !== null && Cv(n, Dt, e.memoizedState, e.memoizedProps);
            break;
        case 5:
            Ll(e, t, n);
            break;
        case 3:
        case 4:
            var l = Dt;
            Dt = ou(e.stateNode.containerInfo),
            Ll(e, t, n),
            Dt = l;
            break;
        case 22:
            e.memoizedState === null && (l = e.alternate,
            l !== null && l.memoizedState !== null ? (l = Aa,
            Aa = 16777216,
            Ll(e, t, n),
            Aa = l) : Ll(e, t, n));
            break;
        default:
            Ll(e, t, n)
        }
    }
    function Vd(e) {
        var t = e.alternate;
        if (t !== null && (e = t.child,
        e !== null)) {
            t.child = null;
            do
                t = e.sibling,
                e.sibling = null,
                e = t;
            while (e !== null)
        }
    }
    function Ra(e) {
        var t = e.deletions;
        if ((e.flags & 16) !== 0) {
            if (t !== null)
                for (var n = 0; n < t.length; n++) {
                    var l = t[n];
                    Ke = l,
                    Xd(l, e)
                }
            Vd(e)
        }
        if (e.subtreeFlags & 10256)
            for (e = e.child; e !== null; )
                Qd(e),
                e = e.sibling
    }
    function Qd(e) {
        switch (e.tag) {
        case 0:
        case 11:
        case 15:
            Ra(e),
            e.flags & 2048 && xn(9, e, e.return);
            break;
        case 3:
            Ra(e);
            break;
        case 12:
            Ra(e);
            break;
        case 22:
            var t = e.stateNode;
            e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3,
            $i(e)) : Ra(e);
            break;
        default:
            Ra(e)
        }
    }
    function $i(e) {
        var t = e.deletions;
        if ((e.flags & 16) !== 0) {
            if (t !== null)
                for (var n = 0; n < t.length; n++) {
                    var l = t[n];
                    Ke = l,
                    Xd(l, e)
                }
            Vd(e)
        }
        for (e = e.child; e !== null; ) {
            switch (t = e,
            t.tag) {
            case 0:
            case 11:
            case 15:
                xn(8, t, t.return),
                $i(t);
                break;
            case 22:
                n = t.stateNode,
                n._visibility & 2 && (n._visibility &= -3,
                $i(t));
                break;
            default:
                $i(t)
            }
            e = e.sibling
        }
    }
    function Xd(e, t) {
        for (; Ke !== null; ) {
            var n = Ke;
            switch (n.tag) {
            case 0:
            case 11:
            case 15:
                xn(8, n, t);
                break;
            case 23:
            case 22:
                if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
                    var l = n.memoizedState.cachePool.pool;
                    l != null && l.refCount++
                }
                break;
            case 24:
                fa(n.memoizedState.cache)
            }
            if (l = n.child,
            l !== null)
                l.return = n,
                Ke = l;
            else
                e: for (n = e; Ke !== null; ) {
                    l = Ke;
                    var i = l.sibling
                      , s = l.return;
                    if (Nd(l),
                    l === n) {
                        Ke = null;
                        break e
                    }
                    if (i !== null) {
                        i.return = s,
                        Ke = i;
                        break e
                    }
                    Ke = s
                }
        }
    }
    var qy = {
        getCacheForType: function(e) {
            var t = Fe(qe)
              , n = t.data.get(e);
            return n === void 0 && (n = e(),
            t.data.set(e, n)),
            n
        },
        cacheSignal: function() {
            return Fe(qe).controller.signal
        }
    }
      , Gy = typeof WeakMap == "function" ? WeakMap : Map
      , Ee = 0
      , Le = null
      , de = null
      , me = 0
      , Te = 0
      , vt = null
      , Cn = !1
      , Ml = !1
      , Co = !1
      , un = 0
      , Ue = 0
      , Tn = 0
      , tl = 0
      , To = 0
      , St = 0
      , zl = 0
      , wa = null
      , ot = null
      , Oo = !1
      , Fi = 0
      , Zd = 0
      , Wi = 1 / 0
      , Ii = null
      , On = null
      , Qe = 0
      , An = null
      , Dl = null
      , rn = 0
      , Ao = 0
      , Ro = null
      , Kd = null
      , La = 0
      , wo = null;
    function bt() {
        return (Ee & 2) !== 0 && me !== 0 ? me & -me : N.T !== null ? Uo() : rc()
    }
    function kd() {
        if (St === 0)
            if ((me & 536870912) === 0 || ye) {
                var e = ui;
                ui <<= 1,
                (ui & 3932160) === 0 && (ui = 262144),
                St = e
            } else
                St = 536870912;
        return e = pt.current,
        e !== null && (e.flags |= 32),
        St
    }
    function st(e, t, n) {
        (e === Le && (Te === 2 || Te === 9) || e.cancelPendingCommit !== null) && (Nl(e, 0),
        Rn(e, me, St, !1)),
        Wl(e, n),
        ((Ee & 2) === 0 || e !== Le) && (e === Le && ((Ee & 2) === 0 && (tl |= n),
        Ue === 4 && Rn(e, me, St, !1)),
        qt(e))
    }
    function Jd(e, t, n) {
        if ((Ee & 6) !== 0)
            throw Error(o(327));
        var l = !n && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Fl(e, t)
          , i = l ? Qy(e, t) : Mo(e, t, !0)
          , s = l;
        do {
            if (i === 0) {
                Ml && !l && Rn(e, t, 0, !1);
                break
            } else {
                if (n = e.current.alternate,
                s && !Yy(n)) {
                    i = Mo(e, t, !1),
                    s = !1;
                    continue
                }
                if (i === 2) {
                    if (s = t,
                    e.errorRecoveryDisabledLanes & s)
                        var h = 0;
                    else
                        h = e.pendingLanes & -536870913,
                        h = h !== 0 ? h : h & 536870912 ? 536870912 : 0;
                    if (h !== 0) {
                        t = h;
                        e: {
                            var y = e;
                            i = wa;
                            var C = y.current.memoizedState.isDehydrated;
                            if (C && (Nl(y, h).flags |= 256),
                            h = Mo(y, h, !1),
                            h !== 2) {
                                if (Co && !C) {
                                    y.errorRecoveryDisabledLanes |= s,
                                    tl |= s,
                                    i = 4;
                                    break e
                                }
                                s = ot,
                                ot = i,
                                s !== null && (ot === null ? ot = s : ot.push.apply(ot, s))
                            }
                            i = h
                        }
                        if (s = !1,
                        i !== 2)
                            continue
                    }
                }
                if (i === 1) {
                    Nl(e, 0),
                    Rn(e, t, 0, !0);
                    break
                }
                e: {
                    switch (l = e,
                    s = i,
                    s) {
                    case 0:
                    case 1:
                        throw Error(o(345));
                    case 4:
                        if ((t & 4194048) !== t)
                            break;
                    case 6:
                        Rn(l, t, St, !Cn);
                        break e;
                    case 2:
                        ot = null;
                        break;
                    case 3:
                    case 5:
                        break;
                    default:
                        throw Error(o(329))
                    }
                    if ((t & 62914560) === t && (i = Fi + 300 - ft(),
                    10 < i)) {
                        if (Rn(l, t, St, !Cn),
                        oi(l, 0, !0) !== 0)
                            break e;
                        rn = t,
                        l.timeoutHandle = Th($d.bind(null, l, n, ot, Ii, Oo, t, St, tl, zl, Cn, s, "Throttled", -0, 0), i);
                        break e
                    }
                    $d(l, n, ot, Ii, Oo, t, St, tl, zl, Cn, s, null, -0, 0)
                }
            }
            break
        } while (!0);
        qt(e)
    }
    function $d(e, t, n, l, i, s, h, y, C, L, U, G, M, D) {
        if (e.timeoutHandle = -1,
        G = t.subtreeFlags,
        G & 8192 || (G & 16785408) === 16785408) {
            G = {
                stylesheets: null,
                count: 0,
                imgCount: 0,
                imgBytes: 0,
                suspenseyImages: [],
                waitingForImages: !0,
                waitingForViewTransition: !1,
                unsuspend: Zt
            },
            Yd(t, s, G);
            var $ = (s & 62914560) === s ? Fi - ft() : (s & 4194048) === s ? Zd - ft() : 0;
            if ($ = Tv(G, $),
            $ !== null) {
                rn = s,
                e.cancelPendingCommit = $(lh.bind(null, e, t, s, n, l, i, h, y, C, U, G, null, M, D)),
                Rn(e, s, h, !L);
                return
            }
        }
        lh(e, t, s, n, l, i, h, y, C)
    }
    function Yy(e) {
        for (var t = e; ; ) {
            var n = t.tag;
            if ((n === 0 || n === 11 || n === 15) && t.flags & 16384 && (n = t.updateQueue,
            n !== null && (n = n.stores,
            n !== null)))
                for (var l = 0; l < n.length; l++) {
                    var i = n[l]
                      , s = i.getSnapshot;
                    i = i.value;
                    try {
                        if (!mt(s(), i))
                            return !1
                    } catch {
                        return !1
                    }
                }
            if (n = t.child,
            t.subtreeFlags & 16384 && n !== null)
                n.return = t,
                t = n;
            else {
                if (t === e)
                    break;
                for (; t.sibling === null; ) {
                    if (t.return === null || t.return === e)
                        return !0;
                    t = t.return
                }
                t.sibling.return = t.return,
                t = t.sibling
            }
        }
        return !0
    }
    function Rn(e, t, n, l) {
        t &= ~To,
        t &= ~tl,
        e.suspendedLanes |= t,
        e.pingedLanes &= ~t,
        l && (e.warmLanes |= t),
        l = e.expirationTimes;
        for (var i = t; 0 < i; ) {
            var s = 31 - ht(i)
              , h = 1 << s;
            l[s] = -1,
            i &= ~h
        }
        n !== 0 && ac(e, n, t)
    }
    function Pi() {
        return (Ee & 6) === 0 ? (Ma(0),
        !1) : !0
    }
    function Lo() {
        if (de !== null) {
            if (Te === 0)
                var e = de.return;
            else
                e = de,
                $t = Kn = null,
                Zr(e),
                Cl = null,
                ha = 0,
                e = de;
            for (; e !== null; )
                Od(e.alternate, e),
                e = e.return;
            de = null
        }
    }
    function Nl(e, t) {
        var n = e.timeoutHandle;
        n !== -1 && (e.timeoutHandle = -1,
        rv(n)),
        n = e.cancelPendingCommit,
        n !== null && (e.cancelPendingCommit = null,
        n()),
        rn = 0,
        Lo(),
        Le = e,
        de = n = kt(e.current, null),
        me = t,
        Te = 0,
        vt = null,
        Cn = !1,
        Ml = Fl(e, t),
        Co = !1,
        zl = St = To = tl = Tn = Ue = 0,
        ot = wa = null,
        Oo = !1,
        (t & 8) !== 0 && (t |= t & 32);
        var l = e.entangledLanes;
        if (l !== 0)
            for (e = e.entanglements,
            l &= t; 0 < l; ) {
                var i = 31 - ht(l)
                  , s = 1 << i;
                t |= e[i],
                l &= ~s
            }
        return un = t,
        bi(),
        n
    }
    function Fd(e, t) {
        ue = null,
        N.H = Ea,
        t === xl || t === Ri ? (t = df(),
        Te = 3) : t === Dr ? (t = df(),
        Te = 4) : Te = t === ro ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1,
        vt = t,
        de === null && (Ue = 1,
        Vi(e, Ct(t, e.current)))
    }
    function Wd() {
        var e = pt.current;
        return e === null ? !0 : (me & 4194048) === me ? Rt === null : (me & 62914560) === me || (me & 536870912) !== 0 ? e === Rt : !1
    }
    function Id() {
        var e = N.H;
        return N.H = Ea,
        e === null ? Ea : e
    }
    function Pd() {
        var e = N.A;
        return N.A = qy,
        e
    }
    function eu() {
        Ue = 4,
        Cn || (me & 4194048) !== me && pt.current !== null || (Ml = !0),
        (Tn & 134217727) === 0 && (tl & 134217727) === 0 || Le === null || Rn(Le, me, St, !1)
    }
    function Mo(e, t, n) {
        var l = Ee;
        Ee |= 2;
        var i = Id()
          , s = Pd();
        (Le !== e || me !== t) && (Ii = null,
        Nl(e, t)),
        t = !1;
        var h = Ue;
        e: do
            try {
                if (Te !== 0 && de !== null) {
                    var y = de
                      , C = vt;
                    switch (Te) {
                    case 8:
                        Lo(),
                        h = 6;
                        break e;
                    case 3:
                    case 2:
                    case 9:
                    case 6:
                        pt.current === null && (t = !0);
                        var L = Te;
                        if (Te = 0,
                        vt = null,
                        Ul(e, y, C, L),
                        n && Ml) {
                            h = 0;
                            break e
                        }
                        break;
                    default:
                        L = Te,
                        Te = 0,
                        vt = null,
                        Ul(e, y, C, L)
                    }
                }
                Vy(),
                h = Ue;
                break
            } catch (U) {
                Fd(e, U)
            }
        while (!0);
        return t && e.shellSuspendCounter++,
        $t = Kn = null,
        Ee = l,
        N.H = i,
        N.A = s,
        de === null && (Le = null,
        me = 0,
        bi()),
        h
    }
    function Vy() {
        for (; de !== null; )
            eh(de)
    }
    function Qy(e, t) {
        var n = Ee;
        Ee |= 2;
        var l = Id()
          , i = Pd();
        Le !== e || me !== t ? (Ii = null,
        Wi = ft() + 500,
        Nl(e, t)) : Ml = Fl(e, t);
        e: do
            try {
                if (Te !== 0 && de !== null) {
                    t = de;
                    var s = vt;
                    t: switch (Te) {
                    case 1:
                        Te = 0,
                        vt = null,
                        Ul(e, t, s, 1);
                        break;
                    case 2:
                    case 9:
                        if (cf(s)) {
                            Te = 0,
                            vt = null,
                            th(t);
                            break
                        }
                        t = function() {
                            Te !== 2 && Te !== 9 || Le !== e || (Te = 7),
                            qt(e)
                        }
                        ,
                        s.then(t, t);
                        break e;
                    case 3:
                        Te = 7;
                        break e;
                    case 4:
                        Te = 5;
                        break e;
                    case 7:
                        cf(s) ? (Te = 0,
                        vt = null,
                        th(t)) : (Te = 0,
                        vt = null,
                        Ul(e, t, s, 7));
                        break;
                    case 5:
                        var h = null;
                        switch (de.tag) {
                        case 26:
                            h = de.memoizedState;
                        case 5:
                        case 27:
                            var y = de;
                            if (h ? Gh(h) : y.stateNode.complete) {
                                Te = 0,
                                vt = null;
                                var C = y.sibling;
                                if (C !== null)
                                    de = C;
                                else {
                                    var L = y.return;
                                    L !== null ? (de = L,
                                    tu(L)) : de = null
                                }
                                break t
                            }
                        }
                        Te = 0,
                        vt = null,
                        Ul(e, t, s, 5);
                        break;
                    case 6:
                        Te = 0,
                        vt = null,
                        Ul(e, t, s, 6);
                        break;
                    case 8:
                        Lo(),
                        Ue = 6;
                        break e;
                    default:
                        throw Error(o(462))
                    }
                }
                Xy();
                break
            } catch (U) {
                Fd(e, U)
            }
        while (!0);
        return $t = Kn = null,
        N.H = l,
        N.A = i,
        Ee = n,
        de !== null ? 0 : (Le = null,
        me = 0,
        bi(),
        Ue)
    }
    function Xy() {
        for (; de !== null && !hp(); )
            eh(de)
    }
    function eh(e) {
        var t = Cd(e.alternate, e, un);
        e.memoizedProps = e.pendingProps,
        t === null ? tu(e) : de = t
    }
    function th(e) {
        var t = e
          , n = t.alternate;
        switch (t.tag) {
        case 15:
        case 0:
            t = vd(n, t, t.pendingProps, t.type, void 0, me);
            break;
        case 11:
            t = vd(n, t, t.pendingProps, t.type.render, t.ref, me);
            break;
        case 5:
            Zr(t);
        default:
            Od(n, t),
            t = de = Ic(t, un),
            t = Cd(n, t, un)
        }
        e.memoizedProps = e.pendingProps,
        t === null ? tu(e) : de = t
    }
    function Ul(e, t, n, l) {
        $t = Kn = null,
        Zr(t),
        Cl = null,
        ha = 0;
        var i = t.return;
        try {
            if (zy(e, i, t, n, me)) {
                Ue = 1,
                Vi(e, Ct(n, e.current)),
                de = null;
                return
            }
        } catch (s) {
            if (i !== null)
                throw de = i,
                s;
            Ue = 1,
            Vi(e, Ct(n, e.current)),
            de = null;
            return
        }
        t.flags & 32768 ? (ye || l === 1 ? e = !0 : Ml || (me & 536870912) !== 0 ? e = !1 : (Cn = e = !0,
        (l === 2 || l === 9 || l === 3 || l === 6) && (l = pt.current,
        l !== null && l.tag === 13 && (l.flags |= 16384))),
        nh(t, e)) : tu(t)
    }
    function tu(e) {
        var t = e;
        do {
            if ((t.flags & 32768) !== 0) {
                nh(t, Cn);
                return
            }
            e = t.return;
            var n = Uy(t.alternate, t, un);
            if (n !== null) {
                de = n;
                return
            }
            if (t = t.sibling,
            t !== null) {
                de = t;
                return
            }
            de = t = e
        } while (t !== null);
        Ue === 0 && (Ue = 5)
    }
    function nh(e, t) {
        do {
            var n = Hy(e.alternate, e);
            if (n !== null) {
                n.flags &= 32767,
                de = n;
                return
            }
            if (n = e.return,
            n !== null && (n.flags |= 32768,
            n.subtreeFlags = 0,
            n.deletions = null),
            !t && (e = e.sibling,
            e !== null)) {
                de = e;
                return
            }
            de = e = n
        } while (e !== null);
        Ue = 6,
        de = null
    }
    function lh(e, t, n, l, i, s, h, y, C) {
        e.cancelPendingCommit = null;
        do
            nu();
        while (Qe !== 0);
        if ((Ee & 6) !== 0)
            throw Error(o(327));
        if (t !== null) {
            if (t === e.current)
                throw Error(o(177));
            if (s = t.lanes | t.childLanes,
            s |= vr,
            xp(e, n, s, h, y, C),
            e === Le && (de = Le = null,
            me = 0),
            Dl = t,
            An = e,
            rn = n,
            Ao = s,
            Ro = i,
            Kd = l,
            (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null,
            e.callbackPriority = 0,
            Jy(ai, function() {
                return oh(),
                null
            })) : (e.callbackNode = null,
            e.callbackPriority = 0),
            l = (t.flags & 13878) !== 0,
            (t.subtreeFlags & 13878) !== 0 || l) {
                l = N.T,
                N.T = null,
                i = Q.p,
                Q.p = 2,
                h = Ee,
                Ee |= 4;
                try {
                    jy(e, t, n)
                } finally {
                    Ee = h,
                    Q.p = i,
                    N.T = l
                }
            }
            Qe = 1,
            ah(),
            ih(),
            uh()
        }
    }
    function ah() {
        if (Qe === 1) {
            Qe = 0;
            var e = An
              , t = Dl
              , n = (t.flags & 13878) !== 0;
            if ((t.subtreeFlags & 13878) !== 0 || n) {
                n = N.T,
                N.T = null;
                var l = Q.p;
                Q.p = 2;
                var i = Ee;
                Ee |= 4;
                try {
                    Bd(t, e);
                    var s = Qo
                      , h = Qc(e.containerInfo)
                      , y = s.focusedElem
                      , C = s.selectionRange;
                    if (h !== y && y && y.ownerDocument && Vc(y.ownerDocument.documentElement, y)) {
                        if (C !== null && hr(y)) {
                            var L = C.start
                              , U = C.end;
                            if (U === void 0 && (U = L),
                            "selectionStart"in y)
                                y.selectionStart = L,
                                y.selectionEnd = Math.min(U, y.value.length);
                            else {
                                var G = y.ownerDocument || document
                                  , M = G && G.defaultView || window;
                                if (M.getSelection) {
                                    var D = M.getSelection()
                                      , $ = y.textContent.length
                                      , ne = Math.min(C.start, $)
                                      , we = C.end === void 0 ? ne : Math.min(C.end, $);
                                    !D.extend && ne > we && (h = we,
                                    we = ne,
                                    ne = h);
                                    var R = Yc(y, ne)
                                      , O = Yc(y, we);
                                    if (R && O && (D.rangeCount !== 1 || D.anchorNode !== R.node || D.anchorOffset !== R.offset || D.focusNode !== O.node || D.focusOffset !== O.offset)) {
                                        var w = G.createRange();
                                        w.setStart(R.node, R.offset),
                                        D.removeAllRanges(),
                                        ne > we ? (D.addRange(w),
                                        D.extend(O.node, O.offset)) : (w.setEnd(O.node, O.offset),
                                        D.addRange(w))
                                    }
                                }
                            }
                        }
                        for (G = [],
                        D = y; D = D.parentNode; )
                            D.nodeType === 1 && G.push({
                                element: D,
                                left: D.scrollLeft,
                                top: D.scrollTop
                            });
                        for (typeof y.focus == "function" && y.focus(),
                        y = 0; y < G.length; y++) {
                            var B = G[y];
                            B.element.scrollLeft = B.left,
                            B.element.scrollTop = B.top
                        }
                    }
                    mu = !!Vo,
                    Qo = Vo = null
                } finally {
                    Ee = i,
                    Q.p = l,
                    N.T = n
                }
            }
            e.current = t,
            Qe = 2
        }
    }
    function ih() {
        if (Qe === 2) {
            Qe = 0;
            var e = An
              , t = Dl
              , n = (t.flags & 8772) !== 0;
            if ((t.subtreeFlags & 8772) !== 0 || n) {
                n = N.T,
                N.T = null;
                var l = Q.p;
                Q.p = 2;
                var i = Ee;
                Ee |= 4;
                try {
                    Dd(e, t.alternate, t)
                } finally {
                    Ee = i,
                    Q.p = l,
                    N.T = n
                }
            }
            Qe = 3
        }
    }
    function uh() {
        if (Qe === 4 || Qe === 3) {
            Qe = 0,
            mp();
            var e = An
              , t = Dl
              , n = rn
              , l = Kd;
            (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Qe = 5 : (Qe = 0,
            Dl = An = null,
            rh(e, e.pendingLanes));
            var i = e.pendingLanes;
            if (i === 0 && (On = null),
            Ju(n),
            t = t.stateNode,
            dt && typeof dt.onCommitFiberRoot == "function")
                try {
                    dt.onCommitFiberRoot($l, t, void 0, (t.current.flags & 128) === 128)
                } catch {}
            if (l !== null) {
                t = N.T,
                i = Q.p,
                Q.p = 2,
                N.T = null;
                try {
                    for (var s = e.onRecoverableError, h = 0; h < l.length; h++) {
                        var y = l[h];
                        s(y.value, {
                            componentStack: y.stack
                        })
                    }
                } finally {
                    N.T = t,
                    Q.p = i
                }
            }
            (rn & 3) !== 0 && nu(),
            qt(e),
            i = e.pendingLanes,
            (n & 261930) !== 0 && (i & 42) !== 0 ? e === wo ? La++ : (La = 0,
            wo = e) : La = 0,
            Ma(0)
        }
    }
    function rh(e, t) {
        (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache,
        t != null && (e.pooledCache = null,
        fa(t)))
    }
    function nu() {
        return ah(),
        ih(),
        uh(),
        oh()
    }
    function oh() {
        if (Qe !== 5)
            return !1;
        var e = An
          , t = Ao;
        Ao = 0;
        var n = Ju(rn)
          , l = N.T
          , i = Q.p;
        try {
            Q.p = 32 > n ? 32 : n,
            N.T = null,
            n = Ro,
            Ro = null;
            var s = An
              , h = rn;
            if (Qe = 0,
            Dl = An = null,
            rn = 0,
            (Ee & 6) !== 0)
                throw Error(o(331));
            var y = Ee;
            if (Ee |= 4,
            Qd(s.current),
            Gd(s, s.current, h, n),
            Ee = y,
            Ma(0, !1),
            dt && typeof dt.onPostCommitFiberRoot == "function")
                try {
                    dt.onPostCommitFiberRoot($l, s)
                } catch {}
            return !0
        } finally {
            Q.p = i,
            N.T = l,
            rh(e, t)
        }
    }
    function sh(e, t, n) {
        t = Ct(n, t),
        t = uo(e.stateNode, t, 2),
        e = bn(e, t, 2),
        e !== null && (Wl(e, 2),
        qt(e))
    }
    function Oe(e, t, n) {
        if (e.tag === 3)
            sh(e, e, n);
        else
            for (; t !== null; ) {
                if (t.tag === 3) {
                    sh(t, e, n);
                    break
                } else if (t.tag === 1) {
                    var l = t.stateNode;
                    if (typeof t.type.getDerivedStateFromError == "function" || typeof l.componentDidCatch == "function" && (On === null || !On.has(l))) {
                        e = Ct(n, e),
                        n = cd(2),
                        l = bn(t, n, 2),
                        l !== null && (fd(n, l, t, e),
                        Wl(l, 2),
                        qt(l));
                        break
                    }
                }
                t = t.return
            }
    }
    function zo(e, t, n) {
        var l = e.pingCache;
        if (l === null) {
            l = e.pingCache = new Gy;
            var i = new Set;
            l.set(t, i)
        } else
            i = l.get(t),
            i === void 0 && (i = new Set,
            l.set(t, i));
        i.has(n) || (Co = !0,
        i.add(n),
        e = Zy.bind(null, e, t, n),
        t.then(e, e))
    }
    function Zy(e, t, n) {
        var l = e.pingCache;
        l !== null && l.delete(t),
        e.pingedLanes |= e.suspendedLanes & n,
        e.warmLanes &= ~n,
        Le === e && (me & n) === n && (Ue === 4 || Ue === 3 && (me & 62914560) === me && 300 > ft() - Fi ? (Ee & 2) === 0 && Nl(e, 0) : To |= n,
        zl === me && (zl = 0)),
        qt(e)
    }
    function ch(e, t) {
        t === 0 && (t = lc()),
        e = Qn(e, t),
        e !== null && (Wl(e, t),
        qt(e))
    }
    function Ky(e) {
        var t = e.memoizedState
          , n = 0;
        t !== null && (n = t.retryLane),
        ch(e, n)
    }
    function ky(e, t) {
        var n = 0;
        switch (e.tag) {
        case 31:
        case 13:
            var l = e.stateNode
              , i = e.memoizedState;
            i !== null && (n = i.retryLane);
            break;
        case 19:
            l = e.stateNode;
            break;
        case 22:
            l = e.stateNode._retryCache;
            break;
        default:
            throw Error(o(314))
        }
        l !== null && l.delete(t),
        ch(e, n)
    }
    function Jy(e, t) {
        return Xu(e, t)
    }
    var lu = null
      , Hl = null
      , Do = !1
      , au = !1
      , No = !1
      , wn = 0;
    function qt(e) {
        e !== Hl && e.next === null && (Hl === null ? lu = Hl = e : Hl = Hl.next = e),
        au = !0,
        Do || (Do = !0,
        Fy())
    }
    function Ma(e, t) {
        if (!No && au) {
            No = !0;
            do
                for (var n = !1, l = lu; l !== null; ) {
                    if (e !== 0) {
                        var i = l.pendingLanes;
                        if (i === 0)
                            var s = 0;
                        else {
                            var h = l.suspendedLanes
                              , y = l.pingedLanes;
                            s = (1 << 31 - ht(42 | e) + 1) - 1,
                            s &= i & ~(h & ~y),
                            s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0
                        }
                        s !== 0 && (n = !0,
                        mh(l, s))
                    } else
                        s = me,
                        s = oi(l, l === Le ? s : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1),
                        (s & 3) === 0 || Fl(l, s) || (n = !0,
                        mh(l, s));
                    l = l.next
                }
            while (n);
            No = !1
        }
    }
    function $y() {
        fh()
    }
    function fh() {
        au = Do = !1;
        var e = 0;
        wn !== 0 && uv() && (e = wn);
        for (var t = ft(), n = null, l = lu; l !== null; ) {
            var i = l.next
              , s = dh(l, t);
            s === 0 ? (l.next = null,
            n === null ? lu = i : n.next = i,
            i === null && (Hl = n)) : (n = l,
            (e !== 0 || (s & 3) !== 0) && (au = !0)),
            l = i
        }
        Qe !== 0 && Qe !== 5 || Ma(e),
        wn !== 0 && (wn = 0)
    }
    function dh(e, t) {
        for (var n = e.suspendedLanes, l = e.pingedLanes, i = e.expirationTimes, s = e.pendingLanes & -62914561; 0 < s; ) {
            var h = 31 - ht(s)
              , y = 1 << h
              , C = i[h];
            C === -1 ? ((y & n) === 0 || (y & l) !== 0) && (i[h] = _p(y, t)) : C <= t && (e.expiredLanes |= y),
            s &= ~y
        }
        if (t = Le,
        n = me,
        n = oi(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1),
        l = e.callbackNode,
        n === 0 || e === t && (Te === 2 || Te === 9) || e.cancelPendingCommit !== null)
            return l !== null && l !== null && Zu(l),
            e.callbackNode = null,
            e.callbackPriority = 0;
        if ((n & 3) === 0 || Fl(e, n)) {
            if (t = n & -n,
            t === e.callbackPriority)
                return t;
            switch (l !== null && Zu(l),
            Ju(n)) {
            case 2:
            case 8:
                n = tc;
                break;
            case 32:
                n = ai;
                break;
            case 268435456:
                n = nc;
                break;
            default:
                n = ai
            }
            return l = hh.bind(null, e),
            n = Xu(n, l),
            e.callbackPriority = t,
            e.callbackNode = n,
            t
        }
        return l !== null && l !== null && Zu(l),
        e.callbackPriority = 2,
        e.callbackNode = null,
        2
    }
    function hh(e, t) {
        if (Qe !== 0 && Qe !== 5)
            return e.callbackNode = null,
            e.callbackPriority = 0,
            null;
        var n = e.callbackNode;
        if (nu() && e.callbackNode !== n)
            return null;
        var l = me;
        return l = oi(e, e === Le ? l : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1),
        l === 0 ? null : (Jd(e, l, t),
        dh(e, ft()),
        e.callbackNode != null && e.callbackNode === n ? hh.bind(null, e) : null)
    }
    function mh(e, t) {
        if (nu())
            return null;
        Jd(e, t, !0)
    }
    function Fy() {
        ov(function() {
            (Ee & 6) !== 0 ? Xu(ec, $y) : fh()
        })
    }
    function Uo() {
        if (wn === 0) {
            var e = El;
            e === 0 && (e = ii,
            ii <<= 1,
            (ii & 261888) === 0 && (ii = 256)),
            wn = e
        }
        return wn
    }
    function gh(e) {
        return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : di("" + e)
    }
    function ph(e, t) {
        var n = t.ownerDocument.createElement("input");
        return n.name = t.name,
        n.value = t.value,
        e.id && n.setAttribute("form", e.id),
        t.parentNode.insertBefore(n, t),
        e = new FormData(e),
        n.parentNode.removeChild(n),
        e
    }
    function Wy(e, t, n, l, i) {
        if (t === "submit" && n && n.stateNode === i) {
            var s = gh((i[lt] || null).action)
              , h = l.submitter;
            h && (t = (t = h[lt] || null) ? gh(t.formAction) : h.getAttribute("formAction"),
            t !== null && (s = t,
            h = null));
            var y = new pi("action","action",null,l,i);
            e.push({
                event: y,
                listeners: [{
                    instance: null,
                    listener: function() {
                        if (l.defaultPrevented) {
                            if (wn !== 0) {
                                var C = h ? ph(i, h) : new FormData(i);
                                eo(n, {
                                    pending: !0,
                                    data: C,
                                    method: i.method,
                                    action: s
                                }, null, C)
                            }
                        } else
                            typeof s == "function" && (y.preventDefault(),
                            C = h ? ph(i, h) : new FormData(i),
                            eo(n, {
                                pending: !0,
                                data: C,
                                method: i.method,
                                action: s
                            }, s, C))
                    },
                    currentTarget: i
                }]
            })
        }
    }
    for (var Ho = 0; Ho < yr.length; Ho++) {
        var jo = yr[Ho]
          , Iy = jo.toLowerCase()
          , Py = jo[0].toUpperCase() + jo.slice(1);
        zt(Iy, "on" + Py)
    }
    zt(Kc, "onAnimationEnd"),
    zt(kc, "onAnimationIteration"),
    zt(Jc, "onAnimationStart"),
    zt("dblclick", "onDoubleClick"),
    zt("focusin", "onFocus"),
    zt("focusout", "onBlur"),
    zt(gy, "onTransitionRun"),
    zt(py, "onTransitionStart"),
    zt(yy, "onTransitionCancel"),
    zt($c, "onTransitionEnd"),
    rl("onMouseEnter", ["mouseout", "mouseover"]),
    rl("onMouseLeave", ["mouseout", "mouseover"]),
    rl("onPointerEnter", ["pointerout", "pointerover"]),
    rl("onPointerLeave", ["pointerout", "pointerover"]),
    qn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")),
    qn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),
    qn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    qn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")),
    qn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")),
    qn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var za = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" ")
      , ev = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(za));
    function yh(e, t) {
        t = (t & 4) !== 0;
        for (var n = 0; n < e.length; n++) {
            var l = e[n]
              , i = l.event;
            l = l.listeners;
            e: {
                var s = void 0;
                if (t)
                    for (var h = l.length - 1; 0 <= h; h--) {
                        var y = l[h]
                          , C = y.instance
                          , L = y.currentTarget;
                        if (y = y.listener,
                        C !== s && i.isPropagationStopped())
                            break e;
                        s = y,
                        i.currentTarget = L;
                        try {
                            s(i)
                        } catch (U) {
                            Si(U)
                        }
                        i.currentTarget = null,
                        s = C
                    }
                else
                    for (h = 0; h < l.length; h++) {
                        if (y = l[h],
                        C = y.instance,
                        L = y.currentTarget,
                        y = y.listener,
                        C !== s && i.isPropagationStopped())
                            break e;
                        s = y,
                        i.currentTarget = L;
                        try {
                            s(i)
                        } catch (U) {
                            Si(U)
                        }
                        i.currentTarget = null,
                        s = C
                    }
            }
        }
    }
    function he(e, t) {
        var n = t[$u];
        n === void 0 && (n = t[$u] = new Set);
        var l = e + "__bubble";
        n.has(l) || (vh(t, e, 2, !1),
        n.add(l))
    }
    function Bo(e, t, n) {
        var l = 0;
        t && (l |= 4),
        vh(n, e, l, t)
    }
    var iu = "_reactListening" + Math.random().toString(36).slice(2);
    function qo(e) {
        if (!e[iu]) {
            e[iu] = !0,
            cc.forEach(function(n) {
                n !== "selectionchange" && (ev.has(n) || Bo(n, !1, e),
                Bo(n, !0, e))
            });
            var t = e.nodeType === 9 ? e : e.ownerDocument;
            t === null || t[iu] || (t[iu] = !0,
            Bo("selectionchange", !1, t))
        }
    }
    function vh(e, t, n, l) {
        switch (kh(t)) {
        case 2:
            var i = Rv;
            break;
        case 8:
            i = wv;
            break;
        default:
            i = es
        }
        n = i.bind(null, t, n, e),
        i = void 0,
        !ar || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (i = !0),
        l ? i !== void 0 ? e.addEventListener(t, n, {
            capture: !0,
            passive: i
        }) : e.addEventListener(t, n, !0) : i !== void 0 ? e.addEventListener(t, n, {
            passive: i
        }) : e.addEventListener(t, n, !1)
    }
    function Go(e, t, n, l, i) {
        var s = l;
        if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
            e: for (; ; ) {
                if (l === null)
                    return;
                var h = l.tag;
                if (h === 3 || h === 4) {
                    var y = l.stateNode.containerInfo;
                    if (y === i)
                        break;
                    if (h === 4)
                        for (h = l.return; h !== null; ) {
                            var C = h.tag;
                            if ((C === 3 || C === 4) && h.stateNode.containerInfo === i)
                                return;
                            h = h.return
                        }
                    for (; y !== null; ) {
                        if (h = al(y),
                        h === null)
                            return;
                        if (C = h.tag,
                        C === 5 || C === 6 || C === 26 || C === 27) {
                            l = s = h;
                            continue e
                        }
                        y = y.parentNode
                    }
                }
                l = l.return
            }
        _c(function() {
            var L = s
              , U = nr(n)
              , G = [];
            e: {
                var M = Fc.get(e);
                if (M !== void 0) {
                    var D = pi
                      , $ = e;
                    switch (e) {
                    case "keypress":
                        if (mi(n) === 0)
                            break e;
                    case "keydown":
                    case "keyup":
                        D = kp;
                        break;
                    case "focusin":
                        $ = "focus",
                        D = or;
                        break;
                    case "focusout":
                        $ = "blur",
                        D = or;
                        break;
                    case "beforeblur":
                    case "afterblur":
                        D = or;
                        break;
                    case "click":
                        if (n.button === 2)
                            break e;
                    case "auxclick":
                    case "dblclick":
                    case "mousedown":
                    case "mousemove":
                    case "mouseup":
                    case "mouseout":
                    case "mouseover":
                    case "contextmenu":
                        D = Tc;
                        break;
                    case "drag":
                    case "dragend":
                    case "dragenter":
                    case "dragexit":
                    case "dragleave":
                    case "dragover":
                    case "dragstart":
                    case "drop":
                        D = Up;
                        break;
                    case "touchcancel":
                    case "touchend":
                    case "touchmove":
                    case "touchstart":
                        D = Fp;
                        break;
                    case Kc:
                    case kc:
                    case Jc:
                        D = Bp;
                        break;
                    case $c:
                        D = Ip;
                        break;
                    case "scroll":
                    case "scrollend":
                        D = Dp;
                        break;
                    case "wheel":
                        D = ey;
                        break;
                    case "copy":
                    case "cut":
                    case "paste":
                        D = Gp;
                        break;
                    case "gotpointercapture":
                    case "lostpointercapture":
                    case "pointercancel":
                    case "pointerdown":
                    case "pointermove":
                    case "pointerout":
                    case "pointerover":
                    case "pointerup":
                        D = Ac;
                        break;
                    case "toggle":
                    case "beforetoggle":
                        D = ny
                    }
                    var ne = (t & 4) !== 0
                      , we = !ne && (e === "scroll" || e === "scrollend")
                      , R = ne ? M !== null ? M + "Capture" : null : M;
                    ne = [];
                    for (var O = L, w; O !== null; ) {
                        var B = O;
                        if (w = B.stateNode,
                        B = B.tag,
                        B !== 5 && B !== 26 && B !== 27 || w === null || R === null || (B = ea(O, R),
                        B != null && ne.push(Da(O, B, w))),
                        we)
                            break;
                        O = O.return
                    }
                    0 < ne.length && (M = new D(M,$,null,n,U),
                    G.push({
                        event: M,
                        listeners: ne
                    }))
                }
            }
            if ((t & 7) === 0) {
                e: {
                    if (M = e === "mouseover" || e === "pointerover",
                    D = e === "mouseout" || e === "pointerout",
                    M && n !== tr && ($ = n.relatedTarget || n.fromElement) && (al($) || $[ll]))
                        break e;
                    if ((D || M) && (M = U.window === U ? U : (M = U.ownerDocument) ? M.defaultView || M.parentWindow : window,
                    D ? ($ = n.relatedTarget || n.toElement,
                    D = L,
                    $ = $ ? al($) : null,
                    $ !== null && (we = f($),
                    ne = $.tag,
                    $ !== we || ne !== 5 && ne !== 27 && ne !== 6) && ($ = null)) : (D = null,
                    $ = L),
                    D !== $)) {
                        if (ne = Tc,
                        B = "onMouseLeave",
                        R = "onMouseEnter",
                        O = "mouse",
                        (e === "pointerout" || e === "pointerover") && (ne = Ac,
                        B = "onPointerLeave",
                        R = "onPointerEnter",
                        O = "pointer"),
                        we = D == null ? M : Pl(D),
                        w = $ == null ? M : Pl($),
                        M = new ne(B,O + "leave",D,n,U),
                        M.target = we,
                        M.relatedTarget = w,
                        B = null,
                        al(U) === L && (ne = new ne(R,O + "enter",$,n,U),
                        ne.target = w,
                        ne.relatedTarget = we,
                        B = ne),
                        we = B,
                        D && $)
                            t: {
                                for (ne = tv,
                                R = D,
                                O = $,
                                w = 0,
                                B = R; B; B = ne(B))
                                    w++;
                                B = 0;
                                for (var P = O; P; P = ne(P))
                                    B++;
                                for (; 0 < w - B; )
                                    R = ne(R),
                                    w--;
                                for (; 0 < B - w; )
                                    O = ne(O),
                                    B--;
                                for (; w--; ) {
                                    if (R === O || O !== null && R === O.alternate) {
                                        ne = R;
                                        break t
                                    }
                                    R = ne(R),
                                    O = ne(O)
                                }
                                ne = null
                            }
                        else
                            ne = null;
                        D !== null && Sh(G, M, D, ne, !1),
                        $ !== null && we !== null && Sh(G, we, $, ne, !0)
                    }
                }
                e: {
                    if (M = L ? Pl(L) : window,
                    D = M.nodeName && M.nodeName.toLowerCase(),
                    D === "select" || D === "input" && M.type === "file")
                        var Se = Uc;
                    else if (Dc(M))
                        if (Hc)
                            Se = dy;
                        else {
                            Se = cy;
                            var I = sy
                        }
                    else
                        D = M.nodeName,
                        !D || D.toLowerCase() !== "input" || M.type !== "checkbox" && M.type !== "radio" ? L && er(L.elementType) && (Se = Uc) : Se = fy;
                    if (Se && (Se = Se(e, L))) {
                        Nc(G, Se, n, U);
                        break e
                    }
                    I && I(e, M, L),
                    e === "focusout" && L && M.type === "number" && L.memoizedProps.value != null && Pu(M, "number", M.value)
                }
                switch (I = L ? Pl(L) : window,
                e) {
                case "focusin":
                    (Dc(I) || I.contentEditable === "true") && (hl = I,
                    mr = L,
                    oa = null);
                    break;
                case "focusout":
                    oa = mr = hl = null;
                    break;
                case "mousedown":
                    gr = !0;
                    break;
                case "contextmenu":
                case "mouseup":
                case "dragend":
                    gr = !1,
                    Xc(G, n, U);
                    break;
                case "selectionchange":
                    if (my)
                        break;
                case "keydown":
                case "keyup":
                    Xc(G, n, U)
                }
                var se;
                if (cr)
                    e: {
                        switch (e) {
                        case "compositionstart":
                            var ge = "onCompositionStart";
                            break e;
                        case "compositionend":
                            ge = "onCompositionEnd";
                            break e;
                        case "compositionupdate":
                            ge = "onCompositionUpdate";
                            break e
                        }
                        ge = void 0
                    }
                else
                    dl ? Mc(e, n) && (ge = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (ge = "onCompositionStart");
                ge && (Rc && n.locale !== "ko" && (dl || ge !== "onCompositionStart" ? ge === "onCompositionEnd" && dl && (se = xc()) : (hn = U,
                ir = "value"in hn ? hn.value : hn.textContent,
                dl = !0)),
                I = uu(L, ge),
                0 < I.length && (ge = new Oc(ge,e,null,n,U),
                G.push({
                    event: ge,
                    listeners: I
                }),
                se ? ge.data = se : (se = zc(n),
                se !== null && (ge.data = se)))),
                (se = ay ? iy(e, n) : uy(e, n)) && (ge = uu(L, "onBeforeInput"),
                0 < ge.length && (I = new Oc("onBeforeInput","beforeinput",null,n,U),
                G.push({
                    event: I,
                    listeners: ge
                }),
                I.data = se)),
                Wy(G, e, L, n, U)
            }
            yh(G, t)
        })
    }
    function Da(e, t, n) {
        return {
            instance: e,
            listener: t,
            currentTarget: n
        }
    }
    function uu(e, t) {
        for (var n = t + "Capture", l = []; e !== null; ) {
            var i = e
              , s = i.stateNode;
            if (i = i.tag,
            i !== 5 && i !== 26 && i !== 27 || s === null || (i = ea(e, n),
            i != null && l.unshift(Da(e, i, s)),
            i = ea(e, t),
            i != null && l.push(Da(e, i, s))),
            e.tag === 3)
                return l;
            e = e.return
        }
        return []
    }
    function tv(e) {
        if (e === null)
            return null;
        do
            e = e.return;
        while (e && e.tag !== 5 && e.tag !== 27);
        return e || null
    }
    function Sh(e, t, n, l, i) {
        for (var s = t._reactName, h = []; n !== null && n !== l; ) {
            var y = n
              , C = y.alternate
              , L = y.stateNode;
            if (y = y.tag,
            C !== null && C === l)
                break;
            y !== 5 && y !== 26 && y !== 27 || L === null || (C = L,
            i ? (L = ea(n, s),
            L != null && h.unshift(Da(n, L, C))) : i || (L = ea(n, s),
            L != null && h.push(Da(n, L, C)))),
            n = n.return
        }
        h.length !== 0 && e.push({
            event: t,
            listeners: h
        })
    }
    var nv = /\r\n?/g
      , lv = /\u0000|\uFFFD/g;
    function bh(e) {
        return (typeof e == "string" ? e : "" + e).replace(nv, `
`).replace(lv, "")
    }
    function Eh(e, t) {
        return t = bh(t),
        bh(e) === t
    }
    function Re(e, t, n, l, i, s) {
        switch (n) {
        case "children":
            typeof l == "string" ? t === "body" || t === "textarea" && l === "" || sl(e, l) : (typeof l == "number" || typeof l == "bigint") && t !== "body" && sl(e, "" + l);
            break;
        case "className":
            ci(e, "class", l);
            break;
        case "tabIndex":
            ci(e, "tabindex", l);
            break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
            ci(e, n, l);
            break;
        case "style":
            bc(e, l, s);
            break;
        case "data":
            if (t !== "object") {
                ci(e, "data", l);
                break
            }
        case "src":
        case "href":
            if (l === "" && (t !== "a" || n !== "href")) {
                e.removeAttribute(n);
                break
            }
            if (l == null || typeof l == "function" || typeof l == "symbol" || typeof l == "boolean") {
                e.removeAttribute(n);
                break
            }
            l = di("" + l),
            e.setAttribute(n, l);
            break;
        case "action":
        case "formAction":
            if (typeof l == "function") {
                e.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                break
            } else
                typeof s == "function" && (n === "formAction" ? (t !== "input" && Re(e, t, "name", i.name, i, null),
                Re(e, t, "formEncType", i.formEncType, i, null),
                Re(e, t, "formMethod", i.formMethod, i, null),
                Re(e, t, "formTarget", i.formTarget, i, null)) : (Re(e, t, "encType", i.encType, i, null),
                Re(e, t, "method", i.method, i, null),
                Re(e, t, "target", i.target, i, null)));
            if (l == null || typeof l == "symbol" || typeof l == "boolean") {
                e.removeAttribute(n);
                break
            }
            l = di("" + l),
            e.setAttribute(n, l);
            break;
        case "onClick":
            l != null && (e.onclick = Zt);
            break;
        case "onScroll":
            l != null && he("scroll", e);
            break;
        case "onScrollEnd":
            l != null && he("scrollend", e);
            break;
        case "dangerouslySetInnerHTML":
            if (l != null) {
                if (typeof l != "object" || !("__html"in l))
                    throw Error(o(61));
                if (n = l.__html,
                n != null) {
                    if (i.children != null)
                        throw Error(o(60));
                    e.innerHTML = n
                }
            }
            break;
        case "multiple":
            e.multiple = l && typeof l != "function" && typeof l != "symbol";
            break;
        case "muted":
            e.muted = l && typeof l != "function" && typeof l != "symbol";
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
            break;
        case "autoFocus":
            break;
        case "xlinkHref":
            if (l == null || typeof l == "function" || typeof l == "boolean" || typeof l == "symbol") {
                e.removeAttribute("xlink:href");
                break
            }
            n = di("" + l),
            e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
            break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
            l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "" + l) : e.removeAttribute(n);
            break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
            l && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, "") : e.removeAttribute(n);
            break;
        case "capture":
        case "download":
            l === !0 ? e.setAttribute(n, "") : l !== !1 && l != null && typeof l != "function" && typeof l != "symbol" ? e.setAttribute(n, l) : e.removeAttribute(n);
            break;
        case "cols":
        case "rows":
        case "size":
        case "span":
            l != null && typeof l != "function" && typeof l != "symbol" && !isNaN(l) && 1 <= l ? e.setAttribute(n, l) : e.removeAttribute(n);
            break;
        case "rowSpan":
        case "start":
            l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l) ? e.removeAttribute(n) : e.setAttribute(n, l);
            break;
        case "popover":
            he("beforetoggle", e),
            he("toggle", e),
            si(e, "popover", l);
            break;
        case "xlinkActuate":
            Xt(e, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
            break;
        case "xlinkArcrole":
            Xt(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
            break;
        case "xlinkRole":
            Xt(e, "http://www.w3.org/1999/xlink", "xlink:role", l);
            break;
        case "xlinkShow":
            Xt(e, "http://www.w3.org/1999/xlink", "xlink:show", l);
            break;
        case "xlinkTitle":
            Xt(e, "http://www.w3.org/1999/xlink", "xlink:title", l);
            break;
        case "xlinkType":
            Xt(e, "http://www.w3.org/1999/xlink", "xlink:type", l);
            break;
        case "xmlBase":
            Xt(e, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
            break;
        case "xmlLang":
            Xt(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
            break;
        case "xmlSpace":
            Xt(e, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
            break;
        case "is":
            si(e, "is", l);
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Mp.get(n) || n,
            si(e, n, l))
        }
    }
    function Yo(e, t, n, l, i, s) {
        switch (n) {
        case "style":
            bc(e, l, s);
            break;
        case "dangerouslySetInnerHTML":
            if (l != null) {
                if (typeof l != "object" || !("__html"in l))
                    throw Error(o(61));
                if (n = l.__html,
                n != null) {
                    if (i.children != null)
                        throw Error(o(60));
                    e.innerHTML = n
                }
            }
            break;
        case "children":
            typeof l == "string" ? sl(e, l) : (typeof l == "number" || typeof l == "bigint") && sl(e, "" + l);
            break;
        case "onScroll":
            l != null && he("scroll", e);
            break;
        case "onScrollEnd":
            l != null && he("scrollend", e);
            break;
        case "onClick":
            l != null && (e.onclick = Zt);
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
            break;
        case "innerText":
        case "textContent":
            break;
        default:
            if (!fc.hasOwnProperty(n))
                e: {
                    if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"),
                    t = n.slice(2, i ? n.length - 7 : void 0),
                    s = e[lt] || null,
                    s = s != null ? s[n] : null,
                    typeof s == "function" && e.removeEventListener(t, s, i),
                    typeof l == "function")) {
                        typeof s != "function" && s !== null && (n in e ? e[n] = null : e.hasAttribute(n) && e.removeAttribute(n)),
                        e.addEventListener(t, l, i);
                        break e
                    }
                    n in e ? e[n] = l : l === !0 ? e.setAttribute(n, "") : si(e, n, l)
                }
        }
    }
    function Ie(e, t, n) {
        switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "img":
            he("error", e),
            he("load", e);
            var l = !1, i = !1, s;
            for (s in n)
                if (n.hasOwnProperty(s)) {
                    var h = n[s];
                    if (h != null)
                        switch (s) {
                        case "src":
                            l = !0;
                            break;
                        case "srcSet":
                            i = !0;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            throw Error(o(137, t));
                        default:
                            Re(e, t, s, h, n, null)
                        }
                }
            i && Re(e, t, "srcSet", n.srcSet, n, null),
            l && Re(e, t, "src", n.src, n, null);
            return;
        case "input":
            he("invalid", e);
            var y = s = h = i = null
              , C = null
              , L = null;
            for (l in n)
                if (n.hasOwnProperty(l)) {
                    var U = n[l];
                    if (U != null)
                        switch (l) {
                        case "name":
                            i = U;
                            break;
                        case "type":
                            h = U;
                            break;
                        case "checked":
                            C = U;
                            break;
                        case "defaultChecked":
                            L = U;
                            break;
                        case "value":
                            s = U;
                            break;
                        case "defaultValue":
                            y = U;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            if (U != null)
                                throw Error(o(137, t));
                            break;
                        default:
                            Re(e, t, l, U, n, null)
                        }
                }
            pc(e, s, y, C, L, h, i, !1);
            return;
        case "select":
            he("invalid", e),
            l = h = s = null;
            for (i in n)
                if (n.hasOwnProperty(i) && (y = n[i],
                y != null))
                    switch (i) {
                    case "value":
                        s = y;
                        break;
                    case "defaultValue":
                        h = y;
                        break;
                    case "multiple":
                        l = y;
                    default:
                        Re(e, t, i, y, n, null)
                    }
            t = s,
            n = h,
            e.multiple = !!l,
            t != null ? ol(e, !!l, t, !1) : n != null && ol(e, !!l, n, !0);
            return;
        case "textarea":
            he("invalid", e),
            s = i = l = null;
            for (h in n)
                if (n.hasOwnProperty(h) && (y = n[h],
                y != null))
                    switch (h) {
                    case "value":
                        l = y;
                        break;
                    case "defaultValue":
                        i = y;
                        break;
                    case "children":
                        s = y;
                        break;
                    case "dangerouslySetInnerHTML":
                        if (y != null)
                            throw Error(o(91));
                        break;
                    default:
                        Re(e, t, h, y, n, null)
                    }
            vc(e, l, i, s);
            return;
        case "option":
            for (C in n)
                n.hasOwnProperty(C) && (l = n[C],
                l != null) && (C === "selected" ? e.selected = l && typeof l != "function" && typeof l != "symbol" : Re(e, t, C, l, n, null));
            return;
        case "dialog":
            he("beforetoggle", e),
            he("toggle", e),
            he("cancel", e),
            he("close", e);
            break;
        case "iframe":
        case "object":
            he("load", e);
            break;
        case "video":
        case "audio":
            for (l = 0; l < za.length; l++)
                he(za[l], e);
            break;
        case "image":
            he("error", e),
            he("load", e);
            break;
        case "details":
            he("toggle", e);
            break;
        case "embed":
        case "source":
        case "link":
            he("error", e),
            he("load", e);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
            for (L in n)
                if (n.hasOwnProperty(L) && (l = n[L],
                l != null))
                    switch (L) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        throw Error(o(137, t));
                    default:
                        Re(e, t, L, l, n, null)
                    }
            return;
        default:
            if (er(t)) {
                for (U in n)
                    n.hasOwnProperty(U) && (l = n[U],
                    l !== void 0 && Yo(e, t, U, l, n, void 0));
                return
            }
        }
        for (y in n)
            n.hasOwnProperty(y) && (l = n[y],
            l != null && Re(e, t, y, l, n, null))
    }
    function av(e, t, n, l) {
        switch (t) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
            break;
        case "input":
            var i = null
              , s = null
              , h = null
              , y = null
              , C = null
              , L = null
              , U = null;
            for (D in n) {
                var G = n[D];
                if (n.hasOwnProperty(D) && G != null)
                    switch (D) {
                    case "checked":
                        break;
                    case "value":
                        break;
                    case "defaultValue":
                        C = G;
                    default:
                        l.hasOwnProperty(D) || Re(e, t, D, null, l, G)
                    }
            }
            for (var M in l) {
                var D = l[M];
                if (G = n[M],
                l.hasOwnProperty(M) && (D != null || G != null))
                    switch (M) {
                    case "type":
                        s = D;
                        break;
                    case "name":
                        i = D;
                        break;
                    case "checked":
                        L = D;
                        break;
                    case "defaultChecked":
                        U = D;
                        break;
                    case "value":
                        h = D;
                        break;
                    case "defaultValue":
                        y = D;
                        break;
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (D != null)
                            throw Error(o(137, t));
                        break;
                    default:
                        D !== G && Re(e, t, M, D, l, G)
                    }
            }
            Iu(e, h, y, C, L, U, s, i);
            return;
        case "select":
            D = h = y = M = null;
            for (s in n)
                if (C = n[s],
                n.hasOwnProperty(s) && C != null)
                    switch (s) {
                    case "value":
                        break;
                    case "multiple":
                        D = C;
                    default:
                        l.hasOwnProperty(s) || Re(e, t, s, null, l, C)
                    }
            for (i in l)
                if (s = l[i],
                C = n[i],
                l.hasOwnProperty(i) && (s != null || C != null))
                    switch (i) {
                    case "value":
                        M = s;
                        break;
                    case "defaultValue":
                        y = s;
                        break;
                    case "multiple":
                        h = s;
                    default:
                        s !== C && Re(e, t, i, s, l, C)
                    }
            t = y,
            n = h,
            l = D,
            M != null ? ol(e, !!n, M, !1) : !!l != !!n && (t != null ? ol(e, !!n, t, !0) : ol(e, !!n, n ? [] : "", !1));
            return;
        case "textarea":
            D = M = null;
            for (y in n)
                if (i = n[y],
                n.hasOwnProperty(y) && i != null && !l.hasOwnProperty(y))
                    switch (y) {
                    case "value":
                        break;
                    case "children":
                        break;
                    default:
                        Re(e, t, y, null, l, i)
                    }
            for (h in l)
                if (i = l[h],
                s = n[h],
                l.hasOwnProperty(h) && (i != null || s != null))
                    switch (h) {
                    case "value":
                        M = i;
                        break;
                    case "defaultValue":
                        D = i;
                        break;
                    case "children":
                        break;
                    case "dangerouslySetInnerHTML":
                        if (i != null)
                            throw Error(o(91));
                        break;
                    default:
                        i !== s && Re(e, t, h, i, l, s)
                    }
            yc(e, M, D);
            return;
        case "option":
            for (var $ in n)
                M = n[$],
                n.hasOwnProperty($) && M != null && !l.hasOwnProperty($) && ($ === "selected" ? e.selected = !1 : Re(e, t, $, null, l, M));
            for (C in l)
                M = l[C],
                D = n[C],
                l.hasOwnProperty(C) && M !== D && (M != null || D != null) && (C === "selected" ? e.selected = M && typeof M != "function" && typeof M != "symbol" : Re(e, t, C, M, l, D));
            return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
            for (var ne in n)
                M = n[ne],
                n.hasOwnProperty(ne) && M != null && !l.hasOwnProperty(ne) && Re(e, t, ne, null, l, M);
            for (L in l)
                if (M = l[L],
                D = n[L],
                l.hasOwnProperty(L) && M !== D && (M != null || D != null))
                    switch (L) {
                    case "children":
                    case "dangerouslySetInnerHTML":
                        if (M != null)
                            throw Error(o(137, t));
                        break;
                    default:
                        Re(e, t, L, M, l, D)
                    }
            return;
        default:
            if (er(t)) {
                for (var we in n)
                    M = n[we],
                    n.hasOwnProperty(we) && M !== void 0 && !l.hasOwnProperty(we) && Yo(e, t, we, void 0, l, M);
                for (U in l)
                    M = l[U],
                    D = n[U],
                    !l.hasOwnProperty(U) || M === D || M === void 0 && D === void 0 || Yo(e, t, U, M, l, D);
                return
            }
        }
        for (var R in n)
            M = n[R],
            n.hasOwnProperty(R) && M != null && !l.hasOwnProperty(R) && Re(e, t, R, null, l, M);
        for (G in l)
            M = l[G],
            D = n[G],
            !l.hasOwnProperty(G) || M === D || M == null && D == null || Re(e, t, G, M, l, D)
    }
    function _h(e) {
        switch (e) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
            return !0;
        default:
            return !1
        }
    }
    function iv() {
        if (typeof performance.getEntriesByType == "function") {
            for (var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0; l < n.length; l++) {
                var i = n[l]
                  , s = i.transferSize
                  , h = i.initiatorType
                  , y = i.duration;
                if (s && y && _h(h)) {
                    for (h = 0,
                    y = i.responseEnd,
                    l += 1; l < n.length; l++) {
                        var C = n[l]
                          , L = C.startTime;
                        if (L > y)
                            break;
                        var U = C.transferSize
                          , G = C.initiatorType;
                        U && _h(G) && (C = C.responseEnd,
                        h += U * (C < y ? 1 : (y - L) / (C - L)))
                    }
                    if (--l,
                    t += 8 * (s + h) / (i.duration / 1e3),
                    e++,
                    10 < e)
                        break
                }
            }
            if (0 < e)
                return t / e / 1e6
        }
        return navigator.connection && (e = navigator.connection.downlink,
        typeof e == "number") ? e : 5
    }
    var Vo = null
      , Qo = null;
    function ru(e) {
        return e.nodeType === 9 ? e : e.ownerDocument
    }
    function xh(e) {
        switch (e) {
        case "http://www.w3.org/2000/svg":
            return 1;
        case "http://www.w3.org/1998/Math/MathML":
            return 2;
        default:
            return 0
        }
    }
    function Ch(e, t) {
        if (e === 0)
            switch (t) {
            case "svg":
                return 1;
            case "math":
                return 2;
            default:
                return 0
            }
        return e === 1 && t === "foreignObject" ? 0 : e
    }
    function Xo(e, t) {
        return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null
    }
    var Zo = null;
    function uv() {
        var e = window.event;
        return e && e.type === "popstate" ? e === Zo ? !1 : (Zo = e,
        !0) : (Zo = null,
        !1)
    }
    var Th = typeof setTimeout == "function" ? setTimeout : void 0
      , rv = typeof clearTimeout == "function" ? clearTimeout : void 0
      , Oh = typeof Promise == "function" ? Promise : void 0
      , ov = typeof queueMicrotask == "function" ? queueMicrotask : typeof Oh < "u" ? function(e) {
        return Oh.resolve(null).then(e).catch(sv)
    }
    : Th;
    function sv(e) {
        setTimeout(function() {
            throw e
        })
    }
    function Ln(e) {
        return e === "head"
    }
    function Ah(e, t) {
        var n = t
          , l = 0;
        do {
            var i = n.nextSibling;
            if (e.removeChild(n),
            i && i.nodeType === 8)
                if (n = i.data,
                n === "/$" || n === "/&") {
                    if (l === 0) {
                        e.removeChild(i),
                        Gl(t);
                        return
                    }
                    l--
                } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
                    l++;
                else if (n === "html")
                    Na(e.ownerDocument.documentElement);
                else if (n === "head") {
                    n = e.ownerDocument.head,
                    Na(n);
                    for (var s = n.firstChild; s; ) {
                        var h = s.nextSibling
                          , y = s.nodeName;
                        s[Il] || y === "SCRIPT" || y === "STYLE" || y === "LINK" && s.rel.toLowerCase() === "stylesheet" || n.removeChild(s),
                        s = h
                    }
                } else
                    n === "body" && Na(e.ownerDocument.body);
            n = i
        } while (n);
        Gl(t)
    }
    function Rh(e, t) {
        var n = e;
        e = 0;
        do {
            var l = n.nextSibling;
            if (n.nodeType === 1 ? t ? (n._stashedDisplay = n.style.display,
            n.style.display = "none") : (n.style.display = n._stashedDisplay || "",
            n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (t ? (n._stashedText = n.nodeValue,
            n.nodeValue = "") : n.nodeValue = n._stashedText || ""),
            l && l.nodeType === 8)
                if (n = l.data,
                n === "/$") {
                    if (e === 0)
                        break;
                    e--
                } else
                    n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || e++;
            n = l
        } while (n)
    }
    function Ko(e) {
        var t = e.firstChild;
        for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
            var n = t;
            switch (t = t.nextSibling,
            n.nodeName) {
            case "HTML":
            case "HEAD":
            case "BODY":
                Ko(n),
                Fu(n);
                continue;
            case "SCRIPT":
            case "STYLE":
                continue;
            case "LINK":
                if (n.rel.toLowerCase() === "stylesheet")
                    continue
            }
            e.removeChild(n)
        }
    }
    function cv(e, t, n, l) {
        for (; e.nodeType === 1; ) {
            var i = n;
            if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
                if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden"))
                    break
            } else if (l) {
                if (!e[Il])
                    switch (t) {
                    case "meta":
                        if (!e.hasAttribute("itemprop"))
                            break;
                        return e;
                    case "link":
                        if (s = e.getAttribute("rel"),
                        s === "stylesheet" && e.hasAttribute("data-precedence"))
                            break;
                        if (s !== i.rel || e.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || e.getAttribute("title") !== (i.title == null ? null : i.title))
                            break;
                        return e;
                    case "style":
                        if (e.hasAttribute("data-precedence"))
                            break;
                        return e;
                    case "script":
                        if (s = e.getAttribute("src"),
                        (s !== (i.src == null ? null : i.src) || e.getAttribute("type") !== (i.type == null ? null : i.type) || e.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && s && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                            break;
                        return e;
                    default:
                        return e
                    }
            } else if (t === "input" && e.type === "hidden") {
                var s = i.name == null ? null : "" + i.name;
                if (i.type === "hidden" && e.getAttribute("name") === s)
                    return e
            } else
                return e;
            if (e = wt(e.nextSibling),
            e === null)
                break
        }
        return null
    }
    function fv(e, t, n) {
        if (t === "")
            return null;
        for (; e.nodeType !== 3; )
            if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !n || (e = wt(e.nextSibling),
            e === null))
                return null;
        return e
    }
    function wh(e, t) {
        for (; e.nodeType !== 8; )
            if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = wt(e.nextSibling),
            e === null))
                return null;
        return e
    }
    function ko(e) {
        return e.data === "$?" || e.data === "$~"
    }
    function Jo(e) {
        return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading"
    }
    function dv(e, t) {
        var n = e.ownerDocument;
        if (e.data === "$~")
            e._reactRetry = t;
        else if (e.data !== "$?" || n.readyState !== "loading")
            t();
        else {
            var l = function() {
                t(),
                n.removeEventListener("DOMContentLoaded", l)
            };
            n.addEventListener("DOMContentLoaded", l),
            e._reactRetry = l
        }
    }
    function wt(e) {
        for (; e != null; e = e.nextSibling) {
            var t = e.nodeType;
            if (t === 1 || t === 3)
                break;
            if (t === 8) {
                if (t = e.data,
                t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
                    break;
                if (t === "/$" || t === "/&")
                    return null
            }
        }
        return e
    }
    var $o = null;
    function Lh(e) {
        e = e.nextSibling;
        for (var t = 0; e; ) {
            if (e.nodeType === 8) {
                var n = e.data;
                if (n === "/$" || n === "/&") {
                    if (t === 0)
                        return wt(e.nextSibling);
                    t--
                } else
                    n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || t++
            }
            e = e.nextSibling
        }
        return null
    }
    function Mh(e) {
        e = e.previousSibling;
        for (var t = 0; e; ) {
            if (e.nodeType === 8) {
                var n = e.data;
                if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
                    if (t === 0)
                        return e;
                    t--
                } else
                    n !== "/$" && n !== "/&" || t++
            }
            e = e.previousSibling
        }
        return null
    }
    function zh(e, t, n) {
        switch (t = ru(n),
        e) {
        case "html":
            if (e = t.documentElement,
            !e)
                throw Error(o(452));
            return e;
        case "head":
            if (e = t.head,
            !e)
                throw Error(o(453));
            return e;
        case "body":
            if (e = t.body,
            !e)
                throw Error(o(454));
            return e;
        default:
            throw Error(o(451))
        }
    }
    function Na(e) {
        for (var t = e.attributes; t.length; )
            e.removeAttributeNode(t[0]);
        Fu(e)
    }
    var Lt = new Map
      , Dh = new Set;
    function ou(e) {
        return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument
    }
    var on = Q.d;
    Q.d = {
        f: hv,
        r: mv,
        D: gv,
        C: pv,
        L: yv,
        m: vv,
        X: bv,
        S: Sv,
        M: Ev
    };
    function hv() {
        var e = on.f()
          , t = Pi();
        return e || t
    }
    function mv(e) {
        var t = il(e);
        t !== null && t.tag === 5 && t.type === "form" ? Ff(t) : on.r(e)
    }
    var jl = typeof document > "u" ? null : document;
    function Nh(e, t, n) {
        var l = jl;
        if (l && typeof t == "string" && t) {
            var i = _t(t);
            i = 'link[rel="' + e + '"][href="' + i + '"]',
            typeof n == "string" && (i += '[crossorigin="' + n + '"]'),
            Dh.has(i) || (Dh.add(i),
            e = {
                rel: e,
                crossOrigin: n,
                href: t
            },
            l.querySelector(i) === null && (t = l.createElement("link"),
            Ie(t, "link", e),
            Ze(t),
            l.head.appendChild(t)))
        }
    }
    function gv(e) {
        on.D(e),
        Nh("dns-prefetch", e, null)
    }
    function pv(e, t) {
        on.C(e, t),
        Nh("preconnect", e, t)
    }
    function yv(e, t, n) {
        on.L(e, t, n);
        var l = jl;
        if (l && e && t) {
            var i = 'link[rel="preload"][as="' + _t(t) + '"]';
            t === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + _t(n.imageSrcSet) + '"]',
            typeof n.imageSizes == "string" && (i += '[imagesizes="' + _t(n.imageSizes) + '"]')) : i += '[href="' + _t(e) + '"]';
            var s = i;
            switch (t) {
            case "style":
                s = Bl(e);
                break;
            case "script":
                s = ql(e)
            }
            Lt.has(s) || (e = v({
                rel: "preload",
                href: t === "image" && n && n.imageSrcSet ? void 0 : e,
                as: t
            }, n),
            Lt.set(s, e),
            l.querySelector(i) !== null || t === "style" && l.querySelector(Ua(s)) || t === "script" && l.querySelector(Ha(s)) || (t = l.createElement("link"),
            Ie(t, "link", e),
            Ze(t),
            l.head.appendChild(t)))
        }
    }
    function vv(e, t) {
        on.m(e, t);
        var n = jl;
        if (n && e) {
            var l = t && typeof t.as == "string" ? t.as : "script"
              , i = 'link[rel="modulepreload"][as="' + _t(l) + '"][href="' + _t(e) + '"]'
              , s = i;
            switch (l) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
                s = ql(e)
            }
            if (!Lt.has(s) && (e = v({
                rel: "modulepreload",
                href: e
            }, t),
            Lt.set(s, e),
            n.querySelector(i) === null)) {
                switch (l) {
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script":
                    if (n.querySelector(Ha(s)))
                        return
                }
                l = n.createElement("link"),
                Ie(l, "link", e),
                Ze(l),
                n.head.appendChild(l)
            }
        }
    }
    function Sv(e, t, n) {
        on.S(e, t, n);
        var l = jl;
        if (l && e) {
            var i = ul(l).hoistableStyles
              , s = Bl(e);
            t = t || "default";
            var h = i.get(s);
            if (!h) {
                var y = {
                    loading: 0,
                    preload: null
                };
                if (h = l.querySelector(Ua(s)))
                    y.loading = 5;
                else {
                    e = v({
                        rel: "stylesheet",
                        href: e,
                        "data-precedence": t
                    }, n),
                    (n = Lt.get(s)) && Fo(e, n);
                    var C = h = l.createElement("link");
                    Ze(C),
                    Ie(C, "link", e),
                    C._p = new Promise(function(L, U) {
                        C.onload = L,
                        C.onerror = U
                    }
                    ),
                    C.addEventListener("load", function() {
                        y.loading |= 1
                    }),
                    C.addEventListener("error", function() {
                        y.loading |= 2
                    }),
                    y.loading |= 4,
                    su(h, t, l)
                }
                h = {
                    type: "stylesheet",
                    instance: h,
                    count: 1,
                    state: y
                },
                i.set(s, h)
            }
        }
    }
    function bv(e, t) {
        on.X(e, t);
        var n = jl;
        if (n && e) {
            var l = ul(n).hoistableScripts
              , i = ql(e)
              , s = l.get(i);
            s || (s = n.querySelector(Ha(i)),
            s || (e = v({
                src: e,
                async: !0
            }, t),
            (t = Lt.get(i)) && Wo(e, t),
            s = n.createElement("script"),
            Ze(s),
            Ie(s, "link", e),
            n.head.appendChild(s)),
            s = {
                type: "script",
                instance: s,
                count: 1,
                state: null
            },
            l.set(i, s))
        }
    }
    function Ev(e, t) {
        on.M(e, t);
        var n = jl;
        if (n && e) {
            var l = ul(n).hoistableScripts
              , i = ql(e)
              , s = l.get(i);
            s || (s = n.querySelector(Ha(i)),
            s || (e = v({
                src: e,
                async: !0,
                type: "module"
            }, t),
            (t = Lt.get(i)) && Wo(e, t),
            s = n.createElement("script"),
            Ze(s),
            Ie(s, "link", e),
            n.head.appendChild(s)),
            s = {
                type: "script",
                instance: s,
                count: 1,
                state: null
            },
            l.set(i, s))
        }
    }
    function Uh(e, t, n, l) {
        var i = (i = fe.current) ? ou(i) : null;
        if (!i)
            throw Error(o(446));
        switch (e) {
        case "meta":
        case "title":
            return null;
        case "style":
            return typeof n.precedence == "string" && typeof n.href == "string" ? (t = Bl(n.href),
            n = ul(i).hoistableStyles,
            l = n.get(t),
            l || (l = {
                type: "style",
                instance: null,
                count: 0,
                state: null
            },
            n.set(t, l)),
            l) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        case "link":
            if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
                e = Bl(n.href);
                var s = ul(i).hoistableStyles
                  , h = s.get(e);
                if (h || (i = i.ownerDocument || i,
                h = {
                    type: "stylesheet",
                    instance: null,
                    count: 0,
                    state: {
                        loading: 0,
                        preload: null
                    }
                },
                s.set(e, h),
                (s = i.querySelector(Ua(e))) && !s._p && (h.instance = s,
                h.state.loading = 5),
                Lt.has(e) || (n = {
                    rel: "preload",
                    as: "style",
                    href: n.href,
                    crossOrigin: n.crossOrigin,
                    integrity: n.integrity,
                    media: n.media,
                    hrefLang: n.hrefLang,
                    referrerPolicy: n.referrerPolicy
                },
                Lt.set(e, n),
                s || _v(i, e, n, h.state))),
                t && l === null)
                    throw Error(o(528, ""));
                return h
            }
            if (t && l !== null)
                throw Error(o(529, ""));
            return null;
        case "script":
            return t = n.async,
            n = n.src,
            typeof n == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = ql(n),
            n = ul(i).hoistableScripts,
            l = n.get(t),
            l || (l = {
                type: "script",
                instance: null,
                count: 0,
                state: null
            },
            n.set(t, l)),
            l) : {
                type: "void",
                instance: null,
                count: 0,
                state: null
            };
        default:
            throw Error(o(444, e))
        }
    }
    function Bl(e) {
        return 'href="' + _t(e) + '"'
    }
    function Ua(e) {
        return 'link[rel="stylesheet"][' + e + "]"
    }
    function Hh(e) {
        return v({}, e, {
            "data-precedence": e.precedence,
            precedence: null
        })
    }
    function _v(e, t, n, l) {
        e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? l.loading = 1 : (t = e.createElement("link"),
        l.preload = t,
        t.addEventListener("load", function() {
            return l.loading |= 1
        }),
        t.addEventListener("error", function() {
            return l.loading |= 2
        }),
        Ie(t, "link", n),
        Ze(t),
        e.head.appendChild(t))
    }
    function ql(e) {
        return '[src="' + _t(e) + '"]'
    }
    function Ha(e) {
        return "script[async]" + e
    }
    function jh(e, t, n) {
        if (t.count++,
        t.instance === null)
            switch (t.type) {
            case "style":
                var l = e.querySelector('style[data-href~="' + _t(n.href) + '"]');
                if (l)
                    return t.instance = l,
                    Ze(l),
                    l;
                var i = v({}, n, {
                    "data-href": n.href,
                    "data-precedence": n.precedence,
                    href: null,
                    precedence: null
                });
                return l = (e.ownerDocument || e).createElement("style"),
                Ze(l),
                Ie(l, "style", i),
                su(l, n.precedence, e),
                t.instance = l;
            case "stylesheet":
                i = Bl(n.href);
                var s = e.querySelector(Ua(i));
                if (s)
                    return t.state.loading |= 4,
                    t.instance = s,
                    Ze(s),
                    s;
                l = Hh(n),
                (i = Lt.get(i)) && Fo(l, i),
                s = (e.ownerDocument || e).createElement("link"),
                Ze(s);
                var h = s;
                return h._p = new Promise(function(y, C) {
                    h.onload = y,
                    h.onerror = C
                }
                ),
                Ie(s, "link", l),
                t.state.loading |= 4,
                su(s, n.precedence, e),
                t.instance = s;
            case "script":
                return s = ql(n.src),
                (i = e.querySelector(Ha(s))) ? (t.instance = i,
                Ze(i),
                i) : (l = n,
                (i = Lt.get(s)) && (l = v({}, n),
                Wo(l, i)),
                e = e.ownerDocument || e,
                i = e.createElement("script"),
                Ze(i),
                Ie(i, "link", l),
                e.head.appendChild(i),
                t.instance = i);
            case "void":
                return null;
            default:
                throw Error(o(443, t.type))
            }
        else
            t.type === "stylesheet" && (t.state.loading & 4) === 0 && (l = t.instance,
            t.state.loading |= 4,
            su(l, n.precedence, e));
        return t.instance
    }
    function su(e, t, n) {
        for (var l = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), i = l.length ? l[l.length - 1] : null, s = i, h = 0; h < l.length; h++) {
            var y = l[h];
            if (y.dataset.precedence === t)
                s = y;
            else if (s !== i)
                break
        }
        s ? s.parentNode.insertBefore(e, s.nextSibling) : (t = n.nodeType === 9 ? n.head : n,
        t.insertBefore(e, t.firstChild))
    }
    function Fo(e, t) {
        e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
        e.title == null && (e.title = t.title)
    }
    function Wo(e, t) {
        e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
        e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
        e.integrity == null && (e.integrity = t.integrity)
    }
    var cu = null;
    function Bh(e, t, n) {
        if (cu === null) {
            var l = new Map
              , i = cu = new Map;
            i.set(n, l)
        } else
            i = cu,
            l = i.get(n),
            l || (l = new Map,
            i.set(n, l));
        if (l.has(e))
            return l;
        for (l.set(e, null),
        n = n.getElementsByTagName(e),
        i = 0; i < n.length; i++) {
            var s = n[i];
            if (!(s[Il] || s[Je] || e === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
                var h = s.getAttribute(t) || "";
                h = e + h;
                var y = l.get(h);
                y ? y.push(s) : l.set(h, [s])
            }
        }
        return l
    }
    function qh(e, t, n) {
        e = e.ownerDocument || e,
        e.head.insertBefore(n, t === "title" ? e.querySelector("head > title") : null)
    }
    function xv(e, t, n) {
        if (n === 1 || t.itemProp != null)
            return !1;
        switch (e) {
        case "meta":
        case "title":
            return !0;
        case "style":
            if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
                break;
            return !0;
        case "link":
            if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
                break;
            return t.rel === "stylesheet" ? (e = t.disabled,
            typeof t.precedence == "string" && e == null) : !0;
        case "script":
            if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
                return !0
        }
        return !1
    }
    function Gh(e) {
        return !(e.type === "stylesheet" && (e.state.loading & 3) === 0)
    }
    function Cv(e, t, n, l) {
        if (n.type === "stylesheet" && (typeof l.media != "string" || matchMedia(l.media).matches !== !1) && (n.state.loading & 4) === 0) {
            if (n.instance === null) {
                var i = Bl(l.href)
                  , s = t.querySelector(Ua(i));
                if (s) {
                    t = s._p,
                    t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++,
                    e = fu.bind(e),
                    t.then(e, e)),
                    n.state.loading |= 4,
                    n.instance = s,
                    Ze(s);
                    return
                }
                s = t.ownerDocument || t,
                l = Hh(l),
                (i = Lt.get(i)) && Fo(l, i),
                s = s.createElement("link"),
                Ze(s);
                var h = s;
                h._p = new Promise(function(y, C) {
                    h.onload = y,
                    h.onerror = C
                }
                ),
                Ie(s, "link", l),
                n.instance = s
            }
            e.stylesheets === null && (e.stylesheets = new Map),
            e.stylesheets.set(n, t),
            (t = n.state.preload) && (n.state.loading & 3) === 0 && (e.count++,
            n = fu.bind(e),
            t.addEventListener("load", n),
            t.addEventListener("error", n))
        }
    }
    var Io = 0;
    function Tv(e, t) {
        return e.stylesheets && e.count === 0 && hu(e, e.stylesheets),
        0 < e.count || 0 < e.imgCount ? function(n) {
            var l = setTimeout(function() {
                if (e.stylesheets && hu(e, e.stylesheets),
                e.unsuspend) {
                    var s = e.unsuspend;
                    e.unsuspend = null,
                    s()
                }
            }, 6e4 + t);
            0 < e.imgBytes && Io === 0 && (Io = 62500 * iv());
            var i = setTimeout(function() {
                if (e.waitingForImages = !1,
                e.count === 0 && (e.stylesheets && hu(e, e.stylesheets),
                e.unsuspend)) {
                    var s = e.unsuspend;
                    e.unsuspend = null,
                    s()
                }
            }, (e.imgBytes > Io ? 50 : 800) + t);
            return e.unsuspend = n,
            function() {
                e.unsuspend = null,
                clearTimeout(l),
                clearTimeout(i)
            }
        }
        : null
    }
    function fu() {
        if (this.count--,
        this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
            if (this.stylesheets)
                hu(this, this.stylesheets);
            else if (this.unsuspend) {
                var e = this.unsuspend;
                this.unsuspend = null,
                e()
            }
        }
    }
    var du = null;
    function hu(e, t) {
        e.stylesheets = null,
        e.unsuspend !== null && (e.count++,
        du = new Map,
        t.forEach(Ov, e),
        du = null,
        fu.call(e))
    }
    function Ov(e, t) {
        if (!(t.state.loading & 4)) {
            var n = du.get(e);
            if (n)
                var l = n.get(null);
            else {
                n = new Map,
                du.set(e, n);
                for (var i = e.querySelectorAll("link[data-precedence],style[data-precedence]"), s = 0; s < i.length; s++) {
                    var h = i[s];
                    (h.nodeName === "LINK" || h.getAttribute("media") !== "not all") && (n.set(h.dataset.precedence, h),
                    l = h)
                }
                l && n.set(null, l)
            }
            i = t.instance,
            h = i.getAttribute("data-precedence"),
            s = n.get(h) || l,
            s === l && n.set(null, i),
            n.set(h, i),
            this.count++,
            l = fu.bind(this),
            i.addEventListener("load", l),
            i.addEventListener("error", l),
            s ? s.parentNode.insertBefore(i, s.nextSibling) : (e = e.nodeType === 9 ? e.head : e,
            e.insertBefore(i, e.firstChild)),
            t.state.loading |= 4
        }
    }
    var ja = {
        $$typeof: Y,
        Provider: null,
        Consumer: null,
        _currentValue: ee,
        _currentValue2: ee,
        _threadCount: 0
    };
    function Av(e, t, n, l, i, s, h, y, C) {
        this.tag = 1,
        this.containerInfo = e,
        this.pingCache = this.current = this.pendingChildren = null,
        this.timeoutHandle = -1,
        this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null,
        this.callbackPriority = 0,
        this.expirationTimes = Ku(-1),
        this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0,
        this.entanglements = Ku(0),
        this.hiddenUpdates = Ku(null),
        this.identifierPrefix = l,
        this.onUncaughtError = i,
        this.onCaughtError = s,
        this.onRecoverableError = h,
        this.pooledCache = null,
        this.pooledCacheLanes = 0,
        this.formState = C,
        this.incompleteTransitions = new Map
    }
    function Yh(e, t, n, l, i, s, h, y, C, L, U, G) {
        return e = new Av(e,t,n,h,C,L,U,G,y),
        t = 1,
        s === !0 && (t |= 24),
        s = gt(3, null, null, t),
        e.current = s,
        s.stateNode = e,
        t = Lr(),
        t.refCount++,
        e.pooledCache = t,
        t.refCount++,
        s.memoizedState = {
            element: l,
            isDehydrated: n,
            cache: t
        },
        Nr(s),
        e
    }
    function Vh(e) {
        return e ? (e = pl,
        e) : pl
    }
    function Qh(e, t, n, l, i, s) {
        i = Vh(i),
        l.context === null ? l.context = i : l.pendingContext = i,
        l = Sn(t),
        l.payload = {
            element: n
        },
        s = s === void 0 ? null : s,
        s !== null && (l.callback = s),
        n = bn(e, l, t),
        n !== null && (st(n, e, t),
        ga(n, e, t))
    }
    function Xh(e, t) {
        if (e = e.memoizedState,
        e !== null && e.dehydrated !== null) {
            var n = e.retryLane;
            e.retryLane = n !== 0 && n < t ? n : t
        }
    }
    function Po(e, t) {
        Xh(e, t),
        (e = e.alternate) && Xh(e, t)
    }
    function Zh(e) {
        if (e.tag === 13 || e.tag === 31) {
            var t = Qn(e, 67108864);
            t !== null && st(t, e, 67108864),
            Po(e, 67108864)
        }
    }
    function Kh(e) {
        if (e.tag === 13 || e.tag === 31) {
            var t = bt();
            t = ku(t);
            var n = Qn(e, t);
            n !== null && st(n, e, t),
            Po(e, t)
        }
    }
    var mu = !0;
    function Rv(e, t, n, l) {
        var i = N.T;
        N.T = null;
        var s = Q.p;
        try {
            Q.p = 2,
            es(e, t, n, l)
        } finally {
            Q.p = s,
            N.T = i
        }
    }
    function wv(e, t, n, l) {
        var i = N.T;
        N.T = null;
        var s = Q.p;
        try {
            Q.p = 8,
            es(e, t, n, l)
        } finally {
            Q.p = s,
            N.T = i
        }
    }
    function es(e, t, n, l) {
        if (mu) {
            var i = ts(l);
            if (i === null)
                Go(e, t, l, gu, n),
                Jh(e, l);
            else if (Mv(i, e, t, n, l))
                l.stopPropagation();
            else if (Jh(e, l),
            t & 4 && -1 < Lv.indexOf(e)) {
                for (; i !== null; ) {
                    var s = il(i);
                    if (s !== null)
                        switch (s.tag) {
                        case 3:
                            if (s = s.stateNode,
                            s.current.memoizedState.isDehydrated) {
                                var h = Bn(s.pendingLanes);
                                if (h !== 0) {
                                    var y = s;
                                    for (y.pendingLanes |= 2,
                                    y.entangledLanes |= 2; h; ) {
                                        var C = 1 << 31 - ht(h);
                                        y.entanglements[1] |= C,
                                        h &= ~C
                                    }
                                    qt(s),
                                    (Ee & 6) === 0 && (Wi = ft() + 500,
                                    Ma(0))
                                }
                            }
                            break;
                        case 31:
                        case 13:
                            y = Qn(s, 2),
                            y !== null && st(y, s, 2),
                            Pi(),
                            Po(s, 2)
                        }
                    if (s = ts(l),
                    s === null && Go(e, t, l, gu, n),
                    s === i)
                        break;
                    i = s
                }
                i !== null && l.stopPropagation()
            } else
                Go(e, t, l, null, n)
        }
    }
    function ts(e) {
        return e = nr(e),
        ns(e)
    }
    var gu = null;
    function ns(e) {
        if (gu = null,
        e = al(e),
        e !== null) {
            var t = f(e);
            if (t === null)
                e = null;
            else {
                var n = t.tag;
                if (n === 13) {
                    if (e = d(t),
                    e !== null)
                        return e;
                    e = null
                } else if (n === 31) {
                    if (e = m(t),
                    e !== null)
                        return e;
                    e = null
                } else if (n === 3) {
                    if (t.stateNode.current.memoizedState.isDehydrated)
                        return t.tag === 3 ? t.stateNode.containerInfo : null;
                    e = null
                } else
                    t !== e && (e = null)
            }
        }
        return gu = e,
        null
    }
    function kh(e) {
        switch (e) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
            return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
            return 8;
        case "message":
            switch (gp()) {
            case ec:
                return 2;
            case tc:
                return 8;
            case ai:
            case pp:
                return 32;
            case nc:
                return 268435456;
            default:
                return 32
            }
        default:
            return 32
        }
    }
    var ls = !1
      , Mn = null
      , zn = null
      , Dn = null
      , Ba = new Map
      , qa = new Map
      , Nn = []
      , Lv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function Jh(e, t) {
        switch (e) {
        case "focusin":
        case "focusout":
            Mn = null;
            break;
        case "dragenter":
        case "dragleave":
            zn = null;
            break;
        case "mouseover":
        case "mouseout":
            Dn = null;
            break;
        case "pointerover":
        case "pointerout":
            Ba.delete(t.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture":
            qa.delete(t.pointerId)
        }
    }
    function Ga(e, t, n, l, i, s) {
        return e === null || e.nativeEvent !== s ? (e = {
            blockedOn: t,
            domEventName: n,
            eventSystemFlags: l,
            nativeEvent: s,
            targetContainers: [i]
        },
        t !== null && (t = il(t),
        t !== null && Zh(t)),
        e) : (e.eventSystemFlags |= l,
        t = e.targetContainers,
        i !== null && t.indexOf(i) === -1 && t.push(i),
        e)
    }
    function Mv(e, t, n, l, i) {
        switch (t) {
        case "focusin":
            return Mn = Ga(Mn, e, t, n, l, i),
            !0;
        case "dragenter":
            return zn = Ga(zn, e, t, n, l, i),
            !0;
        case "mouseover":
            return Dn = Ga(Dn, e, t, n, l, i),
            !0;
        case "pointerover":
            var s = i.pointerId;
            return Ba.set(s, Ga(Ba.get(s) || null, e, t, n, l, i)),
            !0;
        case "gotpointercapture":
            return s = i.pointerId,
            qa.set(s, Ga(qa.get(s) || null, e, t, n, l, i)),
            !0
        }
        return !1
    }
    function $h(e) {
        var t = al(e.target);
        if (t !== null) {
            var n = f(t);
            if (n !== null) {
                if (t = n.tag,
                t === 13) {
                    if (t = d(n),
                    t !== null) {
                        e.blockedOn = t,
                        oc(e.priority, function() {
                            Kh(n)
                        });
                        return
                    }
                } else if (t === 31) {
                    if (t = m(n),
                    t !== null) {
                        e.blockedOn = t,
                        oc(e.priority, function() {
                            Kh(n)
                        });
                        return
                    }
                } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
                    e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
                    return
                }
            }
        }
        e.blockedOn = null
    }
    function pu(e) {
        if (e.blockedOn !== null)
            return !1;
        for (var t = e.targetContainers; 0 < t.length; ) {
            var n = ts(e.nativeEvent);
            if (n === null) {
                n = e.nativeEvent;
                var l = new n.constructor(n.type,n);
                tr = l,
                n.target.dispatchEvent(l),
                tr = null
            } else
                return t = il(n),
                t !== null && Zh(t),
                e.blockedOn = n,
                !1;
            t.shift()
        }
        return !0
    }
    function Fh(e, t, n) {
        pu(e) && n.delete(t)
    }
    function zv() {
        ls = !1,
        Mn !== null && pu(Mn) && (Mn = null),
        zn !== null && pu(zn) && (zn = null),
        Dn !== null && pu(Dn) && (Dn = null),
        Ba.forEach(Fh),
        qa.forEach(Fh)
    }
    function yu(e, t) {
        e.blockedOn === t && (e.blockedOn = null,
        ls || (ls = !0,
        u.unstable_scheduleCallback(u.unstable_NormalPriority, zv)))
    }
    var vu = null;
    function Wh(e) {
        vu !== e && (vu = e,
        u.unstable_scheduleCallback(u.unstable_NormalPriority, function() {
            vu === e && (vu = null);
            for (var t = 0; t < e.length; t += 3) {
                var n = e[t]
                  , l = e[t + 1]
                  , i = e[t + 2];
                if (typeof l != "function") {
                    if (ns(l || n) === null)
                        continue;
                    break
                }
                var s = il(n);
                s !== null && (e.splice(t, 3),
                t -= 3,
                eo(s, {
                    pending: !0,
                    data: i,
                    method: n.method,
                    action: l
                }, l, i))
            }
        }))
    }
    function Gl(e) {
        function t(C) {
            return yu(C, e)
        }
        Mn !== null && yu(Mn, e),
        zn !== null && yu(zn, e),
        Dn !== null && yu(Dn, e),
        Ba.forEach(t),
        qa.forEach(t);
        for (var n = 0; n < Nn.length; n++) {
            var l = Nn[n];
            l.blockedOn === e && (l.blockedOn = null)
        }
        for (; 0 < Nn.length && (n = Nn[0],
        n.blockedOn === null); )
            $h(n),
            n.blockedOn === null && Nn.shift();
        if (n = (e.ownerDocument || e).$$reactFormReplay,
        n != null)
            for (l = 0; l < n.length; l += 3) {
                var i = n[l]
                  , s = n[l + 1]
                  , h = i[lt] || null;
                if (typeof s == "function")
                    h || Wh(n);
                else if (h) {
                    var y = null;
                    if (s && s.hasAttribute("formAction")) {
                        if (i = s,
                        h = s[lt] || null)
                            y = h.formAction;
                        else if (ns(i) !== null)
                            continue
                    } else
                        y = h.action;
                    typeof y == "function" ? n[l + 1] = y : (n.splice(l, 3),
                    l -= 3),
                    Wh(n)
                }
            }
    }
    function Ih() {
        function e(s) {
            s.canIntercept && s.info === "react-transition" && s.intercept({
                handler: function() {
                    return new Promise(function(h) {
                        return i = h
                    }
                    )
                },
                focusReset: "manual",
                scroll: "manual"
            })
        }
        function t() {
            i !== null && (i(),
            i = null),
            l || setTimeout(n, 20)
        }
        function n() {
            if (!l && !navigation.transition) {
                var s = navigation.currentEntry;
                s && s.url != null && navigation.navigate(s.url, {
                    state: s.getState(),
                    info: "react-transition",
                    history: "replace"
                })
            }
        }
        if (typeof navigation == "object") {
            var l = !1
              , i = null;
            return navigation.addEventListener("navigate", e),
            navigation.addEventListener("navigatesuccess", t),
            navigation.addEventListener("navigateerror", t),
            setTimeout(n, 100),
            function() {
                l = !0,
                navigation.removeEventListener("navigate", e),
                navigation.removeEventListener("navigatesuccess", t),
                navigation.removeEventListener("navigateerror", t),
                i !== null && (i(),
                i = null)
            }
        }
    }
    function as(e) {
        this._internalRoot = e
    }
    Su.prototype.render = as.prototype.render = function(e) {
        var t = this._internalRoot;
        if (t === null)
            throw Error(o(409));
        var n = t.current
          , l = bt();
        Qh(n, l, e, t, null, null)
    }
    ,
    Su.prototype.unmount = as.prototype.unmount = function() {
        var e = this._internalRoot;
        if (e !== null) {
            this._internalRoot = null;
            var t = e.containerInfo;
            Qh(e.current, 2, null, e, null, null),
            Pi(),
            t[ll] = null
        }
    }
    ;
    function Su(e) {
        this._internalRoot = e
    }
    Su.prototype.unstable_scheduleHydration = function(e) {
        if (e) {
            var t = rc();
            e = {
                blockedOn: null,
                target: e,
                priority: t
            };
            for (var n = 0; n < Nn.length && t !== 0 && t < Nn[n].priority; n++)
                ;
            Nn.splice(n, 0, e),
            n === 0 && $h(e)
        }
    }
    ;
    var Ph = a.version;
    if (Ph !== "19.2.4")
        throw Error(o(527, Ph, "19.2.4"));
    Q.findDOMNode = function(e) {
        var t = e._reactInternals;
        if (t === void 0)
            throw typeof e.render == "function" ? Error(o(188)) : (e = Object.keys(e).join(","),
            Error(o(268, e)));
        return e = p(t),
        e = e !== null ? S(e) : null,
        e = e === null ? null : e.stateNode,
        e
    }
    ;
    var Dv = {
        bundleType: 0,
        version: "19.2.4",
        rendererPackageName: "react-dom",
        currentDispatcherRef: N,
        reconcilerVersion: "19.2.4"
    };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var bu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!bu.isDisabled && bu.supportsFiber)
            try {
                $l = bu.inject(Dv),
                dt = bu
            } catch {}
    }
    return Za.createRoot = function(e, t) {
        if (!c(e))
            throw Error(o(299));
        var n = !1
          , l = ""
          , i = ud
          , s = rd
          , h = od;
        return t != null && (t.unstable_strictMode === !0 && (n = !0),
        t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
        t.onUncaughtError !== void 0 && (i = t.onUncaughtError),
        t.onCaughtError !== void 0 && (s = t.onCaughtError),
        t.onRecoverableError !== void 0 && (h = t.onRecoverableError)),
        t = Yh(e, 1, !1, null, null, n, l, null, i, s, h, Ih),
        e[ll] = t.current,
        qo(e),
        new as(t)
    }
    ,
    Za.hydrateRoot = function(e, t, n) {
        if (!c(e))
            throw Error(o(299));
        var l = !1
          , i = ""
          , s = ud
          , h = rd
          , y = od
          , C = null;
        return n != null && (n.unstable_strictMode === !0 && (l = !0),
        n.identifierPrefix !== void 0 && (i = n.identifierPrefix),
        n.onUncaughtError !== void 0 && (s = n.onUncaughtError),
        n.onCaughtError !== void 0 && (h = n.onCaughtError),
        n.onRecoverableError !== void 0 && (y = n.onRecoverableError),
        n.formState !== void 0 && (C = n.formState)),
        t = Yh(e, 1, !0, t, n ?? null, l, i, C, s, h, y, Ih),
        t.context = Vh(null),
        n = t.current,
        l = bt(),
        l = ku(l),
        i = Sn(l),
        i.callback = null,
        bn(n, i, l),
        n = l,
        t.current.lanes = n,
        Wl(t, n),
        qt(t),
        e[ll] = t.current,
        qo(e),
        new Su(t)
    }
    ,
    Za.version = "19.2.4",
    Za
}
var ag;
function Q1() {
    if (ag)
        return Cs.exports;
    ag = 1;
    function u() {
        if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
            try {
                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)
            } catch (a) {
                console.error(a)
            }
    }
    return u(),
    Cs.exports = V1(),
    Cs.exports
}
var X1 = Q1();
var ig = "popstate";
function ug(u) {
    return typeof u == "object" && u != null && "pathname"in u && "search"in u && "hash"in u && "state"in u && "key"in u
}
function Z1(u={}) {
    function a(o, c) {
        let f = c.state?.masked
          , {pathname: d, search: m, hash: g} = f || o.location;
        return Us("", {
            pathname: d,
            search: m,
            hash: g
        }, c.state && c.state.usr || null, c.state && c.state.key || "default", f ? {
            pathname: o.location.pathname,
            search: o.location.search,
            hash: o.location.hash
        } : void 0)
    }
    function r(o, c) {
        return typeof c == "string" ? c : Pa(c)
    }
    return k1(a, r, null, u)
}
function Xe(u, a) {
    if (u === !1 || u === null || typeof u > "u")
        throw new Error(a)
}
function Qt(u, a) {
    if (!u) {
        typeof console < "u" && console.warn(a);
        try {
            throw new Error(a)
        } catch {}
    }
}
function K1() {
    return Math.random().toString(36).substring(2, 10)
}
function rg(u, a) {
    return {
        usr: u.state,
        key: u.key,
        idx: a,
        masked: u.unstable_mask ? {
            pathname: u.pathname,
            search: u.search,
            hash: u.hash
        } : void 0
    }
}
function Us(u, a, r=null, o, c) {
    return {
        pathname: typeof u == "string" ? u : u.pathname,
        search: "",
        hash: "",
        ...typeof a == "string" ? ei(a) : a,
        state: r,
        key: a && a.key || o || K1(),
        unstable_mask: c
    }
}
function Pa({pathname: u="/", search: a="", hash: r=""}) {
    return a && a !== "?" && (u += a.charAt(0) === "?" ? a : "?" + a),
    r && r !== "#" && (u += r.charAt(0) === "#" ? r : "#" + r),
    u
}
function ei(u) {
    let a = {};
    if (u) {
        let r = u.indexOf("#");
        r >= 0 && (a.hash = u.substring(r),
        u = u.substring(0, r));
        let o = u.indexOf("?");
        o >= 0 && (a.search = u.substring(o),
        u = u.substring(0, o)),
        u && (a.pathname = u)
    }
    return a
}
function k1(u, a, r, o={}) {
    let {window: c=document.defaultView, v5Compat: f=!1} = o
      , d = c.history
      , m = "POP"
      , g = null
      , p = S();
    p == null && (p = 0,
    d.replaceState({
        ...d.state,
        idx: p
    }, ""));
    function S() {
        return (d.state || {
            idx: null
        }).idx
    }
    function v() {
        m = "POP";
        let x = S()
          , z = x == null ? null : x - p;
        p = x,
        g && g({
            action: m,
            location: A.location,
            delta: z
        })
    }
    function E(x, z) {
        m = "PUSH";
        let q = ug(x) ? x : Us(A.location, x, z);
        p = S() + 1;
        let Y = rg(q, p)
          , k = A.createHref(q.unstable_mask || q);
        try {
            d.pushState(Y, "", k)
        } catch (F) {
            if (F instanceof DOMException && F.name === "DataCloneError")
                throw F;
            c.location.assign(k)
        }
        f && g && g({
            action: m,
            location: A.location,
            delta: 1
        })
    }
    function b(x, z) {
        m = "REPLACE";
        let q = ug(x) ? x : Us(A.location, x, z);
        p = S();
        let Y = rg(q, p)
          , k = A.createHref(q.unstable_mask || q);
        d.replaceState(Y, "", k),
        f && g && g({
            action: m,
            location: A.location,
            delta: 0
        })
    }
    function _(x) {
        return J1(x)
    }
    let A = {
        get action() {
            return m
        },
        get location() {
            return u(c, d)
        },
        listen(x) {
            if (g)
                throw new Error("A history only accepts one active listener");
            return c.addEventListener(ig, v),
            g = x,
            () => {
                c.removeEventListener(ig, v),
                g = null
            }
        },
        createHref(x) {
            return a(c, x)
        },
        createURL: _,
        encodeLocation(x) {
            let z = _(x);
            return {
                pathname: z.pathname,
                search: z.search,
                hash: z.hash
            }
        },
        push: E,
        replace: b,
        go(x) {
            return d.go(x)
        }
    };
    return A
}
function J1(u, a=!1) {
    let r = "http://localhost";
    typeof window < "u" && (r = window.location.origin !== "null" ? window.location.origin : window.location.href),
    Xe(r, "No window.location.(origin|href) available to create URL");
    let o = typeof u == "string" ? u : Pa(u);
    return o = o.replace(/ $/, "%20"),
    !a && o.startsWith("//") && (o = r + o),
    new URL(o,r)
}
function Qg(u, a, r="/") {
    return $1(u, a, r, !1)
}
function $1(u, a, r, o) {
    let c = typeof a == "string" ? ei(a) : a
      , f = sn(c.pathname || "/", r);
    if (f == null)
        return null;
    let d = Xg(u);
    F1(d);
    let m = null;
    for (let g = 0; m == null && g < d.length; ++g) {
        let p = rS(f);
        m = iS(d[g], p, o)
    }
    return m
}
function Xg(u, a=[], r=[], o="", c=!1) {
    let f = (d, m, g=c, p) => {
        let S = {
            relativePath: p === void 0 ? d.path || "" : p,
            caseSensitive: d.caseSensitive === !0,
            childrenIndex: m,
            route: d
        };
        if (S.relativePath.startsWith("/")) {
            if (!S.relativePath.startsWith(o) && g)
                return;
            Xe(S.relativePath.startsWith(o), `Absolute route path "${S.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),
            S.relativePath = S.relativePath.slice(o.length)
        }
        let v = Vt([o, S.relativePath])
          , E = r.concat(S);
        d.children && d.children.length > 0 && (Xe(d.index !== !0, `Index routes must not have child routes. Please remove all child routes from route path "${v}".`),
        Xg(d.children, a, E, v, g)),
        !(d.path == null && !d.index) && a.push({
            path: v,
            score: lS(v, d.index),
            routesMeta: E
        })
    }
    ;
    return u.forEach( (d, m) => {
        if (d.path === "" || !d.path?.includes("?"))
            f(d, m);
        else
            for (let g of Zg(d.path))
                f(d, m, !0, g)
    }
    ),
    a
}
function Zg(u) {
    let a = u.split("/");
    if (a.length === 0)
        return [];
    let[r,...o] = a
      , c = r.endsWith("?")
      , f = r.replace(/\?$/, "");
    if (o.length === 0)
        return c ? [f, ""] : [f];
    let d = Zg(o.join("/"))
      , m = [];
    return m.push(...d.map(g => g === "" ? f : [f, g].join("/"))),
    c && m.push(...d),
    m.map(g => u.startsWith("/") && g === "" ? "/" : g)
}
function F1(u) {
    u.sort( (a, r) => a.score !== r.score ? r.score - a.score : aS(a.routesMeta.map(o => o.childrenIndex), r.routesMeta.map(o => o.childrenIndex)))
}
var W1 = /^:[\w-]+$/
  , I1 = 3
  , P1 = 2
  , eS = 1
  , tS = 10
  , nS = -2
  , og = u => u === "*";
function lS(u, a) {
    let r = u.split("/")
      , o = r.length;
    return r.some(og) && (o += nS),
    a && (o += P1),
    r.filter(c => !og(c)).reduce( (c, f) => c + (W1.test(f) ? I1 : f === "" ? eS : tS), o)
}
function aS(u, a) {
    return u.length === a.length && u.slice(0, -1).every( (o, c) => o === a[c]) ? u[u.length - 1] - a[a.length - 1] : 0
}
function iS(u, a, r=!1) {
    let {routesMeta: o} = u
      , c = {}
      , f = "/"
      , d = [];
    for (let m = 0; m < o.length; ++m) {
        let g = o[m]
          , p = m === o.length - 1
          , S = f === "/" ? a : a.slice(f.length) || "/"
          , v = Nu({
            path: g.relativePath,
            caseSensitive: g.caseSensitive,
            end: p
        }, S)
          , E = g.route;
        if (!v && p && r && !o[o.length - 1].route.index && (v = Nu({
            path: g.relativePath,
            caseSensitive: g.caseSensitive,
            end: !1
        }, S)),
        !v)
            return null;
        Object.assign(c, v.params),
        d.push({
            params: c,
            pathname: Vt([f, v.pathname]),
            pathnameBase: fS(Vt([f, v.pathnameBase])),
            route: E
        }),
        v.pathnameBase !== "/" && (f = Vt([f, v.pathnameBase]))
    }
    return d
}
function Nu(u, a) {
    typeof u == "string" && (u = {
        path: u,
        caseSensitive: !1,
        end: !0
    });
    let[r,o] = uS(u.path, u.caseSensitive, u.end)
      , c = a.match(r);
    if (!c)
        return null;
    let f = c[0]
      , d = f.replace(/(.)\/+$/, "$1")
      , m = c.slice(1);
    return {
        params: o.reduce( (p, {paramName: S, isOptional: v}, E) => {
            if (S === "*") {
                let _ = m[E] || "";
                d = f.slice(0, f.length - _.length).replace(/(.)\/+$/, "$1")
            }
            const b = m[E];
            return v && !b ? p[S] = void 0 : p[S] = (b || "").replace(/%2F/g, "/"),
            p
        }
        , {}),
        pathname: f,
        pathnameBase: d,
        pattern: u
    }
}
function uS(u, a=!1, r=!0) {
    Qt(u === "*" || !u.endsWith("*") || u.endsWith("/*"), `Route path "${u}" will be treated as if it were "${u.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${u.replace(/\*$/, "/*")}".`);
    let o = []
      , c = "^" + u.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (d, m, g, p, S) => {
        if (o.push({
            paramName: m,
            isOptional: g != null
        }),
        g) {
            let v = S.charAt(p + d.length);
            return v && v !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?"
        }
        return "/([^\\/]+)"
    }
    ).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
    return u.endsWith("*") ? (o.push({
        paramName: "*"
    }),
    c += u === "*" || u === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : r ? c += "\\/*$" : u !== "" && u !== "/" && (c += "(?:(?=\\/|$))"),
    [new RegExp(c,a ? void 0 : "i"), o]
}
function rS(u) {
    try {
        return u.split("/").map(a => decodeURIComponent(a).replace(/\//g, "%2F")).join("/")
    } catch (a) {
        return Qt(!1, `The URL path "${u}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${a}).`),
        u
    }
}
function sn(u, a) {
    if (a === "/")
        return u;
    if (!u.toLowerCase().startsWith(a.toLowerCase()))
        return null;
    let r = a.endsWith("/") ? a.length - 1 : a.length
      , o = u.charAt(r);
    return o && o !== "/" ? null : u.slice(r) || "/"
}
var oS = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function sS(u, a="/") {
    let {pathname: r, search: o="", hash: c=""} = typeof u == "string" ? ei(u) : u, f;
    return r ? (r = r.replace(/\/\/+/g, "/"),
    r.startsWith("/") ? f = sg(r.substring(1), "/") : f = sg(r, a)) : f = a,
    {
        pathname: f,
        search: dS(o),
        hash: hS(c)
    }
}
function sg(u, a) {
    let r = a.replace(/\/+$/, "").split("/");
    return u.split("/").forEach(c => {
        c === ".." ? r.length > 1 && r.pop() : c !== "." && r.push(c)
    }
    ),
    r.length > 1 ? r.join("/") : "/"
}
function Rs(u, a, r, o) {
    return `Cannot include a '${u}' character in a manually specified \`to.${a}\` field [${JSON.stringify(o)}].  Please separate it out to the \`to.${r}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`
}
function cS(u) {
    return u.filter( (a, r) => r === 0 || a.route.path && a.route.path.length > 0)
}
function Kg(u) {
    let a = cS(u);
    return a.map( (r, o) => o === a.length - 1 ? r.pathname : r.pathnameBase)
}
function Ks(u, a, r, o=!1) {
    let c;
    typeof u == "string" ? c = ei(u) : (c = {
        ...u
    },
    Xe(!c.pathname || !c.pathname.includes("?"), Rs("?", "pathname", "search", c)),
    Xe(!c.pathname || !c.pathname.includes("#"), Rs("#", "pathname", "hash", c)),
    Xe(!c.search || !c.search.includes("#"), Rs("#", "search", "hash", c)));
    let f = u === "" || c.pathname === "", d = f ? "/" : c.pathname, m;
    if (d == null)
        m = r;
    else {
        let v = a.length - 1;
        if (!o && d.startsWith("..")) {
            let E = d.split("/");
            for (; E[0] === ".."; )
                E.shift(),
                v -= 1;
            c.pathname = E.join("/")
        }
        m = v >= 0 ? a[v] : "/"
    }
    let g = sS(c, m)
      , p = d && d !== "/" && d.endsWith("/")
      , S = (f || d === ".") && r.endsWith("/");
    return !g.pathname.endsWith("/") && (p || S) && (g.pathname += "/"),
    g
}
var Vt = u => u.join("/").replace(/\/\/+/g, "/")
  , fS = u => u.replace(/\/+$/, "").replace(/^\/*/, "/")
  , dS = u => !u || u === "?" ? "" : u.startsWith("?") ? u : "?" + u
  , hS = u => !u || u === "#" ? "" : u.startsWith("#") ? u : "#" + u
  , mS = class {
    constructor(u, a, r, o=!1) {
        this.status = u,
        this.statusText = a || "",
        this.internal = o,
        r instanceof Error ? (this.data = r.toString(),
        this.error = r) : this.data = r
    }
}
;
function gS(u) {
    return u != null && typeof u.status == "number" && typeof u.statusText == "string" && typeof u.internal == "boolean" && "data"in u
}
function pS(u) {
    return u.map(a => a.route.path).filter(Boolean).join("/").replace(/\/\/*/g, "/") || "/"
}
var kg = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function Jg(u, a) {
    let r = u;
    if (typeof r != "string" || !oS.test(r))
        return {
            absoluteURL: void 0,
            isExternal: !1,
            to: r
        };
    let o = r
      , c = !1;
    if (kg)
        try {
            let f = new URL(window.location.href)
              , d = r.startsWith("//") ? new URL(f.protocol + r) : new URL(r)
              , m = sn(d.pathname, a);
            d.origin === f.origin && m != null ? r = m + d.search + d.hash : c = !0
        } catch {
            Qt(!1, `<Link to="${r}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)
        }
    return {
        absoluteURL: o,
        isExternal: c,
        to: r
    }
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var $g = ["POST", "PUT", "PATCH", "DELETE"];
new Set($g);
var yS = ["GET", ...$g];
new Set(yS);
var kl = H.createContext(null);
kl.displayName = "DataRouter";
var ju = H.createContext(null);
ju.displayName = "DataRouterState";
var vS = H.createContext(!1)
  , Fg = H.createContext({
    isTransitioning: !1
});
Fg.displayName = "ViewTransition";
var SS = H.createContext(new Map);
SS.displayName = "Fetchers";
var bS = H.createContext(null);
bS.displayName = "Await";
var Mt = H.createContext(null);
Mt.displayName = "Navigation";
var Bu = H.createContext(null);
Bu.displayName = "Location";
var cn = H.createContext({
    outlet: null,
    matches: [],
    isDataRoute: !1
});
cn.displayName = "Route";
var ks = H.createContext(null);
ks.displayName = "RouteError";
var Wg = "REACT_ROUTER_ERROR"
  , ES = "REDIRECT"
  , _S = "ROUTE_ERROR_RESPONSE";
function xS(u) {
    if (u.startsWith(`${Wg}:${ES}:{`))
        try {
            let a = JSON.parse(u.slice(28));
            if (typeof a == "object" && a && typeof a.status == "number" && typeof a.statusText == "string" && typeof a.location == "string" && typeof a.reloadDocument == "boolean" && typeof a.replace == "boolean")
                return a
        } catch {}
}
function CS(u) {
    if (u.startsWith(`${Wg}:${_S}:{`))
        try {
            let a = JSON.parse(u.slice(40));
            if (typeof a == "object" && a && typeof a.status == "number" && typeof a.statusText == "string")
                return new mS(a.status,a.statusText,a.data)
        } catch {}
}
function TS(u, {relative: a}={}) {
    Xe(ti(), "useHref() may be used only in the context of a <Router> component.");
    let {basename: r, navigator: o} = H.useContext(Mt)
      , {hash: c, pathname: f, search: d} = ni(u, {
        relative: a
    })
      , m = f;
    return r !== "/" && (m = f === "/" ? r : Vt([r, f])),
    o.createHref({
        pathname: m,
        search: d,
        hash: c
    })
}
function ti() {
    return H.useContext(Bu) != null
}
function Hn() {
    return Xe(ti(), "useLocation() may be used only in the context of a <Router> component."),
    H.useContext(Bu).location
}
var Ig = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function Pg(u) {
    H.useContext(Mt).static || H.useLayoutEffect(u)
}
function ep() {
    let {isDataRoute: u} = H.useContext(cn);
    return u ? BS() : OS()
}
function OS() {
    Xe(ti(), "useNavigate() may be used only in the context of a <Router> component.");
    let u = H.useContext(kl)
      , {basename: a, navigator: r} = H.useContext(Mt)
      , {matches: o} = H.useContext(cn)
      , {pathname: c} = Hn()
      , f = JSON.stringify(Kg(o))
      , d = H.useRef(!1);
    return Pg( () => {
        d.current = !0
    }
    ),
    H.useCallback( (g, p={}) => {
        if (Qt(d.current, Ig),
        !d.current)
            return;
        if (typeof g == "number") {
            r.go(g);
            return
        }
        let S = Ks(g, JSON.parse(f), c, p.relative === "path");
        u == null && a !== "/" && (S.pathname = S.pathname === "/" ? a : Vt([a, S.pathname])),
        (p.replace ? r.replace : r.push)(S, p.state, p)
    }
    , [a, r, f, c, u])
}
H.createContext(null);
function ni(u, {relative: a}={}) {
    let {matches: r} = H.useContext(cn)
      , {pathname: o} = Hn()
      , c = JSON.stringify(Kg(r));
    return H.useMemo( () => Ks(u, JSON.parse(c), o, a === "path"), [u, c, o, a])
}
function AS(u, a) {
    return tp(u)
}
function tp(u, a, r) {
    Xe(ti(), "useRoutes() may be used only in the context of a <Router> component.");
    let {navigator: o} = H.useContext(Mt)
      , {matches: c} = H.useContext(cn)
      , f = c[c.length - 1]
      , d = f ? f.params : {}
      , m = f ? f.pathname : "/"
      , g = f ? f.pathnameBase : "/"
      , p = f && f.route;
    {
        let x = p && p.path || "";
        lp(m, !p || x.endsWith("*") || x.endsWith("*?"), `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${m}" (under <Route path="${x}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${x}"> to <Route path="${x === "/" ? "*" : `${x}/*`}">.`)
    }
    let S = Hn(), v;
    v = S;
    let E = v.pathname || "/"
      , b = E;
    if (g !== "/") {
        let x = g.replace(/^\//, "").split("/");
        b = "/" + E.replace(/^\//, "").split("/").slice(x.length).join("/")
    }
    let _ = Qg(u, {
        pathname: b
    });
    return Qt(p || _ != null, `No routes matched location "${v.pathname}${v.search}${v.hash}" `),
    Qt(_ == null || _[_.length - 1].route.element !== void 0 || _[_.length - 1].route.Component !== void 0 || _[_.length - 1].route.lazy !== void 0, `Matched leaf route at location "${v.pathname}${v.search}${v.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`),
    zS(_ && _.map(x => Object.assign({}, x, {
        params: Object.assign({}, d, x.params),
        pathname: Vt([g, o.encodeLocation ? o.encodeLocation(x.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : x.pathname]),
        pathnameBase: x.pathnameBase === "/" ? g : Vt([g, o.encodeLocation ? o.encodeLocation(x.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : x.pathnameBase])
    })), c, r)
}
function RS() {
    let u = jS()
      , a = gS(u) ? `${u.status} ${u.statusText}` : u instanceof Error ? u.message : JSON.stringify(u)
      , r = u instanceof Error ? u.stack : null
      , o = "rgba(200,200,200, 0.5)"
      , c = {
        padding: "0.5rem",
        backgroundColor: o
    }
      , f = {
        padding: "2px 4px",
        backgroundColor: o
    }
      , d = null;
    return console.error("Error handled by React Router default ErrorBoundary:", u),
    d = H.createElement(H.Fragment, null, H.createElement("p", null, "💿 Hey developer 👋"), H.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", H.createElement("code", {
        style: f
    }, "ErrorBoundary"), " or", " ", H.createElement("code", {
        style: f
    }, "errorElement"), " prop on your route.")),
    H.createElement(H.Fragment, null, H.createElement("h2", null, "Unexpected Application Error!"), H.createElement("h3", {
        style: {
            fontStyle: "italic"
        }
    }, a), r ? H.createElement("pre", {
        style: c
    }, r) : null, d)
}
var wS = H.createElement(RS, null)
  , np = class extends H.Component {
    constructor(u) {
        super(u),
        this.state = {
            location: u.location,
            revalidation: u.revalidation,
            error: u.error
        }
    }
    static getDerivedStateFromError(u) {
        return {
            error: u
        }
    }
    static getDerivedStateFromProps(u, a) {
        return a.location !== u.location || a.revalidation !== "idle" && u.revalidation === "idle" ? {
            error: u.error,
            location: u.location,
            revalidation: u.revalidation
        } : {
            error: u.error !== void 0 ? u.error : a.error,
            location: a.location,
            revalidation: u.revalidation || a.revalidation
        }
    }
    componentDidCatch(u, a) {
        this.props.onError ? this.props.onError(u, a) : console.error("React Router caught the following error during render", u)
    }
    render() {
        let u = this.state.error;
        if (this.context && typeof u == "object" && u && "digest"in u && typeof u.digest == "string") {
            const r = CS(u.digest);
            r && (u = r)
        }
        let a = u !== void 0 ? H.createElement(cn.Provider, {
            value: this.props.routeContext
        }, H.createElement(ks.Provider, {
            value: u,
            children: this.props.component
        })) : this.props.children;
        return this.context ? H.createElement(LS, {
            error: u
        }, a) : a
    }
}
;
np.contextType = vS;
var ws = new WeakMap;
function LS({children: u, error: a}) {
    let {basename: r} = H.useContext(Mt);
    if (typeof a == "object" && a && "digest"in a && typeof a.digest == "string") {
        let o = xS(a.digest);
        if (o) {
            let c = ws.get(a);
            if (c)
                throw c;
            let f = Jg(o.location, r);
            if (kg && !ws.get(a))
                if (f.isExternal || o.reloadDocument)
                    window.location.href = f.absoluteURL || f.to;
                else {
                    const d = Promise.resolve().then( () => window.__reactRouterDataRouter.navigate(f.to, {
                        replace: o.replace
                    }));
                    throw ws.set(a, d),
                    d
                }
            return H.createElement("meta", {
                httpEquiv: "refresh",
                content: `0;url=${f.absoluteURL || f.to}`
            })
        }
    }
    return u
}
function MS({routeContext: u, match: a, children: r}) {
    let o = H.useContext(kl);
    return o && o.static && o.staticContext && (a.route.errorElement || a.route.ErrorBoundary) && (o.staticContext._deepestRenderedBoundaryId = a.route.id),
    H.createElement(cn.Provider, {
        value: u
    }, r)
}
function zS(u, a=[], r) {
    let o = r?.state;
    if (u == null) {
        if (!o)
            return null;
        if (o.errors)
            u = o.matches;
        else if (a.length === 0 && !o.initialized && o.matches.length > 0)
            u = o.matches;
        else
            return null
    }
    let c = u
      , f = o?.errors;
    if (f != null) {
        let S = c.findIndex(v => v.route.id && f?.[v.route.id] !== void 0);
        Xe(S >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(f).join(",")}`),
        c = c.slice(0, Math.min(c.length, S + 1))
    }
    let d = !1
      , m = -1;
    if (r && o) {
        d = o.renderFallback;
        for (let S = 0; S < c.length; S++) {
            let v = c[S];
            if ((v.route.HydrateFallback || v.route.hydrateFallbackElement) && (m = S),
            v.route.id) {
                let {loaderData: E, errors: b} = o
                  , _ = v.route.loader && !E.hasOwnProperty(v.route.id) && (!b || b[v.route.id] === void 0);
                if (v.route.lazy || _) {
                    r.isStatic && (d = !0),
                    m >= 0 ? c = c.slice(0, m + 1) : c = [c[0]];
                    break
                }
            }
        }
    }
    let g = r?.onError
      , p = o && g ? (S, v) => {
        g(S, {
            location: o.location,
            params: o.matches?.[0]?.params ?? {},
            unstable_pattern: pS(o.matches),
            errorInfo: v
        })
    }
    : void 0;
    return c.reduceRight( (S, v, E) => {
        let b, _ = !1, A = null, x = null;
        o && (b = f && v.route.id ? f[v.route.id] : void 0,
        A = v.route.errorElement || wS,
        d && (m < 0 && E === 0 ? (lp("route-fallback", !1, "No `HydrateFallback` element provided to render during initial hydration"),
        _ = !0,
        x = null) : m === E && (_ = !0,
        x = v.route.hydrateFallbackElement || null)));
        let z = a.concat(c.slice(0, E + 1))
          , q = () => {
            let Y;
            return b ? Y = A : _ ? Y = x : v.route.Component ? Y = H.createElement(v.route.Component, null) : v.route.element ? Y = v.route.element : Y = S,
            H.createElement(MS, {
                match: v,
                routeContext: {
                    outlet: S,
                    matches: z,
                    isDataRoute: o != null
                },
                children: Y
            })
        }
        ;
        return o && (v.route.ErrorBoundary || v.route.errorElement || E === 0) ? H.createElement(np, {
            location: o.location,
            revalidation: o.revalidation,
            component: A,
            error: b,
            children: q(),
            routeContext: {
                outlet: null,
                matches: z,
                isDataRoute: !0
            },
            onError: p
        }) : q()
    }
    , null)
}
function Js(u) {
    return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`
}
function DS(u) {
    let a = H.useContext(kl);
    return Xe(a, Js(u)),
    a
}
function NS(u) {
    let a = H.useContext(ju);
    return Xe(a, Js(u)),
    a
}
function US(u) {
    let a = H.useContext(cn);
    return Xe(a, Js(u)),
    a
}
function $s(u) {
    let a = US(u)
      , r = a.matches[a.matches.length - 1];
    return Xe(r.route.id, `${u} can only be used on routes that contain a unique "id"`),
    r.route.id
}
function HS() {
    return $s("useRouteId")
}
function jS() {
    let u = H.useContext(ks)
      , a = NS("useRouteError")
      , r = $s("useRouteError");
    return u !== void 0 ? u : a.errors?.[r]
}
function BS() {
    let {router: u} = DS("useNavigate")
      , a = $s("useNavigate")
      , r = H.useRef(!1);
    return Pg( () => {
        r.current = !0
    }
    ),
    H.useCallback(async (c, f={}) => {
        Qt(r.current, Ig),
        r.current && (typeof c == "number" ? await u.navigate(c) : await u.navigate(c, {
            fromRouteId: a,
            ...f
        }))
    }
    , [u, a])
}
var cg = {};
function lp(u, a, r) {
    !a && !cg[u] && (cg[u] = !0,
    Qt(!1, r))
}
H.memo(qS);
function qS({routes: u, future: a, state: r, isStatic: o, onError: c}) {
    return tp(u, void 0, {
        state: r,
        isStatic: o,
        onError: c
    })
}
function GS({basename: u="/", children: a=null, location: r, navigationType: o="POP", navigator: c, static: f=!1, unstable_useTransitions: d}) {
    Xe(!ti(), "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
    let m = u.replace(/^\/*/, "/")
      , g = H.useMemo( () => ({
        basename: m,
        navigator: c,
        static: f,
        unstable_useTransitions: d,
        future: {}
    }), [m, c, f, d]);
    typeof r == "string" && (r = ei(r));
    let {pathname: p="/", search: S="", hash: v="", state: E=null, key: b="default", unstable_mask: _} = r
      , A = H.useMemo( () => {
        let x = sn(p, m);
        return x == null ? null : {
            location: {
                pathname: x,
                search: S,
                hash: v,
                state: E,
                key: b,
                unstable_mask: _
            },
            navigationType: o
        }
    }
    , [m, p, S, v, E, b, o, _]);
    return Qt(A != null, `<Router basename="${m}"> is not able to match the URL "${p}${S}${v}" because it does not start with the basename, so the <Router> won't render anything.`),
    A == null ? null : H.createElement(Mt.Provider, {
        value: g
    }, H.createElement(Bu.Provider, {
        children: a,
        value: A
    }))
}
var Ru = "get"
  , wu = "application/x-www-form-urlencoded";
function qu(u) {
    return typeof HTMLElement < "u" && u instanceof HTMLElement
}
function YS(u) {
    return qu(u) && u.tagName.toLowerCase() === "button"
}
function VS(u) {
    return qu(u) && u.tagName.toLowerCase() === "form"
}
function QS(u) {
    return qu(u) && u.tagName.toLowerCase() === "input"
}
function XS(u) {
    return !!(u.metaKey || u.altKey || u.ctrlKey || u.shiftKey)
}
function ZS(u, a) {
    return u.button === 0 && (!a || a === "_self") && !XS(u)
}
var Au = null;
function KS() {
    if (Au === null)
        try {
            new FormData(document.createElement("form"),0),
            Au = !1
        } catch {
            Au = !0
        }
    return Au
}
var kS = new Set(["application/x-www-form-urlencoded", "multipart/form-data", "text/plain"]);
function Ls(u) {
    return u != null && !kS.has(u) ? (Qt(!1, `"${u}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${wu}"`),
    null) : u
}
function JS(u, a) {
    let r, o, c, f, d;
    if (VS(u)) {
        let m = u.getAttribute("action");
        o = m ? sn(m, a) : null,
        r = u.getAttribute("method") || Ru,
        c = Ls(u.getAttribute("enctype")) || wu,
        f = new FormData(u)
    } else if (YS(u) || QS(u) && (u.type === "submit" || u.type === "image")) {
        let m = u.form;
        if (m == null)
            throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
        let g = u.getAttribute("formaction") || m.getAttribute("action");
        if (o = g ? sn(g, a) : null,
        r = u.getAttribute("formmethod") || m.getAttribute("method") || Ru,
        c = Ls(u.getAttribute("formenctype")) || Ls(m.getAttribute("enctype")) || wu,
        f = new FormData(m,u),
        !KS()) {
            let {name: p, type: S, value: v} = u;
            if (S === "image") {
                let E = p ? `${p}.` : "";
                f.append(`${E}x`, "0"),
                f.append(`${E}y`, "0")
            } else
                p && f.append(p, v)
        }
    } else {
        if (qu(u))
            throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
        r = Ru,
        o = null,
        c = wu,
        d = u
    }
    return f && c === "text/plain" && (d = f,
    f = void 0),
    {
        action: o,
        method: r.toLowerCase(),
        encType: c,
        formData: f,
        body: d
    }
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Fs(u, a) {
    if (u === !1 || u === null || typeof u > "u")
        throw new Error(a)
}
function $S(u, a, r, o) {
    let c = typeof u == "string" ? new URL(u,typeof window > "u" ? "server://singlefetch/" : window.location.origin) : u;
    return r ? c.pathname.endsWith("/") ? c.pathname = `${c.pathname}_.${o}` : c.pathname = `${c.pathname}.${o}` : c.pathname === "/" ? c.pathname = `_root.${o}` : a && sn(c.pathname, a) === "/" ? c.pathname = `${a.replace(/\/$/, "")}/_root.${o}` : c.pathname = `${c.pathname.replace(/\/$/, "")}.${o}`,
    c
}
async function FS(u, a) {
    if (u.id in a)
        return a[u.id];
    try {
        let r = await import(u.module);
        return a[u.id] = r,
        r
    } catch (r) {
        return console.error(`Error loading route module \`${u.module}\`, reloading page...`),
        console.error(r),
        window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
        window.location.reload(),
        new Promise( () => {}
        )
    }
}
function WS(u) {
    return u == null ? !1 : u.href == null ? u.rel === "preload" && typeof u.imageSrcSet == "string" && typeof u.imageSizes == "string" : typeof u.rel == "string" && typeof u.href == "string"
}
async function IS(u, a, r) {
    let o = await Promise.all(u.map(async c => {
        let f = a.routes[c.route.id];
        if (f) {
            let d = await FS(f, r);
            return d.links ? d.links() : []
        }
        return []
    }
    ));
    return nb(o.flat(1).filter(WS).filter(c => c.rel === "stylesheet" || c.rel === "preload").map(c => c.rel === "stylesheet" ? {
        ...c,
        rel: "prefetch",
        as: "style"
    } : {
        ...c,
        rel: "prefetch"
    }))
}
function fg(u, a, r, o, c, f) {
    let d = (g, p) => r[p] ? g.route.id !== r[p].route.id : !0
      , m = (g, p) => r[p].pathname !== g.pathname || r[p].route.path?.endsWith("*") && r[p].params["*"] !== g.params["*"];
    return f === "assets" ? a.filter( (g, p) => d(g, p) || m(g, p)) : f === "data" ? a.filter( (g, p) => {
        let S = o.routes[g.route.id];
        if (!S || !S.hasLoader)
            return !1;
        if (d(g, p) || m(g, p))
            return !0;
        if (g.route.shouldRevalidate) {
            let v = g.route.shouldRevalidate({
                currentUrl: new URL(c.pathname + c.search + c.hash,window.origin),
                currentParams: r[0]?.params || {},
                nextUrl: new URL(u,window.origin),
                nextParams: g.params,
                defaultShouldRevalidate: !0
            });
            if (typeof v == "boolean")
                return v
        }
        return !0
    }
    ) : []
}
function PS(u, a, {includeHydrateFallback: r}={}) {
    return eb(u.map(o => {
        let c = a.routes[o.route.id];
        if (!c)
            return [];
        let f = [c.module];
        return c.clientActionModule && (f = f.concat(c.clientActionModule)),
        c.clientLoaderModule && (f = f.concat(c.clientLoaderModule)),
        r && c.hydrateFallbackModule && (f = f.concat(c.hydrateFallbackModule)),
        c.imports && (f = f.concat(c.imports)),
        f
    }
    ).flat(1))
}
function eb(u) {
    return [...new Set(u)]
}
function tb(u) {
    let a = {}
      , r = Object.keys(u).sort();
    for (let o of r)
        a[o] = u[o];
    return a
}
function nb(u, a) {
    let r = new Set;
    return new Set(a),
    u.reduce( (o, c) => {
        let f = JSON.stringify(tb(c));
        return r.has(f) || (r.add(f),
        o.push({
            key: f,
            link: c
        })),
        o
    }
    , [])
}
function ap() {
    let u = H.useContext(kl);
    return Fs(u, "You must render this element inside a <DataRouterContext.Provider> element"),
    u
}
function lb() {
    let u = H.useContext(ju);
    return Fs(u, "You must render this element inside a <DataRouterStateContext.Provider> element"),
    u
}
var Ws = H.createContext(void 0);
Ws.displayName = "FrameworkContext";
function ip() {
    let u = H.useContext(Ws);
    return Fs(u, "You must render this element inside a <HydratedRouter> element"),
    u
}
function ab(u, a) {
    let r = H.useContext(Ws)
      , [o,c] = H.useState(!1)
      , [f,d] = H.useState(!1)
      , {onFocus: m, onBlur: g, onMouseEnter: p, onMouseLeave: S, onTouchStart: v} = a
      , E = H.useRef(null);
    H.useEffect( () => {
        if (u === "render" && d(!0),
        u === "viewport") {
            let A = z => {
                z.forEach(q => {
                    d(q.isIntersecting)
                }
                )
            }
              , x = new IntersectionObserver(A,{
                threshold: .5
            });
            return E.current && x.observe(E.current),
            () => {
                x.disconnect()
            }
        }
    }
    , [u]),
    H.useEffect( () => {
        if (o) {
            let A = setTimeout( () => {
                d(!0)
            }
            , 100);
            return () => {
                clearTimeout(A)
            }
        }
    }
    , [o]);
    let b = () => {
        c(!0)
    }
      , _ = () => {
        c(!1),
        d(!1)
    }
    ;
    return r ? u !== "intent" ? [f, E, {}] : [f, E, {
        onFocus: Ka(m, b),
        onBlur: Ka(g, _),
        onMouseEnter: Ka(p, b),
        onMouseLeave: Ka(S, _),
        onTouchStart: Ka(v, b)
    }] : [!1, E, {}]
}
function Ka(u, a) {
    return r => {
        u && u(r),
        r.defaultPrevented || a(r)
    }
}
function ib({page: u, ...a}) {
    let {router: r} = ap()
      , o = H.useMemo( () => Qg(r.routes, u, r.basename), [r.routes, u, r.basename]);
    return o ? H.createElement(rb, {
        page: u,
        matches: o,
        ...a
    }) : null
}
function ub(u) {
    let {manifest: a, routeModules: r} = ip()
      , [o,c] = H.useState([]);
    return H.useEffect( () => {
        let f = !1;
        return IS(u, a, r).then(d => {
            f || c(d)
        }
        ),
        () => {
            f = !0
        }
    }
    , [u, a, r]),
    o
}
function rb({page: u, matches: a, ...r}) {
    let o = Hn()
      , {future: c, manifest: f, routeModules: d} = ip()
      , {basename: m} = ap()
      , {loaderData: g, matches: p} = lb()
      , S = H.useMemo( () => fg(u, a, p, f, o, "data"), [u, a, p, f, o])
      , v = H.useMemo( () => fg(u, a, p, f, o, "assets"), [u, a, p, f, o])
      , E = H.useMemo( () => {
        if (u === o.pathname + o.search + o.hash)
            return [];
        let A = new Set
          , x = !1;
        if (a.forEach(q => {
            let Y = f.routes[q.route.id];
            !Y || !Y.hasLoader || (!S.some(k => k.route.id === q.route.id) && q.route.id in g && d[q.route.id]?.shouldRevalidate || Y.hasClientLoader ? x = !0 : A.add(q.route.id))
        }
        ),
        A.size === 0)
            return [];
        let z = $S(u, m, c.unstable_trailingSlashAwareDataRequests, "data");
        return x && A.size > 0 && z.searchParams.set("_routes", a.filter(q => A.has(q.route.id)).map(q => q.route.id).join(",")),
        [z.pathname + z.search]
    }
    , [m, c.unstable_trailingSlashAwareDataRequests, g, o, f, S, a, u, d])
      , b = H.useMemo( () => PS(v, f), [v, f])
      , _ = ub(v);
    return H.createElement(H.Fragment, null, E.map(A => H.createElement("link", {
        key: A,
        rel: "prefetch",
        as: "fetch",
        href: A,
        ...r
    })), b.map(A => H.createElement("link", {
        key: A,
        rel: "modulepreload",
        href: A,
        ...r
    })), _.map( ({key: A, link: x}) => H.createElement("link", {
        key: A,
        nonce: r.nonce,
        ...x,
        crossOrigin: x.crossOrigin ?? r.crossOrigin
    })))
}
function ob(...u) {
    return a => {
        u.forEach(r => {
            typeof r == "function" ? r(a) : r != null && (r.current = a)
        }
        )
    }
}
var sb = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
try {
    sb && (window.__reactRouterVersion = "7.13.1")
} catch {}
function cb({basename: u, children: a, unstable_useTransitions: r, window: o}) {
    let c = H.useRef();
    c.current == null && (c.current = Z1({
        window: o,
        v5Compat: !0
    }));
    let f = c.current
      , [d,m] = H.useState({
        action: f.action,
        location: f.location
    })
      , g = H.useCallback(p => {
        r === !1 ? m(p) : H.startTransition( () => m(p))
    }
    , [r]);
    return H.useLayoutEffect( () => f.listen(g), [f, g]),
    H.createElement(GS, {
        basename: u,
        children: a,
        location: d.location,
        navigationType: d.action,
        navigator: f,
        unstable_useTransitions: r
    })
}
var up = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i
  , rp = H.forwardRef(function({onClick: a, discover: r="render", prefetch: o="none", relative: c, reloadDocument: f, replace: d, unstable_mask: m, state: g, target: p, to: S, preventScrollReset: v, viewTransition: E, unstable_defaultShouldRevalidate: b, ..._}, A) {
    let {basename: x, navigator: z, unstable_useTransitions: q} = H.useContext(Mt)
      , Y = typeof S == "string" && up.test(S)
      , k = Jg(S, x);
    S = k.to;
    let F = TS(S, {
        relative: c
    })
      , re = Hn()
      , W = null;
    if (m) {
        let ce = Ks(m, [], re.unstable_mask ? re.unstable_mask.pathname : "/", !0);
        x !== "/" && (ce.pathname = ce.pathname === "/" ? x : Vt([x, ce.pathname])),
        W = z.createHref(ce)
    }
    let[pe,Ce,V] = ab(o, _)
      , X = mb(S, {
        replace: d,
        unstable_mask: m,
        state: g,
        target: p,
        preventScrollReset: v,
        relative: c,
        viewTransition: E,
        unstable_defaultShouldRevalidate: b,
        unstable_useTransitions: q
    });
    function K(ce) {
        a && a(ce),
        ce.defaultPrevented || X(ce)
    }
    let te = !(k.isExternal || f)
      , oe = H.createElement("a", {
        ..._,
        ...V,
        href: (te ? W : void 0) || k.absoluteURL || F,
        onClick: te ? K : a,
        ref: ob(A, Ce),
        target: p,
        "data-discover": !Y && r === "render" ? "true" : void 0
    });
    return pe && !Y ? H.createElement(H.Fragment, null, oe, H.createElement(ib, {
        page: F
    })) : oe
});
rp.displayName = "Link";
var fb = H.forwardRef(function({"aria-current": a="page", caseSensitive: r=!1, className: o="", end: c=!1, style: f, to: d, viewTransition: m, children: g, ...p}, S) {
    let v = ni(d, {
        relative: p.relative
    })
      , E = Hn()
      , b = H.useContext(ju)
      , {navigator: _, basename: A} = H.useContext(Mt)
      , x = b != null && Sb(v) && m === !0
      , z = _.encodeLocation ? _.encodeLocation(v).pathname : v.pathname
      , q = E.pathname
      , Y = b && b.navigation && b.navigation.location ? b.navigation.location.pathname : null;
    r || (q = q.toLowerCase(),
    Y = Y ? Y.toLowerCase() : null,
    z = z.toLowerCase()),
    Y && A && (Y = sn(Y, A) || Y);
    const k = z !== "/" && z.endsWith("/") ? z.length - 1 : z.length;
    let F = q === z || !c && q.startsWith(z) && q.charAt(k) === "/", re = Y != null && (Y === z || !c && Y.startsWith(z) && Y.charAt(z.length) === "/"), W = {
        isActive: F,
        isPending: re,
        isTransitioning: x
    }, pe = F ? a : void 0, Ce;
    typeof o == "function" ? Ce = o(W) : Ce = [o, F ? "active" : null, re ? "pending" : null, x ? "transitioning" : null].filter(Boolean).join(" ");
    let V = typeof f == "function" ? f(W) : f;
    return H.createElement(rp, {
        ...p,
        "aria-current": pe,
        className: Ce,
        ref: S,
        style: V,
        to: d,
        viewTransition: m
    }, typeof g == "function" ? g(W) : g)
});
fb.displayName = "NavLink";
var db = H.forwardRef( ({discover: u="render", fetcherKey: a, navigate: r, reloadDocument: o, replace: c, state: f, method: d=Ru, action: m, onSubmit: g, relative: p, preventScrollReset: S, viewTransition: v, unstable_defaultShouldRevalidate: E, ...b}, _) => {
    let {unstable_useTransitions: A} = H.useContext(Mt)
      , x = yb()
      , z = vb(m, {
        relative: p
    })
      , q = d.toLowerCase() === "get" ? "get" : "post"
      , Y = typeof m == "string" && up.test(m)
      , k = F => {
        if (g && g(F),
        F.defaultPrevented)
            return;
        F.preventDefault();
        let re = F.nativeEvent.submitter
          , W = re?.getAttribute("formmethod") || d
          , pe = () => x(re || F.currentTarget, {
            fetcherKey: a,
            method: W,
            navigate: r,
            replace: c,
            state: f,
            relative: p,
            preventScrollReset: S,
            viewTransition: v,
            unstable_defaultShouldRevalidate: E
        });
        A && r !== !1 ? H.startTransition( () => pe()) : pe()
    }
    ;
    return H.createElement("form", {
        ref: _,
        method: q,
        action: z,
        onSubmit: o ? g : k,
        ...b,
        "data-discover": !Y && u === "render" ? "true" : void 0
    })
}
);
db.displayName = "Form";
function hb(u) {
    return `${u} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`
}
function op(u) {
    let a = H.useContext(kl);
    return Xe(a, hb(u)),
    a
}
function mb(u, {target: a, replace: r, unstable_mask: o, state: c, preventScrollReset: f, relative: d, viewTransition: m, unstable_defaultShouldRevalidate: g, unstable_useTransitions: p}={}) {
    let S = ep()
      , v = Hn()
      , E = ni(u, {
        relative: d
    });
    return H.useCallback(b => {
        if (ZS(b, a)) {
            b.preventDefault();
            let _ = r !== void 0 ? r : Pa(v) === Pa(E)
              , A = () => S(u, {
                replace: _,
                unstable_mask: o,
                state: c,
                preventScrollReset: f,
                relative: d,
                viewTransition: m,
                unstable_defaultShouldRevalidate: g
            });
            p ? H.startTransition( () => A()) : A()
        }
    }
    , [v, S, E, r, o, c, a, u, f, d, m, g, p])
}
var gb = 0
  , pb = () => `__${String(++gb)}__`;
function yb() {
    let {router: u} = op("useSubmit")
      , {basename: a} = H.useContext(Mt)
      , r = HS()
      , o = u.fetch
      , c = u.navigate;
    return H.useCallback(async (f, d={}) => {
        let {action: m, method: g, encType: p, formData: S, body: v} = JS(f, a);
        if (d.navigate === !1) {
            let E = d.fetcherKey || pb();
            await o(E, r, d.action || m, {
                unstable_defaultShouldRevalidate: d.unstable_defaultShouldRevalidate,
                preventScrollReset: d.preventScrollReset,
                formData: S,
                body: v,
                formMethod: d.method || g,
                formEncType: d.encType || p,
                flushSync: d.flushSync
            })
        } else
            await c(d.action || m, {
                unstable_defaultShouldRevalidate: d.unstable_defaultShouldRevalidate,
                preventScrollReset: d.preventScrollReset,
                formData: S,
                body: v,
                formMethod: d.method || g,
                formEncType: d.encType || p,
                replace: d.replace,
                state: d.state,
                fromRouteId: r,
                flushSync: d.flushSync,
                viewTransition: d.viewTransition
            })
    }
    , [o, c, a, r])
}
function vb(u, {relative: a}={}) {
    let {basename: r} = H.useContext(Mt)
      , o = H.useContext(cn);
    Xe(o, "useFormAction must be used inside a RouteContext");
    let[c] = o.matches.slice(-1)
      , f = {
        ...ni(u || ".", {
            relative: a
        })
    }
      , d = Hn();
    if (u == null) {
        f.search = d.search;
        let m = new URLSearchParams(f.search)
          , g = m.getAll("index");
        if (g.some(S => S === "")) {
            m.delete("index"),
            g.filter(v => v).forEach(v => m.append("index", v));
            let S = m.toString();
            f.search = S ? `?${S}` : ""
        }
    }
    return (!u || u === ".") && c.route.index && (f.search = f.search ? f.search.replace(/^\?/, "?index&") : "?index"),
    r !== "/" && (f.pathname = f.pathname === "/" ? r : Vt([r, f.pathname])),
    Pa(f)
}
function Sb(u, {relative: a}={}) {
    let r = H.useContext(Fg);
    Xe(r != null, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
    let {basename: o} = op("useViewTransitionState")
      , c = ni(u, {
        relative: a
    });
    if (!r.isTransitioning)
        return !1;
    let f = sn(r.currentLocation.pathname, o) || r.currentLocation.pathname
      , d = sn(r.nextLocation.pathname, o) || r.nextLocation.pathname;
    return Nu(c.pathname, d) != null || Nu(c.pathname, f) != null
}
const bb = H.lazy( () => nl( () => import("./page-D-NAkGX4.js"), __vite__mapDeps([0, 1])))
  , Eb = H.lazy( () => nl( () => import("./page-loWmfJ5S.js"), __vite__mapDeps([2, 1, 3, 4])))
  , _b = H.lazy( () => nl( () => import("./page-OqNlvT0X.js"), __vite__mapDeps([5, 1, 3, 4])))
  , xb = H.lazy( () => nl( () => import("./page-CJS09K7r.js"), __vite__mapDeps([6, 1, 3, 4])))
  , Cb = H.lazy( () => nl( () => import("./NotFound-BiWmkV7T.js"), []))
  , sp = [{
    path: "/",
    element: ct.jsx(bb, {})
}, {
    path: "/product-1",
    element: ct.jsx(Eb, {})
}, {
    path: "/product-2",
    element: ct.jsx(_b, {})
}, {
    path: "/product-3",
    element: ct.jsx(xb, {})
}, {
    path: "*",
    element: ct.jsx(Cb, {})
}]
  , Tb = Object.freeze(Object.defineProperty({
    __proto__: null,
    default: sp
}, Symbol.toStringTag, {
    value: "Module"
}));
let cp;
const Ob = new Promise(u => {
    cp = u
}
);
function fp() {
    const u = AS(sp)
      , a = ep();
    return H.useEffect( () => {
        window.REACT_APP_NAVIGATE = a,
        cp(window.REACT_APP_NAVIGATE)
    }
    ),
    u
}
const Ab = Object.freeze(Object.defineProperty({
    __proto__: null,
    AppRoutes: fp,
    navigatePromise: Ob
}, Symbol.toStringTag, {
    value: "Module"
}));
function Rb() {
    return ct.jsx(_1, {
        i18n: Pe,
        children: ct.jsx(cb, {
            basename: "/preview/7a1a7a1f-6f73-434a-abaa-6e0a1b446a92/7346929",
            children: ct.jsx(fp, {})
        })
    })
}
X1.createRoot(document.getElementById("root")).render(ct.jsx(H.StrictMode, {
    children: ct.jsx(Rb, {})
}));
export {rp as L, Em as R, ct as j, H as r, Hn as u};
//# sourceMappingURL=index-BUteU9FP.js.map
