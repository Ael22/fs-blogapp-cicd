import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  // executed to cleanup the jsdom which is used to simulate the browser for testing
  cleanup()
})