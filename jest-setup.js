// Axios 1.15+ fetch adapter calls ReadableStream.cancel() on a locked stream
// during feature detection, which crashes with Expo's ReadableStream polyfill.
// Patch cancel to be a no-op when the stream is locked.
if (typeof ReadableStream !== 'undefined') {
  const origCancel = ReadableStream.prototype.cancel;
  ReadableStream.prototype.cancel = function (...args) {
    if (this.locked) return Promise.resolve();
    return origCancel.apply(this, args);
  };
}

// eslint-disable-next-line no-undef
jest.mock('expo-font');
