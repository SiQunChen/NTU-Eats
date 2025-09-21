
import React, { useEffect, useRef } from 'react';
import type { Filters } from '../types';
import FilterControls from './FilterControls';
import { CloseIcon } from './Icons';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    onRandomPick: () => void;
    isLocationAvailable: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, ...props }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-30 flex justify-center items-start p-4 pt-24 transition-opacity duration-300"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                ref={modalRef}
                className="w-full max-w-2xl bg-transparent rounded-xl shadow-2xl transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
                <div className="relative">
                    <button 
                        onClick={onClose}
                        className="absolute -top-10 right-0 p-2 rounded-full text-white bg-black/30 hover:bg-black/60 transition-colors"
                        aria-label="關閉篩選器"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                    <FilterControls {...props} />
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
