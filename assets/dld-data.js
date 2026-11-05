/* So lieu 6 de on kiem tra 1 tiet Do luong dien (dang bai trong vo, phat trien tu vi du 1.17, 1.18, 1.27, 1.28).
   kind "shunt" = Cau 1: a) Shunt rieng re (hinh 3.5), b) Shunt van nang (hinh 3.6). Thang do tinh bang A.
   kind "mult"  = Cau 2: a) dien tro phu rieng re (hinh 3.17), b) dien tro phu van nang (hinh 3.18). Thang do tinh bang V.
   rg = noi tro co cau (Ω), igm = gia tri gioi han do cua co cau (A). Loi giai tinh tu dong trong assets/dld.js. */
window.DLD_SETS = [
  { id: "c1d1", cau: 1, de: 1, kind: "shunt", rg: 2000, igm: 100e-6,
    a: { ranges: [2e-3, 20e-3, 200e-3] }, b: { ranges: [1e-3, 10e-3, 100e-3] } },
  { id: "c1d2", cau: 1, de: 2, kind: "shunt", rg: 500, igm: 200e-6,
    a: { ranges: [1e-3, 5e-3, 50e-3] }, b: { ranges: [2e-3, 20e-3, 200e-3] } },
  { id: "c1d3", cau: 1, de: 3, kind: "shunt", rg: 100, igm: 1e-3,
    a: { ranges: [10e-3, 100e-3, 1] }, b: { ranges: [5e-3, 50e-3, 500e-3] } },
  { id: "c2d1", cau: 2, de: 1, kind: "mult", rg: 2000, igm: 100e-6,
    a: { ranges: [5, 25, 100] }, b: { ranges: [10, 50, 250] } },
  { id: "c2d2", cau: 2, de: 2, kind: "mult", rg: 2500, igm: 20e-6,
    a: { ranges: [2.5, 10, 50] }, b: { ranges: [10, 100, 500] } },
  { id: "c2d3", cau: 2, de: 3, kind: "mult", rg: 50, igm: 1e-3,
    a: { ranges: [3, 15, 60] }, b: { ranges: [2.5, 10, 50] } }
];
