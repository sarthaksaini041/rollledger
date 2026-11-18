const diameter = (key, label, value, hint) => ({key, label, value, hint, unit: "dim"});
const amount = (key, label, value, hint, unit = "labels") => ({key, label, value, hint, unit});
export const fields = {
  reference: [
    diameter("used", "Current roll diameter", 70, "Across the partial roll, through the center."),
    diameter("full", "Full roll diameter", 100, "Across a new roll of the same stock."),
    diameter("core", "Empty core outside diameter", 32, "Measure across the outside of the tube."),
    amount("original", "Labels on a full roll", 500, "Use the count on the carton or product spec.")
  ],
  diameter: [
    diameter("used", "Current roll diameter", 80, "Measure across the roll through the center."),
    diameter("core", "Empty core outside diameter", 32, "Measure across the outside of the tube."),
    diameter("thickness", "Combined caliper", 0.16, "Include the label, adhesive and liner."),
    diameter("label", "Label length in feed direction", 50, "Measure in the direction the roll unwinds."),
    diameter("gap", "Gap between labels", 3, "Enter zero for continuous, gapless stock."),
    amount("lanes", "Labels across the web", 1, "The number of side-by-side labels per repeat.", "lanes"),
    diameter("waste", "Unusable liner length", 0, "Allow for leaders, trailers or other unusable web.")
  ],
  weight: [
    amount("usedMass", "Current roll weight", 290, "Remove bags and wrappers before weighing.", "mass"),
    amount("fullMass", "Full roll weight", 520, "Use a new roll of the same stock.", "mass"),
    amount("coreMass", "Empty core weight", 60, "Weigh a bare matching core.", "mass"),
    amount("original", "Labels on a full roll", 500, "Use the count on the carton or product spec.")
  ],
  run: [
    amount("job", "Good labels required", 1200, "Enter the usable output your job needs."),
    amount("loaded", "Labels on the loaded roll", 215, "Use a count from one of the stock tools."),
    amount("perRoll", "Labels per unopened roll", 500, "Use the same label stock for the whole job."),
    amount("available", "Unopened rolls on hand", 2, "Count only rolls with the same label stock.", "rolls"),
    amount("buffer", "Extra job buffer", 5, "A percentage of the good labels required.", "%"),
    amount("setup", "Setup and test labels", 20, "Budget these in addition to the buffer.")
  ],
  fit: [
    diameter("used", "Roll outside diameter", 100, "Measure across the roll through the center."),
    diameter("limit", "Printer max. roll diameter", 127, "Default example: Zebra ZD421 direct thermal."),
    diameter("width", "Web width", 105, "Include the liner across its full width."),
    diameter("minWidth", "Printer min. media width", 15, "Copy the lower limit from the printer manual."),
    diameter("maxWidth", "Printer max. media width", 108, "Use the media width, as distinct from print width.")
  ]
};
