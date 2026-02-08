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
//    useRouter: jest.fn(),
//    useLocalSearchParams: jest.fn(),
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

// Mock implementation of useRouter for tests
// Returns a mock router object with common navigation methods
export function mockUseRouter() {
  return {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  };
}

// Mock implementation of useLocalSearchParams for tests
// Returns an empty object by default, can be overridden in tests
export function mockUseLocalSearchParams(params = {}) {
  return params;
}
