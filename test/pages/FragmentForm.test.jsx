// Mock getClientRects car jsdom ne l'implémente pas
window.Range.prototype.getClientRects = () => {
  return {
    item: () => null,
    length: 0,
  };
};

// Mock du module firebase local (firebase.js)
jest.mock('../../firebase', () => ({
  db: {}, // mock simple de la base de données
}));

// Mock des fonctions firestore utilisées dans FragmentForm
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve()),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        { id: 'tag1', data: () => ({ name: 'React', color: '#61dafb' }) },
        { id: 'tag2', data: () => ({ name: 'JavaScript', color: '#f7df1e' }) },
      ],
    })
  ),
  serverTimestamp: jest.fn(() => 'timestamp'),
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import FragmentForm from '../../src/pages/FragmentForm';

describe('FragmentForm sans base réelle', () => {
  const onSubmitMock = jest.fn(() => Promise.resolve());
  const onCancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('affiche "New Fragment" et charge les tags mockés', async () => {
    render(<FragmentForm onSubmit={onSubmitMock} onCancel={onCancelMock} />);

    expect(screen.getByText(/New Fragment/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('React')).toBeInTheDocument());
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });
});
