import React from 'react';
import { rest } from 'msw';
import { MOCK_API_URL } from '../../mocks/constants';
import { server } from '../../mocks/server';
import { render } from '../../test/test-utils';
import { OrdersPage } from './OrdersPage';

describe('<OrdersPage />', () => {
  test('renders correctly', async () => {
    const { findAllByTestId } = render(<OrdersPage />);
    expect(await findAllByTestId('order-view')).toHaveLength(4);
  });

  test('renders an error if fetching of the orders fails', async () => {
    // simulate an error when fetching orders
    server.use(
      rest.get(`${MOCK_API_URL}/orders`, (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    // Suppress console errors
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const { findByText } = render(<OrdersPage />);
    const errorMessage = await findByText(/404/);
    expect(errorMessage).toBeInTheDocument();

    jest.restoreAllMocks();
  });
});
