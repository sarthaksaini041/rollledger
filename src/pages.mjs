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
    mode: "size", path: "label-roll-size-calculator", title: "Label roll diameter from label count", short: "Size a roll",
    kicker: "ROLL DIAMETER", heading: "Calculate the diameter of a label roll",
    sub: "Estimate the finished roll diameter for a target label count, core outside diameter, combined caliper and pitch.",
    intent: "Use this to size a new roll when you know how many labels it needs to hold.",
    example: "At 53 mm pitch and 0.16 mm combined caliper, 500 labels in one lane require 26.5 m of liner. On a 32 mm core the estimated finished roll diameter is 80.14 mm.",
    measuring: "Use the outside diameter of the empty core and the complete stock thickness including liner. Allow some headroom below the printer’s maximum roll diameter.",
    question: "What if the target is not divisible by the number of lanes?",
    answer: "The tool rounds up to the next complete repeat. For 501 labels and two lanes, the roll needs 251 repeats and has 502 label positions.",
    method: "Divide target labels by labels across and round up. Multiply by label pitch, add unused liner, then take the square root of core OD² + 4 × caliper × liner length ÷ π.",
    link: "https://label.averydennison.com/na/en/home/customer-tools-na/roll-calculators.html",
    source: "Avery Dennison roll geometry", related: ["diameter", "fit", "reference"]
  },
  {
    mode: "batch", path: "multi-roll-label-planner", title: "Multi-roll label stock planner", short: "Combine rolls",
    kicker: "MULTIPLE ROLLS", heading: "Plan a print run across partial rolls",
    sub: "Enter the usable label count on each matching roll to see which rolls to use, how many labels to take, and whether stock falls short.",
    intent: "Use this when your stock is split across several rolls of the same label size and material.",
    example: "A 950-label job with a 5% buffer and 20 setup labels needs 1,018 labels. Rolls with 540, 470 and 180 labels together cover it and leave 172 labels on hand.",
    measuring: "Estimate each roll with the reference or weight calculator. Record the roll number so the planned order still matches the physical rolls.",
    question: "Why does it recommend the fullest rolls first?",
    answer: "Taking the biggest available counts first covers the target with the fewest rolls. If you need to use a specific roll first, count that roll separately and plan the remainder here.",
    method: "Add job labels, rounded-up buffer, and fixed setup waste. Sort the available rolls by usable count, then allocate labels from the fullest until the target is covered.",
    related: ["reference", "weight", "run"]
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
