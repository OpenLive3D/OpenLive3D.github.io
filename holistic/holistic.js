(function() {
    /*

     Copyright The Closure Library Authors.
     SPDX-License-Identifier: Apache-2.0
    */
    'use strict';
    var v;

    function aa(a) {
        var b = 0;
        return function() {
            return b < a.length ? {
                done: !1,
                value: a[b++]
            } : {
                done: !0
            }
        }
    }
    var ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
        if (a == Array.prototype || a == Object.prototype) return a;
        a[b] = c.value;
        return a
    };

    function ca(a) {
        a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var b = 0; b < a.length; ++b) {
            var c = a[b];
            if (c && c.Math == Math) return c
        }
        throw Error("Cannot find global object");
    }
    var y = ca(this);

    function z(a, b) {
        if (b) a: {
            var c = y;a = a.split(".");
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                if (!(e in c)) break a;
                c = c[e]
            }
            a = a[a.length - 1];d = c[a];b = b(d);b != d && null != b && ba(c, a, {
                configurable: !0,
                writable: !0,
                value: b
            })
        }
    }
    z("Symbol", function(a) {
        function b(g) {
            if (this instanceof b) throw new TypeError("Symbol is not a constructor");
            return new c(d + (g || "") + "_" + e++, g)
        }

        function c(g, f) {
            this.g = g;
            ba(this, "description", {
                configurable: !0,
                writable: !0,
                value: f
            })
        }
        if (a) return a;
        c.prototype.toString = function() {
            return this.g
        };
        var d = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_",
            e = 0;
        return b
    });
    z("Symbol.iterator", function(a) {
        if (a) return a;
        a = Symbol("Symbol.iterator");
        for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
            var d = y[b[c]];
            "function" === typeof d && "function" != typeof d.prototype[a] && ba(d.prototype, a, {
                configurable: !0,
                writable: !0,
                value: function() {
                    return da(aa(this))
                }
            })
        }
        return a
    });

    function da(a) {
        a = {
            next: a
        };
        a[Symbol.iterator] = function() {
            return this
        };
        return a
    }

    function A(a) {
        var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
        return b ? b.call(a) : {
            next: aa(a)
        }
    }

    function B(a) {
        if (!(a instanceof Array)) {
            a = A(a);
            for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
            a = c
        }
        return a
    }
    var ea = "function" == typeof Object.assign ? Object.assign : function(a, b) {
        for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c];
            if (d)
                for (var e in d) Object.prototype.hasOwnProperty.call(d, e) && (a[e] = d[e])
        }
        return a
    };
    z("Object.assign", function(a) {
        return a || ea
    });
    var fa = "function" == typeof Object.create ? Object.create : function(a) {
            function b() {}
            b.prototype = a;
            return new b
        },
        ha;
    if ("function" == typeof Object.setPrototypeOf) ha = Object.setPrototypeOf;
    else {
        var ia;
        a: {
            var ja = {
                    a: !0
                },
                ka = {};
            try {
                ka.__proto__ = ja;
                ia = ka.a;
                break a
            } catch (a) {}
            ia = !1
        }
        ha = ia ? function(a, b) {
            a.__proto__ = b;
            if (a.__proto__ !== b) throw new TypeError(a + " is not extensible");
            return a
        } : null
    }
    var la = ha;

    function E(a, b) {
        a.prototype = fa(b.prototype);
        a.prototype.constructor = a;
        if (la) la(a, b);
        else
            for (var c in b)
                if ("prototype" != c)
                    if (Object.defineProperties) {
                        var d = Object.getOwnPropertyDescriptor(b, c);
                        d && Object.defineProperty(a, c, d)
                    } else a[c] = b[c];
        a.ya = b.prototype
    }

    function ma() {
        this.l = !1;
        this.i = null;
        this.h = void 0;
        this.g = 1;
        this.v = this.s = 0;
        this.j = null
    }

    function na(a) {
        if (a.l) throw new TypeError("Generator is already running");
        a.l = !0
    }
    ma.prototype.u = function(a) {
        this.h = a
    };

    function oa(a, b) {
        a.j = {
            ma: b,
            na: !0
        };
        a.g = a.s || a.v
    }
    ma.prototype.return = function(a) {
        this.j = {
            return: a
        };
        this.g = this.v
    };

    function F(a, b, c) {
        a.g = c;
        return {
            value: b
        }
    }

    function pa(a) {
        this.g = new ma;
        this.h = a
    }

    function qa(a, b) {
        na(a.g);
        var c = a.g.i;
        if (c) return ra(a, "return" in c ? c["return"] : function(d) {
            return {
                value: d,
                done: !0
            }
        }, b, a.g.return);
        a.g.return(b);
        return sa(a)
    }

    function ra(a, b, c, d) {
        try {
            var e = b.call(a.g.i, c);
            if (!(e instanceof Object)) throw new TypeError("Iterator result " + e + " is not an object");
            if (!e.done) return a.g.l = !1, e;
            var g = e.value
        } catch (f) {
            return a.g.i = null, oa(a.g, f), sa(a)
        }
        a.g.i = null;
        d.call(a.g, g);
        return sa(a)
    }

    function sa(a) {
        for (; a.g.g;) try {
            var b = a.h(a.g);
            if (b) return a.g.l = !1, {
                value: b.value,
                done: !1
            }
        } catch (c) {
            a.g.h = void 0, oa(a.g, c)
        }
        a.g.l = !1;
        if (a.g.j) {
            b = a.g.j;
            a.g.j = null;
            if (b.na) throw b.ma;
            return {
                value: b.return,
                done: !0
            }
        }
        return {
            value: void 0,
            done: !0
        }
    }

    function ta(a) {
        this.next = function(b) {
            na(a.g);
            a.g.i ? b = ra(a, a.g.i.next, b, a.g.u) : (a.g.u(b), b = sa(a));
            return b
        };
        this.throw = function(b) {
            na(a.g);
            a.g.i ? b = ra(a, a.g.i["throw"], b, a.g.u) : (oa(a.g, b), b = sa(a));
            return b
        };
        this.return = function(b) {
            return qa(a, b)
        };
        this[Symbol.iterator] = function() {
            return this
        }
    }

    function ua(a) {
        function b(d) {
            return a.next(d)
        }

        function c(d) {
            return a.throw(d)
        }
        return new Promise(function(d, e) {
            function g(f) {
                f.done ? d(f.value) : Promise.resolve(f.value).then(b, c).then(g, e)
            }
            g(a.next())
        })
    }

    function G(a) {
        return ua(new ta(new pa(a)))
    }
    z("Promise", function(a) {
        function b(f) {
            this.h = 0;
            this.i = void 0;
            this.g = [];
            this.u = !1;
            var h = this.j();
            try {
                f(h.resolve, h.reject)
            } catch (k) {
                h.reject(k)
            }
        }

        function c() {
            this.g = null
        }

        function d(f) {
            return f instanceof b ? f : new b(function(h) {
                h(f)
            })
        }
        if (a) return a;
        c.prototype.h = function(f) {
            if (null == this.g) {
                this.g = [];
                var h = this;
                this.i(function() {
                    h.l()
                })
            }
            this.g.push(f)
        };
        var e = y.setTimeout;
        c.prototype.i = function(f) {
            e(f, 0)
        };
        c.prototype.l = function() {
            for (; this.g && this.g.length;) {
                var f = this.g;
                this.g = [];
                for (var h = 0; h < f.length; ++h) {
                    var k =
                        f[h];
                    f[h] = null;
                    try {
                        k()
                    } catch (l) {
                        this.j(l)
                    }
                }
            }
            this.g = null
        };
        c.prototype.j = function(f) {
            this.i(function() {
                throw f;
            })
        };
        b.prototype.j = function() {
            function f(l) {
                return function(m) {
                    k || (k = !0, l.call(h, m))
                }
            }
            var h = this,
                k = !1;
            return {
                resolve: f(this.H),
                reject: f(this.l)
            }
        };
        b.prototype.H = function(f) {
            if (f === this) this.l(new TypeError("A Promise cannot resolve to itself"));
            else if (f instanceof b) this.K(f);
            else {
                a: switch (typeof f) {
                    case "object":
                        var h = null != f;
                        break a;
                    case "function":
                        h = !0;
                        break a;
                    default:
                        h = !1
                }
                h ? this.B(f) : this.s(f)
            }
        };
        b.prototype.B = function(f) {
            var h = void 0;
            try {
                h = f.then
            } catch (k) {
                this.l(k);
                return
            }
            "function" == typeof h ? this.L(h, f) : this.s(f)
        };
        b.prototype.l = function(f) {
            this.v(2, f)
        };
        b.prototype.s = function(f) {
            this.v(1, f)
        };
        b.prototype.v = function(f, h) {
            if (0 != this.h) throw Error("Cannot settle(" + f + ", " + h + "): Promise already settled in state" + this.h);
            this.h = f;
            this.i = h;
            2 === this.h && this.J();
            this.F()
        };
        b.prototype.J = function() {
            var f = this;
            e(function() {
                if (f.G()) {
                    var h = y.console;
                    "undefined" !== typeof h && h.error(f.i)
                }
            }, 1)
        };
        b.prototype.G =
            function() {
                if (this.u) return !1;
                var f = y.CustomEvent,
                    h = y.Event,
                    k = y.dispatchEvent;
                if ("undefined" === typeof k) return !0;
                "function" === typeof f ? f = new f("unhandledrejection", {
                    cancelable: !0
                }) : "function" === typeof h ? f = new h("unhandledrejection", {
                    cancelable: !0
                }) : (f = y.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", !1, !0, f));
                f.promise = this;
                f.reason = this.i;
                return k(f)
            };
        b.prototype.F = function() {
            if (null != this.g) {
                for (var f = 0; f < this.g.length; ++f) g.h(this.g[f]);
                this.g = null
            }
        };
        var g = new c;
        b.prototype.K =
            function(f) {
                var h = this.j();
                f.T(h.resolve, h.reject)
            };
        b.prototype.L = function(f, h) {
            var k = this.j();
            try {
                f.call(h, k.resolve, k.reject)
            } catch (l) {
                k.reject(l)
            }
        };
        b.prototype.then = function(f, h) {
            function k(p, n) {
                return "function" == typeof p ? function(q) {
                    try {
                        l(p(q))
                    } catch (t) {
                        m(t)
                    }
                } : n
            }
            var l, m, r = new b(function(p, n) {
                l = p;
                m = n
            });
            this.T(k(f, l), k(h, m));
            return r
        };
        b.prototype.catch = function(f) {
            return this.then(void 0, f)
        };
        b.prototype.T = function(f, h) {
            function k() {
                switch (l.h) {
                    case 1:
                        f(l.i);
                        break;
                    case 2:
                        h(l.i);
                        break;
                    default:
                        throw Error("Unexpected state: " +
                            l.h);
                }
            }
            var l = this;
            null == this.g ? g.h(k) : this.g.push(k);
            this.u = !0
        };
        b.resolve = d;
        b.reject = function(f) {
            return new b(function(h, k) {
                k(f)
            })
        };
        b.race = function(f) {
            return new b(function(h, k) {
                for (var l = A(f), m = l.next(); !m.done; m = l.next()) d(m.value).T(h, k)
            })
        };
        b.all = function(f) {
            var h = A(f),
                k = h.next();
            return k.done ? d([]) : new b(function(l, m) {
                function r(q) {
                    return function(t) {
                        p[q] = t;
                        n--;
                        0 == n && l(p)
                    }
                }
                var p = [],
                    n = 0;
                do p.push(void 0), n++, d(k.value).T(r(p.length - 1), m), k = h.next(); while (!k.done)
            })
        };
        return b
    });

    function va(a, b) {
        a instanceof String && (a += "");
        var c = 0,
            d = !1,
            e = {
                next: function() {
                    if (!d && c < a.length) {
                        var g = c++;
                        return {
                            value: b(g, a[g]),
                            done: !1
                        }
                    }
                    d = !0;
                    return {
                        done: !0,
                        value: void 0
                    }
                }
            };
        e[Symbol.iterator] = function() {
            return e
        };
        return e
    }
    z("Number.isNaN", function(a) {
        return a ? a : function(b) {
            return "number" === typeof b && isNaN(b)
        }
    });
    z("Object.is", function(a) {
        return a ? a : function(b, c) {
            return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c
        }
    });
    z("Array.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            var d = this;
            d instanceof String && (d = String(d));
            var e = d.length;
            c = c || 0;
            for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
                var g = d[c];
                if (g === b || Object.is(g, b)) return !0
            }
            return !1
        }
    });
    z("String.prototype.includes", function(a) {
        return a ? a : function(b, c) {
            if (null == this) throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");
            if (b instanceof RegExp) throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
            return -1 !== this.indexOf(b, c || 0)
        }
    });
    z("Array.prototype.keys", function(a) {
        return a ? a : function() {
            return va(this, function(b) {
                return b
            })
        }
    });
    var wa = this || self;

    function H(a, b) {
        a = a.split(".");
        var c = wa;
        a[0] in c || "undefined" == typeof c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c[d] && c[d] !== Object.prototype[d] ? c = c[d] : c = c[d] = {} : c[d] = b
    };
    var xa = {},
        ya = null;

    function za(a) {
        var b;
        void 0 === b && (b = 0);
        Aa();
        b = xa[b];
        for (var c = Array(Math.floor(a.length / 3)), d = b[64] || "", e = 0, g = 0; e < a.length - 2; e += 3) {
            var f = a[e],
                h = a[e + 1],
                k = a[e + 2],
                l = b[f >> 2];
            f = b[(f & 3) << 4 | h >> 4];
            h = b[(h & 15) << 2 | k >> 6];
            k = b[k & 63];
            c[g++] = l + f + h + k
        }
        l = 0;
        k = d;
        switch (a.length - e) {
            case 2:
                l = a[e + 1], k = b[(l & 15) << 2] || d;
            case 1:
                a = a[e], c[g] = b[a >> 2] + b[(a & 3) << 4 | l >> 4] + k + d
        }
        return c.join("")
    }

    function Ba(a) {
        var b = a.length,
            c = 3 * b / 4;
        c % 3 ? c = Math.floor(c) : -1 != "=.".indexOf(a[b - 1]) && (c = -1 != "=.".indexOf(a[b - 2]) ? c - 2 : c - 1);
        var d = new Uint8Array(c),
            e = 0;
        Ca(a, function(g) {
            d[e++] = g
        });
        return e !== c ? d.subarray(0, e) : d
    }

    function Ca(a, b) {
        function c(k) {
            for (; d < a.length;) {
                var l = a.charAt(d++),
                    m = ya[l];
                if (null != m) return m;
                if (!/^[\s\xa0]*$/.test(l)) throw Error("Unknown base64 encoding at char: " + l);
            }
            return k
        }
        Aa();
        for (var d = 0;;) {
            var e = c(-1),
                g = c(0),
                f = c(64),
                h = c(64);
            if (64 === h && -1 === e) break;
            b(e << 2 | g >> 4);
            64 != f && (b(g << 4 & 240 | f >> 2), 64 != h && b(f << 6 & 192 | h))
        }
    }

    function Aa() {
        if (!ya) {
            ya = {};
            for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), b = ["+/=", "+/", "-_=", "-_.", "-_"], c = 0; 5 > c; c++) {
                var d = a.concat(b[c].split(""));
                xa[c] = d;
                for (var e = 0; e < d.length; e++) {
                    var g = d[e];
                    void 0 === ya[g] && (ya[g] = e)
                }
            }
        }
    };
    var Da = "undefined" !== typeof Uint8Array;

    function Ea(a) {
        return Da && null != a && a instanceof Uint8Array
    }
    var Fa;

    function Ga() {
        return Fa || (Fa = new Uint8Array(0))
    }
    var Ha = {};
    var Ia = "function" === typeof Uint8Array.prototype.slice,
        I = 0,
        K = 0;

    function Ja(a) {
        var b = 0 > a;
        a = Math.abs(a);
        var c = a >>> 0;
        a = Math.floor((a - c) / 4294967296);
        b && (c = A(Ka(c, a)), b = c.next().value, a = c.next().value, c = b);
        I = c >>> 0;
        K = a >>> 0
    }

    function La(a) {
        a = +a;
        if (0 === a) 0 < 1 / a ? I = K = 0 : (K = 0, I = 2147483648);
        else if (isNaN(a)) K = 0, I = 2147483647;
        else {
            var b = 0 > a ? -2147483648 : 0;
            a = b ? -a : a;
            if (3.4028234663852886E38 < a) K = 0, I = (b | 2139095040) >>> 0;
            else if (1.1754943508222875E-38 > a) a = Math.round(a / Math.pow(2, -149)), K = 0, I = (b | a) >>> 0;
            else {
                var c = Math.floor(Math.log(a) / Math.LN2);
                a *= Math.pow(2, -c);
                a = Math.round(8388608 * a);
                16777216 <= a && ++c;
                K = 0;
                I = (b | c + 127 << 23 | a & 8388607) >>> 0
            }
        }
    }
    var Ma = "function" === typeof BigInt;

    function Ka(a, b) {
        b = ~b;
        a ? a = ~a + 1 : b += 1;
        return [a, b]
    };

    function Na(a, b) {
        this.h = a >>> 0;
        this.g = b >>> 0
    }

    function Oa(a) {
        if (!a) return Pa || (Pa = new Na(0, 0));
        if (!/^-?\d+$/.test(a)) return null;
        if (16 > a.length) Ja(Number(a));
        else if (Ma) a = BigInt(a), I = Number(a & BigInt(4294967295)) >>> 0, K = Number(a >> BigInt(32) & BigInt(4294967295));
        else {
            var b = +("-" === a[0]);
            K = I = 0;
            for (var c = a.length, d = b, e = (c - b) % 6 + b; e <= c; d = e, e += 6) d = Number(a.slice(d, e)), K *= 1E6, I = 1E6 * I + d, 4294967296 <= I && (K += I / 4294967296 | 0, I %= 4294967296);
            b && (b = A(Ka(I, K)), a = b.next().value, b = b.next().value, I = a, K = b)
        }
        return new Na(I, K)
    }
    var Pa;

    function Qa(a, b) {
        return Error("Invalid wire type: " + a + " (at position " + b + ")")
    }

    function Ra() {
        return Error("Failed to read varint, encoding is invalid.")
    }

    function Sa(a, b) {
        return Error("Tried to read past the end of the data " + b + " > " + a)
    };

    function M() {
        throw Error("Invalid UTF8");
    }

    function Ta(a, b) {
        b = String.fromCharCode.apply(null, b);
        return null == a ? b : a + b
    }
    var Ua = void 0,
        Va, Wa = "undefined" !== typeof TextDecoder,
        Xa, Ya = "undefined" !== typeof TextEncoder;
    var Za;

    function $a(a) {
        if (a !== Ha) throw Error("illegal external caller");
    }

    function ab(a, b) {
        $a(b);
        this.V = a;
        if (null != a && 0 === a.length) throw Error("ByteString should be constructed with non-empty values");
    }

    function bb() {
        return Za || (Za = new ab(null, Ha))
    }

    function cb(a) {
        $a(Ha);
        var b = a.V;
        b = null == b || Ea(b) ? b : "string" === typeof b ? Ba(b) : null;
        return null == b ? b : a.V = b
    };

    function db(a) {
        if ("string" === typeof a) return {
            buffer: Ba(a),
            A: !1
        };
        if (Array.isArray(a)) return {
            buffer: new Uint8Array(a),
            A: !1
        };
        if (a.constructor === Uint8Array) return {
            buffer: a,
            A: !1
        };
        if (a.constructor === ArrayBuffer) return {
            buffer: new Uint8Array(a),
            A: !1
        };
        if (a.constructor === ab) return {
            buffer: cb(a) || Ga(),
            A: !0
        };
        if (a instanceof Uint8Array) return {
            buffer: new Uint8Array(a.buffer, a.byteOffset, a.byteLength),
            A: !1
        };
        throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, a ByteString or an Array of numbers");
    };

    function eb(a) {
        this.h = null;
        this.u = !1;
        this.g = this.i = this.l = 0;
        fb(this, a)
    }

    function fb(a, b) {
        var c = {};
        a.S = void 0 === c.S ? !1 : c.S;
        b && (b = db(b), a.h = b.buffer, a.u = b.A, a.l = 0, a.i = a.h.length, a.g = a.l)
    }
    eb.prototype.reset = function() {
        this.g = this.l
    };

    function N(a, b) {
        a.g = b;
        if (b > a.i) throw Sa(a.i, b);
    }

    function gb(a) {
        var b = a.h,
            c = a.g,
            d = b[c++],
            e = d & 127;
        if (d & 128 && (d = b[c++], e |= (d & 127) << 7, d & 128 && (d = b[c++], e |= (d & 127) << 14, d & 128 && (d = b[c++], e |= (d & 127) << 21, d & 128 && (d = b[c++], e |= d << 28, d & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128 && b[c++] & 128))))) throw Ra();
        N(a, c);
        return e
    }
    eb.prototype.j = function() {
        return gb(this) >>> 0
    };
    eb.prototype.s = function() {
        var a = this.h,
            b = this.g,
            c = a[b],
            d = a[b + 1];
        var e = a[b + 2];
        a = a[b + 3];
        N(this, this.g + 4);
        e = (c << 0 | d << 8 | e << 16 | a << 24) >>> 0;
        c = 2 * (e >> 31) + 1;
        d = e >>> 23 & 255;
        e &= 8388607;
        return 255 == d ? e ? NaN : Infinity * c : 0 == d ? c * Math.pow(2, -149) * e : c * Math.pow(2, d - 150) * (e + Math.pow(2, 23))
    };

    function hb(a, b) {
        if (0 > b) throw Error("Tried to read a negative byte length: " + b);
        var c = a.g,
            d = c + b;
        if (d > a.i) throw Sa(b, a.i - c);
        a.g = d;
        return c
    }
    var ib = [];

    function jb() {
        this.g = []
    }
    jb.prototype.length = function() {
        return this.g.length
    };
    jb.prototype.end = function() {
        var a = this.g;
        this.g = [];
        return a
    };

    function kb(a, b, c) {
        for (; 0 < c || 127 < b;) a.g.push(b & 127 | 128), b = (b >>> 7 | c << 25) >>> 0, c >>>= 7;
        a.g.push(b)
    }

    function lb(a, b) {
        for (; 127 < b;) a.g.push(b & 127 | 128), b >>>= 7;
        a.g.push(b)
    }

    function mb(a, b) {
        if (0 <= b) lb(a, b);
        else {
            for (var c = 0; 9 > c; c++) a.g.push(b & 127 | 128), b >>= 7;
            a.g.push(1)
        }
    }

    function nb(a) {
        var b = I;
        a.g.push(b >>> 0 & 255);
        a.g.push(b >>> 8 & 255);
        a.g.push(b >>> 16 & 255);
        a.g.push(b >>> 24 & 255)
    };

    function ob(a) {
        if (ib.length) {
            var b = ib.pop();
            fb(b, a);
            a = b
        } else a = new eb(a);
        this.g = a;
        this.i = this.g.g;
        this.h = this.j = -1;
        this.setOptions(void 0)
    }
    ob.prototype.setOptions = function(a) {
        a = void 0 === a ? {} : a;
        this.da = void 0 === a.da ? !1 : a.da
    };
    ob.prototype.reset = function() {
        this.g.reset();
        this.i = this.g.g;
        this.h = this.j = -1
    };

    function pb(a) {
        var b = a.g;
        if (b.g == b.i) return !1;
        a.i = a.g.g;
        var c = a.g.j();
        b = c >>> 3;
        c &= 7;
        if (!(0 <= c && 5 >= c)) throw Qa(c, a.i);
        if (1 > b) throw Error("Invalid field number: " + b + " (at position " + a.i + ")");
        a.j = b;
        a.h = c;
        return !0
    }

    function qb(a) {
        switch (a.h) {
            case 0:
                if (0 != a.h) qb(a);
                else a: {
                    a = a.g;
                    for (var b = a.g, c = b + 10, d = a.h; b < c;)
                        if (0 === (d[b++] & 128)) {
                            N(a, b);
                            break a
                        } throw Ra();
                }
                break;
            case 1:
                a = a.g;
                N(a, a.g + 8);
                break;
            case 2:
                2 != a.h ? qb(a) : (b = a.g.j(), a = a.g, N(a, a.g + b));
                break;
            case 5:
                a = a.g;
                N(a, a.g + 4);
                break;
            case 3:
                b = a.j;
                do {
                    if (!pb(a)) throw Error("Unmatched start-group tag: stream EOF");
                    if (4 == a.h) {
                        if (a.j != b) throw Error("Unmatched end-group tag");
                        break
                    }
                    qb(a)
                } while (1);
                break;
            default:
                throw Qa(a.h, a.i);
        }
    }

    function rb(a, b, c) {
        var d = a.g.i,
            e = a.g.j(),
            g = a.g.g + e,
            f = g - d;
        0 >= f && (a.g.i = g, c(b, a, void 0, void 0, void 0), f = g - a.g.g);
        if (f) throw Error("Message parsing ended unexpectedly. Expected to read " + (e + " bytes, instead read " + (e - f) + " bytes, either the data ended unexpectedly or the message misreported its own length"));
        a.g.g = g;
        a.g.i = d
    }

    function sb(a, b, c) {
        var d = a.g.j();
        for (d = a.g.g + d; a.g.g < d;) c.push(b.call(a.g))
    }
    var tb = [];

    function ub() {
        this.i = [];
        this.h = 0;
        this.g = new jb
    }

    function vb(a, b) {
        0 !== b.length && (a.i.push(b), a.h += b.length)
    }

    function wb(a, b) {
        O(a, b, 2);
        b = a.g.end();
        vb(a, b);
        b.push(a.h);
        return b
    }

    function xb(a, b) {
        var c = b.pop();
        for (c = a.h + a.g.length() - c; 127 < c;) b.push(c & 127 | 128), c >>>= 7, a.h++;
        b.push(c);
        a.h++
    }

    function yb(a, b) {
        if (b = b.P) {
            vb(a, a.g.end());
            for (var c = 0; c < b.length; c++) vb(a, cb(b[c]) || Ga())
        }
    }

    function O(a, b, c) {
        lb(a.g, 8 * b + c)
    };
    var zb = {};

    function Ab(a) {
        if (a !== zb) throw Error("requires a valid immutable API token");
    };
    var P = "function" === typeof Symbol && "symbol" === typeof Symbol() ? Symbol(void 0) : void 0;

    function Bb(a, b) {
        Object.isFrozen(a) || (P ? a[P] |= b : void 0 !== a.D ? a.D |= b : Object.defineProperties(a, {
            D: {
                value: b,
                configurable: !0,
                writable: !0,
                enumerable: !1
            }
        }))
    }

    function Cb(a) {
        var b;
        P ? b = a[P] : b = a.D;
        return null == b ? 0 : b
    }

    function Q(a) {
        Bb(a, 1);
        return a
    }

    function Db(a) {
        return Array.isArray(a) ? !!(Cb(a) & 2) : !1
    }

    function Eb(a) {
        if (!Array.isArray(a)) throw Error("cannot mark non-array as immutable");
        Bb(a, 2)
    }

    function Fb(a, b) {
        if (!Array.isArray(a)) throw Error("cannot mark non-array as mutable");
        b ? Bb(a, 8) : Object.isFrozen(a) || (P ? a[P] &= -9 : void 0 !== a.D && (a.D &= -9))
    };

    function R(a) {
        return Db(a.o)
    }

    function Gb(a) {
        return null !== a && "object" === typeof a && !Array.isArray(a) && a.constructor === Object
    }
    var Hb = Object.freeze(Q([]));

    function Ib(a) {
        if (R(a)) throw Error("Cannot mutate an immutable Message");
    }
    var Jb = "undefined" != typeof Symbol && "undefined" != typeof Symbol.hasInstance;

    function Kb(a) {
        return {
            value: a,
            configurable: !1,
            writable: !1,
            enumerable: !1
        }
    };

    function Lb(a, b, c) {
        c = void 0 === c ? !1 : c;
        if (Array.isArray(a)) return new b(a);
        if (c) return new b
    };

    function Mb(a) {
        switch (typeof a) {
            case "number":
                return isFinite(a) ? a : String(a);
            case "object":
                if (a && !Array.isArray(a)) {
                    if (Ea(a)) return za(a);
                    if (a instanceof ab) {
                        var b = a.V;
                        b = null == b || "string" === typeof b ? b : Da && b instanceof Uint8Array ? za(b) : null;
                        return null == b ? "" : a.V = b
                    }
                }
        }
        return a
    };

    function Nb(a) {
        var b = Ob;
        b = void 0 === b ? Pb : b;
        return Qb(a, b)
    }

    function Rb(a, b) {
        if (null != a) {
            if (Array.isArray(a)) a = Qb(a, b);
            else if (Gb(a)) {
                var c = {},
                    d;
                for (d in a) c[d] = Rb(a[d], b);
                a = c
            } else a = b(a);
            return a
        }
    }

    function Qb(a, b) {
        for (var c = a.slice(), d = 0; d < c.length; d++) c[d] = Rb(c[d], b);
        Array.isArray(a) && Cb(a) & 1 && Q(c);
        return c
    }

    function Ob(a) {
        if (a && "object" == typeof a && a.toJSON) return a.toJSON();
        a = Mb(a);
        return Array.isArray(a) ? Nb(a) : a
    }

    function Pb(a) {
        return Ea(a) ? new Uint8Array(a) : a
    };

    function Sb(a) {
        return a.g || (a.g = a.o[a.h + a.C] = {})
    }

    function S(a, b, c) {
        return -1 === b ? null : b >= a.h ? a.g ? a.g[b] : void 0 : (void 0 === c ? 0 : c) && a.g && (c = a.g[b], null != c) ? c : a.o[b + a.C]
    }

    function T(a, b, c, d, e) {
        d = void 0 === d ? !1 : d;
        (void 0 === e ? 0 : e) || Ib(a);
        b < a.h && !d ? (a.o[b + a.C] = c, void 0 !== a.g && b in a.g && delete a.g[b]) : Sb(a)[b] = c
    }

    function U(a, b, c, d) {
        c = void 0 === c ? !0 : c;
        var e = S(a, b, d);
        Array.isArray(e) || (e = Hb);
        if (R(a)) c && (Eb(e), Object.freeze(e));
        else if (e === Hb || Db(e)) e = Q(e.slice()), T(a, b, e, d);
        return e
    }

    function Tb(a) {
        var b = Number,
            c = U(a, 3, !1);
        if (c.length && !(Cb(c) & 4)) {
            Object.isFrozen(c) && (c = Q(c.slice()), T(a, 3, c, void 0, !0));
            for (var d = 0; d < c.length; d++) c[d] = b(c[d]);
            Bb(c, 5)
        }
        R(a) && Object.freeze(c);
        return c
    }

    function Ub(a, b, c) {
        a = S(a, b);
        return null == a ? c : a
    }

    function V(a, b, c) {
        a = S(a, b);
        a = null == a ? a : +a;
        return null == a ? void 0 === c ? 0 : c : a
    }

    function Vb(a, b, c) {
        var d = void 0 === d ? !1 : d;
        if (-1 === c) var e = null;
        else a.m || (a.m = {}), e = a.m[c], e || (b = Lb(S(a, c, d), b), void 0 != b && (a.m[c] = b, R(a) && Eb(b.o), e = b));
        if (null == e) return e;
        R(e) && !R(a) && (e = e.R(zb), T(a, c, e.o, d), a.m[c] = e);
        return e
    }

    function Wb(a, b, c, d, e) {
        e = void 0 === e ? !0 : e;
        a.m || (a.m = {});
        var g = R(a),
            f = a.m[c];
        d = U(a, c, !0, d);
        var h = g || Db(d);
        if (!f) {
            f = [];
            g = g || h;
            for (var k = 0; k < d.length; k++) {
                var l = d[k];
                g = g || Db(l);
                l = Lb(l, b);
                void 0 !== l && (f.push(l), h && Eb(l.o))
            }
            a.m[c] = f;
            Fb(d, !g)
        }
        b = h || e;
        e = Db(f);
        b && !e && (Object.isFrozen(f) && (a.m[c] = f = f.slice()), Eb(f), Object.freeze(f));
        !b && e && (a.m[c] = f = f.slice());
        return f
    }

    function Xb(a, b, c) {
        var d = void 0 === d ? !1 : d;
        var e = R(a);
        b = Wb(a, b, c, d, e);
        a = U(a, c, d);
        if (!(c = e) && (c = a)) {
            if (!Array.isArray(a)) throw Error("cannot check mutability state of non-array");
            c = !(Cb(a) & 8)
        }
        if (c) {
            for (c = 0; c < b.length; c++)(d = b[c]) && R(d) && !e && (b[c] = b[c].R(zb), a[c] = b[c].o);
            Fb(a, !0)
        }
        return b
    }

    function Yb(a, b, c, d, e) {
        Ib(a);
        var g = Wb(a, c, b, void 0, !1);
        c = null != d ? d : new c;
        a = U(a, b);
        void 0 != e ? (g.splice(e, 0, c), a.splice(e, 0, c.o)) : (g.push(c), a.push(c.o));
        c.A(zb) && Fb(a, !1);
        return c
    };

    function Zb(a, b, c) {
        a || (a = $b);
        $b = null;
        var d = this.constructor.h;
        a || (a = d ? [d] : []);
        this.C = (d ? 0 : -1) - (this.constructor.g || 0);
        this.m = void 0;
        this.o = a;
        a: {
            d = this.o.length;a = d - 1;
            if (d && (d = this.o[a], Gb(d))) {
                this.h = a - this.C;
                this.g = d;
                break a
            }
            void 0 !== b && -1 < b ? (this.h = Math.max(b, a + 1 - this.C), this.g = void 0) : this.h = Number.MAX_VALUE
        }
        if (c)
            for (b = 0; b < c.length; b++)
                if (a = c[b], a < this.h) a += this.C, (d = this.o[a]) ? Array.isArray(d) && Q(d) : this.o[a] = Hb;
                else {
                    d = Sb(this);
                    var e = d[a];
                    e ? Array.isArray(e) && Q(e) : d[a] = Hb
                }
    }
    Zb.prototype.toJSON = function() {
        return Nb(this.o)
    };
    Zb.prototype.A = function(a) {
        Ab(a);
        return R(this)
    };
    Zb.prototype.toString = function() {
        return this.o.toString()
    };
    var $b;

    function ac() {
        Zb.apply(this, arguments)
    }
    E(ac, Zb);
    ac.prototype.R = function() {
        return this
    };
    if (Jb) {
        var bc = {};
        Object.defineProperties(ac, (bc[Symbol.hasInstance] = Kb(function() {
            throw Error("Cannot perform instanceof checks for MutableMessage");
        }), bc))
    };

    function cc(a, b, c) {
        if (c) {
            var d = {},
                e;
            for (e in c) {
                var g = c[e],
                    f = g.qa;
                f || (d.I = g.wa || g.oa.W, g.ja ? (d.aa = dc(g.ja), f = function(h) {
                    return function(k, l, m) {
                        return h.I(k, l, m, h.aa)
                    }
                }(d)) : g.ka ? (d.Z = ec(g.ea.O, g.ka), f = function(h) {
                    return function(k, l, m) {
                        return h.I(k, l, m, h.Z)
                    }
                }(d)) : f = d.I, g.qa = f);
                f(b, a, g.ea);
                d = {
                    I: d.I,
                    aa: d.aa,
                    Z: d.Z
                }
            }
        }
        yb(b, a)
    }
    var fc = Symbol();

    function gc(a, b, c) {
        return a[fc] || (a[fc] = function(d, e) {
            return b(d, e, c)
        })
    }

    function hc(a) {
        var b = a[fc];
        if (!b) {
            var c = ic(a);
            b = function(d, e) {
                return jc(d, e, c)
            };
            a[fc] = b
        }
        return b
    }

    function kc(a) {
        var b = a.ja;
        if (b) return hc(b);
        if (b = a.va) return gc(a.ea.O, b, a.ka)
    }

    function lc(a) {
        var b = kc(a),
            c = a.ea,
            d = a.oa.U;
        return b ? function(e, g) {
            return d(e, g, c, b)
        } : function(e, g) {
            return d(e, g, c)
        }
    }

    function mc(a, b) {
        var c = a[b];
        "function" == typeof c && 0 === c.length && (c = c(), a[b] = c);
        return Array.isArray(c) && (nc in c || oc in c || 0 < c.length && "function" == typeof c[0]) ? c : void 0
    }

    function pc(a, b, c, d, e, g) {
        b.O = a[0];
        var f = 1;
        if (a.length > f && "number" !== typeof a[f]) {
            var h = a[f++];
            c(b, h)
        }
        for (; f < a.length;) {
            c = a[f++];
            for (var k = f + 1; k < a.length && "number" !== typeof a[k];) k++;
            h = a[f++];
            k -= f;
            switch (k) {
                case 0:
                    d(b, c, h);
                    break;
                case 1:
                    (k = mc(a, f)) ? (f++, e(b, c, h, k)) : d(b, c, h, a[f++]);
                    break;
                case 2:
                    k = f++;
                    k = mc(a, k);
                    e(b, c, h, k, a[f++]);
                    break;
                case 3:
                    g(b, c, h, a[f++], a[f++], a[f++]);
                    break;
                case 4:
                    g(b, c, h, a[f++], a[f++], a[f++], a[f++]);
                    break;
                default:
                    throw Error("unexpected number of binary field arguments: " + k);
            }
        }
        return b
    }
    var qc = Symbol();

    function dc(a) {
        var b = a[qc];
        if (!b) {
            var c = rc(a);
            b = function(d, e) {
                return sc(d, e, c)
            };
            a[qc] = b
        }
        return b
    }

    function ec(a, b) {
        var c = a[qc];
        c || (c = function(d, e) {
            return cc(d, e, b)
        }, a[qc] = c);
        return c
    }
    var oc = Symbol();

    function tc(a, b) {
        a.push(b)
    }

    function uc(a, b, c) {
        a.push(b, c.W)
    }

    function vc(a, b, c, d) {
        var e = dc(d),
            g = rc(d).O,
            f = c.W;
        a.push(b, function(h, k, l) {
            return f(h, k, l, g, e)
        })
    }

    function wc(a, b, c, d, e, g) {
        var f = ec(d, g),
            h = c.W;
        a.push(b, function(k, l, m) {
            return h(k, l, m, d, f)
        })
    }

    function rc(a) {
        var b = a[oc];
        if (b) return b;
        b = pc(a, a[oc] = [], tc, uc, vc, wc);
        nc in a && oc in a && (a.length = 0);
        return b
    }
    var nc = Symbol();

    function xc(a, b) {
        a[0] = b
    }

    function yc(a, b, c, d) {
        var e = c.U;
        a[b] = d ? function(g, f, h) {
            return e(g, f, h, d)
        } : e
    }

    function zc(a, b, c, d, e) {
        var g = c.U,
            f = hc(d),
            h = ic(d).O;
        a[b] = function(k, l, m) {
            return g(k, l, m, h, f, e)
        }
    }

    function Ac(a, b, c, d, e, g, f) {
        var h = c.U,
            k = gc(d, e, g);
        a[b] = function(l, m, r) {
            return h(l, m, r, d, k, f)
        }
    }

    function ic(a) {
        var b = a[nc];
        if (b) return b;
        b = pc(a, a[nc] = {}, xc, yc, zc, Ac);
        nc in a && oc in a && (a.length = 0);
        return b
    }

    function jc(a, b, c) {
        for (; pb(b) && 4 != b.h;) {
            var d = b.j,
                e = c[d];
            if (!e) {
                var g = c[0];
                g && (g = g[d]) && (e = c[d] = lc(g))
            }
            if (!e || !e(b, a, d)) {
                e = b;
                d = a;
                g = e.i;
                qb(e);
                var f = e;
                if (!f.da) {
                    e = f.g.g - g;
                    f.g.g = g;
                    f = f.g;
                    if (0 == e) e = bb();
                    else {
                        g = hb(f, e);
                        if (f.S && f.u) e = f.h.subarray(g, g + e);
                        else {
                            f = f.h;
                            var h = g;
                            e = g + e;
                            e = h === e ? Ga() : Ia ? f.slice(h, e) : new Uint8Array(f.subarray(h, e))
                        }
                        e = 0 == e.length ? bb() : new ab(e, Ha)
                    }(g = d.P) ? g.push(e): d.P = [e]
                }
            }
        }
        return a
    }

    function Bc(a, b) {
        if (tb.length) {
            var c = tb.pop();
            c.setOptions(void 0);
            fb(c.g, a);
            a = c
        } else a = new ob(a);
        try {
            var d = ic(b);
            return jc(new d.O, a, d)
        } finally {
            b = a.g, b.h = null, b.u = !1, b.l = 0, b.i = 0, b.g = 0, b.S = !1, a.j = -1, a.h = -1, 100 > tb.length && tb.push(a)
        }
    }

    function sc(a, b, c) {
        for (var d = c.length, e = 1 == d % 2, g = e ? 1 : 0; g < d; g += 2)(0, c[g + 1])(b, a, c[g]);
        cc(a, b, e ? c[0] : void 0)
    }

    function Cc(a, b) {
        var c = new ub;
        sc(a, c, rc(b));
        vb(c, c.g.end());
        a = new Uint8Array(c.h);
        b = c.i;
        for (var d = b.length, e = 0, g = 0; g < d; g++) {
            var f = b[g];
            a.set(f, e);
            e += f.length
        }
        c.i = [a];
        return a
    }

    function W(a, b) {
        return {
            U: a,
            W: b
        }
    }

    function Dc(a, b, c) {
        if (5 !== a.h && 2 !== a.h) return !1;
        b = U(b, c);
        2 == a.h ? sb(a, eb.prototype.s, b) : b.push(a.g.s());
        return !0
    }
    var Y = W(function(a, b, c) {
            if (5 !== a.h) return !1;
            T(b, c, a.g.s());
            return !0
        }, function(a, b, c) {
            b = S(b, c);
            null != b && (O(a, c, 5), a = a.g, La(b), nb(a))
        }),
        Ec = W(Dc, function(a, b, c) {
            b = U(b, c);
            if (null != b)
                for (var d = 0; d < b.length; d++) {
                    var e = a,
                        g = b[d];
                    null != g && (O(e, c, 5), e = e.g, La(g), nb(e))
                }
        }),
        Fc = W(Dc, function(a, b, c) {
            b = U(b, c);
            if (null != b && b.length)
                for (O(a, c, 2), lb(a.g, 4 * b.length), c = 0; c < b.length; c++) {
                    var d = a.g;
                    La(b[c]);
                    nb(d)
                }
        }),
        Gc = W(function(a, b, c) {
            if (0 !== a.h) return !1;
            var d = a.g,
                e = 0,
                g = a = 0,
                f = d.h,
                h = d.g;
            do {
                var k = f[h++];
                e |= (k & 127) << g;
                g +=
                    7
            } while (32 > g && k & 128);
            32 < g && (a |= (k & 127) >> 4);
            for (g = 3; 32 > g && k & 128; g += 7) k = f[h++], a |= (k & 127) << g;
            N(d, h);
            if (128 > k) {
                d = e >>> 0;
                k = a >>> 0;
                if (a = k & 2147483648) d = ~d + 1 >>> 0, k = ~k >>> 0, 0 == d && (k = k + 1 >>> 0);
                d = 4294967296 * k + (d >>> 0)
            } else throw Ra();
            T(b, c, a ? -d : d);
            return !0
        }, function(a, b, c) {
            b = S(b, c);
            null != b && ("string" === typeof b && Oa(b), null != b && (O(a, c, 0), "number" === typeof b ? (a = a.g, Ja(b), kb(a, I, K)) : (c = Oa(b), kb(a.g, c.h, c.g))))
        }),
        Hc = W(function(a, b, c) {
            if (0 !== a.h) return !1;
            T(b, c, gb(a.g));
            return !0
        }, function(a, b, c) {
            b = S(b, c);
            null != b && null !=
                b && (O(a, c, 0), mb(a.g, b))
        }),
        Ic = W(function(a, b, c) {
            if (2 !== a.h) return !1;
            var d = a.g.j();
            a = a.g;
            var e = hb(a, d);
            a = a.h;
            if (Wa) {
                var g = a,
                    f;
                (f = Va) || (f = Va = new TextDecoder("utf-8", {
                    fatal: !0
                }));
                a = e + d;
                g = 0 === e && a === g.length ? g : g.subarray(e, a);
                try {
                    var h = f.decode(g)
                } catch (r) {
                    if (void 0 === Ua) {
                        try {
                            f.decode(new Uint8Array([128]))
                        } catch (p) {}
                        try {
                            f.decode(new Uint8Array([97])), Ua = !0
                        } catch (p) {
                            Ua = !1
                        }
                    }!Ua && (Va = void 0);
                    throw r;
                }
            } else {
                h = e;
                d = h + d;
                e = [];
                for (var k = null, l, m; h < d;) l = a[h++], 128 > l ? e.push(l) : 224 > l ? h >= d ? M() : (m = a[h++], 194 > l || 128 !==
                    (m & 192) ? (h--, M()) : e.push((l & 31) << 6 | m & 63)) : 240 > l ? h >= d - 1 ? M() : (m = a[h++], 128 !== (m & 192) || 224 === l && 160 > m || 237 === l && 160 <= m || 128 !== ((g = a[h++]) & 192) ? (h--, M()) : e.push((l & 15) << 12 | (m & 63) << 6 | g & 63)) : 244 >= l ? h >= d - 2 ? M() : (m = a[h++], 128 !== (m & 192) || 0 !== (l << 28) + (m - 144) >> 30 || 128 !== ((g = a[h++]) & 192) || 128 !== ((f = a[h++]) & 192) ? (h--, M()) : (l = (l & 7) << 18 | (m & 63) << 12 | (g & 63) << 6 | f & 63, l -= 65536, e.push((l >> 10 & 1023) + 55296, (l & 1023) + 56320))) : M(), 8192 <= e.length && (k = Ta(k, e), e.length = 0);
                h = Ta(k, e)
            }
            T(b, c, h);
            return !0
        }, function(a, b, c) {
            b = S(b, c);
            if (null !=
                b) {
                var d = !1;
                d = void 0 === d ? !1 : d;
                if (Ya) {
                    if (d && /(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(b)) throw Error("Found an unpaired surrogate");
                    b = (Xa || (Xa = new TextEncoder)).encode(b)
                } else {
                    for (var e = 0, g = new Uint8Array(3 * b.length), f = 0; f < b.length; f++) {
                        var h = b.charCodeAt(f);
                        if (128 > h) g[e++] = h;
                        else {
                            if (2048 > h) g[e++] = h >> 6 | 192;
                            else {
                                if (55296 <= h && 57343 >= h) {
                                    if (56319 >= h && f < b.length) {
                                        var k = b.charCodeAt(++f);
                                        if (56320 <= k && 57343 >= k) {
                                            h = 1024 * (h - 55296) + k - 56320 + 65536;
                                            g[e++] = h >> 18 | 240;
                                            g[e++] = h >>
                                                12 & 63 | 128;
                                            g[e++] = h >> 6 & 63 | 128;
                                            g[e++] = h & 63 | 128;
                                            continue
                                        } else f--
                                    }
                                    if (d) throw Error("Found an unpaired surrogate");
                                    h = 65533
                                }
                                g[e++] = h >> 12 | 224;
                                g[e++] = h >> 6 & 63 | 128
                            }
                            g[e++] = h & 63 | 128
                        }
                    }
                    b = e === g.length ? g : g.subarray(0, e)
                }
                O(a, c, 2);
                lb(a.g, b.length);
                vb(a, a.g.end());
                vb(a, b)
            }
        }),
        Jc = W(function(a, b, c, d, e) {
            if (2 !== a.h) return !1;
            Ib(b);
            b.m || (b.m = {});
            var g = b.m[c];
            g ? (d = g.R(zb), d !== g && (T(b, c, d.o), b.m[c] = d), b = d) : (g = S(b, c), d = Lb(g, d, !0).R(zb), g !== d.o && T(b, c, d.o), b = b.m[c] = d);
            rb(a, b, e);
            return !0
        }, function(a, b, c, d, e) {
            b = Vb(b, d, c);
            null !=
                b && (c = wb(a, c), e(b, a), xb(a, c))
        }),
        Kc = W(function(a, b, c, d, e) {
            if (2 !== a.h) return !1;
            rb(a, Yb(b, c, d), e);
            return !0
        }, function(a, b, c, d, e) {
            b = Xb(b, d, c);
            if (null != b)
                for (d = 0; d < b.length; d++) {
                    var g = wb(a, c);
                    e(b[d], a);
                    xb(a, g)
                }
        }),
        Lc = W(function(a, b, c) {
            if (0 !== a.h && 2 !== a.h) return !1;
            b = U(b, c);
            2 == a.h ? sb(a, eb.prototype.j, b) : b.push(a.g.j());
            return !0
        }, function(a, b, c) {
            b = U(b, c);
            if (null != b)
                for (var d = 0; d < b.length; d++) {
                    var e = a,
                        g = b[d];
                    null != g && (O(e, c, 0), lb(e.g, g))
                }
        }),
        Mc = W(function(a, b, c) {
            if (0 !== a.h) return !1;
            T(b, c, gb(a.g));
            return !0
        }, function(a,
            b, c) {
            b = S(b, c);
            null != b && (b = parseInt(b, 10), O(a, c, 0), mb(a.g, b))
        });

    function Nc(a, b, c, d, e, g) {
        if (a = a.m && a.m[c])
            if (Array.isArray(a)) {
                e = g.ca ? Q(a.slice()) : a;
                Ib(b);
                if (null != e) {
                    g = Q([]);
                    d = !1;
                    for (a = 0; a < e.length; a++) g[a] = e[a].o, d = d || Db(g[a]);
                    b.m || (b.m = {});
                    b.m[c] = e;
                    Fb(g, !d)
                } else b.m && (b.m[c] = void 0), g = Hb;
                T(b, c, g)
            } else Ib(b), b.m || (b.m = {}), e = null != a ? a.o : a, b.m[c] = a, T(b, c, e);
        else Da && d instanceof Uint8Array ? e = d.length ? new ab(new Uint8Array(d), Ha) : bb() : (Array.isArray(d) && (e ? Eb(d) : Array.isArray(d) && Cb(d) & 1 && g.ca && (d = d.slice())), e = d), T(b, c, e)
    };

    function Z() {
        ac.apply(this, arguments)
    }
    E(Z, ac);
    Z.prototype.R = function(a) {
        Ab(a);
        if (R(this)) {
            a = {
                ca: !0
            };
            var b = R(this);
            if (b && !a.ca) throw Error("copyRepeatedFields must be true for frozen messages");
            var c = new this.constructor;
            this.P && (c.P = this.P.slice());
            for (var d = this.o, e = 0; e < d.length; e++) {
                var g = d[e];
                if (e === d.length - 1 && Gb(g))
                    for (h in g) {
                        var f = +h;
                        Number.isNaN(f) ? Sb(c)[h] = g[h] : Nc(this, c, f, g[h], b, a)
                    } else Nc(this, c, e - this.C, g, b, a)
            }
            var h = c
        } else h = this;
        return h
    };
    if (Jb) {
        var Oc = {};
        Object.defineProperties(Z, (Oc[Symbol.hasInstance] = Kb(Object[Symbol.hasInstance]), Oc))
    };

    function Pc(a) {
        Z.call(this, a, -1, Qc)
    }
    E(Pc, Z);
    Pc.prototype.getRows = function() {
        return S(this, 1)
    };
    Pc.prototype.getCols = function() {
        return S(this, 2)
    };
    Pc.prototype.getPackedDataList = function() {
        return Tb(this)
    };
    Pc.prototype.getLayout = function() {
        return Ub(this, 4, 0)
    };
    var Qc = [3],
        Rc = [Pc, 1, Hc, 2, Hc, 3, Fc, 4, Mc];

    function Sc(a) {
        Z.call(this, a)
    }
    E(Sc, Z);
    var Tc = [Sc, 1, Hc, 2, Y, 3, Ic, 4, Ic];

    function Uc(a) {
        Z.call(this, a, -1, Vc)
    }
    E(Uc, Z);
    Uc.prototype.addClassification = function(a, b) {
        Yb(this, 1, Sc, a, b);
        return this
    };
    var Vc = [1],
        Wc = [Uc, 1, Kc, Tc];

    function Xc(a) {
        Z.call(this, a)
    }
    E(Xc, Z);
    var Yc = [Xc, 1, Y, 2, Y, 3, Y, 4, Y, 5, Y];

    function Zc(a) {
        Z.call(this, a, -1, $c)
    }
    E(Zc, Z);
    var $c = [1],
        ad = [Zc, 1, Kc, Yc];

    function bd(a) {
        Z.call(this, a)
    }
    E(bd, Z);
    var cd = [bd, 1, Y, 2, Y, 3, Y, 4, Y, 5, Y, 6, Gc];

    function dd(a) {
        Z.call(this, a, -1, ed)
    }
    E(dd, Z);
    dd.prototype.getVertexType = function() {
        return Ub(this, 1, 0)
    };
    dd.prototype.getPrimitiveType = function() {
        return Ub(this, 2, 0)
    };
    dd.prototype.getVertexBufferList = function() {
        return Tb(this)
    };
    dd.prototype.getIndexBufferList = function() {
        return U(this, 4)
    };
    var ed = [3, 4],
        fd = [dd, 1, Mc, 2, Mc, 3, Ec, 4, Lc];

    function gd(a) {
        Z.call(this, a)
    }
    E(gd, Z);
    gd.prototype.getMesh = function() {
        return Vb(this, dd, 1)
    };
    gd.prototype.getPoseTransformMatrix = function() {
        return Vb(this, Pc, 2)
    };
    var hd = [gd, 1, Jc, fd, 2, Jc, Rc];
    var id = [
            [61, 146],
            [146, 91],
            [91, 181],
            [181, 84],
            [84, 17],
            [17, 314],
            [314, 405],
            [405, 321],
            [321, 375],
            [375, 291],
            [61, 185],
            [185, 40],
            [40, 39],
            [39, 37],
            [37, 0],
            [0, 267],
            [267, 269],
            [269, 270],
            [270, 409],
            [409, 291],
            [78, 95],
            [95, 88],
            [88, 178],
            [178, 87],
            [87, 14],
            [14, 317],
            [317, 402],
            [402, 318],
            [318, 324],
            [324, 308],
            [78, 191],
            [191, 80],
            [80, 81],
            [81, 82],
            [82, 13],
            [13, 312],
            [312, 311],
            [311, 310],
            [310, 415],
            [415, 308]
        ],
        jd = [
            [263, 249],
            [249, 390],
            [390, 373],
            [373, 374],
            [374, 380],
            [380, 381],
            [381, 382],
            [382, 362],
            [263, 466],
            [466, 388],
            [388, 387],
            [387, 386],
            [386,
                385
            ],
            [385, 384],
            [384, 398],
            [398, 362]
        ],
        kd = [
            [276, 283],
            [283, 282],
            [282, 295],
            [295, 285],
            [300, 293],
            [293, 334],
            [334, 296],
            [296, 336]
        ],
        ld = [
            [33, 7],
            [7, 163],
            [163, 144],
            [144, 145],
            [145, 153],
            [153, 154],
            [154, 155],
            [155, 133],
            [33, 246],
            [246, 161],
            [161, 160],
            [160, 159],
            [159, 158],
            [158, 157],
            [157, 173],
            [173, 133]
        ],
        md = [
            [46, 53],
            [53, 52],
            [52, 65],
            [65, 55],
            [70, 63],
            [63, 105],
            [105, 66],
            [66, 107]
        ],
        nd = [
            [10, 338],
            [338, 297],
            [297, 332],
            [332, 284],
            [284, 251],
            [251, 389],
            [389, 356],
            [356, 454],
            [454, 323],
            [323, 361],
            [361, 288],
            [288, 397],
            [397, 365],
            [365, 379],
            [379, 378],
            [378, 400],
            [400, 377],
            [377, 152],
            [152, 148],
            [148, 176],
            [176, 149],
            [149, 150],
            [150, 136],
            [136, 172],
            [172, 58],
            [58, 132],
            [132, 93],
            [93, 234],
            [234, 127],
            [127, 162],
            [162, 21],
            [21, 54],
            [54, 103],
            [103, 67],
            [67, 109],
            [109, 10]
        ],
        od = [].concat(B(id), B(jd), B(kd), B(ld), B(md), B(nd));

    function pd(a, b, c) {
        c = a.createShader(0 === c ? a.VERTEX_SHADER : a.FRAGMENT_SHADER);
        a.shaderSource(c, b);
        a.compileShader(c);
        if (!a.getShaderParameter(c, a.COMPILE_STATUS)) throw Error("Could not compile WebGL shader.\n\n" + a.getShaderInfoLog(c));
        return c
    };

    function qd(a) {
        return Xb(a, Sc, 1).map(function(b) {
            return {
                index: Ub(b, 1, 0),
                score: V(b, 2),
                label: null != S(b, 3) ? Ub(b, 3, "") : void 0,
                displayName: null != S(b, 4) ? Ub(b, 4, "") : void 0
            }
        })
    };

    function rd(a) {
        return {
            x: V(a, 1),
            y: V(a, 2),
            z: V(a, 3),
            visibility: null != S(a, 4) ? V(a, 4) : void 0
        }
    }

    function sd(a) {
        a = Bc(a, ad);
        return Xb(a, Xc, 1).map(rd)
    };

    function td(a, b) {
        this.h = a;
        this.g = b;
        this.l = 0
    }

    function ud(a, b, c) {
        vd(a, b);
        if ("function" === typeof a.g.canvas.transferToImageBitmap) return Promise.resolve(a.g.canvas.transferToImageBitmap());
        if (c) return Promise.resolve(a.g.canvas);
        if ("function" === typeof createImageBitmap) return createImageBitmap(a.g.canvas);
        void 0 === a.i && (a.i = document.createElement("canvas"));
        return new Promise(function(d) {
            a.i.height = a.g.canvas.height;
            a.i.width = a.g.canvas.width;
            a.i.getContext("2d", {}).drawImage(a.g.canvas, 0, 0, a.g.canvas.width, a.g.canvas.height);
            d(a.i)
        })
    }

    function vd(a, b) {
        var c = a.g;
        if (void 0 === a.s) {
            var d = pd(c, "\n  attribute vec2 aVertex;\n  attribute vec2 aTex;\n  varying vec2 vTex;\n  void main(void) {\n    gl_Position = vec4(aVertex, 0.0, 1.0);\n    vTex = aTex;\n  }", 0),
                e = pd(c, "\n  precision mediump float;\n  varying vec2 vTex;\n  uniform sampler2D sampler0;\n  void main(){\n    gl_FragColor = texture2D(sampler0, vTex);\n  }", 1),
                g = c.createProgram();
            c.attachShader(g, d);
            c.attachShader(g, e);
            c.linkProgram(g);
            if (!c.getProgramParameter(g, c.LINK_STATUS)) throw Error("Could not compile WebGL program.\n\n" +
                c.getProgramInfoLog(g));
            d = a.s = g;
            c.useProgram(d);
            e = c.getUniformLocation(d, "sampler0");
            a.j = {
                N: c.getAttribLocation(d, "aVertex"),
                M: c.getAttribLocation(d, "aTex"),
                xa: e
            };
            a.v = c.createBuffer();
            c.bindBuffer(c.ARRAY_BUFFER, a.v);
            c.enableVertexAttribArray(a.j.N);
            c.vertexAttribPointer(a.j.N, 2, c.FLOAT, !1, 0, 0);
            c.bufferData(c.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), c.STATIC_DRAW);
            c.bindBuffer(c.ARRAY_BUFFER, null);
            a.u = c.createBuffer();
            c.bindBuffer(c.ARRAY_BUFFER, a.u);
            c.enableVertexAttribArray(a.j.M);
            c.vertexAttribPointer(a.j.M,
                2, c.FLOAT, !1, 0, 0);
            c.bufferData(c.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), c.STATIC_DRAW);
            c.bindBuffer(c.ARRAY_BUFFER, null);
            c.uniform1i(e, 0)
        }
        d = a.j;
        c.useProgram(a.s);
        c.canvas.width = b.width;
        c.canvas.height = b.height;
        c.viewport(0, 0, b.width, b.height);
        c.activeTexture(c.TEXTURE0);
        a.h.bindTexture2d(b.glName);
        c.enableVertexAttribArray(d.N);
        c.bindBuffer(c.ARRAY_BUFFER, a.v);
        c.vertexAttribPointer(d.N, 2, c.FLOAT, !1, 0, 0);
        c.enableVertexAttribArray(d.M);
        c.bindBuffer(c.ARRAY_BUFFER, a.u);
        c.vertexAttribPointer(d.M,
            2, c.FLOAT, !1, 0, 0);
        c.bindFramebuffer(c.DRAW_FRAMEBUFFER ? c.DRAW_FRAMEBUFFER : c.FRAMEBUFFER, null);
        c.clearColor(0, 0, 0, 0);
        c.clear(c.COLOR_BUFFER_BIT);
        c.colorMask(!0, !0, !0, !0);
        c.drawArrays(c.TRIANGLE_FAN, 0, 4);
        c.disableVertexAttribArray(d.N);
        c.disableVertexAttribArray(d.M);
        c.bindBuffer(c.ARRAY_BUFFER, null);
        a.h.bindTexture2d(0)
    }

    function wd(a) {
        this.g = a
    };
    var xd = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11]);

    function yd(a, b) {
        return b + a
    }

    function zd(a, b) {
        window[a] = b
    }

    function Ad(a) {
        var b = document.createElement("script");
        b.setAttribute("src", a);
        b.setAttribute("crossorigin", "anonymous");
        return new Promise(function(c) {
            b.addEventListener("load", function() {
                c()
            }, !1);
            b.addEventListener("error", function() {
                c()
            }, !1);
            document.body.appendChild(b)
        })
    }

    function Bd() {
        return G(function(a) {
            switch (a.g) {
                case 1:
                    return a.s = 2, F(a, WebAssembly.instantiate(xd), 4);
                case 4:
                    a.g = 3;
                    a.s = 0;
                    break;
                case 2:
                    return a.s = 0, a.j = null, a.return(!1);
                case 3:
                    return a.return(!0)
            }
        })
    }

    function Cd(a) {
        this.g = a;
        this.listeners = {};
        this.j = {};
        this.K = {};
        this.s = {};
        this.v = {};
        this.L = this.u = this.ha = !0;
        this.H = Promise.resolve();
        this.ga = "";
        this.G = {};
        this.locateFile = a && a.locateFile || yd;
        if ("object" === typeof window) var b = window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/";
        else if ("undefined" !== typeof location) b = location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/";
        else throw Error("solutions can only be loaded on a web page or in a web worker");
        this.ia = b;
        if (a.options) {
            b = A(Object.keys(a.options));
            for (var c = b.next(); !c.done; c = b.next()) {
                c = c.value;
                var d = a.options[c].default;
                void 0 !== d && (this.j[c] = "function" === typeof d ? d() : d)
            }
        }
    }
    v = Cd.prototype;
    v.close = function() {
        this.i && this.i.delete();
        return Promise.resolve()
    };

    function Dd(a) {
        var b, c, d, e, g, f, h, k, l, m, r;
        return G(function(p) {
            switch (p.g) {
                case 1:
                    if (!a.ha) return p.return();
                    b = void 0 === a.g.files ? [] : "function" === typeof a.g.files ? a.g.files(a.j) : a.g.files;
                    return F(p, Bd(), 2);
                case 2:
                    c = p.h;
                    if ("object" === typeof window) return zd("createMediapipeSolutionsWasm", {
                        locateFile: a.locateFile
                    }), zd("createMediapipeSolutionsPackedAssets", {
                        locateFile: a.locateFile
                    }), f = b.filter(function(n) {
                        return void 0 !== n.data
                    }), h = b.filter(function(n) {
                        return void 0 === n.data
                    }), k = Promise.all(f.map(function(n) {
                        var q =
                            Ed(a, n.url);
                        if (void 0 !== n.path) {
                            var t = n.path;
                            q = q.then(function(x) {
                                a.overrideFile(t, x);
                                return Promise.resolve(x)
                            })
                        }
                        return q
                    })), l = Promise.all(h.map(function(n) {
                        return void 0 === n.simd || n.simd && c || !n.simd && !c ? Ad(a.locateFile(n.url, a.ia)) : Promise.resolve()
                    })).then(function() {
                        var n, q, t;
                        return G(function(x) {
                            if (1 == x.g) return n = window.createMediapipeSolutionsWasm, q = window.createMediapipeSolutionsPackedAssets, t = a, F(x, n(q), 2);
                            t.h = x.h;
                            x.g = 0
                        })
                    }), m = function() {
                        return G(function(n) {
                            a.g.graph && a.g.graph.url ? n = F(n,
                                Ed(a, a.g.graph.url), 0) : (n.g = 0, n = void 0);
                            return n
                        })
                    }(), F(p, Promise.all([l, k, m]), 7);
                    if ("function" !== typeof importScripts) throw Error("solutions can only be loaded on a web page or in a web worker");
                    d = b.filter(function(n) {
                        return void 0 === n.simd || n.simd && c || !n.simd && !c
                    }).map(function(n) {
                        return a.locateFile(n.url, a.ia)
                    });
                    importScripts.apply(null, B(d));
                    e = a;
                    return F(p, createMediapipeSolutionsWasm(Module), 6);
                case 6:
                    e.h = p.h;/*
                    a.l = new OffscreenCanvas(1, 1);
                    a.h.canvas = a.l;
                    g = a.h.GL.createContext(a.l, {
                        antialias: !1,
                        alpha: !1,
                        ua: "undefined" !== typeof WebGL2RenderingContext ? 2 : 1
                    });
                    a.h.GL.makeContextCurrent(g);
                    a.C = a.h.GL.currentContext.GLctx;
                    p.g = 4;
                    break;*/
                case 7:
                    // a.l = document.createElement("canvas");
                    a.l = ((typeof document !== 'undefined') && document.createElement("canvas")) || new OffscreenCanvas(1,1);
                    r = a.l.getContext("webgl2", {});
                    if (!r && (r = a.l.getContext("webgl", {}), !r)) return alert("Failed to create WebGL canvas context when passing video frame."), p.return();
                    a.J = r;
                    a.h.canvas = a.l;
                    a.h.createContext(a.l, !0, !0, {});
                case 4:
                    a.i = new a.h.SolutionWasm, a.ha = !1, p.g = 0
            }
        })
    }

    function Fd(a) {
        var b, c, d, e, g, f, h, k;
        return G(function(l) {
            if (1 == l.g) {
                if (a.g.graph && a.g.graph.url && a.ga === a.g.graph.url) return l.return();
                a.u = !0;
                if (!a.g.graph || !a.g.graph.url) {
                    l.g = 2;
                    return
                }
                a.ga = a.g.graph.url;
                return F(l, Ed(a, a.g.graph.url), 3)
            }
            2 != l.g && (b = l.h, a.i.loadGraph(b));
            c = A(Object.keys(a.G));
            for (d = c.next(); !d.done; d = c.next()) e = d.value, a.i.overrideFile(e, a.G[e]);
            a.G = {};
            if (a.g.listeners)
                for (g = A(a.g.listeners), f = g.next(); !f.done; f = g.next()) h = f.value, Gd(a, h);
            k = a.j;
            a.j = {};
            a.setOptions(k);
            l.g = 0
        })
    }
    v.reset = function() {
        var a = this;
        return G(function(b) {
            a.i && (a.i.reset(), a.s = {}, a.v = {});
            b.g = 0
        })
    };
    v.setOptions = function(a, b) {
        var c = this;
        if (b = b || this.g.options) {
            for (var d = [], e = [], g = {}, f = A(Object.keys(a)), h = f.next(); !h.done; g = {
                    X: g.X,
                    Y: g.Y
                }, h = f.next())
                if (h = h.value, !(h in this.j && this.j[h] === a[h])) {
                    this.j[h] = a[h];
                    var k = b[h];
                    void 0 !== k && (k.onChange && (g.X = k.onChange, g.Y = a[h], d.push(function(l) {
                        return function() {
                            var m;
                            return G(function(r) {
                                if (1 == r.g) return F(r, l.X(l.Y), 2);
                                m = r.h;
                                !0 === m && (c.u = !0);
                                r.g = 0
                            })
                        }
                    }(g))), k.graphOptionXref && (h = Object.assign({}, {
                        calculatorName: "",
                        calculatorIndex: 0
                    }, k.graphOptionXref, {
                        valueNumber: 1 === k.type ? a[h] : 0,
                        valueBoolean: 0 === k.type ? a[h] : !1,
                        valueString: 2 === k.type ? a[h] : ""
                    }), e.push(h)))
                } if (0 !== d.length || 0 !== e.length) this.u = !0, this.F = (void 0 === this.F ? [] : this.F).concat(e), this.B = (void 0 === this.B ? [] : this.B).concat(d)
        }
    };

    function Hd(a) {
        var b, c, d, e, g, f, h;
        return G(function(k) {
            switch (k.g) {
                case 1:
                    if (!a.u) return k.return();
                    if (!a.B) {
                        k.g = 2;
                        break
                    }
                    b = A(a.B);
                    c = b.next();
                case 3:
                    if (c.done) {
                        k.g = 5;
                        break
                    }
                    d = c.value;
                    return F(k, d(), 4);
                case 4:
                    c = b.next();
                    k.g = 3;
                    break;
                case 5:
                    a.B = void 0;
                case 2:
                    if (a.F) {
                        e = new a.h.GraphOptionChangeRequestList;
                        g = A(a.F);
                        for (f = g.next(); !f.done; f = g.next()) h = f.value, e.push_back(h);
                        a.i.changeOptions(e);
                        e.delete();
                        a.F = void 0
                    }
                    a.u = !1;
                    k.g = 0
            }
        })
    }
    v.initialize = function() {
        var a = this;
        return G(function(b) {
            return 1 == b.g ? F(b, Dd(a), 2) : 3 != b.g ? F(b, Fd(a), 3) : F(b, Hd(a), 0)
        })
    };

    function Ed(a, b) {
        var c, d;
        return G(function(e) {
            if (b in a.K) return e.return(a.K[b]);
            c = a.locateFile(b, "");
            d = fetch(c).then(function(g) {
                return g.arrayBuffer()
            });
            a.K[b] = d;
            return e.return(d)
        })
    }
    v.overrideFile = function(a, b) {
        this.i ? this.i.overrideFile(a, b) : this.G[a] = b
    };
    v.clearOverriddenFiles = function() {
        this.G = {};
        this.i && this.i.clearOverriddenFiles()
    };
    v.send = function(a, b) {
        var c = this,
            d, e, g, f, h, k, l, m, r;
        return G(function(p) {
            switch (p.g) {
                case 1:
                    if (!c.g.inputs) return p.return();
                    d = 1E3 * (void 0 === b || null === b ? performance.now() : b);
                    return F(p, c.H, 2);
                case 2:
                    return F(p, c.initialize(), 3);
                case 3:
                    e = new c.h.PacketDataList;
                    g = A(Object.keys(a));
                    for (f = g.next(); !f.done; f = g.next())
                        if (h = f.value, k = c.g.inputs[h]) {
                            a: {
                                var n = a[h];
                                switch (k.type) {
                                    case "video":
                                        var q = c.s[k.stream];
                                        q || (q = new td(c.h, c.J), c.s[k.stream] = q);
                                        0 === q.l && (q.l = q.h.createTexture());
                                        if ("undefined" !== typeof HTMLVideoElement &&
                                            n instanceof HTMLVideoElement) {
                                            var t = n.videoWidth;
                                            var x = n.videoHeight
                                        } else "undefined" !== typeof HTMLImageElement && n instanceof HTMLImageElement ? (t = n.naturalWidth, x = n.naturalHeight) : (t = n.width, x = n.height);
                                        x = {
                                            glName: q.l,
                                            width: t,
                                            height: x
                                        };
                                        t = q.g;
                                        t.canvas.width = x.width;
                                        t.canvas.height = x.height;
                                        t.activeTexture(t.TEXTURE0);
                                        q.h.bindTexture2d(q.l);
                                        t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, n);
                                        q.h.bindTexture2d(0);
                                        q = x;
                                        break a;
                                    case "detections":
                                        q = c.s[k.stream];
                                        q || (q = new wd(c.h), c.s[k.stream] = q);
                                        q.data || (q.data = new q.g.DetectionListData);
                                        q.data.reset(n.length);
                                        for (x = 0; x < n.length; ++x) {
                                            t = n[x];
                                            var w = q.data,
                                                C = w.setBoundingBox,
                                                L = x;
                                            var J = t.la;
                                            var u = new bd;
                                            T(u, 1, J.ra);
                                            T(u, 2, J.sa);
                                            T(u, 3, J.height);
                                            T(u, 4, J.width);
                                            T(u, 5, J.rotation);
                                            T(u, 6, J.pa);
                                            J = Cc(u, cd);
                                            C.call(w, L, J);
                                            if (t.fa)
                                                for (w = 0; w < t.fa.length; ++w) {
                                                    u = t.fa[w];
                                                    C = q.data;
                                                    L = C.addNormalizedLandmark;
                                                    J = x;
                                                    u = Object.assign({}, u, {
                                                        visibility: u.visibility ? u.visibility : 0
                                                    });
                                                    var D = new Xc;
                                                    T(D, 1, u.x);
                                                    T(D, 2, u.y);
                                                    T(D, 3, u.z);
                                                    u.visibility && T(D, 4, u.visibility);
                                                    u = Cc(D,
                                                        Yc);
                                                    L.call(C, J, u)
                                                }
                                            if (t.ba)
                                                for (w = 0; w < t.ba.length; ++w) C = q.data, L = C.addClassification, J = x, u = t.ba[w], D = new Sc, T(D, 2, u.score), u.index && T(D, 1, u.index), u.label && T(D, 3, u.label), u.displayName && T(D, 4, u.displayName), u = Cc(D, Tc), L.call(C, J, u)
                                        }
                                        q = q.data;
                                        break a;
                                    default:
                                        q = {}
                                }
                            }
                            l = q;m = k.stream;
                            switch (k.type) {
                                case "video":
                                    e.pushTexture2d(Object.assign({}, l, {
                                        stream: m,
                                        timestamp: d
                                    }));
                                    break;
                                case "detections":
                                    r = l;
                                    r.stream = m;
                                    r.timestamp = d;
                                    e.pushDetectionList(r);
                                    break;
                                default:
                                    throw Error("Unknown input config type: '" + k.type +
                                        "'");
                            }
                        } c.i.send(e);
                    return F(p, c.H, 4);
                case 4:
                    e.delete(), p.g = 0
            }
        })
    };

    function Id(a, b, c) {
        var d, e, g, f, h, k, l, m, r, p, n, q, t, x;
        return G(function(w) {
            switch (w.g) {
                case 1:
                    if (!c) return w.return(b);
                    d = {};
                    e = 0;
                    g = A(Object.keys(c));
                    for (f = g.next(); !f.done; f = g.next()) h = f.value, k = c[h], "string" !== typeof k && "texture" === k.type && void 0 !== b[k.stream] && ++e;
                    1 < e && (a.L = !1);
                    l = A(Object.keys(c));
                    f = l.next();
                case 2:
                    if (f.done) {
                        w.g = 4;
                        break
                    }
                    m = f.value;
                    r = c[m];
                    if ("string" === typeof r) return t = d, x = m, F(w, Jd(a, m, b[r]), 14);
                    p = b[r.stream];
                    if ("detection_list" === r.type) {
                        if (p) {
                            var C = p.getRectList();
                            for (var L = p.getLandmarksList(),
                                    J = p.getClassificationsList(), u = [], D = 0; D < C.size(); ++D) {
                                var X = Bc(C.get(D), cd);
                                X = {
                                    la: {
                                        ra: V(X, 1),
                                        sa: V(X, 2),
                                        height: V(X, 3),
                                        width: V(X, 4),
                                        rotation: V(X, 5, 0),
                                        pa: Ub(X, 6, 0)
                                    },
                                    fa: sd(L.get(D)),
                                    ba: qd(Bc(J.get(D), Wc))
                                };
                                u.push(X)
                            }
                            C = u
                        } else C = [];
                        d[m] = C;
                        w.g = 7;
                        break
                    }
                    if ("proto_list" === r.type) {
                        if (p) {
                            C = Array(p.size());
                            for (L = 0; L < p.size(); L++) C[L] = p.get(L);
                            p.delete()
                        } else C = [];
                        d[m] = C;
                        w.g = 7;
                        break
                    }
                    if (void 0 === p) {
                        w.g = 3;
                        break
                    }
                    if ("float_list" === r.type) {
                        d[m] = p;
                        w.g = 7;
                        break
                    }
                    if ("proto" === r.type) {
                        d[m] = p;
                        w.g = 7;
                        break
                    }
                    if ("texture" !== r.type) throw Error("Unknown output config type: '" +
                        r.type + "'");
                    n = a.v[m];
                    n || (n = new td(a.h, a.J), a.v[m] = n);
                    return F(w, ud(n, p, a.L), 13);
                case 13:
                    q = w.h, d[m] = q;
                case 7:
                    r.transform && d[m] && (d[m] = r.transform(d[m]));
                    w.g = 3;
                    break;
                case 14:
                    t[x] = w.h;
                case 3:
                    f = l.next();
                    w.g = 2;
                    break;
                case 4:
                    return w.return(d)
            }
        })
    }

    function Jd(a, b, c) {
        var d;
        return G(function(e) {
            return "number" === typeof c || c instanceof Uint8Array || c instanceof a.h.Uint8BlobList ? e.return(c) : c instanceof a.h.Texture2dDataOut ? (d = a.v[b], d || (d = new td(a.h, a.J), a.v[b] = d), e.return(ud(d, c, a.L))) : e.return(void 0)
        })
    }

    function Gd(a, b) {
        for (var c = b.name || "$", d = [].concat(B(b.wants)), e = new a.h.StringList, g = A(b.wants), f = g.next(); !f.done; f = g.next()) e.push_back(f.value);
        g = a.h.PacketListener.implement({
            onResults: function(h) {
                for (var k = {}, l = 0; l < b.wants.length; ++l) k[d[l]] = h.get(l);
                var m = a.listeners[c];
                m && (a.H = Id(a, k, b.outs).then(function(r) {
                    r = m(r);
                    for (var p = 0; p < b.wants.length; ++p) {
                        var n = k[d[p]];
                        "object" === typeof n && n.hasOwnProperty && n.hasOwnProperty("delete") && n.delete()
                    }
                    r && (a.H = r)
                }))
            }
        });
        a.i.attachMultiListener(e, g);
        e.delete()
    }
    v.onResults = function(a, b) {
        this.listeners[b || "$"] = a
    };
    H("Solution", Cd);
    H("OptionType", {
        BOOL: 0,
        NUMBER: 1,
        ta: 2,
        0: "BOOL",
        1: "NUMBER",
        2: "STRING"
    });

    function Kd(a) {
        return a.map(Ld)
    }

    function Ld(a) {
        a = Bc(a, hd);
        var b = a.getMesh();
        if (!b) return a;
        var c = new Float32Array(b.getVertexBufferList());
        b.getVertexBufferList = function() {
            return c
        };
        var d = new Uint32Array(b.getIndexBufferList());
        b.getIndexBufferList = function() {
            return d
        };
        return a
    };

    function Md(a) {
        var b = this;
        a = a || {};
        this.g = new Cd({
            locateFile: a.locateFile,
            files: [{
                url: "holistic_solution_packed_assets_loader.js"
            }, {
                simd: !1,
                url: "holistic_solution_wasm_bin.js"
            }, {
                simd: !0,
                url: "holistic_solution_simd_wasm_bin.js"
            }],
            graph: {
                url: "holistic.binarypb"
            },
            inputs: {
                image: {
                    type: "video",
                    stream: "input_frames_gpu"
                }
            },
            listeners: [{
                wants: "left_hand_landmarks right_hand_landmarks face_landmarks pose_landmarks world_landmarks segmentation_mask image_transformed multi_face_geometry".split(" "),
                outs: {
                    image: {
                        type: "texture",
                        stream: "image_transformed"
                    },
                    leftHandLandmarks: {
                        type: "proto",
                        stream: "left_hand_landmarks",
                        transform: sd
                    },
                    rightHandLandmarks: {
                        type: "proto",
                        stream: "right_hand_landmarks",
                        transform: sd
                    },
                    faceLandmarks: {
                        type: "proto",
                        stream: "face_landmarks",
                        transform: sd
                    },
                    poseLandmarks: {
                        type: "proto",
                        stream: "pose_landmarks",
                        transform: sd
                    },
                    za: {
                        type: "proto",
                        stream: "world_landmarks",
                        transform: sd
                    },
                    segmentationMask: {
                        type: "texture",
                        stream: "segmentation_mask"
                    },
                    multiFaceGeometry: {
                        type: "proto_list",
                        stream: "multi_face_geometry",
                        transform: Kd
                    }
                }
            }],
            options: {
                useCpuInference: {
                    type: 0,
                    graphOptionXref: {
                        calculatorType: "InferenceCalculator",
                        fieldName: "use_cpu_inference"
                    },
                    default: "object" !== typeof window || void 0 === window.navigator ? !1 : "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document
                },
                enableFaceGeometry: {
                    type: 0,
                    graphOptionXref: {
                        calculatorName: "EnableFaceGeometryConstant",
                        calculatorType: "ConstantSidePacketCalculator",
                        fieldName: "bool_value"
                    }
                },
                selfieMode: {
                    type: 0,
                    graphOptionXref: {
                        calculatorType: "GlScalerCalculator",
                        calculatorIndex: 1,
                        fieldName: "flip_horizontal"
                    }
                },
                modelComplexity: {
                    type: 1,
                    default: 1,
                    graphOptionXref: {
                        calculatorType: "ConstantSidePacketCalculator",
                        calculatorName: "ConstantSidePacketCalculatorModelComplexity",
                        fieldName: "int_value"
                    },
                    onChange: function(c) {
                        var d, e, g, f;
                        return G(function(h) {
                            if (1 == h.g) {
                                d = "";
                                switch (c) {
                                    case 1:
                                        d = "pose_landmark_full.tflite";
                                        break;
                                    case 2:
                                        d = "pose_landmark_heavy.tflite";
                                        break;
                                    default:
                                        d = "pose_landmark_lite.tflite"
                                }
                                e =
                                    "third_party/mediapipe/modules/pose_landmark/" + d;
                                g = b.g.locateFile(d, "");
                                return F(h, fetch(g), 3)
                            }
                            if (2 != h.g) return F(h, h.h.arrayBuffer(), 2);
                            f = h.h;
                            b.g.overrideFile(e, f);
                            return F(h, b.g.reset(), 0)
                        })
                    }
                },
                smoothLandmarks: {
                    type: 0,
                    graphOptionXref: {
                        calculatorType: "ConstantSidePacketCalculator",
                        calculatorName: "ConstantSidePacketCalculatorSmoothLandmarks",
                        fieldName: "bool_value"
                    }
                },
                enableSegmentation: {
                    type: 0,
                    graphOptionXref: {
                        calculatorType: "ConstantSidePacketCalculator",
                        calculatorName: "ConstantSidePacketCalculatorEnableSegmentation",
                        fieldName: "bool_value"
                    }
                },
                smoothSegmentation: {
                    type: 0,
                    graphOptionXref: {
                        calculatorType: "ConstantSidePacketCalculator",
                        calculatorName: "ConstantSidePacketCalculatorSmoothSegmentation",
                        fieldName: "bool_value"
                    }
                },
                refineFaceLandmarks: {
                    type: 0,
                    graphOptionXref: {
                        calculatorType: "ConstantSidePacketCalculator",
                        calculatorName: "ConstantSidePacketCalculatorRefineFaceLandmarks",
                        fieldName: "bool_value"
                    }
                },
                minDetectionConfidence: {
                    type: 1,
                    graphOptionXref: {
                        calculatorType: "TensorsToDetectionsCalculator",
                        calculatorName: "holisticlandmarkgpu__poselandmarkgpu__posedetectiongpu__TensorsToDetectionsCalculator",
                        fieldName: "min_score_thresh"
                    }
                },
                minTrackingConfidence: {
                    type: 1,
                    graphOptionXref: {
                        calculatorType: "ThresholdingCalculator",
                        calculatorName: "holisticlandmarkgpu__poselandmarkgpu__poselandmarkbyroigpu__tensorstoposelandmarksandsegmentation__ThresholdingCalculator",
                        fieldName: "threshold"
                    }
                },
                cameraNear: {
                    type: 1,
                    graphOptionXref: {
                        calculatorType: "FaceGeometryEnvGeneratorCalculator",
                        fieldName: "near"
                    }
                },
                cameraFar: {
                    type: 1,
                    graphOptionXref: {
                        calculatorType: "FaceGeometryEnvGeneratorCalculator",
                        fieldName: "far"
                    }
                },
                cameraVerticalFovDegrees: {
                    type: 1,
                    graphOptionXref: {
                        calculatorType: "FaceGeometryEnvGeneratorCalculator",
                        fieldName: "vertical_fov_degrees"
                    }
                }
            }
        })
    }
    v = Md.prototype;
    v.close = function() {
        this.g.close();
        return Promise.resolve()
    };
    v.onResults = function(a) {
        this.g.onResults(a)
    };
    v.initialize = function() {
        var a = this;
        return G(function(b) {
            return F(b, a.g.initialize(), 0)
        })
    };
    v.reset = function() {
        this.g.reset()
    };
    v.send = function(a) {
        var b = this;
        return G(function(c) {
            return F(c, b.g.send(a), 0)
        })
    };
    v.setOptions = function(a) {
        this.g.setOptions(a)
    };
    H("Holistic", Md);
    H("FACE_GEOMETRY", {
        Layout: {
            COLUMN_MAJOR: 0,
            ROW_MAJOR: 1,
            0: "COLUMN_MAJOR",
            1: "ROW_MAJOR"
        },
        PrimitiveType: {
            TRIANGLE: 0,
            0: "TRIANGLE"
        },
        VertexType: {
            VERTEX_PT: 0,
            0: "VERTEX_PT"
        },
        DEFAULT_CAMERA_PARAMS: {
            verticalFovDegrees: 63,
            near: 1,
            far: 1E4
        }
    });
    H("FACEMESH_LIPS", id);
    H("FACEMESH_LEFT_EYE", jd);
    H("FACEMESH_LEFT_EYEBROW", kd);
    H("FACEMESH_LEFT_IRIS", [
        [474, 475],
        [475, 476],
        [476, 477],
        [477, 474]
    ]);
    H("FACEMESH_RIGHT_EYE", ld);
    H("FACEMESH_RIGHT_EYEBROW", md);
    H("FACEMESH_RIGHT_IRIS", [
        [469, 470],
        [470, 471],
        [471, 472],
        [472, 469]
    ]);
    H("FACEMESH_FACE_OVAL", nd);
    H("FACEMESH_CONTOURS", od);
    H("FACEMESH_TESSELATION", [
        [127, 34],
        [34, 139],
        [139, 127],
        [11, 0],
        [0, 37],
        [37, 11],
        [232, 231],
        [231, 120],
        [120, 232],
        [72, 37],
        [37, 39],
        [39, 72],
        [128, 121],
        [121, 47],
        [47, 128],
        [232, 121],
        [121, 128],
        [128, 232],
        [104, 69],
        [69, 67],
        [67, 104],
        [175, 171],
        [171, 148],
        [148, 175],
        [118, 50],
        [50, 101],
        [101, 118],
        [73, 39],
        [39, 40],
        [40, 73],
        [9, 151],
        [151, 108],
        [108, 9],
        [48, 115],
        [115, 131],
        [131, 48],
        [194, 204],
        [204, 211],
        [211, 194],
        [74, 40],
        [40, 185],
        [185, 74],
        [80, 42],
        [42, 183],
        [183, 80],
        [40, 92],
        [92, 186],
        [186, 40],
        [230, 229],
        [229, 118],
        [118, 230],
        [202, 212],
        [212,
            214
        ],
        [214, 202],
        [83, 18],
        [18, 17],
        [17, 83],
        [76, 61],
        [61, 146],
        [146, 76],
        [160, 29],
        [29, 30],
        [30, 160],
        [56, 157],
        [157, 173],
        [173, 56],
        [106, 204],
        [204, 194],
        [194, 106],
        [135, 214],
        [214, 192],
        [192, 135],
        [203, 165],
        [165, 98],
        [98, 203],
        [21, 71],
        [71, 68],
        [68, 21],
        [51, 45],
        [45, 4],
        [4, 51],
        [144, 24],
        [24, 23],
        [23, 144],
        [77, 146],
        [146, 91],
        [91, 77],
        [205, 50],
        [50, 187],
        [187, 205],
        [201, 200],
        [200, 18],
        [18, 201],
        [91, 106],
        [106, 182],
        [182, 91],
        [90, 91],
        [91, 181],
        [181, 90],
        [85, 84],
        [84, 17],
        [17, 85],
        [206, 203],
        [203, 36],
        [36, 206],
        [148, 171],
        [171, 140],
        [140, 148],
        [92,
            40
        ],
        [40, 39],
        [39, 92],
        [193, 189],
        [189, 244],
        [244, 193],
        [159, 158],
        [158, 28],
        [28, 159],
        [247, 246],
        [246, 161],
        [161, 247],
        [236, 3],
        [3, 196],
        [196, 236],
        [54, 68],
        [68, 104],
        [104, 54],
        [193, 168],
        [168, 8],
        [8, 193],
        [117, 228],
        [228, 31],
        [31, 117],
        [189, 193],
        [193, 55],
        [55, 189],
        [98, 97],
        [97, 99],
        [99, 98],
        [126, 47],
        [47, 100],
        [100, 126],
        [166, 79],
        [79, 218],
        [218, 166],
        [155, 154],
        [154, 26],
        [26, 155],
        [209, 49],
        [49, 131],
        [131, 209],
        [135, 136],
        [136, 150],
        [150, 135],
        [47, 126],
        [126, 217],
        [217, 47],
        [223, 52],
        [52, 53],
        [53, 223],
        [45, 51],
        [51, 134],
        [134, 45],
        [211, 170],
        [170,
            140
        ],
        [140, 211],
        [67, 69],
        [69, 108],
        [108, 67],
        [43, 106],
        [106, 91],
        [91, 43],
        [230, 119],
        [119, 120],
        [120, 230],
        [226, 130],
        [130, 247],
        [247, 226],
        [63, 53],
        [53, 52],
        [52, 63],
        [238, 20],
        [20, 242],
        [242, 238],
        [46, 70],
        [70, 156],
        [156, 46],
        [78, 62],
        [62, 96],
        [96, 78],
        [46, 53],
        [53, 63],
        [63, 46],
        [143, 34],
        [34, 227],
        [227, 143],
        [123, 117],
        [117, 111],
        [111, 123],
        [44, 125],
        [125, 19],
        [19, 44],
        [236, 134],
        [134, 51],
        [51, 236],
        [216, 206],
        [206, 205],
        [205, 216],
        [154, 153],
        [153, 22],
        [22, 154],
        [39, 37],
        [37, 167],
        [167, 39],
        [200, 201],
        [201, 208],
        [208, 200],
        [36, 142],
        [142, 100],
        [100,
            36
        ],
        [57, 212],
        [212, 202],
        [202, 57],
        [20, 60],
        [60, 99],
        [99, 20],
        [28, 158],
        [158, 157],
        [157, 28],
        [35, 226],
        [226, 113],
        [113, 35],
        [160, 159],
        [159, 27],
        [27, 160],
        [204, 202],
        [202, 210],
        [210, 204],
        [113, 225],
        [225, 46],
        [46, 113],
        [43, 202],
        [202, 204],
        [204, 43],
        [62, 76],
        [76, 77],
        [77, 62],
        [137, 123],
        [123, 116],
        [116, 137],
        [41, 38],
        [38, 72],
        [72, 41],
        [203, 129],
        [129, 142],
        [142, 203],
        [64, 98],
        [98, 240],
        [240, 64],
        [49, 102],
        [102, 64],
        [64, 49],
        [41, 73],
        [73, 74],
        [74, 41],
        [212, 216],
        [216, 207],
        [207, 212],
        [42, 74],
        [74, 184],
        [184, 42],
        [169, 170],
        [170, 211],
        [211, 169],
        [170,
            149
        ],
        [149, 176],
        [176, 170],
        [105, 66],
        [66, 69],
        [69, 105],
        [122, 6],
        [6, 168],
        [168, 122],
        [123, 147],
        [147, 187],
        [187, 123],
        [96, 77],
        [77, 90],
        [90, 96],
        [65, 55],
        [55, 107],
        [107, 65],
        [89, 90],
        [90, 180],
        [180, 89],
        [101, 100],
        [100, 120],
        [120, 101],
        [63, 105],
        [105, 104],
        [104, 63],
        [93, 137],
        [137, 227],
        [227, 93],
        [15, 86],
        [86, 85],
        [85, 15],
        [129, 102],
        [102, 49],
        [49, 129],
        [14, 87],
        [87, 86],
        [86, 14],
        [55, 8],
        [8, 9],
        [9, 55],
        [100, 47],
        [47, 121],
        [121, 100],
        [145, 23],
        [23, 22],
        [22, 145],
        [88, 89],
        [89, 179],
        [179, 88],
        [6, 122],
        [122, 196],
        [196, 6],
        [88, 95],
        [95, 96],
        [96, 88],
        [138, 172],
        [172, 136],
        [136, 138],
        [215, 58],
        [58, 172],
        [172, 215],
        [115, 48],
        [48, 219],
        [219, 115],
        [42, 80],
        [80, 81],
        [81, 42],
        [195, 3],
        [3, 51],
        [51, 195],
        [43, 146],
        [146, 61],
        [61, 43],
        [171, 175],
        [175, 199],
        [199, 171],
        [81, 82],
        [82, 38],
        [38, 81],
        [53, 46],
        [46, 225],
        [225, 53],
        [144, 163],
        [163, 110],
        [110, 144],
        [52, 65],
        [65, 66],
        [66, 52],
        [229, 228],
        [228, 117],
        [117, 229],
        [34, 127],
        [127, 234],
        [234, 34],
        [107, 108],
        [108, 69],
        [69, 107],
        [109, 108],
        [108, 151],
        [151, 109],
        [48, 64],
        [64, 235],
        [235, 48],
        [62, 78],
        [78, 191],
        [191, 62],
        [129, 209],
        [209, 126],
        [126, 129],
        [111, 35],
        [35, 143],
        [143,
            111
        ],
        [117, 123],
        [123, 50],
        [50, 117],
        [222, 65],
        [65, 52],
        [52, 222],
        [19, 125],
        [125, 141],
        [141, 19],
        [221, 55],
        [55, 65],
        [65, 221],
        [3, 195],
        [195, 197],
        [197, 3],
        [25, 7],
        [7, 33],
        [33, 25],
        [220, 237],
        [237, 44],
        [44, 220],
        [70, 71],
        [71, 139],
        [139, 70],
        [122, 193],
        [193, 245],
        [245, 122],
        [247, 130],
        [130, 33],
        [33, 247],
        [71, 21],
        [21, 162],
        [162, 71],
        [170, 169],
        [169, 150],
        [150, 170],
        [188, 174],
        [174, 196],
        [196, 188],
        [216, 186],
        [186, 92],
        [92, 216],
        [2, 97],
        [97, 167],
        [167, 2],
        [141, 125],
        [125, 241],
        [241, 141],
        [164, 167],
        [167, 37],
        [37, 164],
        [72, 38],
        [38, 12],
        [12, 72],
        [38, 82],
        [82, 13],
        [13, 38],
        [63, 68],
        [68, 71],
        [71, 63],
        [226, 35],
        [35, 111],
        [111, 226],
        [101, 50],
        [50, 205],
        [205, 101],
        [206, 92],
        [92, 165],
        [165, 206],
        [209, 198],
        [198, 217],
        [217, 209],
        [165, 167],
        [167, 97],
        [97, 165],
        [220, 115],
        [115, 218],
        [218, 220],
        [133, 112],
        [112, 243],
        [243, 133],
        [239, 238],
        [238, 241],
        [241, 239],
        [214, 135],
        [135, 169],
        [169, 214],
        [190, 173],
        [173, 133],
        [133, 190],
        [171, 208],
        [208, 32],
        [32, 171],
        [125, 44],
        [44, 237],
        [237, 125],
        [86, 87],
        [87, 178],
        [178, 86],
        [85, 86],
        [86, 179],
        [179, 85],
        [84, 85],
        [85, 180],
        [180, 84],
        [83, 84],
        [84, 181],
        [181, 83],
        [201, 83],
        [83, 182],
        [182, 201],
        [137, 93],
        [93, 132],
        [132, 137],
        [76, 62],
        [62, 183],
        [183, 76],
        [61, 76],
        [76, 184],
        [184, 61],
        [57, 61],
        [61, 185],
        [185, 57],
        [212, 57],
        [57, 186],
        [186, 212],
        [214, 207],
        [207, 187],
        [187, 214],
        [34, 143],
        [143, 156],
        [156, 34],
        [79, 239],
        [239, 237],
        [237, 79],
        [123, 137],
        [137, 177],
        [177, 123],
        [44, 1],
        [1, 4],
        [4, 44],
        [201, 194],
        [194, 32],
        [32, 201],
        [64, 102],
        [102, 129],
        [129, 64],
        [213, 215],
        [215, 138],
        [138, 213],
        [59, 166],
        [166, 219],
        [219, 59],
        [242, 99],
        [99, 97],
        [97, 242],
        [2, 94],
        [94, 141],
        [141, 2],
        [75, 59],
        [59, 235],
        [235, 75],
        [24, 110],
        [110, 228],
        [228,
            24
        ],
        [25, 130],
        [130, 226],
        [226, 25],
        [23, 24],
        [24, 229],
        [229, 23],
        [22, 23],
        [23, 230],
        [230, 22],
        [26, 22],
        [22, 231],
        [231, 26],
        [112, 26],
        [26, 232],
        [232, 112],
        [189, 190],
        [190, 243],
        [243, 189],
        [221, 56],
        [56, 190],
        [190, 221],
        [28, 56],
        [56, 221],
        [221, 28],
        [27, 28],
        [28, 222],
        [222, 27],
        [29, 27],
        [27, 223],
        [223, 29],
        [30, 29],
        [29, 224],
        [224, 30],
        [247, 30],
        [30, 225],
        [225, 247],
        [238, 79],
        [79, 20],
        [20, 238],
        [166, 59],
        [59, 75],
        [75, 166],
        [60, 75],
        [75, 240],
        [240, 60],
        [147, 177],
        [177, 215],
        [215, 147],
        [20, 79],
        [79, 166],
        [166, 20],
        [187, 147],
        [147, 213],
        [213, 187],
        [112, 233],
        [233, 244],
        [244, 112],
        [233, 128],
        [128, 245],
        [245, 233],
        [128, 114],
        [114, 188],
        [188, 128],
        [114, 217],
        [217, 174],
        [174, 114],
        [131, 115],
        [115, 220],
        [220, 131],
        [217, 198],
        [198, 236],
        [236, 217],
        [198, 131],
        [131, 134],
        [134, 198],
        [177, 132],
        [132, 58],
        [58, 177],
        [143, 35],
        [35, 124],
        [124, 143],
        [110, 163],
        [163, 7],
        [7, 110],
        [228, 110],
        [110, 25],
        [25, 228],
        [356, 389],
        [389, 368],
        [368, 356],
        [11, 302],
        [302, 267],
        [267, 11],
        [452, 350],
        [350, 349],
        [349, 452],
        [302, 303],
        [303, 269],
        [269, 302],
        [357, 343],
        [343, 277],
        [277, 357],
        [452, 453],
        [453, 357],
        [357, 452],
        [333, 332],
        [332,
            297
        ],
        [297, 333],
        [175, 152],
        [152, 377],
        [377, 175],
        [347, 348],
        [348, 330],
        [330, 347],
        [303, 304],
        [304, 270],
        [270, 303],
        [9, 336],
        [336, 337],
        [337, 9],
        [278, 279],
        [279, 360],
        [360, 278],
        [418, 262],
        [262, 431],
        [431, 418],
        [304, 408],
        [408, 409],
        [409, 304],
        [310, 415],
        [415, 407],
        [407, 310],
        [270, 409],
        [409, 410],
        [410, 270],
        [450, 348],
        [348, 347],
        [347, 450],
        [422, 430],
        [430, 434],
        [434, 422],
        [313, 314],
        [314, 17],
        [17, 313],
        [306, 307],
        [307, 375],
        [375, 306],
        [387, 388],
        [388, 260],
        [260, 387],
        [286, 414],
        [414, 398],
        [398, 286],
        [335, 406],
        [406, 418],
        [418, 335],
        [364, 367],
        [367,
            416
        ],
        [416, 364],
        [423, 358],
        [358, 327],
        [327, 423],
        [251, 284],
        [284, 298],
        [298, 251],
        [281, 5],
        [5, 4],
        [4, 281],
        [373, 374],
        [374, 253],
        [253, 373],
        [307, 320],
        [320, 321],
        [321, 307],
        [425, 427],
        [427, 411],
        [411, 425],
        [421, 313],
        [313, 18],
        [18, 421],
        [321, 405],
        [405, 406],
        [406, 321],
        [320, 404],
        [404, 405],
        [405, 320],
        [315, 16],
        [16, 17],
        [17, 315],
        [426, 425],
        [425, 266],
        [266, 426],
        [377, 400],
        [400, 369],
        [369, 377],
        [322, 391],
        [391, 269],
        [269, 322],
        [417, 465],
        [465, 464],
        [464, 417],
        [386, 257],
        [257, 258],
        [258, 386],
        [466, 260],
        [260, 388],
        [388, 466],
        [456, 399],
        [399, 419],
        [419, 456],
        [284, 332],
        [332, 333],
        [333, 284],
        [417, 285],
        [285, 8],
        [8, 417],
        [346, 340],
        [340, 261],
        [261, 346],
        [413, 441],
        [441, 285],
        [285, 413],
        [327, 460],
        [460, 328],
        [328, 327],
        [355, 371],
        [371, 329],
        [329, 355],
        [392, 439],
        [439, 438],
        [438, 392],
        [382, 341],
        [341, 256],
        [256, 382],
        [429, 420],
        [420, 360],
        [360, 429],
        [364, 394],
        [394, 379],
        [379, 364],
        [277, 343],
        [343, 437],
        [437, 277],
        [443, 444],
        [444, 283],
        [283, 443],
        [275, 440],
        [440, 363],
        [363, 275],
        [431, 262],
        [262, 369],
        [369, 431],
        [297, 338],
        [338, 337],
        [337, 297],
        [273, 375],
        [375, 321],
        [321, 273],
        [450, 451],
        [451,
            349
        ],
        [349, 450],
        [446, 342],
        [342, 467],
        [467, 446],
        [293, 334],
        [334, 282],
        [282, 293],
        [458, 461],
        [461, 462],
        [462, 458],
        [276, 353],
        [353, 383],
        [383, 276],
        [308, 324],
        [324, 325],
        [325, 308],
        [276, 300],
        [300, 293],
        [293, 276],
        [372, 345],
        [345, 447],
        [447, 372],
        [352, 345],
        [345, 340],
        [340, 352],
        [274, 1],
        [1, 19],
        [19, 274],
        [456, 248],
        [248, 281],
        [281, 456],
        [436, 427],
        [427, 425],
        [425, 436],
        [381, 256],
        [256, 252],
        [252, 381],
        [269, 391],
        [391, 393],
        [393, 269],
        [200, 199],
        [199, 428],
        [428, 200],
        [266, 330],
        [330, 329],
        [329, 266],
        [287, 273],
        [273, 422],
        [422, 287],
        [250, 462],
        [462,
            328
        ],
        [328, 250],
        [258, 286],
        [286, 384],
        [384, 258],
        [265, 353],
        [353, 342],
        [342, 265],
        [387, 259],
        [259, 257],
        [257, 387],
        [424, 431],
        [431, 430],
        [430, 424],
        [342, 353],
        [353, 276],
        [276, 342],
        [273, 335],
        [335, 424],
        [424, 273],
        [292, 325],
        [325, 307],
        [307, 292],
        [366, 447],
        [447, 345],
        [345, 366],
        [271, 303],
        [303, 302],
        [302, 271],
        [423, 266],
        [266, 371],
        [371, 423],
        [294, 455],
        [455, 460],
        [460, 294],
        [279, 278],
        [278, 294],
        [294, 279],
        [271, 272],
        [272, 304],
        [304, 271],
        [432, 434],
        [434, 427],
        [427, 432],
        [272, 407],
        [407, 408],
        [408, 272],
        [394, 430],
        [430, 431],
        [431, 394],
        [395, 369],
        [369, 400],
        [400, 395],
        [334, 333],
        [333, 299],
        [299, 334],
        [351, 417],
        [417, 168],
        [168, 351],
        [352, 280],
        [280, 411],
        [411, 352],
        [325, 319],
        [319, 320],
        [320, 325],
        [295, 296],
        [296, 336],
        [336, 295],
        [319, 403],
        [403, 404],
        [404, 319],
        [330, 348],
        [348, 349],
        [349, 330],
        [293, 298],
        [298, 333],
        [333, 293],
        [323, 454],
        [454, 447],
        [447, 323],
        [15, 16],
        [16, 315],
        [315, 15],
        [358, 429],
        [429, 279],
        [279, 358],
        [14, 15],
        [15, 316],
        [316, 14],
        [285, 336],
        [336, 9],
        [9, 285],
        [329, 349],
        [349, 350],
        [350, 329],
        [374, 380],
        [380, 252],
        [252, 374],
        [318, 402],
        [402, 403],
        [403, 318],
        [6, 197],
        [197,
            419
        ],
        [419, 6],
        [318, 319],
        [319, 325],
        [325, 318],
        [367, 364],
        [364, 365],
        [365, 367],
        [435, 367],
        [367, 397],
        [397, 435],
        [344, 438],
        [438, 439],
        [439, 344],
        [272, 271],
        [271, 311],
        [311, 272],
        [195, 5],
        [5, 281],
        [281, 195],
        [273, 287],
        [287, 291],
        [291, 273],
        [396, 428],
        [428, 199],
        [199, 396],
        [311, 271],
        [271, 268],
        [268, 311],
        [283, 444],
        [444, 445],
        [445, 283],
        [373, 254],
        [254, 339],
        [339, 373],
        [282, 334],
        [334, 296],
        [296, 282],
        [449, 347],
        [347, 346],
        [346, 449],
        [264, 447],
        [447, 454],
        [454, 264],
        [336, 296],
        [296, 299],
        [299, 336],
        [338, 10],
        [10, 151],
        [151, 338],
        [278, 439],
        [439,
            455
        ],
        [455, 278],
        [292, 407],
        [407, 415],
        [415, 292],
        [358, 371],
        [371, 355],
        [355, 358],
        [340, 345],
        [345, 372],
        [372, 340],
        [346, 347],
        [347, 280],
        [280, 346],
        [442, 443],
        [443, 282],
        [282, 442],
        [19, 94],
        [94, 370],
        [370, 19],
        [441, 442],
        [442, 295],
        [295, 441],
        [248, 419],
        [419, 197],
        [197, 248],
        [263, 255],
        [255, 359],
        [359, 263],
        [440, 275],
        [275, 274],
        [274, 440],
        [300, 383],
        [383, 368],
        [368, 300],
        [351, 412],
        [412, 465],
        [465, 351],
        [263, 467],
        [467, 466],
        [466, 263],
        [301, 368],
        [368, 389],
        [389, 301],
        [395, 378],
        [378, 379],
        [379, 395],
        [412, 351],
        [351, 419],
        [419, 412],
        [436, 426],
        [426, 322],
        [322, 436],
        [2, 164],
        [164, 393],
        [393, 2],
        [370, 462],
        [462, 461],
        [461, 370],
        [164, 0],
        [0, 267],
        [267, 164],
        [302, 11],
        [11, 12],
        [12, 302],
        [268, 12],
        [12, 13],
        [13, 268],
        [293, 300],
        [300, 301],
        [301, 293],
        [446, 261],
        [261, 340],
        [340, 446],
        [330, 266],
        [266, 425],
        [425, 330],
        [426, 423],
        [423, 391],
        [391, 426],
        [429, 355],
        [355, 437],
        [437, 429],
        [391, 327],
        [327, 326],
        [326, 391],
        [440, 457],
        [457, 438],
        [438, 440],
        [341, 382],
        [382, 362],
        [362, 341],
        [459, 457],
        [457, 461],
        [461, 459],
        [434, 430],
        [430, 394],
        [394, 434],
        [414, 463],
        [463, 362],
        [362, 414],
        [396, 369],
        [369, 262],
        [262, 396],
        [354, 461],
        [461, 457],
        [457, 354],
        [316, 403],
        [403, 402],
        [402, 316],
        [315, 404],
        [404, 403],
        [403, 315],
        [314, 405],
        [405, 404],
        [404, 314],
        [313, 406],
        [406, 405],
        [405, 313],
        [421, 418],
        [418, 406],
        [406, 421],
        [366, 401],
        [401, 361],
        [361, 366],
        [306, 408],
        [408, 407],
        [407, 306],
        [291, 409],
        [409, 408],
        [408, 291],
        [287, 410],
        [410, 409],
        [409, 287],
        [432, 436],
        [436, 410],
        [410, 432],
        [434, 416],
        [416, 411],
        [411, 434],
        [264, 368],
        [368, 383],
        [383, 264],
        [309, 438],
        [438, 457],
        [457, 309],
        [352, 376],
        [376, 401],
        [401, 352],
        [274, 275],
        [275, 4],
        [4, 274],
        [421, 428],
        [428,
            262
        ],
        [262, 421],
        [294, 327],
        [327, 358],
        [358, 294],
        [433, 416],
        [416, 367],
        [367, 433],
        [289, 455],
        [455, 439],
        [439, 289],
        [462, 370],
        [370, 326],
        [326, 462],
        [2, 326],
        [326, 370],
        [370, 2],
        [305, 460],
        [460, 455],
        [455, 305],
        [254, 449],
        [449, 448],
        [448, 254],
        [255, 261],
        [261, 446],
        [446, 255],
        [253, 450],
        [450, 449],
        [449, 253],
        [252, 451],
        [451, 450],
        [450, 252],
        [256, 452],
        [452, 451],
        [451, 256],
        [341, 453],
        [453, 452],
        [452, 341],
        [413, 464],
        [464, 463],
        [463, 413],
        [441, 413],
        [413, 414],
        [414, 441],
        [258, 442],
        [442, 441],
        [441, 258],
        [257, 443],
        [443, 442],
        [442, 257],
        [259, 444],
        [444, 443],
        [443, 259],
        [260, 445],
        [445, 444],
        [444, 260],
        [467, 342],
        [342, 445],
        [445, 467],
        [459, 458],
        [458, 250],
        [250, 459],
        [289, 392],
        [392, 290],
        [290, 289],
        [290, 328],
        [328, 460],
        [460, 290],
        [376, 433],
        [433, 435],
        [435, 376],
        [250, 290],
        [290, 392],
        [392, 250],
        [411, 416],
        [416, 433],
        [433, 411],
        [341, 463],
        [463, 464],
        [464, 341],
        [453, 464],
        [464, 465],
        [465, 453],
        [357, 465],
        [465, 412],
        [412, 357],
        [343, 412],
        [412, 399],
        [399, 343],
        [360, 363],
        [363, 440],
        [440, 360],
        [437, 399],
        [399, 456],
        [456, 437],
        [420, 456],
        [456, 363],
        [363, 420],
        [401, 435],
        [435, 288],
        [288, 401],
        [372,
            383
        ],
        [383, 353],
        [353, 372],
        [339, 255],
        [255, 249],
        [249, 339],
        [448, 261],
        [261, 255],
        [255, 448],
        [133, 243],
        [243, 190],
        [190, 133],
        [133, 155],
        [155, 112],
        [112, 133],
        [33, 246],
        [246, 247],
        [247, 33],
        [33, 130],
        [130, 25],
        [25, 33],
        [398, 384],
        [384, 286],
        [286, 398],
        [362, 398],
        [398, 414],
        [414, 362],
        [362, 463],
        [463, 341],
        [341, 362],
        [263, 359],
        [359, 467],
        [467, 263],
        [263, 249],
        [249, 255],
        [255, 263],
        [466, 467],
        [467, 260],
        [260, 466],
        [75, 60],
        [60, 166],
        [166, 75],
        [238, 239],
        [239, 79],
        [79, 238],
        [162, 127],
        [127, 139],
        [139, 162],
        [72, 11],
        [11, 37],
        [37, 72],
        [121, 232],
        [232,
            120
        ],
        [120, 121],
        [73, 72],
        [72, 39],
        [39, 73],
        [114, 128],
        [128, 47],
        [47, 114],
        [233, 232],
        [232, 128],
        [128, 233],
        [103, 104],
        [104, 67],
        [67, 103],
        [152, 175],
        [175, 148],
        [148, 152],
        [119, 118],
        [118, 101],
        [101, 119],
        [74, 73],
        [73, 40],
        [40, 74],
        [107, 9],
        [9, 108],
        [108, 107],
        [49, 48],
        [48, 131],
        [131, 49],
        [32, 194],
        [194, 211],
        [211, 32],
        [184, 74],
        [74, 185],
        [185, 184],
        [191, 80],
        [80, 183],
        [183, 191],
        [185, 40],
        [40, 186],
        [186, 185],
        [119, 230],
        [230, 118],
        [118, 119],
        [210, 202],
        [202, 214],
        [214, 210],
        [84, 83],
        [83, 17],
        [17, 84],
        [77, 76],
        [76, 146],
        [146, 77],
        [161, 160],
        [160, 30],
        [30, 161],
        [190, 56],
        [56, 173],
        [173, 190],
        [182, 106],
        [106, 194],
        [194, 182],
        [138, 135],
        [135, 192],
        [192, 138],
        [129, 203],
        [203, 98],
        [98, 129],
        [54, 21],
        [21, 68],
        [68, 54],
        [5, 51],
        [51, 4],
        [4, 5],
        [145, 144],
        [144, 23],
        [23, 145],
        [90, 77],
        [77, 91],
        [91, 90],
        [207, 205],
        [205, 187],
        [187, 207],
        [83, 201],
        [201, 18],
        [18, 83],
        [181, 91],
        [91, 182],
        [182, 181],
        [180, 90],
        [90, 181],
        [181, 180],
        [16, 85],
        [85, 17],
        [17, 16],
        [205, 206],
        [206, 36],
        [36, 205],
        [176, 148],
        [148, 140],
        [140, 176],
        [165, 92],
        [92, 39],
        [39, 165],
        [245, 193],
        [193, 244],
        [244, 245],
        [27, 159],
        [159, 28],
        [28, 27],
        [30,
            247
        ],
        [247, 161],
        [161, 30],
        [174, 236],
        [236, 196],
        [196, 174],
        [103, 54],
        [54, 104],
        [104, 103],
        [55, 193],
        [193, 8],
        [8, 55],
        [111, 117],
        [117, 31],
        [31, 111],
        [221, 189],
        [189, 55],
        [55, 221],
        [240, 98],
        [98, 99],
        [99, 240],
        [142, 126],
        [126, 100],
        [100, 142],
        [219, 166],
        [166, 218],
        [218, 219],
        [112, 155],
        [155, 26],
        [26, 112],
        [198, 209],
        [209, 131],
        [131, 198],
        [169, 135],
        [135, 150],
        [150, 169],
        [114, 47],
        [47, 217],
        [217, 114],
        [224, 223],
        [223, 53],
        [53, 224],
        [220, 45],
        [45, 134],
        [134, 220],
        [32, 211],
        [211, 140],
        [140, 32],
        [109, 67],
        [67, 108],
        [108, 109],
        [146, 43],
        [43, 91],
        [91, 146],
        [231, 230],
        [230, 120],
        [120, 231],
        [113, 226],
        [226, 247],
        [247, 113],
        [105, 63],
        [63, 52],
        [52, 105],
        [241, 238],
        [238, 242],
        [242, 241],
        [124, 46],
        [46, 156],
        [156, 124],
        [95, 78],
        [78, 96],
        [96, 95],
        [70, 46],
        [46, 63],
        [63, 70],
        [116, 143],
        [143, 227],
        [227, 116],
        [116, 123],
        [123, 111],
        [111, 116],
        [1, 44],
        [44, 19],
        [19, 1],
        [3, 236],
        [236, 51],
        [51, 3],
        [207, 216],
        [216, 205],
        [205, 207],
        [26, 154],
        [154, 22],
        [22, 26],
        [165, 39],
        [39, 167],
        [167, 165],
        [199, 200],
        [200, 208],
        [208, 199],
        [101, 36],
        [36, 100],
        [100, 101],
        [43, 57],
        [57, 202],
        [202, 43],
        [242, 20],
        [20, 99],
        [99, 242],
        [56, 28],
        [28,
            157
        ],
        [157, 56],
        [124, 35],
        [35, 113],
        [113, 124],
        [29, 160],
        [160, 27],
        [27, 29],
        [211, 204],
        [204, 210],
        [210, 211],
        [124, 113],
        [113, 46],
        [46, 124],
        [106, 43],
        [43, 204],
        [204, 106],
        [96, 62],
        [62, 77],
        [77, 96],
        [227, 137],
        [137, 116],
        [116, 227],
        [73, 41],
        [41, 72],
        [72, 73],
        [36, 203],
        [203, 142],
        [142, 36],
        [235, 64],
        [64, 240],
        [240, 235],
        [48, 49],
        [49, 64],
        [64, 48],
        [42, 41],
        [41, 74],
        [74, 42],
        [214, 212],
        [212, 207],
        [207, 214],
        [183, 42],
        [42, 184],
        [184, 183],
        [210, 169],
        [169, 211],
        [211, 210],
        [140, 170],
        [170, 176],
        [176, 140],
        [104, 105],
        [105, 69],
        [69, 104],
        [193, 122],
        [122, 168],
        [168, 193],
        [50, 123],
        [123, 187],
        [187, 50],
        [89, 96],
        [96, 90],
        [90, 89],
        [66, 65],
        [65, 107],
        [107, 66],
        [179, 89],
        [89, 180],
        [180, 179],
        [119, 101],
        [101, 120],
        [120, 119],
        [68, 63],
        [63, 104],
        [104, 68],
        [234, 93],
        [93, 227],
        [227, 234],
        [16, 15],
        [15, 85],
        [85, 16],
        [209, 129],
        [129, 49],
        [49, 209],
        [15, 14],
        [14, 86],
        [86, 15],
        [107, 55],
        [55, 9],
        [9, 107],
        [120, 100],
        [100, 121],
        [121, 120],
        [153, 145],
        [145, 22],
        [22, 153],
        [178, 88],
        [88, 179],
        [179, 178],
        [197, 6],
        [6, 196],
        [196, 197],
        [89, 88],
        [88, 96],
        [96, 89],
        [135, 138],
        [138, 136],
        [136, 135],
        [138, 215],
        [215, 172],
        [172, 138],
        [218,
            115
        ],
        [115, 219],
        [219, 218],
        [41, 42],
        [42, 81],
        [81, 41],
        [5, 195],
        [195, 51],
        [51, 5],
        [57, 43],
        [43, 61],
        [61, 57],
        [208, 171],
        [171, 199],
        [199, 208],
        [41, 81],
        [81, 38],
        [38, 41],
        [224, 53],
        [53, 225],
        [225, 224],
        [24, 144],
        [144, 110],
        [110, 24],
        [105, 52],
        [52, 66],
        [66, 105],
        [118, 229],
        [229, 117],
        [117, 118],
        [227, 34],
        [34, 234],
        [234, 227],
        [66, 107],
        [107, 69],
        [69, 66],
        [10, 109],
        [109, 151],
        [151, 10],
        [219, 48],
        [48, 235],
        [235, 219],
        [183, 62],
        [62, 191],
        [191, 183],
        [142, 129],
        [129, 126],
        [126, 142],
        [116, 111],
        [111, 143],
        [143, 116],
        [118, 117],
        [117, 50],
        [50, 118],
        [223, 222],
        [222,
            52
        ],
        [52, 223],
        [94, 19],
        [19, 141],
        [141, 94],
        [222, 221],
        [221, 65],
        [65, 222],
        [196, 3],
        [3, 197],
        [197, 196],
        [45, 220],
        [220, 44],
        [44, 45],
        [156, 70],
        [70, 139],
        [139, 156],
        [188, 122],
        [122, 245],
        [245, 188],
        [139, 71],
        [71, 162],
        [162, 139],
        [149, 170],
        [170, 150],
        [150, 149],
        [122, 188],
        [188, 196],
        [196, 122],
        [206, 216],
        [216, 92],
        [92, 206],
        [164, 2],
        [2, 167],
        [167, 164],
        [242, 141],
        [141, 241],
        [241, 242],
        [0, 164],
        [164, 37],
        [37, 0],
        [11, 72],
        [72, 12],
        [12, 11],
        [12, 38],
        [38, 13],
        [13, 12],
        [70, 63],
        [63, 71],
        [71, 70],
        [31, 226],
        [226, 111],
        [111, 31],
        [36, 101],
        [101, 205],
        [205, 36],
        [203, 206],
        [206, 165],
        [165, 203],
        [126, 209],
        [209, 217],
        [217, 126],
        [98, 165],
        [165, 97],
        [97, 98],
        [237, 220],
        [220, 218],
        [218, 237],
        [237, 239],
        [239, 241],
        [241, 237],
        [210, 214],
        [214, 169],
        [169, 210],
        [140, 171],
        [171, 32],
        [32, 140],
        [241, 125],
        [125, 237],
        [237, 241],
        [179, 86],
        [86, 178],
        [178, 179],
        [180, 85],
        [85, 179],
        [179, 180],
        [181, 84],
        [84, 180],
        [180, 181],
        [182, 83],
        [83, 181],
        [181, 182],
        [194, 201],
        [201, 182],
        [182, 194],
        [177, 137],
        [137, 132],
        [132, 177],
        [184, 76],
        [76, 183],
        [183, 184],
        [185, 61],
        [61, 184],
        [184, 185],
        [186, 57],
        [57, 185],
        [185, 186],
        [216, 212],
        [212,
            186
        ],
        [186, 216],
        [192, 214],
        [214, 187],
        [187, 192],
        [139, 34],
        [34, 156],
        [156, 139],
        [218, 79],
        [79, 237],
        [237, 218],
        [147, 123],
        [123, 177],
        [177, 147],
        [45, 44],
        [44, 4],
        [4, 45],
        [208, 201],
        [201, 32],
        [32, 208],
        [98, 64],
        [64, 129],
        [129, 98],
        [192, 213],
        [213, 138],
        [138, 192],
        [235, 59],
        [59, 219],
        [219, 235],
        [141, 242],
        [242, 97],
        [97, 141],
        [97, 2],
        [2, 141],
        [141, 97],
        [240, 75],
        [75, 235],
        [235, 240],
        [229, 24],
        [24, 228],
        [228, 229],
        [31, 25],
        [25, 226],
        [226, 31],
        [230, 23],
        [23, 229],
        [229, 230],
        [231, 22],
        [22, 230],
        [230, 231],
        [232, 26],
        [26, 231],
        [231, 232],
        [233, 112],
        [112, 232],
        [232, 233],
        [244, 189],
        [189, 243],
        [243, 244],
        [189, 221],
        [221, 190],
        [190, 189],
        [222, 28],
        [28, 221],
        [221, 222],
        [223, 27],
        [27, 222],
        [222, 223],
        [224, 29],
        [29, 223],
        [223, 224],
        [225, 30],
        [30, 224],
        [224, 225],
        [113, 247],
        [247, 225],
        [225, 113],
        [99, 60],
        [60, 240],
        [240, 99],
        [213, 147],
        [147, 215],
        [215, 213],
        [60, 20],
        [20, 166],
        [166, 60],
        [192, 187],
        [187, 213],
        [213, 192],
        [243, 112],
        [112, 244],
        [244, 243],
        [244, 233],
        [233, 245],
        [245, 244],
        [245, 128],
        [128, 188],
        [188, 245],
        [188, 114],
        [114, 174],
        [174, 188],
        [134, 131],
        [131, 220],
        [220, 134],
        [174, 217],
        [217, 236],
        [236, 174],
        [236, 198],
        [198, 134],
        [134, 236],
        [215, 177],
        [177, 58],
        [58, 215],
        [156, 143],
        [143, 124],
        [124, 156],
        [25, 110],
        [110, 7],
        [7, 25],
        [31, 228],
        [228, 25],
        [25, 31],
        [264, 356],
        [356, 368],
        [368, 264],
        [0, 11],
        [11, 267],
        [267, 0],
        [451, 452],
        [452, 349],
        [349, 451],
        [267, 302],
        [302, 269],
        [269, 267],
        [350, 357],
        [357, 277],
        [277, 350],
        [350, 452],
        [452, 357],
        [357, 350],
        [299, 333],
        [333, 297],
        [297, 299],
        [396, 175],
        [175, 377],
        [377, 396],
        [280, 347],
        [347, 330],
        [330, 280],
        [269, 303],
        [303, 270],
        [270, 269],
        [151, 9],
        [9, 337],
        [337, 151],
        [344, 278],
        [278, 360],
        [360, 344],
        [424, 418],
        [418,
            431
        ],
        [431, 424],
        [270, 304],
        [304, 409],
        [409, 270],
        [272, 310],
        [310, 407],
        [407, 272],
        [322, 270],
        [270, 410],
        [410, 322],
        [449, 450],
        [450, 347],
        [347, 449],
        [432, 422],
        [422, 434],
        [434, 432],
        [18, 313],
        [313, 17],
        [17, 18],
        [291, 306],
        [306, 375],
        [375, 291],
        [259, 387],
        [387, 260],
        [260, 259],
        [424, 335],
        [335, 418],
        [418, 424],
        [434, 364],
        [364, 416],
        [416, 434],
        [391, 423],
        [423, 327],
        [327, 391],
        [301, 251],
        [251, 298],
        [298, 301],
        [275, 281],
        [281, 4],
        [4, 275],
        [254, 373],
        [373, 253],
        [253, 254],
        [375, 307],
        [307, 321],
        [321, 375],
        [280, 425],
        [425, 411],
        [411, 280],
        [200, 421],
        [421,
            18
        ],
        [18, 200],
        [335, 321],
        [321, 406],
        [406, 335],
        [321, 320],
        [320, 405],
        [405, 321],
        [314, 315],
        [315, 17],
        [17, 314],
        [423, 426],
        [426, 266],
        [266, 423],
        [396, 377],
        [377, 369],
        [369, 396],
        [270, 322],
        [322, 269],
        [269, 270],
        [413, 417],
        [417, 464],
        [464, 413],
        [385, 386],
        [386, 258],
        [258, 385],
        [248, 456],
        [456, 419],
        [419, 248],
        [298, 284],
        [284, 333],
        [333, 298],
        [168, 417],
        [417, 8],
        [8, 168],
        [448, 346],
        [346, 261],
        [261, 448],
        [417, 413],
        [413, 285],
        [285, 417],
        [326, 327],
        [327, 328],
        [328, 326],
        [277, 355],
        [355, 329],
        [329, 277],
        [309, 392],
        [392, 438],
        [438, 309],
        [381, 382],
        [382,
            256
        ],
        [256, 381],
        [279, 429],
        [429, 360],
        [360, 279],
        [365, 364],
        [364, 379],
        [379, 365],
        [355, 277],
        [277, 437],
        [437, 355],
        [282, 443],
        [443, 283],
        [283, 282],
        [281, 275],
        [275, 363],
        [363, 281],
        [395, 431],
        [431, 369],
        [369, 395],
        [299, 297],
        [297, 337],
        [337, 299],
        [335, 273],
        [273, 321],
        [321, 335],
        [348, 450],
        [450, 349],
        [349, 348],
        [359, 446],
        [446, 467],
        [467, 359],
        [283, 293],
        [293, 282],
        [282, 283],
        [250, 458],
        [458, 462],
        [462, 250],
        [300, 276],
        [276, 383],
        [383, 300],
        [292, 308],
        [308, 325],
        [325, 292],
        [283, 276],
        [276, 293],
        [293, 283],
        [264, 372],
        [372, 447],
        [447, 264],
        [346, 352],
        [352, 340],
        [340, 346],
        [354, 274],
        [274, 19],
        [19, 354],
        [363, 456],
        [456, 281],
        [281, 363],
        [426, 436],
        [436, 425],
        [425, 426],
        [380, 381],
        [381, 252],
        [252, 380],
        [267, 269],
        [269, 393],
        [393, 267],
        [421, 200],
        [200, 428],
        [428, 421],
        [371, 266],
        [266, 329],
        [329, 371],
        [432, 287],
        [287, 422],
        [422, 432],
        [290, 250],
        [250, 328],
        [328, 290],
        [385, 258],
        [258, 384],
        [384, 385],
        [446, 265],
        [265, 342],
        [342, 446],
        [386, 387],
        [387, 257],
        [257, 386],
        [422, 424],
        [424, 430],
        [430, 422],
        [445, 342],
        [342, 276],
        [276, 445],
        [422, 273],
        [273, 424],
        [424, 422],
        [306, 292],
        [292, 307],
        [307, 306],
        [352,
            366
        ],
        [366, 345],
        [345, 352],
        [268, 271],
        [271, 302],
        [302, 268],
        [358, 423],
        [423, 371],
        [371, 358],
        [327, 294],
        [294, 460],
        [460, 327],
        [331, 279],
        [279, 294],
        [294, 331],
        [303, 271],
        [271, 304],
        [304, 303],
        [436, 432],
        [432, 427],
        [427, 436],
        [304, 272],
        [272, 408],
        [408, 304],
        [395, 394],
        [394, 431],
        [431, 395],
        [378, 395],
        [395, 400],
        [400, 378],
        [296, 334],
        [334, 299],
        [299, 296],
        [6, 351],
        [351, 168],
        [168, 6],
        [376, 352],
        [352, 411],
        [411, 376],
        [307, 325],
        [325, 320],
        [320, 307],
        [285, 295],
        [295, 336],
        [336, 285],
        [320, 319],
        [319, 404],
        [404, 320],
        [329, 330],
        [330, 349],
        [349, 329],
        [334, 293],
        [293, 333],
        [333, 334],
        [366, 323],
        [323, 447],
        [447, 366],
        [316, 15],
        [15, 315],
        [315, 316],
        [331, 358],
        [358, 279],
        [279, 331],
        [317, 14],
        [14, 316],
        [316, 317],
        [8, 285],
        [285, 9],
        [9, 8],
        [277, 329],
        [329, 350],
        [350, 277],
        [253, 374],
        [374, 252],
        [252, 253],
        [319, 318],
        [318, 403],
        [403, 319],
        [351, 6],
        [6, 419],
        [419, 351],
        [324, 318],
        [318, 325],
        [325, 324],
        [397, 367],
        [367, 365],
        [365, 397],
        [288, 435],
        [435, 397],
        [397, 288],
        [278, 344],
        [344, 439],
        [439, 278],
        [310, 272],
        [272, 311],
        [311, 310],
        [248, 195],
        [195, 281],
        [281, 248],
        [375, 273],
        [273, 291],
        [291, 375],
        [175, 396],
        [396, 199],
        [199, 175],
        [312, 311],
        [311, 268],
        [268, 312],
        [276, 283],
        [283, 445],
        [445, 276],
        [390, 373],
        [373, 339],
        [339, 390],
        [295, 282],
        [282, 296],
        [296, 295],
        [448, 449],
        [449, 346],
        [346, 448],
        [356, 264],
        [264, 454],
        [454, 356],
        [337, 336],
        [336, 299],
        [299, 337],
        [337, 338],
        [338, 151],
        [151, 337],
        [294, 278],
        [278, 455],
        [455, 294],
        [308, 292],
        [292, 415],
        [415, 308],
        [429, 358],
        [358, 355],
        [355, 429],
        [265, 340],
        [340, 372],
        [372, 265],
        [352, 346],
        [346, 280],
        [280, 352],
        [295, 442],
        [442, 282],
        [282, 295],
        [354, 19],
        [19, 370],
        [370, 354],
        [285, 441],
        [441, 295],
        [295, 285],
        [195,
            248
        ],
        [248, 197],
        [197, 195],
        [457, 440],
        [440, 274],
        [274, 457],
        [301, 300],
        [300, 368],
        [368, 301],
        [417, 351],
        [351, 465],
        [465, 417],
        [251, 301],
        [301, 389],
        [389, 251],
        [394, 395],
        [395, 379],
        [379, 394],
        [399, 412],
        [412, 419],
        [419, 399],
        [410, 436],
        [436, 322],
        [322, 410],
        [326, 2],
        [2, 393],
        [393, 326],
        [354, 370],
        [370, 461],
        [461, 354],
        [393, 164],
        [164, 267],
        [267, 393],
        [268, 302],
        [302, 12],
        [12, 268],
        [312, 268],
        [268, 13],
        [13, 312],
        [298, 293],
        [293, 301],
        [301, 298],
        [265, 446],
        [446, 340],
        [340, 265],
        [280, 330],
        [330, 425],
        [425, 280],
        [322, 426],
        [426, 391],
        [391, 322],
        [420,
            429
        ],
        [429, 437],
        [437, 420],
        [393, 391],
        [391, 326],
        [326, 393],
        [344, 440],
        [440, 438],
        [438, 344],
        [458, 459],
        [459, 461],
        [461, 458],
        [364, 434],
        [434, 394],
        [394, 364],
        [428, 396],
        [396, 262],
        [262, 428],
        [274, 354],
        [354, 457],
        [457, 274],
        [317, 316],
        [316, 402],
        [402, 317],
        [316, 315],
        [315, 403],
        [403, 316],
        [315, 314],
        [314, 404],
        [404, 315],
        [314, 313],
        [313, 405],
        [405, 314],
        [313, 421],
        [421, 406],
        [406, 313],
        [323, 366],
        [366, 361],
        [361, 323],
        [292, 306],
        [306, 407],
        [407, 292],
        [306, 291],
        [291, 408],
        [408, 306],
        [291, 287],
        [287, 409],
        [409, 291],
        [287, 432],
        [432, 410],
        [410, 287],
        [427, 434],
        [434, 411],
        [411, 427],
        [372, 264],
        [264, 383],
        [383, 372],
        [459, 309],
        [309, 457],
        [457, 459],
        [366, 352],
        [352, 401],
        [401, 366],
        [1, 274],
        [274, 4],
        [4, 1],
        [418, 421],
        [421, 262],
        [262, 418],
        [331, 294],
        [294, 358],
        [358, 331],
        [435, 433],
        [433, 367],
        [367, 435],
        [392, 289],
        [289, 439],
        [439, 392],
        [328, 462],
        [462, 326],
        [326, 328],
        [94, 2],
        [2, 370],
        [370, 94],
        [289, 305],
        [305, 455],
        [455, 289],
        [339, 254],
        [254, 448],
        [448, 339],
        [359, 255],
        [255, 446],
        [446, 359],
        [254, 253],
        [253, 449],
        [449, 254],
        [253, 252],
        [252, 450],
        [450, 253],
        [252, 256],
        [256, 451],
        [451, 252],
        [256,
            341
        ],
        [341, 452],
        [452, 256],
        [414, 413],
        [413, 463],
        [463, 414],
        [286, 441],
        [441, 414],
        [414, 286],
        [286, 258],
        [258, 441],
        [441, 286],
        [258, 257],
        [257, 442],
        [442, 258],
        [257, 259],
        [259, 443],
        [443, 257],
        [259, 260],
        [260, 444],
        [444, 259],
        [260, 467],
        [467, 445],
        [445, 260],
        [309, 459],
        [459, 250],
        [250, 309],
        [305, 289],
        [289, 290],
        [290, 305],
        [305, 290],
        [290, 460],
        [460, 305],
        [401, 376],
        [376, 435],
        [435, 401],
        [309, 250],
        [250, 392],
        [392, 309],
        [376, 411],
        [411, 433],
        [433, 376],
        [453, 341],
        [341, 464],
        [464, 453],
        [357, 453],
        [453, 465],
        [465, 357],
        [343, 357],
        [357, 412],
        [412, 343],
        [437, 343],
        [343, 399],
        [399, 437],
        [344, 360],
        [360, 440],
        [440, 344],
        [420, 437],
        [437, 456],
        [456, 420],
        [360, 420],
        [420, 363],
        [363, 360],
        [361, 401],
        [401, 288],
        [288, 361],
        [265, 372],
        [372, 353],
        [353, 265],
        [390, 339],
        [339, 249],
        [249, 390],
        [339, 448],
        [448, 255],
        [255, 339]
    ]);
    H("HAND_CONNECTIONS", [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],
        [5, 9],
        [9, 10],
        [10, 11],
        [11, 12],
        [9, 13],
        [13, 14],
        [14, 15],
        [15, 16],
        [13, 17],
        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20]
    ]);
    H("POSE_CONNECTIONS", [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 7],
        [0, 4],
        [4, 5],
        [5, 6],
        [6, 8],
        [9, 10],
        [11, 12],
        [11, 13],
        [13, 15],
        [15, 17],
        [15, 19],
        [15, 21],
        [17, 19],
        [12, 14],
        [14, 16],
        [16, 18],
        [16, 20],
        [16, 22],
        [18, 20],
        [11, 23],
        [12, 24],
        [23, 24],
        [23, 25],
        [24, 26],
        [25, 27],
        [26, 28],
        [27, 29],
        [28, 30],
        [29, 31],
        [30, 32],
        [27, 31],
        [28, 32]
    ]);
    H("POSE_LANDMARKS", {
        NOSE: 0,
        LEFT_EYE_INNER: 1,
        LEFT_EYE: 2,
        LEFT_EYE_OUTER: 3,
        RIGHT_EYE_INNER: 4,
        RIGHT_EYE: 5,
        RIGHT_EYE_OUTER: 6,
        LEFT_EAR: 7,
        RIGHT_EAR: 8,
        LEFT_RIGHT: 9,
        RIGHT_LEFT: 10,
        LEFT_SHOULDER: 11,
        RIGHT_SHOULDER: 12,
        LEFT_ELBOW: 13,
        RIGHT_ELBOW: 14,
        LEFT_WRIST: 15,
        RIGHT_WRIST: 16,
        LEFT_PINKY: 17,
        RIGHT_PINKY: 18,
        LEFT_INDEX: 19,
        RIGHT_INDEX: 20,
        LEFT_THUMB: 21,
        RIGHT_THUMB: 22,
        LEFT_HIP: 23,
        RIGHT_HIP: 24,
        LEFT_KNEE: 25,
        RIGHT_KNEE: 26,
        LEFT_ANKLE: 27,
        RIGHT_ANKLE: 28,
        LEFT_HEEL: 29,
        RIGHT_HEEL: 30,
        LEFT_FOOT_INDEX: 31,
        RIGHT_FOOT_INDEX: 32
    });
    H("POSE_LANDMARKS_LEFT", {
        LEFT_EYE_INNER: 1,
        LEFT_EYE: 2,
        LEFT_EYE_OUTER: 3,
        LEFT_EAR: 7,
        LEFT_RIGHT: 9,
        LEFT_SHOULDER: 11,
        LEFT_ELBOW: 13,
        LEFT_WRIST: 15,
        LEFT_PINKY: 17,
        LEFT_INDEX: 19,
        LEFT_THUMB: 21,
        LEFT_HIP: 23,
        LEFT_KNEE: 25,
        LEFT_ANKLE: 27,
        LEFT_HEEL: 29,
        LEFT_FOOT_INDEX: 31
    });
    H("POSE_LANDMARKS_RIGHT", {
        RIGHT_EYE_INNER: 4,
        RIGHT_EYE: 5,
        RIGHT_EYE_OUTER: 6,
        RIGHT_EAR: 8,
        RIGHT_LEFT: 10,
        RIGHT_SHOULDER: 12,
        RIGHT_ELBOW: 14,
        RIGHT_WRIST: 16,
        RIGHT_PINKY: 18,
        RIGHT_INDEX: 20,
        RIGHT_THUMB: 22,
        RIGHT_HIP: 24,
        RIGHT_KNEE: 26,
        RIGHT_ANKLE: 28,
        RIGHT_HEEL: 30,
        RIGHT_FOOT_INDEX: 32
    });
    H("POSE_LANDMARKS_NEUTRAL", {
        NOSE: 0
    });
    H("matrixDataToMatrix", function(a) {
        for (var b = a.getCols(), c = a.getRows(), d = a.getPackedDataList(), e = [], g = 0; g < c; g++) e.push(Array(b));
        for (g = 0; g < c; g++)
            for (var f = 0; f < b; f++) {
                var h = 1 === a.getLayout() ? g * b + f : f * c + g;
                e[g][f] = d[h]
            }
        return e
    });
    H("VERSION", "0.5.1657300018");
}).call(this);