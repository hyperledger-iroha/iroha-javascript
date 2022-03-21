import { encodeI64, decodeI64, encodeFactory, trackableCodec, Decode } from '@scale-codec/definition-runtime';
import { f64StrToBigint, bigintToF64Str } from '@iroha2/i64-fixnum';

const PRECISION = 9;

const encoder = encodeFactory<string>(
    (value, walker) => {
        encodeI64(f64StrToBigint(value, PRECISION), walker);
    },
    // i64 is always fixed 8-bytes len
    () => 8,
);

const decoder: Decode<string> = (walker) => {
    const bi = decodeI64(walker);
    return bigintToF64Str(bi, PRECISION);
};

type FixedPointI64P9 = string;

const FixedPointI64P9 = trackableCodec<string>('FixedPointI64P9', encoder, decoder);

export { FixedPointI64P9 };
