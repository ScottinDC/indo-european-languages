export const manifest = {
  screens: {
    scr_9ly0ly: { name: "Floating panel", route: "/", state: { "layout": "floating" }, position: { "x": 160, "y": 220 } },
    scr_t95vj2: { name: "Docked sidebar", route: "/", state: { "layout": "sidebar" }, position: { "x": 1560, "y": 220 } }
  },
  sections: {
    sec_nf1d7s: { name: "Navigation layout", x: 0, y: 0, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "section", id: "sec_nf1d7s", children: [
    { kind: "screen", id: "scr_9ly0ly" },
    { kind: "screen", id: "scr_t95vj2" }]
  }]

};