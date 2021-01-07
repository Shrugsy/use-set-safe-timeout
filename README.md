# use-set-safe-timeout

[![version](https://img.shields.io/npm/v/use-set-safe-timeout)](https://www.npmjs.com/package/use-set-safe-timeout)
[![Build Status](https://img.shields.io/travis/shrugsy/use-set-safe-timeout)](https://travis-ci.org/shrugsy/use-set-safe-timeout)
[![codecov](https://img.shields.io/codecov/c/github/shrugsy/use-set-safe-timeout)](https://codecov.io/gh/shrugsy/use-set-safe-timeout)

A React hook that provides a version of `window.setTimeout` which clears itself on unmount. Removes the overhead of having to worry about clearing timeouts on unmount manually within your React components.

[codesandbox demo](https://codesandbox.io/s/use-set-safe-timeout-hzhjh?file=/src/App.tsx)

## Features

- Provides a callback that can be called like `window.setTimeout`.
- When called, returns a function that can be called to clear the timeout (as opposed to returning a timeout ID).
- Clears itself on unmount (hence, it's safe!).

## Installation

`npm i use-set-safe-timeout`

## Usage

### Basic Usage

```tsx
import useSetSafeTimeout from 'use-set-safe-timeout';
...
// within a component
function App() {
    const setSafeTimeout = useSetSafeTimeout();

    function handleAlert() {
        setSafeTimeout(() => {
            alert("Hello world!");
        }, 1000);
    }

    return <button onClick={handleAlert}>Click to alert in one second</button>
}
```

In the example above, clicking the button will start a timeout to alert `'Hello world!'` after 1000ms. On unmount, all pending timeouts will be cleared.

### Clearing a timeout manually

The `setSafeTimeout` function will return another function that when called, clears the corresponding timeout.

```tsx
import { useRef } from 'react';
import useSetSafeTimeout from 'use-set-safe-timeout';
...
// within a component
function App() {
    const clearLastTimeoutRef = useRef<(() => void) | null>(null);
    const setSafeTimeout = useSetSafeTimeout();

    function handleAlert() {
        clearLastTimeoutRef.current = setSafeTimeout(() => {
            alert("Hello world!");
        }, 1000);
    }

    function handleClearLatest() {
        if (clearLastTimeoutRef.current) {
            clearLastTimeoutRef.current()
        }
    }

    return (
        <div>
            <button onClick={handleAlert}>Click to alert in one second</button>
            <button onClick={handleClearLatest}>Click to clear the latest pending alert</button>
        </div>
    );
}
```

Note: If you require a different level of control over 'cleaning up', I recommend checking out my hook [use-cleanup-callback](https://www.npmjs.com/package/use-cleanup-callback), or using a plain `useEffect`.
