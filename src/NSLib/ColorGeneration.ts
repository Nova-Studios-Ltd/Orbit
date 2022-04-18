function GetRandomInt(min: number, max: number) : number {
  const mmin = Math.ceil(min);
  const mmax = Math.floor(max);
  return Math.floor(Math.random() * (mmax - mmin) + mmin); //The maximum is exclusive and the minimum is inclusive
}

function HslToHex(h: number, s: number, l: number) : string{
  const ll = l / 100;
  const a = s * Math.min(ll, 1 - ll) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate a HEX color string
 * @param lightness Optional lightness value (default: 75)
 * @returns A HEX string containing a color
 */
export default function GenerateRandomColor(lightness: number = 75) : string {
  return HslToHex(GetRandomInt(0, 360), GetRandomInt(80, 100), lightness);
}

