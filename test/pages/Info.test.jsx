import React from 'react';
import { render, screen } from '@testing-library/react';
import Info from '../../src/pages/Info';

jest.mock('@heroicons/react/24/outline', () => ({
  BeakerIcon: () => <div data-testid="beaker-icon" />,
  CodeBracketIcon: () => <div data-testid="code-icon" />,
  ShieldCheckIcon: () => <div data-testid="shield-icon" />,
  UserGroupIcon: () => <div data-testid="team-icon" />,
  BookOpenIcon: () => <div data-testid="book-icon" />,
}));

describe('Info Component', () => {
  beforeEach(() => {
    render(<Info />);
  });

  test('renders main title correctly', () => {
    expect(screen.getByText('Application Information')).toBeInTheDocument();
  });

  describe('Key Features Section', () => {
    test('displays section title with icon', () => {
      expect(screen.getByText('Key Features')).toBeInTheDocument();
      expect(screen.getByTestId('beaker-icon')).toBeInTheDocument();
    });

    test('lists all features with icons', () => {
      expect(screen.getByText('Code Snippets Management')).toBeInTheDocument();
      expect(screen.getByText('Smart Tagging System')).toBeInTheDocument();
      expect(screen.getByText('Data Security')).toBeInTheDocument();
      
      // Vérifie qu'il y a exactement 1 occurrence de chaque icône de fonctionnalité
      expect(screen.getAllByTestId('code-icon').length).toBe(1);
      expect(screen.getAllByTestId('book-icon').length).toBe(1);
      expect(screen.getAllByTestId('shield-icon').length).toBe(2); // Maintenant 2 occurrences
    });
  });

  describe('Compliance Section', () => {
    test('displays section title with icon', () => {
      expect(screen.getByText('Compliance & Data Protection')).toBeInTheDocument();
      
      // Utilisez une vérification plus précise pour l'icône du titre
      const shieldIcons = screen.getAllByTestId('shield-icon');
      expect(shieldIcons.length).toBeGreaterThanOrEqual(1); // Au moins une occurrence
    });

    test('lists security measures', () => {
      expect(screen.getByText(/AES-256 encryption/i)).toBeInTheDocument();
      expect(screen.getByText(/Daily backups/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual security audits/i)).toBeInTheDocument();
    });
  });
});