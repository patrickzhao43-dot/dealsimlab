/* =====================================================================
   Site engine: renders pages from content.js, runs the deal model,
   and provides edit mode (add ?edit to the address, or Ctrl+Shift+E).
   ===================================================================== */
(function () {
  "use strict";

  var DRAFT_KEY = "dsl-content-draft";
  var NOTES_KEY = "dsl-model-notes";
  var EDIT = false;
  var DATA = clone(window.SITE);
  var app = document.getElementById("app");
  var saveTimer = null;
  var companyQuery = "", companyCap = "All";
  var MS = null, activeScenario = "Base";

  /* ---------------- utilities ---------------- */
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, DATA); }
  function set(path, val) {
    var keys = path.split("."), o = DATA;
    for (var i = 0; i < keys.length - 1; i++) { if (o[keys[i]] == null) o[keys[i]] = {}; o = o[keys[i]]; }
    o[keys[keys.length - 1]] = val;
  }
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  function fmtDate(d) {
    if (!d) return "";
    var p = String(d).split("-"), m = MONTHS[parseInt(p[1], 10) - 1];
    if (p.length < 2 || !m) return d;
    return (p[2] ? parseInt(p[2], 10) + " " : "") + m + " " + p[0];
  }
  function fmtShortDate(d) {
    var p = String(d).split("-"), m = MONTHS[parseInt(p[1], 10) - 1];
    return m ? m.slice(0, 3) + " " + p[0] : d;
  }
  function money(v, dp) {
    if (v == null || isNaN(v)) return "—";
    dp = dp == null ? 1 : dp;
    var s = "$" + Math.abs(v).toFixed(dp) + "m";
    return v < 0 ? "−" + s : s;
  }
  function pct(v, dp) { return (v == null || isNaN(v)) ? "—" : (v * 100).toFixed(dp == null ? 0 : dp) + "%"; }
  function thou(v) { return (v / 1000).toFixed(1); }
  function today(day) {
    var t = new Date(), m = ("0" + (t.getMonth() + 1)).slice(-2), dd = ("0" + t.getDate()).slice(-2);
    return t.getFullYear() + "-" + m + (day ? "-" + dd : "");
  }
  function byDateDesc(list) {
    return list.map(function (x, i) { return { x: x, i: i }; })
      .sort(function (a, b) { return String(b.x.date || "").localeCompare(String(a.x.date || "")); });
  }

  /* ---------------- editable field builders ---------------- */
  function T(path, tag, cls, ph) {
    tag = tag || "span";
    return "<" + tag + (cls ? ' class="' + cls + '"' : "") + ' data-path="' + path + '" data-ph="' + esc(ph || "Click to type") + '">' + esc(get(path)) + "</" + tag + ">";
  }
  function M(path, cls, ph) {
    var paras = String(get(path) || "").split(/\n+/).filter(function (s) { return s.trim(); });
    return '<div class="prose ' + (cls || "") + '" data-path="' + path + '" data-multi="1" data-ph="' + esc(ph || "Click to write") + '">' +
      paras.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + "</div>";
  }
  function D(path, tag, cls) {
    tag = tag || "span";
    if (EDIT) return "<" + tag + (cls ? ' class="' + cls + '"' : "") + ' data-path="' + path + '" data-ph="YYYY-MM-DD">' + esc(get(path)) + "</" + tag + ">";
    return "<" + tag + (cls ? ' class="' + cls + '"' : "") + ">" + esc(fmtDate(get(path))) + "</" + tag + ">";
  }
  function btn(label, attrs) { return '<button type="button" class="ebtn ed" ' + attrs + ">" + label + "</button>"; }
  function listTools(list, i, n) {
    return '<div class="ed ebar-row">' +
      (i > 0 ? btn("↑ Up", 'data-act="up" data-list="' + list + '" data-i="' + i + '"') : "") +
      (i < n - 1 ? btn("↓ Down", 'data-act="down" data-list="' + list + '" data-i="' + i + '"') : "") +
      btn("Remove", 'data-act="del" data-list="' + list + '" data-i="' + i + '"') + "</div>";
  }
  var KIND_LABEL = { disclosed: "Disclosed", analysis: "Analysis", assumption: "Assumption" };
  function kindTag(path) {
    var k = get(path) || "analysis";
    if (EDIT) return '<span class="kind kind-' + esc(k) + '" data-path="' + path + '" data-ph="disclosed / analysis / assumption" title="Type: disclosed, analysis or assumption">' + esc(k) + "</span>";
    return '<span class="kind kind-' + esc(k) + '">' + esc(KIND_LABEL[k] || k) + "</span>";
  }

  /* ---------------- figures ---------------- */
  function figure(list, i, n) {
    var path = list + "." + i, f = get(path) || {};
    var inner = f.src ? '<img src="' + esc(f.src) + '" alt="' + esc(f.caption) + '" data-zoom="1" loading="lazy">' : "Photograph";
    return '<figure><div class="ph">' + inner + "</div>" + T(path + ".caption", "figcaption", "", "Caption") +
      '<div class="ed ebar-row">' + btn("Upload image", 'data-act="img" data-target="' + path + '.src"') + btn("Use file path", 'data-act="imgpath" data-target="' + path + '.src"') +
      btn("Remove", 'data-act="del" data-list="' + list + '" data-i="' + i + '"') + "</div></figure>";
  }
  function gallery(list) {
    var arr = get(list) || [];
    return (arr.length ? '<div class="gallery">' + arr.map(function (_, i) { return figure(list, i, arr.length); }).join("") + "</div>" : "") +
      '<div class="ed ebar-row">' + btn("+ Add photo", 'data-act="add" data-list="' + list + '" data-tpl="image"') + "</div>";
  }

  /* ---------------- line chart (monochrome, hover readout) ---------------- */
  var CHARTS = {};
  var STROKES = [{ c: "#111111", d: "" }, { c: "#7a7a7a", d: "6 4" }];
  function niceStep(span, n) {
    var s0 = (span || 1) / n, mag = Math.pow(10, Math.floor(Math.log10(s0))), e = s0 / mag;
    return (e >= 7.5 ? 10 : e >= 3.5 ? 5 : e >= 1.5 ? 2 : 1) * mag;
  }
  function lineChart(uid, labels, series, fmt) {
    var vals = []; series.forEach(function (s) { vals = vals.concat(s.values); });
    var mn = Math.min.apply(null, vals.concat([0])), mx = Math.max.apply(null, vals.concat([0]));
    var step = niceStep(mx - mn, 5), lo = Math.floor(mn / step) * step, hi = Math.ceil(mx / step) * step;
    if (hi === lo) { hi += step; }
    var W = 640, H = 300, L = 56, R = 118, Tm = 14, B = 34, pw = W - L - R, ph = H - Tm - B;
    function X(i) { return L + (labels.length === 1 ? pw / 2 : i / (labels.length - 1) * pw); }
    function Y(v) { return Tm + ph - (v - lo) / (hi - lo) * ph; }
    var g = "";
    for (var v = lo; v <= hi + step / 2; v += step) {
      var y = Y(v).toFixed(1), zero = Math.abs(v) < 1e-9;
      g += '<line x1="' + L + '" x2="' + (L + pw) + '" y1="' + y + '" y2="' + y + '" stroke="' + (zero ? "#111" : "#ececec") + '" stroke-width="1"/>';
      g += '<text x="' + (L - 10) + '" y="' + y + '" text-anchor="end" dominant-baseline="middle">' + esc(fmt(+v.toFixed(6), 0)) + "</text>";
    }
    labels.forEach(function (l, i) { g += '<text x="' + X(i).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + esc(l) + "</text>"; });
    var lines = "";
    series.forEach(function (s, si) {
      var st = STROKES[si], pts = s.values.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); });
      lines += '<polyline fill="none" stroke="' + st.c + '" stroke-width="2" stroke-linejoin="round"' + (st.d ? ' stroke-dasharray="' + st.d + '"' : "") + ' points="' + pts.join(" ") + '"/>';
      var last = pts[pts.length - 1].split(",");
      lines += '<text x="' + (+last[0] + 8) + '" y="' + last[1] + '" dominant-baseline="middle" style="fill:#4a4a4a">' + esc(s.name) + "</text>";
    });
    var hover = '<g class="hover" style="display:none"><line y1="' + Tm + '" y2="' + (Tm + ph) + '" stroke="#111"/>' +
      series.map(function (s, si) { return '<circle r="4.5" fill="' + STROKES[si].c + '" stroke="#fff" stroke-width="2" data-s="' + si + '"/>'; }).join("") + "</g>";
    CHARTS[uid] = { labels: labels, series: series, X: X, Y: Y, W: W, L: L, pw: pw, fmt: fmt };
    return '<div class="chart-wrap" data-uid="' + uid + '"><svg viewBox="0 0 ' + W + " " + H + '" role="img">' + g + lines + hover +
      '<rect class="hit" x="' + L + '" y="' + Tm + '" width="' + pw + '" height="' + ph + '" fill="transparent"/></svg><div class="tip"></div></div>' +
      (series.length > 1 ? '<div class="legend">' + series.map(function (s, i) { return "<span><i" + (i ? ' class="dash"' : "") + "></i>" + esc(s.name) + "</span>"; }).join("") + "</div>" : "");
  }
  function bindCharts() {
    Array.prototype.forEach.call(document.querySelectorAll(".chart-wrap"), function (wrap) {
      var c = CHARTS[wrap.dataset.uid]; if (!c) return;
      var svg = wrap.querySelector("svg"), hit = svg.querySelector(".hit"), hov = svg.querySelector(".hover"), tip = wrap.querySelector(".tip");
      hit.addEventListener("mousemove", function (ev) {
        var r = svg.getBoundingClientRect(), sx = (ev.clientX - r.left) * (c.W / r.width);
        var i = Math.max(0, Math.min(c.labels.length - 1, Math.round((sx - c.L) / c.pw * (c.labels.length - 1))));
        var x = c.X(i), top = Infinity, rows = [];
        hov.style.display = ""; hov.querySelector("line").setAttribute("x1", x); hov.querySelector("line").setAttribute("x2", x);
        c.series.forEach(function (s, si) {
          var v = s.values[i], dot = hov.querySelector('circle[data-s="' + si + '"]');
          dot.setAttribute("cx", x); dot.setAttribute("cy", c.Y(v)); top = Math.min(top, c.Y(v));
          rows.push(esc(s.name) + ": " + esc(c.fmt(v, 1)));
        });
        tip.innerHTML = "<b>" + esc(c.labels[i]) + "</b>" + rows.join("<br>");
        tip.style.display = "block"; tip.style.left = x / c.W * r.width + "px"; tip.style.top = (top * r.width / c.W - 8) + "px";
      });
      hit.addEventListener("mouseleave", function () { hov.style.display = "none"; tip.style.display = "none"; });
    });
  }

  /* ---------------- deal model ---------------- */
  function runModel(a, override) {
    a = Object.assign({}, a, override || {});
    var r = a.disc / 100, tg = a.tg / 100, rows = [], y0 = -(a.price - a.cashAcq) - a.txn;
    for (var t = 1; t <= 5; t++) {
      var rev = a.arr1 * Math.pow(1 + a.growth / 100, t - 1), op = rev * a.margin / 100;
      var b = t <= a.buildYears ? a.buildAvoided : 0;
      var ig = t === 1 ? a.integ1 : t === 2 ? a.integ2 : 0;
      var rt = a.retYears > 0 && t <= a.retYears ? a.retention / a.retYears : 0;
      var cf = op + b - ig - rt, df = 1 / Math.pow(1 + r, t);
      rows.push({ t: t, rev: rev, op: op, build: b, integ: ig, ret: rt, cf: cf, df: df, pv: cf * df });
    }
    var tv = r > tg ? rows[4].op * (1 + tg) / (r - tg) : NaN;
    var pvtv = tv / Math.pow(1 + r, 5);
    var pvOps = rows.reduce(function (s, x) { return s + x.pv; }, 0);
    var npv = y0 + pvOps + pvtv;
    var flows = [y0].concat(rows.map(function (x, i) { return x.cf + (i === 4 ? tv : 0); }));
    var irr = solveIRR(flows);
    var cum = y0, payback = null, cumU = [y0], cumPV = [y0], cp = y0;
    rows.forEach(function (x) { cum += x.cf; cumU.push(cum); cp += x.pv; cumPV.push(cp); if (payback === null && cum >= 0) payback = x.t; });
    cumPV[5] += pvtv;
    return { a: a, y0: y0, rows: rows, tv: tv, pvtv: pvtv, pvOps: pvOps, npv: npv, irr: irr, payback: payback,
      maxPrice: a.price + npv, allIn: a.price - a.cashAcq + a.txn + a.retention, cumU: cumU, cumPV: cumPV };
  }
  function solveIRR(f) {
    function npvAt(r) { return f.reduce(function (s, c, t) { return s + c / Math.pow(1 + r, t); }, 0); }
    var lo = -0.95, hi = 5, flo = npvAt(lo), fhi = npvAt(hi);
    if (isNaN(flo) || isNaN(fhi) || flo * fhi > 0) return NaN;
    for (var k = 0; k < 200; k++) { var mid = (lo + hi) / 2, fm = npvAt(mid); if (flo * fm <= 0) { hi = mid; } else { lo = mid; flo = fm; } }
    return (lo + hi) / 2;
  }
  function breakevenArr(a) {
    var lo = 0, hi = 100;
    if (runModel(a, { arr1: hi }).npv < 0) return NaN;
    for (var k = 0; k < 80; k++) { var mid = (lo + hi) / 2; if (runModel(a, { arr1: mid }).npv < 0) lo = mid; else hi = mid; }
    return hi;
  }

  function pageModel() {
    var m = DATA.model;
    if (!MS) MS = clone(m.scenarios[activeScenario] || m.scenarios.Base);
    var groups = [];
    m.inputs.forEach(function (inp) { if (groups.indexOf(inp.group) < 0) groups.push(inp.group); });
    var notesSaved = ""; try { notesSaved = localStorage.getItem(NOTES_KEY) || ""; } catch (e) {}
    return T("model.title", "h1", "page-title") + T("model.lede", "p", "lede") +
      '<div class="caveat">' + T("model.caveat", "span") + "</div>" +
      '<div class="scen-row"><span class="k">Scenario</span>' + Object.keys(m.scenarios).map(function (s) {
        return '<button type="button" class="chip' + (s === activeScenario ? " on" : "") + '" data-act="scenario" data-s="' + esc(s) + '">' + esc(s) + "</button>";
      }).join("") + '<button type="button" class="chip" data-act="exportcsv">Export CSV</button></div>' +
      '<div class="model-grid"><div class="inputs">' + groups.map(function (g) {
        return '<div class="igroup"><div class="igroup-h">' + esc(g) + "</div>" + m.inputs.filter(function (x) { return x.group === g; }).map(function (x) {
          return '<label class="irow"><span class="ilabel">' + esc(x.label) + ' <em class="k-' + x.kind + '" title="' + esc(KIND_LABEL[x.kind]) + '">' + (x.kind === "disclosed" ? "D" : "A") + "</em></span>" +
            '<span class="ifield"><input type="number" step="' + x.step + '" data-in="' + x.key + '" value="' + esc(MS[x.key]) + '"><span class="unit">' + esc(x.unit) + "</span></span></label>";
        }).join("") + "</div>";
      }).join("") + '<p class="small muted">D = anchored to disclosure &nbsp;·&nbsp; A = our assumption</p></div>' +
      '<div class="outputs" id="model-out"></div></div>' +
      '<section class="section"><div class="section-head"><h2>Method notes</h2></div><div class="focus-grid">' +
        (m.notes || []).map(function (_, i) { return '<div class="focus">' + T("model.notes." + i + ".heading", "h3") + M("model.notes." + i + ".body") + "</div>"; }).join("") +
      "</div></section>" +
      '<section class="section"><div class="section-head"><h2>Working notes</h2><span class="small muted">Saved in this browser only</span></div>' +
        '<textarea class="notes" id="model-notes" placeholder="Record what you changed and why the result moved.">' + esc(notesSaved) + "</textarea></section>";
  }
  function renderModelOutputs() {
    var out = document.getElementById("model-out"); if (!out) return;
    CHARTS = {};
    var R = runModel(MS), be = breakevenArr(MS), a = R.a;
    var kpis = [
      ["NPV", money(R.npv), R.npv >= 0 ? "Creates value under these assumptions" : "Destroys value under these assumptions"],
      ["IRR", isNaN(R.irr) ? "n/a" : pct(R.irr, 1), "Includes terminal value"],
      ["Max justified price", money(R.maxPrice), "vs " + money(a.price) + " paid"],
      ["All-in economic cost", money(R.allIn), "Net cash + transaction costs + retention"],
      ["Break-even year-1 revenue", isNaN(be) ? "n/a" : money(be, 2), "Year-1 revenue for NPV = 0"],
      ["Payback (undiscounted)", R.payback ? "Year " + R.payback : "Beyond year 5", "Excludes terminal value"]
    ];
    var tvShare = R.npv !== 0 ? R.pvtv / (R.pvOps + R.pvtv) : NaN;
    var row = function (label, key, f, cls) {
      return "<tr" + (cls ? ' class="' + cls + '"' : "") + "><td>" + label + '</td><td class="num">' + (key === "y0" ? money(R.y0) : "") + "</td>" +
        R.rows.map(function (x) { return '<td class="num">' + money(f(x)) + "</td>"; }).join("") + "</tr>";
    };
    // sensitivity: growth x margin
    var gs = [-20, -10, 0, 10, 20].map(function (d) { return a.growth + d; });
    var ms = [-10, -5, 0, 5, 10].map(function (d) { return a.margin + d; });
    var grid = gs.map(function (g) { return ms.map(function (mm) { return runModel(a, { growth: g, margin: mm }).npv; }); });
    var mx = Math.max.apply(null, grid.map(function (r) { return Math.max.apply(null, r.map(Math.abs)); })) || 1;
    out.innerHTML =
      '<div class="kpis">' + kpis.map(function (k) { return '<div class="kpi"><div class="lbl">' + k[0] + '</div><div class="num">' + k[1] + '</div><div class="sub">' + k[2] + "</div></div>"; }).join("") + "</div>" +
      '<p class="small muted" style="margin-top:12px">Terminal value is ' + (isNaN(tvShare) ? "—" : pct(tvShare)) + " of the present value of future cash flows.</p>" +
      '<h3 class="mh">Cumulative cash position</h3>' +
      lineChart("cum", ["Close", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"], [
        { name: "Undiscounted", values: R.cumU },
        { name: "Present value, incl. TV", values: R.cumPV }
      ], function (v, dp) { return money(v, dp); }) +
      '<h3 class="mh">Cash flow</h3><div class="tscroll"><table class="ind cf"><thead><tr><th>$m</th><th class="num">Close</th>' +
        R.rows.map(function (x) { return '<th class="num">Year ' + x.t + "</th>"; }).join("") + "</tr></thead><tbody>" +
        row("Net price paid + costs", "y0", function () { return null; }) +
        row("Incremental revenue", "", function (x) { return x.rev; }, "muted-row") +
        row("Operating cash flow", "", function (x) { return x.op; }) +
        row("Build cost avoided", "", function (x) { return x.build; }) +
        row("Integration cost", "", function (x) { return -x.integ; }) +
        row("Retention compensation", "", function (x) { return -x.ret; }) +
        row("Net cash flow", "", function (x) { return x.cf; }, "total") +
        row("Present value", "", function (x) { return x.pv; }, "muted-row") +
        '<tr><td>Terminal value (PV)</td><td></td><td></td><td></td><td></td><td></td><td class="num">' + money(R.pvtv) + "</td></tr>" +
      "</tbody></table></div>" +
      '<h3 class="mh">Sensitivity: NPV by growth and cash margin</h3><div class="tscroll"><table class="sens"><thead><tr><th>Growth ↓ / Margin →</th>' +
        ms.map(function (mm) { return "<th>" + mm + "%</th>"; }).join("") + "</tr></thead><tbody>" +
        grid.map(function (r, i) {
          return "<tr><th>" + gs[i] + "%</th>" + r.map(function (v, j) {
            var k = Math.min(1, Math.abs(v) / mx), bg = v >= 0 ? "rgba(17,17,17," + (0.06 + k * 0.5).toFixed(2) + ")" : "rgba(17,17,17,0.02)";
            var col = v >= 0 && k > 0.55 ? "#fff" : (v < 0 ? "#7a7a7a" : "#111");
            return '<td class="' + (i === 2 && j === 2 ? "cur" : "") + '" style="background:' + bg + ";color:" + col + '">' + money(v) + "</td>";
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div>" +
      '<p class="small muted">Shaded cells create value; light grey cells destroy it. The outlined cell is the current scenario.</p>';
    bindCharts();
  }
  function exportCSV() {
    var R = runModel(MS), lines = [["Input", "Value"]];
    DATA.model.inputs.forEach(function (x) { lines.push([x.label + " (" + x.unit + ")", MS[x.key]]); });
    lines.push([], ["$m", "Close", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]);
    function r(n, f) { lines.push([n, ""].concat(R.rows.map(function (x) { return f(x).toFixed(3); }))); }
    lines.push(["Net price paid + costs", R.y0.toFixed(3)]);
    r("Incremental revenue", function (x) { return x.rev; }); r("Operating cash flow", function (x) { return x.op; });
    r("Build cost avoided", function (x) { return x.build; }); r("Integration cost", function (x) { return -x.integ; });
    r("Retention compensation", function (x) { return -x.ret; }); r("Net cash flow", function (x) { return x.cf; }); r("Present value", function (x) { return x.pv; });
    lines.push([], ["Terminal value (PV)", R.pvtv.toFixed(3)], ["NPV", R.npv.toFixed(3)], ["IRR", isNaN(R.irr) ? "" : (R.irr * 100).toFixed(2) + "%"], ["Max justified price", R.maxPrice.toFixed(3)]);
    download("deal-model-" + activeScenario.toLowerCase() + ".csv", lines.map(function (l) { return l.map(function (c) { return /[",]/.test(String(c)) ? '"' + String(c).replace(/"/g, '""') + '"' : c; }).join(","); }).join("\n"), "text/csv");
  }
  function download(name, text, type) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------------- pages ---------------- */
  function pageHome() {
    var h = DATA.home;
    var nDeals = (DATA.research.deals || []).length, nCos = (DATA.companies.list || []).length;
    var base = runModel(DATA.model.scenarios.Base);
    var d0 = (DATA.research.deals || [])[0];
    var stats = [
      [nCos, "Company profiles"],
      [nDeals, "Deals compared from filings"],
      [Object.keys(DATA.model.scenarios).length, "Model scenarios"],
      [d0 ? money((d0.price - d0.cash + d0.txn + d0.retention) / 1000) : "—", "All-in cost, " + (d0 ? d0.target : "")]
    ];
    var layers = h.layers || [];
    return '<section class="hero">' + T("home.eyebrow", "div", "eyebrow") + T("home.title", "h1", "page-title") + T("home.lede", "p", "lede") + "</section>" +
      '<div class="status">' + T("home.status", "span") + "</div>" +
      '<div class="stats">' + stats.map(function (s) { return '<div class="stat"><div class="num">' + s[0] + '</div><div class="lbl">' + esc(s[1]) + "</div></div>"; }).join("") + "</div>" +
      '<section class="section"><div class="section-head"><h2>The question</h2></div>' + T("home.question", "p", "big") + "</section>" +
      '<section class="section"><div class="section-head"><h2>Three layers of analysis</h2></div>' +
        '<table class="ind layers"><thead><tr><th>Layer</th><th>Question</th><th>Where it lives</th></tr></thead><tbody>' +
        layers.map(function (_, i) {
          var p = "home.layers." + i, l = layers[i];
          return "<tr><td>" + T(p + ".layer", "span", "strong") + "</td><td>" + T(p + ".question") + "</td><td>" + T(p + ".where") +
            (l.route ? ' <a class="go" href="#/' + esc(l.route) + '">Open →</a>' : "") + "</td></tr>";
        }).join("") + "</tbody></table></section>" +
      '<section class="section"><div class="section-head"><h2>Key finding so far</h2><a href="#/research">Read the memo →</a></div>' +
        T("home.finding", "div", "summary-box") + "</section>" +
      '<section class="section"><div class="section-head"><h2>How information is labelled</h2></div><div class="focus-grid">' +
        (h.method || []).map(function (_, i) {
          var p = "home.method." + i;
          return '<div class="focus">' + kindTag(p + ".kind") + T(p + ".title", "h3") + M(p + ".text") + "</div>";
        }).join("") + "</div>" +
        '<p class="small muted" style="margin-top:26px;max-width:760px">' + T("home.aiNote", "span") + "</p></section>" +
      '<section class="section"><div class="section-head"><h2>Model snapshot, base case</h2><a href="#/model">Open the model →</a></div>' +
        '<div class="kpis three"><div class="kpi"><div class="lbl">NPV</div><div class="num">' + money(base.npv) + '</div></div><div class="kpi"><div class="lbl">Max justified price</div><div class="num">' + money(base.maxPrice) +
        '</div></div><div class="kpi"><div class="lbl">Terminal value share</div><div class="num">' + pct(base.pvtv / (base.pvOps + base.pvtv)) + "</div></div></div></section>";
  }

  function pageResearch() {
    var r = DATA.research, deals = r.deals || [];
    var dealRows = deals.map(function (d, i) {
      var p = "research.deals." + i, net = d.price - d.cash, allIn = net + d.txn + d.retention;
      return "<tr><td>" + T(p + ".target", "span", "strong") + '<div class="small muted">' + T(p + ".capability") + "</div></td>" +
        '<td class="num">' + (EDIT ? T(p + ".closed") : esc(fmtShortDate(d.closed))) + "</td>" +
        '<td class="num">' + thou(d.price) + '</td><td class="num">' + thou(net) + '</td><td class="num">' + thou(d.retention) + ' <span class="muted small">/ ' + d.retYears + "y</span></td>" +
        '<td class="num strong">' + thou(allIn) + '</td><td class="num">' + pct(d.goodwill / d.price) + '</td><td class="num">' + pct(d.retention / d.price) + "</td></tr>";
    }).join("");
    var memo = r.memo || [];
    return T("research.title", "h1", "page-title") + T("research.lede", "p", "lede") +
      '<nav class="toc">' + memo.map(function (m, i) { return '<a href="#/research" data-act="jump" data-to="memo-' + i + '">' + esc(m.heading) + "</a>"; }).join("") + "</nav>" +
      '<section class="section"><div class="section-head"><h2>' + T("research.dealsTitle", "span") + "</h2></div>" +
        '<div class="tscroll"><table class="ind deals"><thead><tr><th>Target</th><th class="num">Closed</th><th class="num">Purchase price</th><th class="num">Net of cash</th><th class="num">Retention</th><th class="num">All-in cost</th><th class="num">Goodwill / price</th><th class="num">Retention / price</th></tr></thead><tbody>' +
        dealRows + "</tbody></table></div>" +
        '<p class="small muted" style="margin-top:10px">US$ millions in table. All-in cost = net of cash + transaction costs + retention.</p>' +
        T("research.dealsNote", "p", "small muted") + "</section>" +
      '<section class="section"><div class="section-head"><h2>Research memo</h2></div><div class="memo">' +
        memo.map(function (_, i) {
          var p = "research.memo." + i;
          return '<article class="memo-sec" id="memo-' + i + '">' + kindTag(p + ".kind") + T(p + ".heading", "h3", "", "Heading") + M(p + ".body") + listTools("research.memo", i, memo.length) + "</article>";
        }).join("") +
        '<div class="ed ebar-row">' + btn("+ Add memo section", 'data-act="add" data-list="research.memo" data-tpl="memo"') + "</div></div></section>" +
      '<section class="section"><div class="section-head"><h2>Sources</h2></div><ol class="sources">' +
        (r.sources || []).map(function (s, i) {
          var p = "research.sources." + i;
          return "<li>" + (EDIT ? T(p + ".label") + ' <span class="small muted">URL: </span>' + T(p + ".url", "span", "small") : '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>") +
            listTools("research.sources", i, r.sources.length) + "</li>";
        }).join("") + "</ol>" + '<div class="ed ebar-row">' + btn("+ Add source", 'data-act="add" data-list="research.sources" data-tpl="source"') + "</div></section>";
  }

  function pageCompanies() {
    var c = DATA.companies, list = c.list || [];
    var caps = ["All"]; list.forEach(function (x) { if (caps.indexOf(x.capability) < 0) caps.push(x.capability); });
    if (caps.indexOf(companyCap) < 0) companyCap = "All";
    var q = companyQuery.toLowerCase();
    var idx = list.map(function (x, i) { return i; }).filter(function (i) {
      var x = list[i];
      return (companyCap === "All" || x.capability === companyCap) &&
        (!q || [x.name, x.acquirer, x.problem, x.why, x.capability].join(" ").toLowerCase().indexOf(q) >= 0);
    });
    var groups = [];
    idx.forEach(function (i) { if (groups.indexOf(list[i].capability) < 0) groups.push(list[i].capability); });
    return T("companies.title", "h1", "page-title") + T("companies.lede", "p", "lede") +
      '<div class="searchbar"><input type="search" id="co-search" placeholder="Search companies, acquirers, problems…" value="' + esc(companyQuery) + '"><span class="muted small" id="co-count">' + idx.length + " of " + list.length + "</span></div>" +
      '<div class="filters">' + caps.map(function (t) { return '<button type="button" class="chip' + (t === companyCap ? " on" : "") + '" data-act="cap" data-tag="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div>" +
      '<div class="ed ebar-row">' + btn("+ Add company", 'data-act="add" data-list="companies.list" data-tpl="company"') + "</div>" +
      (groups.length ? groups.map(function (g) {
        return '<section class="section cap-group"><div class="section-head"><h2>' + esc(g) + '</h2></div><div class="cards">' +
          idx.filter(function (i) { return list[i].capability === g; }).map(function (i) {
            var p = "companies.list." + i, x = list[i];
            return '<div class="card">' + T(p + ".name", "h3", "", "Company") +
              '<div class="card-meta">' + T(p + ".acquirer") + " · " + D(p + ".date") + "</div>" +
              '<div class="card-price">' + T(p + ".price", "span", "", "Price") + "</div>" +
              '<div class="k">Problem solved</div>' + T(p + ".problem", "p") +
              '<div class="k">Why the acquirer bought it</div>' + T(p + ".why", "p") +
              (EDIT ? '<div class="k">Capability group</div>' + T(p + ".capability", "p") + '<div class="k">Source URL</div>' + T(p + ".source", "p", "small") :
                (x.source ? '<a class="small" href="' + esc(x.source) + '" target="_blank" rel="noopener">Source →</a>' : "")) +
              '<div class="ed ebar-row">' + btn("Remove", 'data-act="del" data-list="companies.list" data-i="' + i + '"') + "</div></div>";
          }).join("") + "</div></section>";
      }).join("") : '<p class="muted" style="margin-top:30px">No companies match.</p>');
  }

  function pageLog() {
    var ev = DATA.log.events || [], sorted = byDateDesc(ev), years = {}, order = [];
    sorted.forEach(function (o) { var y = String(o.x.date || "").slice(0, 4) || "—"; if (!years[y]) { years[y] = []; order.push(y); } years[y].push(o); });
    return T("log.title", "h1", "page-title") + T("log.lede", "p", "lede") +
      '<div class="ed ebar-row" style="margin-top:18px">' + btn("+ Add log entry", 'data-act="add" data-list="log.events" data-tpl="event"') + "</div>" +
      order.map(function (y) {
        return '<div class="tl-year"><h2>' + esc(y) + '</h2><div class="tl-items">' + years[y].map(function (o) {
          var p = "log.events." + o.i, planned = /planned/i.test(o.x.type || "");
          return '<div class="tl-item' + (planned ? " planned" : "") + '">' + D(p + ".date", "div", "tl-date") + "<div>" +
            T(p + ".type", "div", "tl-type", "Type") + T(p + ".title", "div", "tl-title", "Title") + M(p + ".text", "tl-text") +
            ((o.x.images && o.x.images.length) || EDIT ? gallery(p + ".images") : "") +
            '<div class="ed ebar-row">' + btn("Remove entry", 'data-act="del" data-list="log.events" data-i="' + o.i + '"') + "</div></div></div>";
        }).join("") + "</div></div>";
      }).join("");
  }

  function personCards(list) {
    var arr = get(list) || [];
    return '<div class="people">' + arr.map(function (pp, i) {
      var p = list + "." + i;
      return '<div class="person"><div class="ph">' + (pp.photo ? '<img src="' + esc(pp.photo) + '" alt="' + esc(pp.name) + '" data-zoom="1">' : "Portrait") + "</div>" +
        T(p + ".name", "h3", "", "Name") + T(p + ".role", "div", "role", "Role") + M(p + ".note") +
        '<div class="ed ebar-row">' + btn("Upload photo", 'data-act="img" data-target="' + p + '.photo"') + btn("Use file path", 'data-act="imgpath" data-target="' + p + '.photo"') + "</div>" +
        listTools(list, i, arr.length) + "</div>";
    }).join("") + "</div>" + '<div class="ed ebar-row">' + btn("+ Add person", 'data-act="add" data-list="' + list + '" data-tpl="person"') + "</div>";
  }
  function pageTeam() {
    return T("team.title", "h1", "page-title") + T("team.lede", "p", "lede") +
      '<section class="section"><div class="section-head"><h2>Members</h2></div>' + personCards("team.members") + "</section>" +
      '<section class="section"><div class="section-head"><h2>' + T("team.advisorsTitle", "span") + "</h2></div>" + personCards("team.advisors") + "</section>";
  }

  function renderChrome() {
    var s = DATA.settings;
    document.getElementById("brand").innerHTML = T("settings.siteName", "span", "", "Site name") + '<span class="tagline">' + T("settings.tagline", "span", "", "Tagline") + "</span>";
    var contact = EDIT ? "<span>Email: " + T("settings.email", "span", "", "email") + "</span>"
      : "<span>" + (s.email && s.email.indexOf("[") < 0 ? '<a href="mailto:' + esc(s.email) + '">' + esc(s.email) + "</a>" : esc(s.email)) + "</span>";
    document.getElementById("footer").innerHTML = "<span>© " + new Date().getFullYear() + " " + T("settings.siteName", "span") + ". " + T("settings.footerNote", "span") + "</span>" + contact;
  }

  /* ---------------- router ---------------- */
  var PAGES = { "": pageHome, research: pageResearch, companies: pageCompanies, model: pageModel, log: pageLog, team: pageTeam };
  var LABELS = { "": "", research: "Research", companies: "Companies", model: "Model", log: "Log", team: "Team" };
  function route() { return (location.hash.replace(/^#\/?/, "") || "").split("/")[0]; }
  function render(scrollTop) {
    CHARTS = {};
    var name = route(); if (!PAGES[name]) name = "";
    app.innerHTML = PAGES[name]();
    renderChrome();
    Array.prototype.forEach.call(document.querySelectorAll("#nav a"), function (a) { a.classList.toggle("active", a.dataset.route === name); });
    document.title = (LABELS[name] ? LABELS[name] + " — " : "") + String(DATA.settings.siteName || "").replace(/[\[\]]/g, "");
    if (EDIT) Array.prototype.forEach.call(document.querySelectorAll("[data-path]"), function (el) { el.setAttribute("contenteditable", "true"); });
    if (name === "model") renderModelOutputs();
    bindCharts();
    if (scrollTop) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", function () { render(true); });

  /* ---------------- edit mode ---------------- */
  var TPL = {
    image: function () { return { src: "", caption: "" }; },
    memo: function () { return { kind: "analysis", heading: "New section", body: "" }; },
    source: function () { return { label: "New source", url: "https://" }; },
    company: function () { return { name: "New company", acquirer: "", date: today(false), price: "", capability: companyCap !== "All" ? companyCap : "Other", problem: "", why: "", source: "" }; },
    person: function () { return { name: "New person", role: "", note: "", photo: "" }; },
    event: function () { return { date: today(true), type: "Update", title: "New log entry", text: "", images: [] }; }
  };
  function saveDraft() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(DATA)); setStatus("Draft saved in this browser. Export to publish."); }
      catch (e) { setStatus("Browser storage is full (large images). Export now so nothing is lost."); }
    }, 300);
  }
  function setStatus(t) { var s = document.querySelector(".toolbar .status"); if (s) s.textContent = "Edit mode — " + t; }
  function exportContent() {
    var head = "/* SITE CONTENT — exported " + new Date().toISOString().slice(0, 16).replace("T", " ") + ".\n   Replace content.js with this file to publish the changes. */\n";
    download("content.js", head + "window.SITE = " + JSON.stringify(DATA, null, 2) + ";\n", "text/javascript");
    setStatus("content.js downloaded. Upload it to the site to publish.");
  }
  function compressImage(file) {
    return new Promise(function (resolve, reject) {
      if (/svg|gif/.test(file.type)) { var fr = new FileReader(); fr.onload = function () { resolve(fr.result); }; fr.onerror = reject; fr.readAsDataURL(file); return; }
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var max = 1600, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
        var ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject; img.src = url;
    });
  }
  function pickImage(path) {
    var inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    inp.onchange = function () { if (inp.files[0]) compressImage(inp.files[0]).then(function (src) { set(path, src); saveDraft(); render(false); }); };
    inp.click();
  }
  function startEdit() {
    EDIT = true;
    try { sessionStorage.setItem("dsl-edit", "1"); } catch (e) {}
    var draft = null; try { draft = localStorage.getItem(DRAFT_KEY); } catch (e) {}
    if (draft) { try { DATA = JSON.parse(draft); } catch (e) {} }
    document.body.classList.add("editing");
    var bar = document.createElement("div"); bar.className = "toolbar";
    bar.innerHTML = '<div class="wrap"><span class="status"></span><button type="button" data-tb="export" class="primary">Export content.js</button>' +
      '<button type="button" data-tb="discard">Discard draft</button><button type="button" data-tb="exit">Exit edit mode</button></div>';
    document.body.appendChild(bar);
    setStatus(draft ? "Unpublished draft loaded from this browser." : "Click any outlined text to edit. Changes save here as a draft.");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.dataset.tb === "export") exportContent();
      if (b.dataset.tb === "discard" && confirm("Discard all unpublished edits in this browser?")) {
        try { localStorage.removeItem(DRAFT_KEY); } catch (x) {}
        DATA = clone(window.SITE); render(false); setStatus("Draft discarded.");
      }
      if (b.dataset.tb === "exit") stopEdit();
    });
    render(false);
  }
  function stopEdit() {
    EDIT = false;
    try { sessionStorage.removeItem("dsl-edit"); } catch (e) {}
    document.body.classList.remove("editing");
    var bar = document.querySelector(".toolbar"); if (bar) bar.remove();
    if (/[?&]edit\b/.test(location.search)) { location.href = location.pathname + location.hash; return; }
    render(false);
  }

  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.id === "co-search") {
      companyQuery = t.value; var pos = t.selectionStart; render(false);
      var s = document.getElementById("co-search"); s.focus(); try { s.setSelectionRange(pos, pos); } catch (x) {}
      return;
    }
    if (t.dataset && t.dataset.in) {
      var v = parseFloat(t.value); if (!isNaN(v)) { MS[t.dataset.in] = v; activeScenario = "Custom"; markScenario(); renderModelOutputs(); }
      return;
    }
    if (t.id === "model-notes") { try { localStorage.setItem(NOTES_KEY, t.value); } catch (x) {} return; }
    if (!EDIT) return;
    var el = t.closest && t.closest("[data-path]"); if (!el) return;
    var val = el.dataset.multi ? el.innerText.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean).join("\n\n")
      : el.innerText.replace(/\s*\n\s*/g, " ").replace(/ /g, " ").trim();
    set(el.dataset.path, val); saveDraft();
  });
  function markScenario() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-act="scenario"]'), function (b) { b.classList.toggle("on", b.dataset.s === activeScenario); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.shiftKey && (e.key === "E" || e.key === "e")) { e.preventDefault(); EDIT ? stopEdit() : startEdit(); return; }
    if (e.key === "Escape") document.getElementById("lightbox").hidden = true;
    if (!EDIT) return;
    var el = e.target.closest && e.target.closest("[data-path]");
    if (el && e.key === "Enter" && !el.dataset.multi) { e.preventDefault(); el.blur(); }
  });
  document.addEventListener("paste", function (e) {
    if (!EDIT || !(e.target.closest && e.target.closest("[data-path]"))) return;
    e.preventDefault(); document.execCommand("insertText", false, (e.clipboardData || window.clipboardData).getData("text/plain"));
  });
  document.addEventListener("focusout", function (e) {
    if (!EDIT) return;
    var el = e.target.closest && e.target.closest("[data-path]");
    if (el && /\.(date|kind|capability|closed)$/.test(el.dataset.path)) setTimeout(function () { if (!document.activeElement.closest("[data-path]")) render(false); }, 0);
  });

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (EDIT && t.closest("[data-path]") && t.closest("a")) { e.preventDefault(); return; }
    var zoom = t.closest("img[data-zoom]");
    if (zoom && !EDIT) { var lb = document.getElementById("lightbox"); lb.querySelector("img").src = zoom.src; lb.querySelector("figcaption").textContent = zoom.alt || ""; lb.hidden = false; return; }
    if (t.closest("#lightbox")) { document.getElementById("lightbox").hidden = true; return; }
    var b = t.closest("[data-act]"); if (!b) return;
    var act = b.dataset.act, list = b.dataset.list, i = +b.dataset.i, arr = list ? get(list) : null;
    if (act === "jump") { e.preventDefault(); var tg = document.getElementById(b.dataset.to); if (tg) tg.scrollIntoView({ behavior: "smooth" }); return; }
    if (act === "cap") { companyCap = b.dataset.tag; render(false); return; }
    if (act === "scenario") { activeScenario = b.dataset.s; MS = clone(DATA.model.scenarios[activeScenario]); render(false); return; }
    if (act === "exportcsv") { exportCSV(); return; }
    if (!EDIT) return;
    if (act === "add") { if (!arr) { set(list, []); arr = get(list); } arr.push(TPL[b.dataset.tpl]()); }
    else if (act === "del") { if (!confirm("Remove this item?")) return; arr.splice(i, 1); }
    else if (act === "up" && i > 0) { var u = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = u; }
    else if (act === "down" && i < arr.length - 1) { var d = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = d; }
    else if (act === "img") { pickImage(b.dataset.target); return; }
    else if (act === "imgpath") {
      var cur = get(b.dataset.target) || "";
      var pth = prompt("Image file name or URL (e.g. meeting.jpg). Leave empty to clear.", /^data:/.test(cur) ? "" : cur);
      if (pth === null) return; set(b.dataset.target, pth.trim());
    }
    else return;
    saveDraft(); render(false);
  });

  /* ---------------- start ---------------- */
  var wantEdit = /[?&]edit\b/.test(location.search);
  try { wantEdit = wantEdit || sessionStorage.getItem("dsl-edit") === "1"; } catch (e) {}
  if (wantEdit) startEdit(); else render(false);
})();
