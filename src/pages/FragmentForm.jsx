// Import des dépendances React et Firebase
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';

// Import de CodeMirror (éditeur de code)
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

// Import d'une icône pour le bouton d'annulation
import { XMarkIcon } from '@heroicons/react/24/outline';

// Composant principal FragmentForm
const FragmentForm = ({ existingFragment, onCancel, onSubmit }) => {
  // États pour le formulaire : titre, code source, etc.
  const [title, setTitle] = useState(existingFragment?.title || '');
  const [code, setCode] = useState(existingFragment?.code || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTags, setSelectedTags] = useState(existingFragment?.tags || []);
  const [availableTags, setAvailableTags] = useState([]);

  // Chargement des tags disponibles depuis Firestore au montage du composant
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tags'));
        const tagsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableTags(tagsData); // Mise à jour des tags récupérés
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsSubmitting(true); // Active l'état de soumission

    try {
      // Préparation des données du fragment
      const fragmentData = {
        title,
        code,
        tags: selectedTags,
        createdAt: existingFragment ? existingFragment.createdAt : serverTimestamp(),
        views: existingFragment?.views || 0
      };

      // Si un fragment existe, on l'édite via onSubmit
      if (existingFragment) {
        await onSubmit(fragmentData);
      } else {
        // Sinon, on crée un nouveau fragment dans Firestore
        await addDoc(collection(db, "codeFragments"), fragmentData);
      }

      // Affichage du message de succès
      setSuccessMessage(existingFragment ? 'Fragment updated!' : 'Fragment created!');

      // Réinitialisation du formulaire après un court délai
      setTimeout(() => {
        setSuccessMessage('');
        if (!existingFragment) {
          setTitle('');
          setCode('');
          setSelectedTags([]);
        }
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage('❌ Error: ' + error.message);
    } finally {
      setIsSubmitting(false); // Fin de la soumission
    }
  };

  // Fonction pour ajouter/retirer un tag sélectionné
  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Rendu JSX du formulaire
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[#333333]">
      <div className="max-w-2xl w-full space-y-8 p-8 shadow-2xl">
        {/* Titre et bouton d'annulation */}
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-[#9A48D0]">
            {existingFragment ? 'Edit Fragment' : 'New Fragment'}
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          )}
        </div>

        {/* Message de succès ou d'erreur */}
        {successMessage && (
          <div className={`p-3 rounded-lg text-center ${
            successMessage.includes('❌') ? 'bg-red-800/30 text-red-400' : 'bg-[#7BC950] text-white'
          }`}>
            {successMessage}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Champ titre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title of the Fragment
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={50}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100"
                placeholder="Explicit title..."
                disabled={isSubmitting}
              />
            </div>

            {/* Sélecteur de tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Associated Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'opacity-100 scale-100'
                        : 'opacity-70 hover:opacity-90 scale-95 hover:scale-100'
                    }`}
                    style={{ 
                      backgroundColor: `${tag.color}40`,
                      border: `1px solid ${tag.color}`,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && (
                      <XMarkIcon className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Editeur de code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source Code
              </label>
              <CodeMirror
                value={code}
                height="300px"
                extensions={[javascript()]}
                theme="dark"
                onChange={(value) => setCode(value)}
                className="rounded-xl overflow-hidden border border-gray-600"
                placeholder="// Your code here..."
                readOnly={isSubmitting}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all ${
                isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-[#9A48D0] hover:bg-[#B288C0]'
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Sending...</span>
              ) : existingFragment ? (
                '💾 Save'
              ) : (
                'Publish'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Export du composant pour utilisation ailleurs
export default FragmentForm;
