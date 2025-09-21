
import crypto from 'node:crypto';

/*
c# base32 converter: https://olegignat.com/base32/
*/

const out_byte_size = 5;
const in_byte_size = 8; // bits in Uint8
const charset = 'acdefhjmnrtvwxyAEFHJLMNRT2345678'.split('');

export async function idGenMain() {
  console.log('~ idGenMain');
  let testInputs: [ string, string ][] = [
    [ '5dac', 'vNNa' ], // vNNa
    [ 'd5363a08', '3L4eLda' ], // 3L4eLda
    [ 'c025f369', 'TaH8j3c' ], // TaH8j3c
    [ '1111113F', 'dfnFdAe' ], // dfnFdAe
    [ '241ad744a466a7fa', 'fExxyFhfw3J8t' ],
    [ '5102b9cc850adf8685ef1e8e825b696b', '' ],
  ];
  let buf: Buffer;
  let enc: string;
  for(let i = 0; i < testInputs.length; ++i) {
    let [ currTestInput, expectedEnc ] = testInputs[i];
    buf = Buffer.from(currTestInput, 'hex');
    console.log(buf);
    enc = encodeBase32(buf);
    console.log(enc);
    console.log(enc === expectedEnc);
  }
  // buf = Buffer.from('5dac', 'hex');
  // console.log(buf);
  // enc = encodeBase32(buf);
  // console.log(enc);
  // for(let i = 0; i < buf.length; i++) {
  //   let curr = buf[i];
  //   console.log(curr.toString(2));
  //   console.log(curr & 0x3);
  //   console.log((curr & 3).toString(2));
  //   console.log('');
  // }
}

function encodeBase32(buf: Buffer<ArrayBufferLike>): string {
  let res: string;
  let i = 0;
  let bitPos = 0;
  let outBitPos = 0;
  let outByte = 0;
  let byte = buf[i];
  let outBytes: number[] = [];
  while(i < buf.length) {
    let bitsLeftInByte = Math.min(in_byte_size - bitPos, out_byte_size - outBitPos);
    outByte <<= bitsLeftInByte;
    outByte |= (byte >> (in_byte_size - (bitPos + bitsLeftInByte)));
    bitPos += bitsLeftInByte;
    if(bitPos >= in_byte_size) {
      i++;
      byte = buf[i];
      bitPos = 0;
    }
    outBitPos += bitsLeftInByte;
    if(outBitPos >= out_byte_size) {
      // drop overflow bits
      outByte &= 0x1F; // 0x1F = 00011111
      outBytes.push(outByte);
      outBitPos = 0;
    }
  }
  // Check if we have a remainder
  if(outBitPos > 0) {
    // console.log({outBitPos});
    // console.log(outByte);
    // console.log(outByte.toString(2));
    /*
      want overflow bits in least significant pos (right)
    _*/
    let overflowMask = 0x1F >> (out_byte_size - outBitPos);
    outByte &= overflowMask;
    // console.log(outByte);
    outBytes.push(outByte);
  }
  res = outBytes.reduce((acc, curr) => {
    let c = charset[curr];
    if(c === undefined) {
      throw new Error(`Unrepresented byte: ${curr}`);
    }
    return acc + c;
  }, '');
  return res;
}
