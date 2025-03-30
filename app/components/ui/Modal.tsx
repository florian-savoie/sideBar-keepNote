'use client';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  title: string;
  description: string;
  image?: string;
  btn?: React.ReactNode[];  // Permet d'ajouter des boutons personnalisés
  onClose?: () => void;     // Fonction pour gérer la fermeture
}

const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(({
  title,
  description,
  image,
  btn,
  onClose,
}: ModalProps, ref) => {

  const handleClose = () => {
    if (ref && typeof ref !== 'function') {
      const modal = ref as any ;
      modal.close();
    }
    onClose && onClose();  // Appeler la fonction de fermeture si elle est définie
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box relative">
        {/* Affichage de l'image si elle existe */}
        {image && <img src={image} alt="Modal Image" className="w-full h-auto mb-4" />}

        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{description}</p>

        <div className="modal-action">
          {/* Bouton de fermeture */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>

          {/* Ajout de boutons personnalisés si définis */}
          {btn && btn.length > 0 ? (
            btn.map((button, index) => (
              <div key={index} className="ml-2">
                {button}
              </div>
            ))
          ) : (
            // Si aucun bouton personnalisé, utiliser le bouton de validation par défaut
            <Button onClick={handleClose}>Valider</Button>
          )}
        </div>
      </div>
    </dialog>
  );
});

Modal.displayName = 'Modal';

export default Modal;
