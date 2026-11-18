import { calculate } from "./calculations.mjs";

const form = document.querySelector("form[data-mode]");
if (form) {
  const mode = form.dataset.mode;
  const output = document.querySelector("#result");
  const error = document.querySelector("#form-error");
  const transfer = document.querySelector("#transfer");
  const rollEntries = document.querySelector("#roll-entries");
  const addRoll = document.querySelector("#add-roll");
  const rollLimit = document.querySelector("#roll-limit");
  const batchPlan = document.querySelector("#batch-plan");
  const exportPlan = document.querySelector("#export-plan");
  const originalRollEntries = rollEntries ? Array.from(rollEntries.children, (row) => row.cloneNode(true)) : [];
  let currentPlan = null;
  const unitInputs = Array.from(form.querySelectorAll('input[name="units"]'));
  let unit = unitInputs.find((input) => input.checked)?.value ?? "mm";
  let lastCount = null;
  const element = (tag, content, cls) => {
    const node = document.createElement(tag);
    node.textContent = content;
    if (cls) node.className = cls;
    return node;
  };

  function display() {
    const data = new FormData(form);
    const current = Object.fromEntries(data);
    if (rollEntries) current.rolls = data.getAll("rollStock");
    error.hidden = true;
    try {
      const result = calculate(mode, current, unit);
      lastCount = result.remaining <= 1e9 ? result.remaining : null;
      if (transfer) transfer.hidden = lastCount === null;
      const items = [
        element("strong", result.value, /^\d/.test(result.value) ? "result-number" : "result-number result-text"),
        element("p", result.caption, "result-caption")
      ];
      if (result.fraction !== null) {
        const meter = element("div", "", "meter");
        meter.setAttribute("aria-hidden", "true");
        const bar = element("span", "");
        bar.style.width = Math.min(100, Math.max(0, result.fraction * 100)) + "%";
        meter.append(bar);
        items.push(meter);
      }
      const dl = element("dl", "");
      for (const [label, value] of result.details) {
        const row = element("div", "");
        row.append(element("dt", label), element("dd", value));
        dl.append(row);
      }
      output.replaceChildren(...items, dl, element("p", result.note, "result-note"));
      if (batchPlan) {
        currentPlan = result;
        const rows = result.plan.map(({number,stock,used,left}) => {
          const row = document.createElement("tr");
          const numberCell = element("th", String(number));
          numberCell.scope = "row";
          row.append(numberCell, ...[stock,used,left].map(n=>element("td",n.toLocaleString("en-US"))));
          return row;
        });
        batchPlan.querySelector("tbody").replaceChildren(...rows);
        batchPlan.hidden = false;
        exportPlan.hidden = false;
      }
      return true;
    } catch (problem) {
      lastCount = null;
      if (transfer) transfer.hidden = true;
      if (batchPlan) {
        currentPlan = null;
        batchPlan.hidden = true;
        exportPlan.hidden = true;
      }
      error.textContent = problem.message;
      error.hidden = false;
      output.replaceChildren(element("p", "Check your measurements to update the result.", "result-note"));
    }
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const valid = display();
    if (valid && window.matchMedia("(max-width: 720px)").matches) {
      output.closest(".output").focus({ preventScroll: true });
      output.closest(".output").scrollIntoView({ block: "nearest" });
    }
  });
  form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      if (rollEntries) {
        rollEntries.replaceChildren(...originalRollEntries.map(row => row.cloneNode(true)));
        syncRollRows();
      }
      unit = unitInputs[0]?.value ?? "mm";
      changeSuffixes();
      display();
    });
  });
  form.addEventListener("input", (event) => {
    if (event.target.name === "units") return;
    clearExport();
  });
  function clearExport() {
    if (transfer) transfer.hidden = true;
    if (exportPlan) {
      currentPlan = null;
      exportPlan.hidden = true;
    }
  }

  function syncRollRows() {
    const rows = Array.from(rollEntries.children);
    rows.forEach((row,i) => {
      const input = row.querySelector("input");
      const label = row.querySelector("label");
      const remove = row.querySelector("button");
      input.id = "roll-" + (i+1);
      label.htmlFor = input.id;
      label.firstChild.textContent = "Roll " + (i+1);
      remove.setAttribute("aria-label","Remove roll " + (i+1));
      remove.disabled = rows.length === 1;
    });
    addRoll.disabled = rows.length === 12;
    rollLimit.textContent = addRoll.disabled ? "The planner supports up to 12 rolls." : "";
  }
  if (rollEntries) {
    syncRollRows();
    addRoll.addEventListener("click", () => {
      if (addRoll.disabled) return;
      const row = originalRollEntries[0].cloneNode(true);
      const input = row.querySelector("input");
      input.value = "";
      input.defaultValue = "";
      rollEntries.append(row);
      syncRollRows();
      clearExport();
      input.focus();
    });
    rollEntries.addEventListener("click", (event) => {
      const remove = event.target.closest(".roll-remove");
      if (!remove || remove.disabled) return;
      const row = remove.closest(".roll-row");
      const focusRow = row.nextElementSibling ?? row.previousElementSibling;
      row.remove();
      syncRollRows();
      clearExport();
      focusRow?.querySelector("input").focus();
    });
    exportPlan.addEventListener("click", () => {
      if (!currentPlan) return;
      const {plan,needed,stock,unmet} = currentPlan;
      const lines = [["Labels required",needed],["Stock on hand",stock],["Stock shortfall",unmet],[],
        ["Roll","On hand","Use","Left"],...plan.map(r=>[r.number,r.stock,r.used,r.left])];
      const csv = lines.map(line=>line.join(",")).join("\r\n")+"\r\n";
      const url = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
      const link = document.createElement("a");
      link.href = url;
      link.download = "rollledger-print-plan.csv";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  }
  function changeSuffixes() {
    for (const suffix of form.querySelectorAll('[data-unit="dim"], [data-unit="mass"]')) suffix.textContent = unit;
  }
  for (const radio of unitInputs) {
    radio.addEventListener("change", () => {
      const factor = { mm: 1, in: 25.4, g: 1, oz: 28.349523125 };
      for (const suffix of form.querySelectorAll('[data-unit="dim"], [data-unit="mass"]')) {
        const input = suffix.previousElementSibling;
        const n = input.valueAsNumber;
        if (Number.isFinite(n)) input.value = String(Number((n * factor[unit] / factor[radio.value]).toPrecision(15)));
      }
      unit = radio.value;
      changeSuffixes();
      display();
    });
  }

  if (transfer) {
    transfer.addEventListener("click", () => {
      if (lastCount === null) return;
      const route = new URL(form.dataset.planner, window.location.href);
      try {
        sessionStorage.setItem("rollledger-loaded", String(lastCount));
      } catch {
        route.searchParams.set("loaded", String(lastCount));
      }
      window.location.assign(route);
    });
  }
  if (mode === "run") {
    const route = new URL(window.location.href);
    let loaded = route.searchParams.get("loaded");
    try {
      loaded ??= sessionStorage.getItem("rollledger-loaded");
      sessionStorage.removeItem("rollledger-loaded");
    } catch {
      // The URL fallback still works.
    }
    if (loaded !== null && /^\d{1,10}$/.test(loaded) && Number(loaded) <= 1e9) {
      form.elements.namedItem("loaded").value = loaded;
    }
    if (route.searchParams.has("loaded")) {
      route.searchParams.delete("loaded");
      history.replaceState(null, "", route);
    }
  }
  display();
}

const search = document.querySelector("#tool-search");
if (search) {
  const cards = Array.from(document.querySelectorAll("[data-search]"));
  const status = document.querySelector("#tool-search-status");
  search.addEventListener("input", () => {
    const words = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    for (const card of cards) card.hidden = !words.every((word) => card.dataset.search.includes(word));
    const count = cards.filter((card) => !card.hidden).length;
    status.textContent = !words.length ? "" : count === 0
      ? "No matching tools. Try “weight”, “diameter”, or “printer”."
      : count + (count === 1 ? " matching tool." : " matching tools.");
  });
}
