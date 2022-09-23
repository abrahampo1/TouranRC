let guernica_notes = [
  7000, 7200, 7600, 7900, 8400, 8600, 8800, 8950, 9100, 9300, 9900, 10000,
  10600, 10900, 11300, 11500, 11750, 11900, 12150, 12400, 12800, 13300, 13600,
  13800, 14300, 14500, 14700, 14900, 15100, 15300, 15800, 16600, 16900, 17400,
  17600, 17800, 18100, 18300, 18700, 19500, 20200, 20300, 20600, 20700,
];
let guern = false;
function guernica(btn) {
  if (!guern) {
    guern = true;
  } else {
    return;
  }
  document.getElementById("guernica").play();
  document.getElementById("guernica").onplay = function () {
    guernica_notes.forEach((note) => {
      setTimeout(() => {
        light(btn);
      }, note);
    });
    setTimeout(() => {
      btn.classList.remove("active");
      guern = false;
    }, 21000);
  };
}

let lolita_notes = [
  1300, 1800, 2100, 3100, 3600, 4400, 4600, 5000, 5200, 5500, 5900,
];
let lolita = false;
function lolitalola(btn) {
  if (!lolita) {
    lolita = true;
  } else {
    return;
  }
  document.getElementById("lolitalola").play();
  document.getElementById("lolitalola").onplay = function () {
    lolita_notes.forEach((note) => {
      setTimeout(() => {
        light(btn);
      }, note);
    });
    setTimeout(() => {
      btn.classList.remove("active");
      lolita = false;
    }, 21000);
  };
}
