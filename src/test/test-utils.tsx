import React, { ReactElement, Suspense } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary, Loading } from '../components';
import { EnvProvider } from '../contexts';

// -----------------------------------------------------------------------------
// This file re-exports everything from React Testing Library and then overrides
// its render method. In tests that require global context providers, import
// this file instead of React Testing Library.
//
// For further details, see:
// https://testing-library.com/docs/react-testing-library/setup/#custom-render
// -----------------------------------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // force queries to fail fast during tests, otherwise jest and
      // React Testing Library will hit their timeouts
      retry: false,
    },
  },
});

const AllProviders: React.FC = ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <EnvProvider>
          <QueryClientProvider client={queryClient}>
            <Router>{children}</Router>
          </QueryClientProvider>
        </EnvProvider>
      </ErrorBoundary>
    </Suspense>
  );
};

/**
 * Custom render method that includes global context providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: AllProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
