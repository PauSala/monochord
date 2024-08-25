import { Fraction } from "./Point";
import * as Tone from "tone";

/**
 * Calculate the Greatest Common Divisor (GCD) of two numbers.
 * @param a - First number.
 * @param b - Second number.
 * @returns - The GCD of the two numbers.
 */
const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
};

/**
 * Simplify a fraction given as {numerator, denominator}.
 * @param fraction - The fraction to simplify.
 * @returns - The simplified fraction.
 */
export const simplifyFraction = (fraction: Fraction): Fraction => {
  const { numerator, denominator } = fraction;

  if (denominator === 0) {
    throw new Error("Denominator cannot be zero.");
  }

  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));

  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  };
};

export const substractFraction = (a: Fraction, b: Fraction): Fraction => {
  return simplifyFraction({
    numerator: a.numerator * b.denominator - b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
};

export const addFraction = (a: Fraction, b: Fraction): Fraction => {
  return simplifyFraction({
    numerator: a.numerator * b.denominator + b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
};

export const divideFraction = (a: Fraction, b: Fraction): Fraction => {
  return simplifyFraction({
    numerator: a.numerator * b.denominator,
    denominator: a.denominator * b.numerator,
  });
};

export const multiplyFraction = (a: Fraction, b: Fraction): Fraction => {
  return simplifyFraction({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
};

export const pointPosition = (
  start: Fraction,
  end: Fraction,
  fraction: Fraction
): Fraction => {
  const mid = substractFraction(end, start);
  const mult = multiplyFraction(mid, fraction);
  return addFraction(start, mult);
};

export const getSynth = () => {
  const limiter = new Tone.Limiter(-25).toDestination();
  const volume = new Tone.Volume(-20).connect(limiter);
  const synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.02,
      decay: 0.5,
      sustain: 0.5,
      release: 1,
    },
  }).connect(volume);
  return synth;
};
