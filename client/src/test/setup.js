import '@testing-library/jest-dom';
import { vi } from 'vitest';

globalThis.jest = {
    fn: vi.fn,
};
