export const pages = [
  {
    mode: "reference", path: "labels-remaining", title: "Labels remaining on a roll calculator", short: "Count by reference",
    kicker: "REFERENCE ROLL", heading: "Labels remaining on a roll",
    measuring: "A roll that looks half used can have far fewer than half its labels left. The outer layers hold more labels per turn than the inner layers.",
    question: "Can I use the core size printed on the box?", answer: "Use the outside diameter of the cardboard tube. A stated printer core size is usually the inside diameter, which is smaller by two wall thicknesses.", sub: "Estimate the labels on a partial roll using a matching full roll. You only need a ruler and the original label count.",
    intent: "Use this when you have a new roll of the same stock, or a reliable record of its new diameter and label quantity.",
    example: "A roll measures 70 mm across. A matching full roll measures 100 mm, the empty core measures 32 mm across, and a full roll has 500 labels. The estimate is 215 labels remaining, about 43.2% of the full roll.",
    method: "Multiply the full label count by (current OD² − core OD²) ÷ (full OD² − core OD²), then round down. Match the stock, core and winding. Measure each diameter straight across its center.", link: "https://label.averydennison.com/na/en/home/customer-tools-na/roll-calculators",
    source: "Avery Dennison roll geometry", related: ["weight", "diameter", "run"]
  },
  {
    mode: "diameter", path: "label-roll-diameter", title: "Label roll length and count from diameter", short: "Count by diameter",
    kicker: "ROLL GEOMETRY", heading: "Label roll length and label count",
    measuring: "Use this method if your supplier lists the combined caliper or if you measured it with a micrometer. A small error in caliper affects the estimate across every layer.",
    question: "What is the difference between label width and pitch?", answer: "Width is measured across the liner. Pitch runs in the feed direction and is the distance from one label’s leading edge to the next. Enter one label’s feed length plus the gap.", sub: "Estimate web length and usable labels from measured roll dimensions, liner thickness and label spacing.",
    intent: "Use this when you know the combined caliper of the label material and liner. Measure label length in the feed direction and count the lanes across the web.",
    example: "An 80 mm roll on a 32 mm outside-diameter core with 0.16 mm combined caliper holds about 26.39 m of web. At 53 mm pitch, one lane and no unusable liner, it holds 497 whole labels.",
    method: "Web length is π × (roll OD² − core OD²) ÷ (4 × combined caliper). Subtract unusable web, divide by pitch, round down to a whole repeat, then multiply by lanes. Nominal caliper is an approximation for wound, die-cut rolls.", link: "https://label.averydennison.com/na/en/home/customer-tools-na/roll-calculators",
    source: "Avery Dennison roll calculators", related: ["reference", "weight", "fit"]
  },
  {
    mode: "weight", path: "label-count-by-weight", title: "Labels remaining by weight calculator", short: "Count by weight",
    kicker: "SCALE METHOD", heading: "Label count by weight",
    measuring: "A scale is especially useful when a roll is oval, loosely wound or too small to measure accurately. Both reference rolls should use the same core, stock and liner.",
    question: "Can I weigh a few labels instead of weighing a full roll?", answer: "A sample can help check the estimate if it includes the liner and spans many repeats. This calculator uses a known full roll and matching bare core. Count a short remainder by hand if the scale cannot resolve small differences.", sub: "Use the weight of a partial roll, a matching full roll and an empty core to estimate the remaining label count.",
    intent: "Use a scale when the wound roll is loose or difficult to measure. A matching core matters because it can make up a large share of an almost-empty roll’s weight.",
    example: "A 290 g partial roll, 520 g full roll and 60 g empty core leave 230 g of material out of 460 g. On a 500-label roll that is an estimated 250 labels.",
    method: "Subtract the empty core weight from the current and full weights. Divide those net weights and multiply by the full label count. Remove packaging and use the same weight unit for the three measurements.",
    related: ["reference", "diameter", "run"]
  },
  {
    mode: "run", path: "label-run-planner", title: "Label print run and roll inventory planner", short: "Plan a print run",
    kicker: "PRINT RUN", heading: "Label print run planner",
    measuring: "Check whether the loaded roll and unopened inventory can cover the job. The result includes both the number of new rolls to open and the number of labels left or missing after the run.",
    question: "What is the difference between setup labels and buffer?", answer: "Setup labels are a fixed allowance for alignment, test prints and calibration. Buffer is a percentage of the good labels needed to cover rejects or reprints. The planner rounds it up to a whole label.", sub: "Combine a partial roll with unopened stock, setup waste and a job buffer to see if you can finish the run.",
    intent: "Plan a single label stock per job. Count usable labels on the loaded roll and unopened rolls of that same stock. Include test prints in setup labels.",
    example: "For 1,200 good labels, a 5% buffer and 20 setup labels, budget 1,280 labels. If 215 are loaded and new rolls hold 500 each, you need three unopened rolls.",
    method: "Required labels = job labels + rounded-up buffer + setup labels. Subtract loaded stock and round up to whole unopened rolls. Stock shortfall uses all the stock you entered.",
    related: ["reference", "weight", "fit"]
  },
  {
    mode: "fit", path: "label-printer-roll-fit", title: "Label printer roll diameter and width checker", short: "Check printer fit",
    kicker: "PRINTER FIT", heading: "Label printer roll fit checker",
    measuring: "Use the media limits in the exact printer manual. Compare the full liner width and the diameter of the roll when new.",
    question: "What else should I check before ordering a roll?", answer: "Check the core inner diameter, any core adapters, the minimum label length, the liner or black-mark sensor requirements, and whether your stock is direct thermal or thermal transfer.", sub: "Compare a roll’s outside diameter and full web width with the media limits in your printer manual.",
    intent: "Use the full width of the liner or web. A printer’s maximum print width can differ from the maximum media width. Check core inner diameter and sensor support separately.",
    example: "A 100 mm diameter roll with 105 mm web width is within diameter and width limits of 127 mm and 15–108 mm. Zebra lists these limits for the ZD421 direct thermal model. Verify the exact variant and manual before ordering.",
    method: "Compare measured roll diameter to the permitted maximum and compare full web width to the published range. Limits are inclusive. This check covers two measurements only.", link: "https://www.zebra.com/us/en/products/spec-sheets/printers/desktop/zd400-series",
    source: "Zebra ZD400 series specifications", related: ["reference", "diameter", "run"]
  }
];
