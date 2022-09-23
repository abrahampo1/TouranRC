let guernica_notes = [
  6900, 7200, 7600, 7900, 8400, 8600, 8800, 8950, 9100, 9300, 9900, 10000,
  10600, 10900, 11300, 11500, 11750, 11900, 12150, 12400, 12800, 13300, 13600,
  13800,
];
function guernica(btn) {
  document.getElementById("guernica").play();
  guernica_notes.forEach((note) => {
    setTimeout(() => {
      light(btn);
    }, note);
  });
}
