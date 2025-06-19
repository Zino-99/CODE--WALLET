// test/pages/Fragments.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Fragments from '../../src/pages/Fragments';

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn((ref, callback) => {
    callback({
      docs: [
        {
          id: '1',
          data: () => ({
            title: 'Fragment test 1',
            code: 'console.log("Hello World")',
            tags: ['tag1'],
            createdAt: {
              toDate: () => new Date('2023-01-01'),
            },
          }),
        },
      ],
    });
    return jest.fn(); // simulate unsubscribe
  }),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: 'tag1',
          data: () => ({ name: 'JavaScript', color: '#f7df1e' }),
        },
      ],
    })
  ),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

// Mock Clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('Fragments Component', () => {
  test('renders fragment title and tags', async () => {
    render(<Fragments />);

    expect(await screen.findByText('Fragment test 1')).toBeInTheDocument();
    expect(await screen.findByText('JavaScript')).toBeInTheDocument();
  });

  test('can open view modal on card click', async () => {
    render(<Fragments />);
    const card = await screen.findByText('Fragment test 1');
    fireEvent.click(card);

    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    );
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  test('copies code to clipboard', async () => {
    render(<Fragments />);
    const card = await screen.findByText('Fragment test 1');
    fireEvent.click(card);

    const copyButton = await screen.findByText('Copy');
    fireEvent.click(copyButton);

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'console.log("Hello World")'
      )
    );
  });
});
