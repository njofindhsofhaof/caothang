/* Tinh mach 3 pha tai doi xung (bai tap Ly thuyet mach Chuong 4, trang /baitap3pha).
   Dung chung cho trang va test/bp3-calc.test.js.
   Mo hinh bai: { conn: "Y" | "D", Ud | Up, R, X, Rd?, Xd?, source?, zForm?, ask }
     conn: Y = noi sao, D = noi tam giac; R, X = dien tro, dien khang 1 pha tai (Z_p = R + jX)
     Ud: dien ap day nguon; Up: dien ap pha nguon noi Y (Ud = √3·Up); source "220/380" = cho ca hai
     Rd, Xd: dien tro, dien khang moi day dan (bo trong = bo qua duong day)
     zForm: "complex" = de cho Z_p = R + jX; ask: cac o can nhap (khoa trong UNITS).
   Ky hieu: chi so d = day, p = pha. */
(function (root) {
  "use strict";

  var SQ3 = Math.sqrt(3);

  function hasLine(p) { return !!(p.Rd || p.Xd); }

  /** Dien ap day nguon: cho Ud, hoac Up cua nguon noi Y (Ud = √3·Up). */
  function lineVoltage(p) { return p.Ud != null ? p.Ud : SQ3 * p.Up; }

  /**
   * @returns {{Ud:number, Up:number, Zp:number, Ip:number, Id:number, Zt:number, phi:number, cos:number, sin:number, P:number, Q:number, S:number}}
   * Up, Ip: dien ap va dong tren 1 pha tai; phi: do; Zt: tong tro 1 pha cua so do sao tuong duong (ke ca day).
   */
  function solve(p) {
    var Ud = lineVoltage(p), Rd = p.Rd || 0, Xd = p.Xd || 0;
    var Zp = Math.hypot(p.R, p.X);
    var k = p.conn === "D" ? 3 : 1;           /* Δ → Y: tro khang tai chia 3 */
    var Rt = Rd + p.R / k, Xt = Xd + p.X / k, Zt = Math.hypot(Rt, Xt);
    var Id = Ud / (SQ3 * Zt);
    var Ip = p.conn === "D" ? Id / SQ3 : Id;
    var Up = Ip * Zp;
    var phi = Math.atan2(p.X, p.R);
    return {
      Ud: Ud, Up: Up, Zp: Zp, Ip: Ip, Id: Id, Zt: Zt,
      phi: phi * 180 / Math.PI, cos: Math.cos(phi), sin: Math.sin(phi),
      P: 3 * p.R * Ip * Ip, Q: 3 * p.X * Ip * Ip, S: 3 * Up * Ip
    };
  }

  var KEYMAP = { U_d: "Ud", U_p: "Up", Z_p: "Zp", I_p: "Ip", I_d: "Id", "φ": "phi", "cosφ": "cos", P: "P", Q: "Q", S: "S" };
  var UNITS = { U_d: "V", U_p: "V", Z_p: "Ω", I_p: "A", I_d: "A", "φ": "°", "cosφ": "", P: "W", Q: "VAr", S: "VA" };

  /** Gia tri cac o nhap, theo thu tu p.ask (vd. ["I_p", "I_d", "P", "cosφ"]). */
  function answers(p) {
    var s = solve(p), out = {};
    p.ask.forEach(function (k) { out[k] = s[KEYMAP[k]]; });
    return out;
  }

  /** "8,78" ; "4620,8" ; "0,8" — lam tron toi da `d` chu so (mac dinh 2), dau phay thap phan. */
  function num(x, d) {
    var f = Math.pow(10, d == null ? 2 : d);
    var r = Math.round(x * f) / f;
    if (r === 0) r = 0;
    return String(r).replace("-", "−").replace(".", ",");
  }

  /** So hien trong dap so: cong suat 1 chu so, cos 3 chu so, con lai 2 chu so. */
  function fmt(key, x) {
    if (key === "cosφ") return num(x, 3);
    if (key === "P" || key === "Q" || key === "S") return num(x, 1);
    return num(x, 2);
  }

  /** Doc so nguoi hoc nhap: "8,78", "-3", "13/3", "4625 W", "0.8". @returns {number} NaN neu khong hop le */
  function parseNumber(raw) {
    var s = String(raw).trim().replace(/[−–—]/g, "-").replace(/,/g, ".").replace(/\s+/g, "")
      .replace(/(var|va|w|v|a|Ω|°)$/i, "");
    var m = /^([-+]?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
    if (m) return parseFloat(m[2]) === 0 ? NaN : parseFloat(m[1]) / parseFloat(m[2]);
    return /^[-+]?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }

  /** Dung khi lech ≤ 1% hoac ≤ 0,01 (chap nhan lam tron I_p truoc khi binh phuong). */
  var REL_TOL = 0.01;
  function matches(input, expected) {
    if (isNaN(input)) return false;
    return Math.abs(input - expected) <= Math.max(0.01, REL_TOL * Math.abs(expected)) + 1e-9;
  }

  /* ---------- de ngau nhien ---------- */
  /* Cap (R, X) cho Z_p tron so (bo ba Pythagore). */
  var RX = [[3, 4], [4, 3], [6, 8], [8, 6], [9, 12], [12, 9], [12, 16], [16, 12], [20, 15], [15, 20], [5, 12], [12, 5], [24, 7], [8, 15], [30, 40], [40, 30]];
  var LINE = [[0.5, 1], [1, 1], [1, 2], [1.5, 2], [2, 1], [0.5, 1.5]];
  var KINDS = ["Y", "D", "Yd", "Dd"];

  function pickFrom(rng, arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; }

  /**
   * Sinh de moi. kind: "Y" | "D" | "Yd" | "Dd" (d = co xet day) | khac = ngau nhien.
   * @param {() => number} [rng]  ham ngau nhien [0, 1)
   */
  function generate(rng, kind) {
    rng = rng || Math.random;
    kind = KINDS.indexOf(kind) >= 0 ? kind : pickFrom(rng, KINDS);
    var conn = kind.charAt(0), line = kind.length > 1;
    var rx = pickFrom(rng, RX);
    var p = { conn: conn, R: rx[0], X: rx[1], random: true };
    var form = conn === "Y" ? pickFrom(rng, ["Ud", "Up", "both"]) : pickFrom(rng, ["Ud", "both"]);
    if (form === "Up") p.Up = 220; else p.Ud = 380;
    if (form === "both") p.source = "220/380";
    p.zForm = pickFrom(rng, ["rx", "complex"]);
    if (line) { var l = pickFrom(rng, LINE); p.Rd = l[0]; p.Xd = l[1]; }
    if (line) p.ask = ["I_d", "I_p", "U_p", "P", "Q", "S"];
    else p.ask = [form === "Up" ? "U_d" : "U_p", "I_p", "I_d", "cosφ", "P", "Q", "S"];
    p.title = (conn === "Y" ? "Tải nối sao Y" : "Tải nối tam giác Δ") + (line ? " có xét đường dây" : "");
    p.text = describe(p);
    return p;
  }

  /** Cau de bai tu mo hinh. */
  function describe(p) {
    var load = p.conn === "Y" ? "nối hình sao (Y)" : "nối hình tam giác (Δ)";
    var z = p.zForm === "complex"
      ? "tổng trở mỗi pha Z_p = " + num(p.R) + " + j" + num(p.X) + " Ω"
      : "R_p = " + num(p.R) + " Ω, X_p = " + num(p.X) + " Ω";
    var src = p.source ? "Nguồn 3 pha cân bằng " + p.source + " V" :
      (p.Ud != null ? "Mạng điện 3 pha có U_d = " + num(p.Ud) + " V" : "Nguồn 3 pha nối Y có U_p = " + num(p.Up) + " V");
    var s = src + " cấp cho tải 3 pha đối xứng " + load + ", " + z + ".";
    if (hasLine(p)) s += " Mỗi dây dẫn có R_d = " + num(p.Rd) + " Ω, X_d = " + num(p.Xd) + " Ω.";
    return s + " Tính " + p.ask.join(", ") + ".";
  }

  /* ---------- loi giai tung buoc ---------- */
  function stepsVoltage(p, s) {
    var lines = [];
    if (p.source) lines.push("Nguồn " + p.source + " V nghĩa là điện áp pha nguồn 220 V, điện áp dây U_d = 380 V.");
    else if (p.Ud == null) lines.push("Nguồn nối Y: U_d = √3 × U_p = √3 × " + num(p.Up) + " = " + num(s.Ud) + " V");
    else lines.push("Điện áp dây U_d = " + num(s.Ud) + " V");
    if (hasLine(p)) {
      lines.push("Có tổng trở đường dây nên điện áp trên tải nhỏ hơn: tính dòng trước rồi mới suy ra U_p của tải.");
      return lines;
    }
    if (p.conn === "Y") lines.push("Tải nối Y: U_p = U_d/√3 = " + num(s.Ud) + "/√3 = " + num(s.Up) + " V ; I_d = I_p");
    else lines.push("Tải nối Δ: U_p = U_d = " + num(s.Up) + " V ; I_d = √3 × I_p");
    return lines;
  }

  function stepsCurrent(p, s) {
    var R = num(p.R), X = num(p.X), lines = [];
    if (p.zForm === "complex") lines.push("Z_p = " + R + " + j" + X + " Ω nghĩa là R_p = " + R + " Ω, X_p = " + X + " Ω");
    lines.push("Z_p = √(R_p² + X_p²) = √(" + R + "² + " + X + "²) = " + num(s.Zp) + " Ω");
    if (!hasLine(p)) {
      lines.push("I_p = U_p/Z_p = " + num(s.Up) + "/" + num(s.Zp) + " = " + num(s.Ip) + " A");
      lines.push(p.conn === "Y" ? "I_d = I_p = " + num(s.Id) + " A" : "I_d = √3 × I_p = √3 × " + num(s.Ip) + " = " + num(s.Id) + " A");
      return lines;
    }
    if (p.conn === "Y") {
      lines.push("Tải Y: dây nối tiếp với từng pha nên cộng thẳng. R_d + R_p = " + num(p.Rd) + " + " + R + " = " + num(p.Rd + p.R) +
        " Ω ; X_d + X_p = " + num(p.Xd) + " + " + X + " = " + num(p.Xd + p.X) + " Ω");
      lines.push("I_d = I_p = U_d / (√3·√((R_d + R_p)² + (X_d + X_p)²)) = " + num(s.Ud) + " / (√3 × " + num(s.Zt) + ") = " + num(s.Id) + " A");
    } else {
      lines.push("Tải Δ đổi sang Y tương đương: điện trở và điện kháng chia 3 ⇒ R_p/3 = " + num(p.R / 3) + " Ω, X_p/3 = " + num(p.X / 3) + " Ω");
      lines.push("R_d + R_p/3 = " + num(p.Rd + p.R / 3) + " Ω ; X_d + X_p/3 = " + num(p.Xd + p.X / 3) + " Ω");
      lines.push("I_d = U_d / (√3·√((R_d + R_p/3)² + (X_d + X_p/3)²)) = " + num(s.Ud) + " / (√3 × " + num(s.Zt) + ") = " + num(s.Id) + " A");
      lines.push("Trong tải Δ: I_p = I_d/√3 = " + num(s.Id) + "/√3 = " + num(s.Ip) + " A");
    }
    lines.push("Điện áp trên mỗi pha tải: U_p = I_p × Z_p = " + num(s.Ip) + " × " + num(s.Zp) + " = " + num(s.Up) + " V");
    return lines;
  }

  function stepsPower(p, s) {
    var Ip = num(s.Ip);
    return [
      "cosφ = R_p/Z_p = " + num(p.R) + "/" + num(s.Zp) + " = " + fmt("cosφ", s.cos) + " ; φ = arctg(X_p/R_p) = " + num(s.phi) + "°",
      "P = 3 × R_p × I_p² = 3 × " + num(p.R) + " × " + Ip + "² = " + fmt("P", s.P) + " W",
      "Q = 3 × X_p × I_p² = 3 × " + num(p.X) + " × " + Ip + "² = " + fmt("Q", s.Q) + " VAr",
      "S = √(P² + Q²) = 3 × U_p × I_p = " + fmt("S", s.S) + " VA",
      "Kiểm tra: P/S = " + fmt("cosφ", s.P / s.S) + " = cosφ ✓"
    ];
  }

  /** @returns {{title:string, lines:string[]}[]} */
  function steps(p) {
    var s = solve(p);
    return [
      { title: "Bước 1. Điện áp", lines: stepsVoltage(p, s) },
      { title: "Bước 2. Tổng trở và dòng điện", lines: stepsCurrent(p, s) },
      { title: "Bước 3. Công suất", lines: stepsPower(p, s) }
    ];
  }

  root.BP3_CALC = {
    solve: solve, answers: answers, steps: steps, generate: generate, describe: describe,
    num: num, fmt: fmt, parseNumber: parseNumber, matches: matches, UNITS: UNITS, KINDS: KINDS
  };
})(typeof window !== "undefined" ? window : globalThis);
