function getContrastingColors(baseColor) {
  // Convertir el color base a HSL
  var baseHSL = hexToHSL(baseColor);

  // Calcular los valores de luminosidad para los colores contrastantes
  var lightness1 = baseHSL.lightness > 50 ? 0 : 100;
  var lightness2 = (baseHSL.lightness + 50) % 100;

  // Calcular los valores de matiz para los colores contrastantes
  var hueDifference = 180; // Diferencia de matiz de 180 grados para un alto contraste
  var hue1 = (baseHSL.hue + hueDifference) % 360;
  var hue2 = (baseHSL.hue - hueDifference + 360) % 360;

  // Convertir los valores de HSL de vuelta a hexadecimal
  var color1 = hslToHex(hue1, baseHSL.saturation, lightness1);
  var color2 = hslToHex(hue2, baseHSL.saturation, lightness2);

  // Devolver los colores contrastantes
  return [color1, color2];
}

function generateColorTriad(baseColor) {
  // Convertir el color base a HSL
  var baseHSL = hexToHSL(baseColor);

  // Calcular los valores de matiz para la triada
  var hue1 = baseHSL.hue + 120; // Sumar 120 para obtener el primer color de la triada
  var hue2 = baseHSL.hue - 120; // Restar 120 para obtener el segundo color de la triada

  // Asegurar que los valores de matiz estén en el rango de 0 a 360
  hue1 = (hue1 + 360) % 360;
  hue2 = (hue2 + 360) % 360;

  // Convertir los valores de matiz de vuelta a RGB
  var color1 = hslToHex(hue1, baseHSL.saturation, baseHSL.lightness);
  var color2 = hslToHex(hue2, baseHSL.saturation, baseHSL.lightness);

  // Devolver la triada de colores
  return [baseColor, color1, color2];
}

// Función auxiliar para convertir un color en formato hexadecimal a HSL
function hexToHSL(hexColor) {
  var r = parseInt(hexColor.substr(1, 2), 16) / 255;
  var g = parseInt(hexColor.substr(3, 2), 16) / 255;
  var b = parseInt(hexColor.substr(5, 2), 16) / 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);

  var h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  return {
    hue: Math.round(h * 360),
    saturation: Math.round(s * 100),
    lightness: Math.round(l * 100)
  };
}

// Función auxiliar para convertir un color en formato HSL a hexadecimal
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  var r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var hueToRGB = function hueToRGB(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hueToRGB(p, q, h + 1 / 3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1 / 3);
  }

  var toHex = function toHex(c) {
    var hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return "#" + toHex(r) + toHex(g) + toHex(b);
}
