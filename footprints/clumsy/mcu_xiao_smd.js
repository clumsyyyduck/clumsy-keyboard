// XIAO-format nRF52840 (Seeed XIAO BLE and clones such as YUVASYN Super 52840),
// soldered flat by its castellated edge pads (reflow together with the switches).
//
// Module 21 x 17.8 mm, 2 x 7 pads, pitch 2.54 mm, rows 15.24 mm apart.
// Local frame: USB-C points to -x. Pin order (from the USB end):
//   row y = +7.62: P002 P003 P028 P029 P004 P005 P111  (XIAO D0..D6)
//   row y = -7.62: 5V   GND  3V3  P115 P114 P113 P112  (XIAO -, -, -, D10..D7)
//
// The battery (B+/B-) and RST pads are on the underside of the module. When it is soldered
// flat they face the PCB, so the footprint cuts a window under the USB end: solder short
// wires to B+ and RST before placing the module and pass them through to the other side.
// B- is GND and is already connected through the GND pin. The wires land on two
// through-hole pads past the far end of the module: "raw" (B+, after the power switch)
// and "rst" (reset button).
//
// On the back side the module is mirrored across the long axis, so the two rows swap
// nets there. USB-C stays at the same board edge.
//
// Params:
//    side: F or B, used when reversible is false
//    reversible: pads on both sides
//    window: cut the window for the underside wires
//    P002..P115, 3V3, GND, 5V, raw, rst: nets

const ROW_A = ['P002', 'P003', 'P028', 'P029', 'P004', 'P005', 'P111']
const ROW_B = ['5V', 'GND', '3V3', 'P115', 'P114', 'P113', 'P112']

module.exports = {
  params: {
    designator: 'MCU',
    side: 'F',
    reversible: false,
    window: true,
    P002: { type: 'net', value: 'P002' },
    P003: { type: 'net', value: 'P003' },
    P028: { type: 'net', value: 'P028' },
    P029: { type: 'net', value: 'P029' },
    P004: { type: 'net', value: 'P004' },
    P005: { type: 'net', value: 'P005' },
    P111: { type: 'net', value: 'P111' },
    P112: { type: 'net', value: 'P112' },
    P113: { type: 'net', value: 'P113' },
    P114: { type: 'net', value: 'P114' },
    P115: { type: 'net', value: 'P115' },
    '3V3': { type: 'net', value: '3V3' },
    GND: { type: 'net', value: 'GND' },
    '5V': { type: 'net', value: '5V' },
    raw: { type: 'net', value: 'RAW' },
    rst: { type: 'net', value: 'RST' },
  },
  body: p => {
    const pad = (side, num, x, y, net) =>
      `(pad "${num}" smd roundrect (at ${x.toFixed(2)} ${y} ${p.r}) (size 1.6 2.6) (layers "${side}.Cu" "${side}.Paste" "${side}.Mask") (roundrect_rratio 0.25) ${p[net].str})`

    const side_pads = (side, mirror) => {
      const ya = mirror ? -7.9 : 7.9
      const out = []
      for (let i = 0; i < 7; i++) {
        const x = -7.62 + 2.54 * i
        out.push(pad(side, i + 1, x, ya, ROW_A[i]))
        out.push(pad(side, i + 8, x, -ya, ROW_B[i]))
      }
      out.push(`(fp_rect (start -10.5 -8.9) (end 10.5 8.9) (layer "${side}.Fab") (stroke (width 0.1) (type solid)) (fill none))`)
      out.push(`(fp_rect (start -11.9 -4.6) (end -9.5 4.6) (layer "${side}.Fab") (stroke (width 0.1) (type solid)) (fill none))`)
      out.push(`(fp_rect (start -12.2 -9.5) (end 10.8 9.5) (layer "${side}.CrtYd") (stroke (width 0.05) (type solid)) (fill none))`)
      out.push(`(fp_line (start -10.5 -9.3) (end 10.5 -9.3) (layer "${side}.SilkS") (stroke (width 0.15) (type solid)))`)
      out.push(`(fp_line (start -10.5 9.3) (end 10.5 9.3) (layer "${side}.SilkS") (stroke (width 0.15) (type solid)))`)
      out.push(`(fp_text user "USB" (at -8 0 ${p.r + 90}) (layer "${side}.Fab") (effects (font (size 1 1) (thickness 0.15))${side == 'B' ? ' (justify mirror)' : ''}))`)
      return out.join('\n    ')
    }

    const window = `
    (fp_rect (start -9.3 -4.5) (end -2.3 4.5) (layer "Edge.Cuts") (stroke (width 0.1) (type solid)) (fill none))
    `
    const wire_pads = `
    (pad "20" thru_hole circle (at 12.5 -1.5 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.raw.str})
    (pad "21" thru_hole circle (at 12.5 1.5 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers "*.Cu" "*.Mask") ${p.rst.str})
    (fp_text user "B+" (at 14.4 -1.5 ${p.r}) (layer "F.SilkS") (effects (font (size 0.8 0.8) (thickness 0.12))))
    (fp_text user "RST" (at 14.8 1.5 ${p.r}) (layer "F.SilkS") (effects (font (size 0.8 0.8) (thickness 0.12))))
    (fp_text user "B+" (at 14.4 -1.5 ${p.r}) (layer "B.SilkS") (effects (font (size 0.8 0.8) (thickness 0.12)) (justify mirror)))
    (fp_text user "RST" (at 14.8 1.5 ${p.r}) (layer "B.SilkS") (effects (font (size 0.8 0.8) (thickness 0.12)) (justify mirror)))
    `

    let out = `
  (footprint "clumsy:mcu_xiao_smd"
    (layer "${p.side}.Cu")
    ${p.at}
    (property "Reference" "${p.ref}" (at 0 0 ${p.r}) (layer "${p.side}.Fab") ${p.ref_hide}
      (effects (font (size 1 1) (thickness 0.15)))
    )
    (attr smd)
    `
    if (p.reversible || p.side == 'F') out += side_pads('F', false) + '\n'
    if (p.reversible || p.side == 'B') out += '    ' + side_pads('B', true) + '\n'
    if (p.window) out += window
    out += wire_pads
    return out + `
  )
    `
  }
}
