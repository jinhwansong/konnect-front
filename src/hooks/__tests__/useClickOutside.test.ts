import { fireEvent } from '@testing-library/dom';
import { renderHook } from '@testing-library/react';

import useClickOutside from '../useClickOutside';

describe('useClickOutside', () => {
  it('calls callback when clicking outside', () => {
    const mockCallback = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickOutside(ref, mockCallback));
    document.body.appendChild(ref.current!);

    fireEvent.mouseDown(document.body);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('does not call callback when clicking inside', () => {
    const mockCallback = jest.fn();
    const ref = { current: document.createElement('div') };

    renderHook(() => useClickOutside(ref, mockCallback));
    document.body.appendChild(ref.current!);

    fireEvent.mouseDown(ref.current!);
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
