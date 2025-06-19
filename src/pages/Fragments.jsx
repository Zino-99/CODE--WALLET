import React, { Fragment, useEffect, useState } from 'react';

// Configuration Firebase
import { db } from '../../firebase'; 
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';

// Composants UI
import CodeMirror from '@uiw/react-codemirror'; // Éditeur de code
import { Dialog, Transition } from '@headlessui/react'; // Modales animées
import { javascript } from '@codemirror/lang-javascript';

// Icônes
import { PencilSquareIcon, TrashIcon, EyeIcon, XMarkIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import FragmentForm from './FragmentForm';

/*
 * Composant principal `Fragments`
 * -------------------------------
 * Ce composant affiche, édite, copie et supprime des fragments de code stockés dans Firestore.
 * Il permet aussi de visualiser les fragments dans des modales, de filtrer les tags associés,
 * et d’éditer les métadonnées via un formulaire.
 */

const Fragments = () => {
  // Stocke la liste des fragments de code
  const [fragments, setFragments] = useState([]);
  // Liste complète des tags disponibles
  const [availableTags, setAvailableTags] = useState([]);
  // Fragment sélectionné pour visualisation
  const [selectedFragment, setSelectedFragment] = useState(null);
  // Fragment en cours d'édition
  const [editFragment, setEditFragment] = useState(null);
  // ID du fragment à supprimer
  const [deleteFragmentId, setDeleteFragmentId] = useState(null);
  // Message de feedback pour la copie
  const [copyFeedback, setCopyFeedback] = useState('');

  /*
    onSnapshot crée un abonnement temps réel à la collection Firestore
    Toute modification dans la collection déclenche une mise à jour automatique
    fetchTags récupère une fois les tags disponibles
    Le cleanup désabonne l'écouteur quand le composant est démonté
  */


  useEffect(() => {
     // Abonnement temps réel aux fragments
    const unsubscribeFragments = onSnapshot(collection(db, "codeFragments"), (snapshot) => {
      const fragmentsData = snapshot.docs.map(doc => ({
        id: doc.id, // ID unique du document Firestore
        ...doc.data() // Spread des données du fragment
      }));
      setFragments(fragmentsData); // Mise à jour de l'état
    });

    // Récupération asynchrone des tags
    const fetchTags = async () => {
      const querySnapshot = await getDocs(collection(db, 'tags'));
      const tagsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() // Nom + couleur du tag
      }));
      setAvailableTags(tagsData); // Stockage des tags disponibles
    };

    fetchTags(); // Appel initial

    // Nettoyage : désabonnement à l'écoute Firestore
    return () => {
      unsubscribeFragments();
    };
  }, []); // Tableau de dépendances vide = exécution unique au montage

  /*
    getFragmentTags: 
     _Prend un tableau d'IDs de tags
     _Filtre la liste complète des tags pour ne garder que ceux associés au fragment
  */

  const getFragmentTags = (tagIds) => {
    return availableTags.filter(tag => tagIds?.includes(tag.id));
  };

  const handleDelete = async () => {
    try {
      // Suppression Firestore
      await deleteDoc(doc(db, "codeFragments", deleteFragmentId));
      setDeleteFragmentId(null); // Réinitialisation de l'état
    } catch (error) {
      console.error("Erreur de suppression : ", error); // Log d'erreur
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      // Mise à jour Firestore
      //updateDoc met à jour seulement les champs modifiés 
      await updateDoc(doc(db, "codeFragments", editFragment.id), updatedData); //editFragment.id contient l'ID du document à modifier
      setEditFragment(null); // Fermeture du formulaire d'édition
    } catch (error) {
      console.error("Erreur de mise à jour : ", error);
    }
  };

  /*
    Utilise l'API Clipboard moderne
    Gère à la fois le succès et l'échec
    Feedback visuel temporaire avec setTimeout
    Sécurisé avec try/catch
  */  

