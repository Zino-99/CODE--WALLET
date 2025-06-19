// Import des dépendances React et Firebase
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Import de l'instance Firestore
import {
  collection, getDocs, addDoc,
  doc, updateDoc, deleteDoc
} from 'firebase/firestore';

// Import des icônes et composants
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/common/Modal';

// Composant principal de gestion des tags
const Tags = () => {
  const [tags, setTags] = useState([]); // Liste des tags
  const [isModalOpen, setIsModalOpen] = useState(false); // État modal ouverte/fermée
  const [selectedTag, setSelectedTag] = useState(null); // Tag sélectionné pour modification
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  // Chargement initial des tags depuis Firestore
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tags'));
        const tagsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags(); // Appel de la fonction au chargement
  }, []);

  // Enregistrement (création ou mise à jour) d’un tag
  const handleSaveTag = async (tagData) => {
    try {
      if (selectedTag) {
        // Mise à jour d’un tag existant
        const tagRef = doc(db, 'tags', selectedTag.id);
        await updateDoc(tagRef, tagData);
        setTags(tags.map(tag =>
          tag.id === selectedTag.id ? { ...tag, ...tagData } : tag
        ));
      } else {
        // Création d’un nouveau tag
        const docRef = await addDoc(collection(db, 'tags'), {
          ...tagData,
          createdAt: new Date()
        });
        setTags([...tags, { id: docRef.id, ...tagData }]);
      }
      setIsModalOpen(false); // Ferme le modal après enregistrement
    } catch (error) {
      console.error('Error saving tag:', error);
    }
  };

  // Suppression d’un tag
  const handleDeleteTag = async () => {
    if (!selectedTag) return;
    try {
      await deleteDoc(doc(db, 'tags', selectedTag.id));
      setTags(tags.filter(tag => tag.id !== selectedTag.id));
      setIsModalOpen(false); // Ferme le modal après suppression
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  // Rendu JSX
  return (
    <div className="min-h-screen bg-[#333333] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Titre et bouton de création */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#9A48D0]">Tags Management</h1>
          <button
            onClick={() => {
              setSelectedTag(null); // Réinitialise la sélection
              setIsModalOpen(true); // Ouvre le modal
            }}
            className="bg-[#9A48D0] hover:bg-[#B288C0] text-white px-6 py-2 rounded-xl flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            New Tag
          </button>
        </div>

        {/* Chargement ou affichage des tags */}
        {loading ? (
          <div className="text-center text-gray-400">Loading tags...</div>
        ) : (
          <div className="grid grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
            {tags.map(tag => (
              <div
                key={tag.id}
                onClick={() => {
                  setSelectedTag(tag);
                  setIsModalOpen(true); // Ouvre le modal pour modification
                }}
                className="p-4 rounded-xl cursor-pointer transition-all hover:brightness-90 flex items-center justify-center"
                style={{
                  backgroundColor: tag.color,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' // Ombre pour lisibilité
                }}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className="text-lg font-semibold"
                    style={{
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)', // Contour sombre
                      color: '#ffffff' // Texte blanc
                    }}
                  >
                    {tag.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal pour création/modification */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedTag ? 'Edit Tag' : 'Create New Tag'}
        >
          <TagForm
            tag={selectedTag}
            onSave={handleSaveTag}
            onDelete={selectedTag ? handleDeleteTag : null}
          />
        </Modal>
      </div>
    </div>
  );
};

// Formulaire pour créer ou modifier un tag
const TagForm = ({ tag, onSave, onDelete }) => {
  const [name, setName] = useState(tag?.name || '');
  const [color, setColor] = useState(tag?.color || '#9A48D0');

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      color
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Champ nom du tag */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tag Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100"
          placeholder="Tag name..."
        />
      </div>

      {/* Sélecteur de couleur */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Color
        </label>
        <input
          type="color"
          value={color}
          data-testid="color-input"
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-12 bg-gray-700 rounded-xl cursor-pointer"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-between">
        {/* Bouton suppression */}
        <div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </button>
          )}
        </div>

        {/* Boutons annuler et sauvegarder */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => onSave(null)} // Ferme sans sauvegarder
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#9A48D0] hover:bg-[#B288C0] text-white rounded-xl"
          >
            {tag ? 'Save Changes' : 'Create Tag'}
          </button>
        </div>
      </div>
    </form>
  );
};

// Export du composant principal
export default Tags;
