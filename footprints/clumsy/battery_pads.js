// Two through-hole pads for a LiPo with bare wires (no connector), e.g. 502030 250 mAh.
// Pads 2.54 mm apart, marked "+" and "-" on both sides.
//
// Params:
//    pos / neg: battery nets

module.exports = {
  params: {
    designator: 'BT',
    side: 'F',
    pos: { type: 'net', value: 'BAT_P' },
    neg: { type: 'net', value: 'GND' },
  },
  body: p => {
    const label = (side, text, x) =>
      `(fp_text user "${text}" (at ${x} -2 ${p.r}) (layer "${side}.SilkS") (effects (font (size 1 1) (thickness 0.15))${side == 'B' ? ' (justify mirror)' : ''}))`
    return `
  (footprint "clumsy:battery_pads"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}" (at 0 2.2 ${p.r}) (layer "${p.side}.Fab") ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr through_hole)
    (pad "1" thru_hole rect (at -1.27 0 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.pos.str})
    (pad "2" thru_hole circle (at 1.27 0 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.neg.str})
    ${label('F', '+', -1.27)}
    ${label('F', '-', 1.27)}
    ${label('B', '+', -1.27)}
    ${label('B', '-', 1.27)}
  )
    `
  }
}
