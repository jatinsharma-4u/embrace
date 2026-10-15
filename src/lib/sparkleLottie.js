// A tiny hand-authored Lottie: three gold four-point stars that twinkle.
// Generated in code so it adds ~1KB instead of shipping a JSON asset.

const kf = (t, s, last = false) =>
  last
    ? { t, s }
    : { t, s, i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } }

const kf3 = (t, s, last = false) =>
  last
    ? { t, s }
    : { t, s, i: { x: [0.4, 0.4, 0.4], y: [1, 1, 1] }, o: { x: [0.6, 0.6, 0.6], y: [0, 0, 0] } }

function star(ind, x, y, size, delay, color) {
  const d = delay
  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: `star${ind}`,
    sr: 1,
    ks: {
      o: { a: 1, k: [kf(d, [0]), kf(d + 12, [100]), kf(d + 48, [100]), kf(d + 66, [0], true)] },
      r: { a: 1, k: [kf(d, [-30]), kf(d + 66, [45], true)] },
      p: { a: 0, k: [x, y, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [kf3(d, [0, 0, 100]), kf3(d + 18, [110, 110, 100]), kf3(d + 30, [90, 90, 100]), kf3(d + 66, [0, 0, 100], true)] },
    },
    ao: 0,
    shapes: [
      {
        ty: 'gr',
        nm: 'g',
        it: [
          {
            ty: 'sr',
            nm: 's',
            sy: 1,
            d: 1,
            pt: { a: 0, k: 4 },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 },
            ir: { a: 0, k: size * 0.2 },
            is: { a: 0, k: 0 },
            or: { a: 0, k: size },
            os: { a: 0, k: 0 },
          },
          { ty: 'fl', nm: 'f', c: { a: 0, k: color }, o: { a: 0, k: 100 }, r: 1 },
          {
            ty: 'tr',
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
          },
        ],
      },
    ],
    ip: 0,
    op: 120,
    st: 0,
    bm: 0,
  }
}

const gold = [0.94, 0.8, 0.5, 1]
const pale = [1, 0.95, 0.82, 1]

export const sparkleAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: 'sparkle',
  ddd: 0,
  assets: [],
  layers: [star(1, 100, 100, 56, 0, gold), star(2, 150, 58, 22, 22, pale), star(3, 52, 146, 18, 40, gold)],
}
