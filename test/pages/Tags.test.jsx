import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Tags from '@/pages/Tags';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Mock Firebase
jest.mock('../../firebase', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn((db, collectionName, id) => `${collectionName}/${id}`),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
}));

// Mock Icons
jest.mock('@heroicons/react/24/outline', () => ({
  PlusIcon: () => <div data-testid="plus-icon" />,
  XMarkIcon: () => <div data-testid="xmark-icon" />
}));

// Mock Modal
jest.mock('@/components/common/Modal', () => 
  ({ isOpen, onClose, title, children }) => 
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
);

const mockTags = [
  { id: '1', name: 'React', color: '#61DAFB', createdAt: new Date() },
  { id: '2', name: 'Testing', color: '#FFD700', createdAt: new Date() }
];

describe('Tags Component', () => {
  beforeEach(() => {
    // Configuration des mocks
    collection.mockImplementation((db, name) => name);
    getDocs.mockResolvedValue({
      docs: mockTags.map(tag => ({
        id: tag.id,
        data: () => tag
      }))
    });
    addDoc.mockResolvedValue({ id: '3' });
    updateDoc.mockResolvedValue();
    deleteDoc.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('affiche le loading initial puis les tags', async () => {
    render(<Tags />);
    
    expect(screen.getByText('Loading tags...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading tags...')).toBeNull();
      mockTags.forEach(tag => {
        expect(screen.getByText(tag.name)).toBeInTheDocument();
      });
    });
  });

  test('crée un nouveau tag', async () => {
    render(<Tags />);
    
    await waitFor(() => screen.getByText('React'));

    fireEvent.click(screen.getByText('New Tag'));
    fireEvent.change(screen.getByPlaceholderText('Tag name...'), {
      target: { value: 'New Tag' }
    });
    fireEvent.input(screen.getByTestId('color-input'), {
      target: { value: '#ffffff' }
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Create Tag'));
    });

    expect(addDoc).toHaveBeenCalledWith('tags', {
      name: 'New Tag',
      color: '#ffffff',
      createdAt: expect.any(Date)
    });
  });

  test('supprime un tag existant', async () => {
    render(<Tags />);
    
    await waitFor(() => screen.getByText('React'));
    fireEvent.click(screen.getByText('React'));
    
    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    expect(doc).toHaveBeenCalledWith(db, 'tags', '1');
    expect(deleteDoc).toHaveBeenCalledWith('tags/1');
  });

  test('met à jour un tag', async () => {
    render(<Tags />);
    
    const reactTag = await screen.findByText('React');
    fireEvent.click(reactTag);

    fireEvent.change(screen.getByPlaceholderText('Tag name...'), {
      target: { value: 'React Updated' }
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Save Changes'));
    });

    expect(doc).toHaveBeenCalledWith(db, 'tags', '1');
    expect(updateDoc).toHaveBeenCalledWith(
      'tags/1',
      {
        name: 'React Updated',
        color: '#61DAFB'
      }
    );
  });

  test('ferme le modal après annulation', async () => {
    render(<Tags />);
    
    await waitFor(() => screen.getByText('React'));
    fireEvent.click(screen.getByText('New Tag'));
    
    await act(async () => {
      fireEvent.click(screen.getByText('Cancel'));
    });

    expect(screen.queryByText('Create New Tag')).toBeNull();
  });
});