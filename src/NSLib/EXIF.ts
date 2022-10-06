function MapUintA(numbers: number[]) : Uint8Array {
  const buffer = new Uint8Array(numbers.length);
  for (let i = 0; i < numbers.length; i++) {
    buffer[i] = numbers[i];
  }
  return buffer;
}

function IsEqual(bufferA: Uint8Array, bufferB: Uint8Array) : boolean {
  if (bufferA.length !== bufferB.length) return false;
  for (let i = 0; i < bufferA.length; i++) {
    if (bufferA[i] !== bufferB[i]) return false;
  }
  return true;
}

function splitIntoSegments(data: Uint8Array) : Uint8Array[] {
  let head = 2;
  let segments = [MapUintA([0xff, 0xd8])];
  while (true) {
    if (IsEqual(data.slice(head, head + 2), MapUintA([0xff, 0xda]))) {
      segments.push(data.slice(head));
      break;
    }
    else {
      let length = unpack(">H", data.slice(head + 2, head + 4))[0];
      let endpoint = head + length + 2;
      segments.push(data.slice(head, endpoint));
      head = endpoint;
    }

    if (head >= data.length) {
      throw new Error("Wrong JPEG data.");
    }
  }
  return segments;
}

function unpack(mark: string, data: Uint8Array) : number[] {
  let l = 0;
  for (let markPointer = 1; markPointer < mark.length; markPointer++) {
    if (mark[markPointer].toLowerCase() === "b") {
      l += 1;
    }
    else if (mark[markPointer].toLowerCase() === "h") {
      l += 2;
    }
    else if (mark[markPointer].toLowerCase() === "l") {
      l += 4;
    }
    else {
      throw new Error("'unpack' error. Got invalid mark.");
    }
  }

  if (l !== data.length) {
    throw new Error("'unpack' error. Mismatch between symbol and string length. " + l + ":" + data.length);
  }

  let littleEndian = false;
  if (mark[0] === "<") {
    littleEndian = true;
  }
  else if (mark[0] === ">") {
    littleEndian = false;
  }
  else {
    throw new Error("'unpack' error.");
  }

  let unpacked = [] as number[];
  let pointer = 0;
  let p = 1;
  let val: number;
  let c: string;
  let length: number;
  let sliced: Uint8Array;

  // eslint-disable-next-line no-cond-assign
  while (c = mark[p]) {
    if (c.toLowerCase() === "b") {
      length = 1;
      sliced = data.slice(pointer, pointer + length);
      val = sliced[0];
      if ((c === "b") && (val >= 0x80)) {
        val -= 0x100;
      }
    }
    else if (c === "H") {
      length = 2;
      sliced = data.slice(pointer, pointer + length);
      if (littleEndian) {
        sliced = sliced.reverse();
      }
      val = sliced[0] * 0x100 + sliced[1];
    }
    else if (c.toLowerCase() === "l") {
      length = 4;
      sliced = data.slice(pointer, pointer + length);
      if (littleEndian) {
        sliced = sliced.reverse();
      }
      val = sliced[0] * 0x1000000 + sliced[1] * 0x10000 + sliced[2] * 0x100 + sliced[3];
      if ((c === "l") && (val >= 0x80000000)) {
        val -= 0x100000000;
      }
    }
    else {
      throw new Error("'unpack' error. " + c);
    }

    unpacked.push(val);
    pointer += length;
    p += 1;
  }
  return unpacked;
}

function JoinUint8Arrays(arrays: Uint8Array[]) : Uint8Array {
  // Calculate max size
  let finalSize = 0;
  arrays.forEach((array) => {
    finalSize += array.length;
  });

  // Combine buffers
  const buffer = new Uint8Array(finalSize);
  let offset = 0;
  arrays.forEach((array) => {
    buffer.set(array, offset);
    offset += array.length;
  });

  return buffer;
}

/**
 * Removes EXIF metadata from a image
 * @param image Uint8Array containing the image content
 * @returns Uint8Array with EXIF metadata removed
 */
export function RemoveEXIF(image: Uint8Array) : Uint8Array {
  if (!IsEqual(image.slice(0, 2), MapUintA([0xff, 0xd8]))) {
    return image;
  }

  const segments = splitIntoSegments(image);
  const newSegs = segments.filter((seg) => {
    return !(IsEqual(seg.slice(0, 2), MapUintA([0xff, 0xe1])) && IsEqual(seg.slice(4, 10), MapUintA([0x45, 0x78, 0x69, 0x66, 0x00, 0x00])));
  });

  return JoinUint8Arrays(newSegs);
}
