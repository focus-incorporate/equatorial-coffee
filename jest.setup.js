/**
 * Jest Setup File for Equatorial Coffee Website
 * 
 * Sets up testing environment with required global mocks
 * and extends expect with custom matchers.
 */
import '@testing-library/jest-dom';

// Mock IntersectionObserver which isn't available in test environment
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    this.observedEntries = [];
  }

  observe(element) {
    this.elements.add(element);
    this.observedEntries.push({
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: element.getBoundingClientRect(),
      isIntersecting: true,
      rootBounds: null,
      target: element,
      time: Date.now(),
    });

    this.callback(this.observedEntries);
  }

  unobserve(element) {
    this.elements.delete(element);
    const indexOfElement = this.observedEntries.findIndex(
      (entry) => entry.target === element
    );
    if (indexOfElement >= 0) {
      this.observedEntries.splice(indexOfElement, 1);
    }
  }

  disconnect() {
    this.elements.clear();
    this.observedEntries = [];
  }
}

// Mock Match Media
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
  }

  unobserve(element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }
}

// Mock PointerEvent
class MockPointerEvent extends Event {
  constructor(type, props) {
    super(type, props);
    Object.assign(this, props);
  }
}

// Assign mocks to global
global.IntersectionObserver = MockIntersectionObserver;
global.ResizeObserver = MockResizeObserver;
global.PointerEvent = MockPointerEvent;

// Mock WebGL context for Three.js
HTMLCanvasElement.prototype.getContext = jest.fn(() => {
  return {
    canvas: {},
    getExtension: () => true,
    createBuffer: jest.fn(),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    enable: jest.fn(),
    createProgram: jest.fn(() => {
      return {
        attach: jest.fn(),
        link: jest.fn(),
        use: jest.fn(),
      };
    }),
    getShaderPrecisionFormat: jest.fn(() => {
      return { precision: 1 };
    }),
    getParameter: jest.fn(() => {
      return {};
    }),
  };
});

// Suppress console errors during tests - useful for expected errors
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
    args[0]?.includes?.('Warning: ReactDOM.render has not been supported')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Extend Jest matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
