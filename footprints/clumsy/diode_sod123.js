// SOD-123 diode (1N4148W), SMD pads on one or both sides.
//
// Pads 1.2 x 1.2 mm at +-1.7 mm. Pad 1 (cathode, marked with a bar) is the "to" net.
// No paste by default: with PG1316S the diodes sit on the side opposite the switches
// and are soldered by hand after the switches are reflowed.
//
// Params:
//    side: F or B, used when reversible is false
//    reversible: pads on both sides
//    paste: add solder paste openings
//    from / to: anode / cathode nets

module.exports = {
  params: {
    designator: 'D',
    side: 'F',
    reversible: false,
    paste: false,
    from: undefined,
    to: undefined,
  },
  body: p => {
    const pads = side => {
      const layers = `"${side}.Cu" ${p.paste ? `"${side}.Paste" ` : ''}"${side}.Mask"`
      return `
    (pad "1" smd rect (at -1.7 0 ${p.r}) (size 1.2 1.2) (layers ${layers}) ${p.to.str})
    (pad "2" smd rect (at 1.7 0 ${p.r}) (size 1.2 1.2) (layers ${layers}) ${p.from.str})
    (fp_line (start -2.6 -0.9) (end -2.6 0.9) (layer "${side}.SilkS") (stroke (width 0.15) (type solid)))
    (fp_rect (start -1.35 -0.8) (end 1.35 0.8) (layer "${side}.Fab") (stroke (width 0.1) (type solid)) (fill none))
    (fp_rect (start -2.5 -0.85) (end 2.5 0.85) (layer "${side}.CrtYd") (stroke (width 0.05) (type solid)) (fill none))
    `
    }
    let out = `
  (footprint "clumsy:diode_sod123"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}" (at 0 0 ${p.r}) (layer "${p.side}.Fab") ${p.ref_hide}
      (effects (font (size 0.8 0.8) (thickness 0.12)))
    )
    (attr smd)
    `
    if (p.reversible || p.side == 'F') out += pads('F')
    if (p.reversible || p.side == 'B') out += pads('B')
    return out + `
  )
    `
  }
}
