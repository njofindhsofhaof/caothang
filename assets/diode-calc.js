/* Giai mach diode/LED theo cach trong vo: VCC -> R -> cac tang noi tiep xuong Mass, moi tang la 1 diode
   hoac 1 cum diode song song. Mo hinh diode ly tuong co nguong: dan thi giu dung V_D, khong dan thi I = 0.
   - Tang khong co diode phan cuc thuan -> mach ho (I = 0): cac nut tu tang do tro len = VCC, ben duoi = 0 V.
   - VCC <= tong nguong -> khong diode nao dan (noi tiep: 1 con khong dan thi ca mach khong dan), moi nut = VCC.
   - Cum song song: diode co nguong nho nhat dan truoc va ghim dien ap cum; cac diode cung loai chia deu dong.
   Dung chung cho trang /baitapdiode va test/diode-calc.test.js. */
(function (root) {
  "use strict";

  var E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];

  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }

  /** @param {Array<{name:string, vf:number, rev?:boolean}>} level @returns {{v:number, on:string[], blocked:boolean}} */
  function levelState(level) {
    var fwd = level.filter(function (d) { return !d.rev; });
    if (!fwd.length) return { v: 0, on: [], blocked: true };
    var v = Math.min.apply(null, fwd.map(function (d) { return d.vf; }));
    return { v: v, on: fwd.filter(function (d) { return d.vf === v; }).map(function (d) { return d.name; }), blocked: false };
  }

  function analyzeLevels(levels) {
    var states = levels.map(levelState);
    var blockedAt = -1;
    states.some(function (s, k) { if (s.blocked) { blockedAt = k; return true; } return false; });
    var sumV = clean(states.reduce(function (a, s) { return a + s.v; }, 0));
    return { states: states, blockedAt: blockedAt, sumV: sumV };
  }

  /** Dien ap nut tren tang k khi mach dan: tong dien ap cac tang tu k xuong Mass. */
  function nodeOn(states, k) {
    return clean(states.slice(k).reduce(function (a, s) { return a + s.v; }, 0));
  }

  function diodeCurrents(levels, states, iR) {
    var out = {};
    levels.forEach(function (level, k) {
      level.forEach(function (d) {
        var on = states[k].on.indexOf(d.name) >= 0;
        out[d.name] = on && iR > 0 ? iR / states[k].on.length : 0;
      });
    });
    return out;
  }

  /**
   * @param {Array<Array<{name:string, vf:number, rev?:boolean}>>} levels tu tren xuong
   * @param {number} vcc V @param {number} r ohm
   * @returns {{mode:"blocked"|"off"|"on", sumV:number, blockedAt:number, states:Array, iR:number, id:Object<string,number>, nodes:number[]}}
   *   iR, id tinh bang A; nodes[k] = dien ap nut ngay tren tang k (V).
   */
  function solve(levels, vcc, r) {
    var a = analyzeLevels(levels);
    var mode = a.blockedAt >= 0 ? "blocked" : (vcc <= a.sumV ? "off" : "on");
    var iR = mode === "on" ? (vcc - a.sumV) / r : 0;
    var nodes = levels.map(function (_, k) {
      if (mode === "blocked") return k <= a.blockedAt ? vcc : 0;
      if (mode === "off") return vcc;
      return nodeOn(a.states, k);
    });
    return { mode: mode, sumV: a.sumV, blockedAt: a.blockedAt, states: a.states, iR: iR, id: diodeCurrents(levels, a.states, iR), nodes: nodes };
  }

  /**
   * Chon R de dong qua moi diode dan bang iD.
   * @param {Array} levels @param {number} vcc V @param {number} iD A
   * @returns {{ok:boolean, n:number, iR:number, r:number, sumV:number, states:Array, nodes:number[], nearest:number, higher:number}}
   */
  function design(levels, vcc, iD) {
    var a = analyzeLevels(levels);
    var counts = a.states.map(function (s) { return s.on.length; });
    var n = counts[0];
    var ok = a.blockedAt < 0 && vcc > a.sumV && counts.every(function (c) { return c === n; });
    var iR = n * iD;
    var r = ok ? clean((vcc - a.sumV) / iR) : NaN;
    return {
      ok: ok, n: n, iR: iR, r: r, sumV: a.sumV, states: a.states,
      nodes: levels.map(function (_, k) { return nodeOn(a.states, k); }),
      nearest: ok ? nearestE12(r) : NaN, higher: ok ? nextE12(r) : NaN
    };
  }

  function decadeValues(x) {
    var exp = Math.floor(Math.log10(x)) - 1;
    var out = [];
    [exp - 1, exp, exp + 1].forEach(function (e) {
      E12.forEach(function (m) { out.push(clean(m * Math.pow(10, e))); });
    });
    out.push(clean(10 * Math.pow(10, exp + 2)));
    return out;
  }

  /** @param {number} r @returns {number} gia tri E12 gan nhat (so theo ti le), vd 210 -> 220, 340 -> 330 */
  function nearestE12(r) {
    return decadeValues(r).reduce(function (best, v) {
      return Math.abs(Math.log(v / r)) < Math.abs(Math.log(best / r)) ? v : best;
    });
  }

  /** @param {number} r @returns {number} gia tri E12 nho nhat >= r, vd 466,7 -> 470 */
  function nextE12(r) {
    var vals = decadeValues(r).filter(function (v) { return v >= r * (1 - 1e-9); });
    return Math.min.apply(null, vals);
  }

  root.DIODE_CALC = { E12: E12, levelState: levelState, solve: solve, design: design, nearestE12: nearestE12, nextE12: nextE12 };
})(typeof window !== "undefined" ? window : globalThis);
