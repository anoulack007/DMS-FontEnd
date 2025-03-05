
export function encode(input: string) {
  try {
    if (!input) {
      console.warn('Encoding empty input');
      return '';
    }

    // Simply return the input ID for URL
    return input;
  } catch (err) {
    console.error('Encoding error:', err);
    return '';
  }
}

export function decode(input: string) {
  try {
    if (!input) {
      console.warn('Decoding empty input');
      return '';
    }

    // Simply return the input ID
    return input;
  } catch (err) {
    console.error('Decoding error:', err);
    return '';
  }
}