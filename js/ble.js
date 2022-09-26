let light_status = false;
function light(l) {
  if (serv) {
    l.classList.toggle("active");
  }
  if (!light_status) {
    light_status = true;
    document.getElementById("touran").src = "img/touranluz.png";
    send_command("posicion_on");
  } else {
    document.getElementById("touran").src = "img/touran.png";
    light_status = false;
    send_command("posicion_off");
  }
}
function send_command(comm) {
  if (serv) {
    var enc = new TextEncoder();
    serv.writeValue(enc.encode(comm));
  } else {
    onButtonClick();
  }
}
let serv;
function onButtonClick(btn) {
  // Validate services UUID entered by user first.

  navigator.bluetooth
    .requestDevice({
      filters: [{ name: "VWTOURAN" }],
    })
    .then((device) => {
      return device.gatt.connect();
    })
    .then((server) => {
      // Note that we could also get all services that match a specific UUID by
      // passing it to getPrimaryServices().
      return server.getPrimaryServices();
    })
    .then((services) => {
      let queue = Promise.resolve();
      services.forEach((service) => {
        queue = queue.then((_) => {
          service.getCharacteristic(0xffe1).then((characteristic) => {
            serv = characteristic;
            document.getElementById("connect").remove();
            document.getElementById("controls").style.display = "inherit";
          });
          service.getCharacteristic("FFE1").then((characteristic) => {
            serv = characteristic;
            document.getElementById("connect").remove();
            document.getElementById("controls").style.display = "inherit";
          });
        });
      });
      return queue;
    })
    .catch((error) => {
      alert("Argh! " + error);
    });
}

function flash(l) {
  if (serv) {
    l.classList.toggle("active");
  }
  send_command("lights_flash");
  setTimeout(() => {
    if (serv) {
      l.classList.remove("active");
    }
  }, 200);
}

/* Utils */

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return "[" + supportedProperties.join(", ") + "]";
}

function toHex(str) {
  var result = "";
  for (var i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}
