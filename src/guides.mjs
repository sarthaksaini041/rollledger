export const guides = [
  {
    path: "method",
    title: "How to measure a label roll",
    description: "Measure roll outside diameter, empty core diameter, media width and weight for a more useful label inventory estimate.",
    sections: [
      ["Measure through the center", "Use a ruler or caliper across the round end of the roll. Take the measurement through the center with the ruler perpendicular to the axis. If the roll is visibly oval, take two readings at right angles and use the weight method when the difference is material."],
      ["Record the empty core’s outside diameter", "In the count and length tools, use the outside edge of the bare tube. If only the hole diameter and wall thickness are known, add twice the wall thickness. For a 25.4 mm hole and 3 mm wall, the core outside diameter is 31.4 mm."],
      ["Match your reference roll", "If the stock carton lists 500 labels per roll, measure a new roll of the same product and core. Record the diameter and full count together. For the scale method, remove sleeves and packaging and weigh a matching bare core separately."],
      ["Allow for unusable stock", "Leave a margin for a loose wind, splices, missing labels or unusable liner near the core. Enter the liner waste in the roll length calculator or budget setup and reprints in the print-run planner."]
    ],
    tools: ["reference", "weight", "run"],
    sources: [["Avery Dennison roll calculators", "https://label.averydennison.com/na/en/home/customer-tools-na/roll-calculators.html"]]
  },
  {
    path: "label-core-id-vs-od",
    title: "Label roll core ID vs. OD",
    description: "Learn when to use the inner or outer diameter of a label roll core, with a conversion example and a printer media checklist.",
    sections: [
      ["Core ID is the opening", "The core inner diameter measures the hole that fits over a media holder or spindle. A printer manual may specify different diameters supported by standard holders and optional adapters."],
      ["Core OD is the outside of the empty tube", "The outer diameter measures the tube from outside edge to outside edge. Use it when calculating the area available for wound labels. A 1-inch hole (25.4 mm) and two 3 mm walls give a core OD of 31.4 mm. Weigh or measure the actual core when its wall thickness is unknown."],
      ["The wound roll has its own OD", "The roll outside diameter includes all remaining stock. A 31.4 mm core and an 80 mm wound roll have different diameters. Printer maximum roll OD refers to the second dimension, and applies to a new roll at its largest."],
      ["Check the liner width separately", "Media width spans the entire liner. Use that value for the printer fit check, even when the printed portion of the label is narrower. Verify the exact model and holder before ordering."]
    ],
    tools: ["reference", "diameter", "fit"],
    sources: [["Zebra ZD400 media specifications", "https://www.zebra.com/us/en/products/spec-sheets/printers/desktop/zd400-series.html"], ["Avery Dennison roll definitions", "https://label.averydennison.com/na/en/home/customer-tools-na/roll-calculators.html"]]
  },
  {
    path: "label-pitch-and-gap",
    title: "How to measure label pitch and gap",
    description: "Work out label pitch, gap and labels across for converting wound liner length to whole labels per roll.",
    sections: [
      ["Measure pitch in the feed direction", "Pitch is the distance between the leading edges of adjacent labels. It includes the length of one label and the gap after it. A 50 mm label with a 3 mm gap has a 53 mm pitch."],
      ["Use several repeats for small gaps", "Measure from the leading edge of the first label to the leading edge of the eleventh, then divide by ten. This avoids treating small gaps as a single ruler reading. Convert to a common unit before using the calculator."],
      ["Count complete repeats and lanes", "With 1.00 m of usable liner and a 53 mm pitch, the roll has 18 complete repeats. Two lanes of aligned labels produce 36 labels. For staggered or irregular labels, count a complete repeating pattern and check the result against a physical sample."],
      ["Set aside the leader and trailer", "Deduct any plain liner at the beginning or end before dividing by pitch. For continuous stock, enter a zero gap and use the intended cut length as your repeat. Check cut accuracy against the printer or applicator settings."]
    ],
    tools: ["diameter", "run", "fit"],
    sources: []
  }
];
