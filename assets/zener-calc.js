/* Tinh toan cho trang /baitapzener: mach on ap Zener.
   Dong dien trung gian lam tron 0,01 mA nhu cach giai tay (vd. I_S = 39,33 mA) de so trong loi giai khop ket qua.
   Dung chung cho assets/zener.js va test/zener-calc.test.js. Don vi: V, ohm, A, W. */
(function (root) {
  "use strict";

  /** Lam tron dong dien (A) toi 0,01 mA. */
  function roundI(a) { return Math.round(a * 1e5) / 1e5; }

  /**
   * Dang 1: biet V_S, R_S, R_L -> I_S, I_RL, I_Z, P_Z va xet on ap.
   * @param {{vz:number, izmin:number, izmax:number, vs:number, rs:number, rl:number}} c
   */
  function zenerPoint(c) {
    var is = roundI((c.vs - c.vz) / c.rs);
    var irl = roundI(c.vz / c.rl);
    var iz = roundI(is - irl);
    return { is: is, irl: irl, iz: iz, pz: iz * c.vz, ok: iz >= c.izmin && iz <= c.izmax };
  }

  /** Dang 2: khoang V_S de on ap: (I_Zmin + I_RL)R_S + V_Z <= V_S <= (I_Zmax + I_RL)R_S + V_Z. */
  function vsRange(c) {
    var irl = roundI(c.vz / c.rl);
    return { irl: irl, lo: (c.izmin + irl) * c.rs + c.vz, hi: (c.izmax + irl) * c.rs + c.vz };
  }

  /** Dang 3: khoang R_L de on ap: V_Z/(I_S - I_Zmin) <= R_L <= V_Z/(I_S - I_Zmax). hi = Infinity neu I_S <= I_Zmax. */
  function rlRange(c) {
    var is = roundI((c.vs - c.vz) / c.rs);
    var dMax = is - c.izmax;
    return { is: is, lo: c.vz / (is - c.izmin), hi: dMax > 0 ? c.vz / dMax : Infinity };
  }

  root.ZENER_CALC = {
    roundI: roundI, zenerPoint: zenerPoint, vsRange: vsRange, rlRange: rlRange
  };
})(typeof window !== "undefined" ? window : globalThis);
