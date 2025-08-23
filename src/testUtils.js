import {useFocusEffect} from 'expo-router';

export const safeAreaMetrics = {
  frame: {
    width: 320,
    height: 640,
    x: 0,
    y: 0,
  },
  insets: {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
};

// provide mock implementation of useFocusEffect to run once each time callback changes
//
// requires running this in the test file:
//
//  jest.mock('expo-router', () => ({
//    useFocusEffect: jest.fn(),
//    // ...
//  }));
export function mockUseFocusEffect() {
  let lastCallback = null;
  useFocusEffect.mockImplementation(callback => {
    if (lastCallback !== callback) {
      lastCallback = callback;
      callback();
    }
  });
}
