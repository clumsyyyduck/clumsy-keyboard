// Kailh PG1316S (CPG1316S01D02) ultra low profile SMD switch.
//
// Pad geometry from the Kailh datasheet: two signal pads 1.55 x 2 mm at (+-2.5, 2.65)
// and four mounting pads 2 x 2 mm at (+-6.35, +-6). Body 13.5 x 13 mm, keycap 16 x 16 mm.
// The switch has no polarity, so the back side uses the same pad positions and nets.
//
// Soldering: reflow (solder paste + hotplate). Paste is on for the switch pads.
//
// Params:
//    side: F or B, used when reversible is false
//    reversible: pads on both sides (one PCB for both halves)
//    include_keycap: draw a 16 x 16 keycap outline on Dwgs.User
//    from / to: switch nets

module.exports = {
  params: {
    designator: 'S',
    side: 'F',
    reversible: false,
    include_keycap: true,
    from: undefined,
    to: undefined,
  },
  body: p => {
    const pads = side => `
    (pad "1" smd roundrect (at -2.5 2.65 ${p.r}) (size 1.55 2) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.15) ${p.from.str})
    (pad "2" smd roundrect (at 2.5 2.65 ${p.r}) (size 1.55 2) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.15) ${p.to.str})
    (pad "" smd roundrect (at -6.35 -6 ${p.r}) (size 2 2) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.15))
    (pad "" smd roundrect (at 6.35 -6 ${p.r}) (size 2 2) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.15))
    (pad "" smd roundrect (at -6.35 6 ${p.r}) (size 2 2) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.15))
    (pad "" smd roundrect (at 6.35 6 ${p.r}) (size 2 2) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.15))
    (fp_rect (start -6.75 -6.5) (end 6.75 6.5) (layer "${side}.Fab") (stroke (width 0.1) (type solid)) (fill none))
    (fp_rect (start -7 -6.75) (end 7 6.75) (layer "${side}.CrtYd") (stroke (width 0.05) (type solid)) (fill none))
    `
    const keycap = `
    (fp_rect (start -8 -8) (end 8 8) (layer "Dwgs.User") (stroke (width 0.15) (type solid)) (fill none))
    `
    let out = `
  (footprint "clumsy:switch_pg1316s"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}" (at 0 -4 ${p.r}) (layer "${p.side}.Fab") ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr smd)
    `
    if (p.reversible || p.side == 'F') out += pads('F')
    if (p.reversible || p.side == 'B') out += pads('B')
    if (p.include_keycap) out += keycap
    return out + `
  )
    `
  }
}