const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text); // API Clipboard
      // Feedback positif
      setCopyFeedback('Code copié !');
      // Disparition après 2s
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      // Feedback d'erreur
      setCopyFeedback('Erreur de copie');
      console.error('Erreur de copie : ', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#333333] pt-8 px-8">
  {/* Titre principal de la page */}
  <h2 className="text-5xl text-center font-bold text-transparent bg-clip-text bg-[#9A48D0] mb-8 ">
    Fragment Management
  </h2>

  {/* Grille contenant les fragments */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    {fragments.map((fragment) => (
      // Carte individuelle de fragment
      <div 
        key={fragment.id}
        className="bg-gray-800 rounded-2xl p-6 transition-all hover:bg-gray-750 relative group"
      >
        {/* Boutons d'action (éditer et supprimer) en haut à droite de la carte */}
        <div className="absolute top-5 right-14 flex gap-3 opacity-100 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Empêche le clic de propager vers le parent
              setEditFragment(fragment); // Déclenche l'édition du fragment
            }}
            className="p-1 text-purple-400 hover:text-purple-300"
          >
            <PencilSquareIcon data-testid="edit-icon" className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteFragmentId(fragment.id); // Déclenche la suppression du fragment
            }}
            className="p-1 text-red-400 hover:text-red-300"
          >
            <TrashIcon data-testid="delete-icon" className="h-5 w-5" />
          </button>
        </div>

        {/* Contenu cliquable de la carte */}
        <div 
          className="cursor-pointer h-full" 
          onClick={() => setSelectedFragment(fragment)} // Ouvre le modal de visualisation
        >
          {/* Titre du fragment + icône */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-200 truncate pr-4">
              {fragment.title}
            </h3>
            <div className="flex-shrink-0">
              <EyeIcon data-testid="view-icon" className="h-5 w-5 text-purple-400" />
            </div>
          </div>

          {/* Affichage des tags du fragment */}
          <div className="flex flex-wrap gap-2 mb-2">
            {getFragmentTags(fragment.tags)?.map(tag => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${tag.color}30`, // Couleur de fond avec opacité
                  border: `1px solid ${tag.color}`, // Bordure avec couleur
                  color: tag.color // Texte coloré
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Date de création du fragment */}
          <p className="text-sm text-gray-400 mt-2">
            {fragment.createdAt?.toDate().toLocaleDateString()}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Modal de visualisation d'un fragment sélectionné */}
  <Transition.Root show={!!selectedFragment} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={() => setSelectedFragment(null)}>
      {/* Arrière-plan assombri */}
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-75" />
      </Transition.Child>

      {/* Contenu du modal */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl">
              {/* En-tête du modal avec titre, bouton copy et bouton close */}
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-xl font-bold text-white">
                  {selectedFragment?.title}
                </Dialog.Title>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => copyToClipboard(selectedFragment?.code)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#9A48D0] hover:bg-[#B288C0] text-white rounded-lg transition-colors relative"
                  >
                    <DocumentDuplicateIcon data-testid="copy-icon" className="h-5 w-5" />
                    Copy
                    {copyFeedback && (
                      <span className="absolute -top-8 right-0 bg-gray-700 text-white px-2 py-1 rounded text-sm">
                        {copyFeedback}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedFragment(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XMarkIcon data-testid="close-icon" className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Affichage des tags du fragment sélectionné */}
              <div className="flex flex-wrap gap-2 mb-4">
                {getFragmentTags(selectedFragment?.tags)?.map(tag => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${tag.color}30`,
                      border: `1px solid ${tag.color}`,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* CodeMirror en lecture seule pour afficher le code du fragment */}
              <CodeMirror
                value={selectedFragment?.code}
                extensions={[javascript()]}
                readOnly
                theme="dark"
                height="400px"
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>

     

      {/* Modal d'édition */}
      <Transition.Root show={!!editFragment} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setEditFragment(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="p-6 w-full max-w-3xl">
                  <div className="flex justify-between items-center mb-4">
               
                    <button
                      onClick={() => setEditFragment(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      
                    </button>
                  </div>
                  
                  <FragmentForm 
                    existingFragment={editFragment} 
                    onSubmit={handleUpdate} 
                    onCancel={() => setEditFragment(null)}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Modal de suppression */}
      <Transition.Root show={!!deleteFragmentId} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setDeleteFragmentId(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                  <div className="text-center">
                    <Dialog.Title className="text-lg font-bold text-white mb-4">
                      Confirm deletion?
                    </Dialog.Title>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setDeleteFragmentId(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Fragments;