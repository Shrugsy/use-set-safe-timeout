import { renderHook } from "@testing-library/react-hooks";
import useSetSafeTimeout from "./";

jest.useFakeTimers();

describe("useSetSafeTimeout", () => {
  test("provides a callback that allows using a timeout", () => {
    const mockCallback = jest.fn(() => {});

    const { result } = renderHook(() => useSetSafeTimeout());
    const setSafeTimeout = result.current;

    expect(mockCallback).not.toHaveBeenCalled();

    // set timeout for mockCallback to be called in 1000ms
    setSafeTimeout(mockCallback, 1000);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(999);
    expect(mockCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test("does not call the callback if hook unmounts", () => {
    const mockCallback = jest.fn(() => {});

    const { result, unmount } = renderHook(() => useSetSafeTimeout());
    const setSafeTimeout = result.current;
    expect(mockCallback).not.toHaveBeenCalled();

    // set timeout for mockCallback to be called in 1000ms
    setSafeTimeout(mockCallback, 1000);

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockCallback).not.toHaveBeenCalled();

    // unmount, no further timeouts should trigger
    unmount();
    jest.advanceTimersByTime(500);

    // despite the correct time passing, should not be called due to cleaning up on unmount
    expect(mockCallback).not.toHaveBeenCalled();

    // ensure none are remaining
    jest.runAllTimers();
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("can set multiple timeouts, and clears any pending on unmount", () => {
    const mockCallback0 = jest.fn(() => {});
    const mockCallback1 = jest.fn(() => {});
    const mockCallback2 = jest.fn(() => {});
    const mockCallback3 = jest.fn(() => {});

    const { result, unmount } = renderHook(() => useSetSafeTimeout());
    const setSafeTimeout = result.current;

    expect(mockCallback0).not.toHaveBeenCalled();
    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).not.toHaveBeenCalled();

    // set timeout for mockCallbacks 0 & 1 to be called in 500ms & 1000ms respectively
    setSafeTimeout(mockCallback0, 500);
    setSafeTimeout(mockCallback1, 1000);
    setSafeTimeout(mockCallback2, 1500);

    expect(mockCallback0).not.toHaveBeenCalled();
    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockCallback0).toHaveBeenCalledTimes(1);
    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);
    expect(mockCallback0).toHaveBeenCalledTimes(1);
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).not.toHaveBeenCalled();

    setSafeTimeout(mockCallback3, 500);

    // unmount, no further timeouts should trigger
    unmount();
    jest.advanceTimersByTime(500);
    // despite the correct time passing, should not be called due to cleaning up on unmount
    expect(mockCallback0).toHaveBeenCalledTimes(1);
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).not.toHaveBeenCalled();

    // ensure none are remaining
    jest.runAllTimers();
    expect(mockCallback0).toHaveBeenCalledTimes(1);
    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).not.toHaveBeenCalled();
  });

  test("setSafeTimeout returns a function that cancels it's own pending timeout", () => {
    const mockCallback = jest.fn(() => {});

    const { result } = renderHook(() => useSetSafeTimeout());
    const setSafeTimeout = result.current;

    const cancel = setSafeTimeout(mockCallback, 1000);
    expect(mockCallback).not.toHaveBeenCalled();

    cancel();
    jest.advanceTimersByTime(1000);
    // timeout should not trigger since `cancel` function was called
    expect(mockCallback).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("returned function has a stable reference", () => {
    const mockCallback = jest.fn(() => {});

    const { result, rerender } = renderHook(() => useSetSafeTimeout());
    const setSafeTimeout = result.current;

    setSafeTimeout(mockCallback, 1000);

    // function reference should be the same even after timers trigger
    jest.runAllTimers();
    expect(setSafeTimeout).toEqual(result.current);

    // function reference should be the same even after re-rendering
    rerender();
    expect(setSafeTimeout).toEqual(result.current);
  });
});
