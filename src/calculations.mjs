const mmPerInch = 25.4;
function assert(condition, message) { if (!condition) throw new Error(message); }
function fmt(n, digits = 0) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n); }
function floorCount(n) { return Math.floor(n + Math.max(1, n) * Number.EPSILON * 8); }
function quantity(n) { return fmt(n) + (n === 1 ? " label" : " labels"); }
function areaRatio(used, full, core) { return ((used - core) * (used + core)) / ((full - core) * (full + core)); }

export function calculate(mode, input, units = "mm") {
  const read = (key, name, { zero = false, integer = false } = {}) => {
    const raw = input[key];
    assert(raw !== undefined && raw !== null && String(raw).trim() !== "", "Enter " + name + ".");
    const value = Number(raw);
    assert(Number.isFinite(value) && (zero ? value >= 0 : value > 0) &&
      value <= 1e9 && (!integer || Number.isInteger(value)), "Enter a valid " + name + ".");
    return value;
  };
  const dim = (key, name, zero = false) => read(key, name, { zero }) * (units === "in" ? mmPerInch : 1);
  const count = (key, name, zero = false) => read(key, name, { zero, integer: true });
  const showDim = (mm) => fmt(units === "in" ? mm / mmPerInch : mm, units === "in" ? 3 : 2) + " " + units;
  const checkCount = (n) => { assert(Number.isSafeInteger(n) && n <= 1e12, "These inputs produce an impractically large label count."); return n; };

  if (mode === "reference") {
    const used = dim("used", "current roll diameter");
    const full = dim("full", "full roll diameter");
    const core = dim("core", "empty core outside diameter");
    const original = count("original", "full roll label count");
    assert(full > core, "Full roll diameter must be larger than the core.");
    assert(used >= core && used <= full, "Current diameter must be between the core and full roll diameters.");
    const ratio = areaRatio(used, full, core);
    const remaining = floorCount(ratio * original);
    return { value: fmt(remaining), caption: "estimated labels remaining", remaining, fraction: ratio,
      details: [["Stock remaining", fmt(ratio * 100, 1) + "%"], ["Labels already used", quantity(original - remaining)]],
      note: "Use a full reference roll of the same stock and core size. Winding differences can shift the estimate." };
  }

  if (mode === "diameter") {
    const used = dim("used", "current roll diameter");
    const core = dim("core", "empty core outside diameter");
    const thickness = dim("thickness", "combined caliper");
    const label = dim("label", "label length");
    const gap = dim("gap", "label gap", true);
    const lanes = count("lanes", "labels across");
    const waste = dim("waste", "unusable liner length", true);
    assert(used >= core, "Roll diameter must be at least as large as the core.");
    const length = Math.PI * (used - core) * (used + core) / (4 * thickness);
    const pitch = label + gap;
    const repeats = floorCount(Math.max(0, length - waste) / pitch);
    const remaining = checkCount(repeats * lanes);
    return { value: fmt(remaining), caption: "estimated usable labels", remaining, fraction: null,
      details: [["Total web length", units === "in" ? fmt(length / 304.8, 2) + " ft" : fmt(length / 1000, 2) + " m"], ["Label pitch", showDim(pitch)], ["Complete repeats", fmt(repeats)]],
      note: "Use combined stock and liner caliper. Allow for loose winding, gaps, and leader or trailer waste." };
  }

  if (mode === "weight") {
    const used = read("usedMass", "current roll weight", { zero: true });
    const full = read("fullMass", "full roll weight");
    const core = read("coreMass", "empty core weight", { zero: true });
    const original = count("original", "full roll label count");
    assert(full > core, "Full roll weight must exceed empty core weight.");
    assert(used >= core && used <= full, "Current weight must be between empty core and full roll weight.");
    const ratio = (used - core) / (full - core);
    const remaining = floorCount(ratio * original);
    return { value: fmt(remaining), caption: "estimated labels remaining", remaining, fraction: ratio,
      details: [["Stock remaining", fmt(ratio * 100, 1) + "%"], ["Labels already used", quantity(original - remaining)]],
      note: "Use a matching empty core and stock. Remove packaging and weigh all three items in the same unit." };
  }

  if (mode === "run") {
    const job = count("job", "job label count");
    const loaded = count("loaded", "labels on the loaded roll", true);
    const perRoll = count("perRoll", "labels per unopened roll");
    const available = count("available", "number of unopened rolls on hand", true);
    const buffer = read("buffer", "buffer percentage", { zero: true });
    assert(buffer <= 100, "Enter a buffer percentage between 0 and 100.");
    const setup = count("setup", "setup labels", true);
    const needed = Math.ceil(job * buffer / 100) + job + setup;
    const extraNeeded = Math.ceil(Math.max(0, needed - loaded) / perRoll);
    const stock = loaded + available * perRoll;
    assert(Number.isSafeInteger(stock), "Enter smaller stock quantities.");
    const surplus = stock - needed;
    return { value: fmt(extraNeeded), caption: extraNeeded === 1 ? "unopened roll needed" : "unopened rolls needed",
      fraction: Math.min(stock / needed, 1), details: [["Labels required", quantity(needed)],
        ["Stock on hand", quantity(stock)], [surplus >= 0 ? "Stock left after job" : "Stock shortfall", quantity(Math.abs(surplus))]],
      note: extraNeeded <= available ? "Your entered stock covers this run, including setup and buffer." : "The rolls on hand fall short of your job target." };
  }

  if (mode === "size") {
    const core = dim("core", "empty core outside diameter");
    const thickness = dim("thickness", "combined caliper");
    const label = dim("label", "label length");
    const gap = dim("gap", "label gap", true);
    const lanes = count("lanes", "labels across");
    const target = count("target", "target label count");
    const waste = dim("waste", "unusable liner length", true);
    const repeats = Math.ceil(target / lanes);
    const length = repeats * (label + gap) + waste;
    const diameter = Math.hypot(core, Math.sqrt(4 * thickness * length / Math.PI));
    return {value: showDim(diameter), caption: "estimated finished roll diameter", fraction: null,
      details: [["Web length", units === "in" ? fmt(length / 304.8, 2) + " ft" : fmt(length / 1000, 2) + " m"],
        ["Complete repeats", fmt(repeats)], ["Label positions", quantity(repeats * lanes)]],
      note: "Actual size varies with winding tension and caliper. Allow clearance before ordering or winding to a printer limit."};
  }

  if (mode === "batch") {
    const job = count("job", "job label count");
    const setup = count("setup", "setup labels", true);
    const buffer = read("buffer", "buffer percentage", {zero:true});
    assert(buffer <= 100, "Enter a buffer percentage between 0 and 100.");
    assert(Array.isArray(input.rolls) && input.rolls.length >= 1 && input.rolls.length <= 12, "Enter one to twelve rolls.");
    const rolls = input.rolls.map((raw, index) => {
      const n = Number(raw);
      assert(raw !== "" && Number.isInteger(n) && n >= 0 && n <= 1e9, "Enter a valid label count for roll " + (index + 1) + ".");
      return {number:index+1, stock:n};
    }).sort((a,b) => b.stock - a.stock || a.number - b.number);
    const needed = job + setup + Math.ceil(job * buffer / 100);
    let unmet = needed;
    const plan = rolls.map(({number,stock}) => {
      const used = Math.min(stock,unmet);
      unmet -= used;
      return {number, stock, used, left:stock-used};
    });
    const stock = rolls.reduce((sum, roll) => sum + roll.stock, 0);
    const used = plan.filter((roll) => roll.used > 0).length;
    return {value: fmt(used), caption: used === 1 ? "roll to use" : "rolls to use",
      fraction: Math.min(stock/needed,1), plan, needed, stock, unmet,
      details: [["Labels required", quantity(needed)], ["Stock on hand", quantity(stock)],
        [unmet ? "Stock shortfall" : "Stock left after job", quantity(unmet || stock-needed)]],
      note: unmet ? "All usable rolls together fall short of the target." : "Use the fullest rolls first to minimize the number of rolls opened."};
  }

  if (mode === "fit") {
    const roll = dim("used", "roll outside diameter");
    const limit = dim("limit", "maximum roll diameter");
    const width = dim("width", "web width");
    const min = dim("minWidth", "minimum web width", true);
    const max = dim("maxWidth", "maximum web width");
    assert(min <= max, "Minimum width must be at or below maximum width.");
    const eps = 1e-9;
    const rollFits = roll <= limit + eps;
    const widthFits = width >= min - eps && width <= max + eps;
    const clearance = limit - roll;
    return { value: rollFits && widthFits ? "Within limits" : "Outside limits", caption: "diameter and web width check",
      fraction: null, details: [["Diameter clearance", showDim(Math.max(0, Math.abs(clearance))) + (rollFits ? " available" : " over")],
        ["Web width", widthFits ? "Within range" : "Outside range"]],
      note: "Check the core inner diameter, sensors and adapters in your printer manual before buying stock." };
  }
  throw new Error("Choose a calculator.");
}
