
import React from 'react';
import { SearchIcon } from './Icons';

interface HeaderProps {
    onSearchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-20">
            <div className="container mx-auto px-4 py-4 md:px-8 flex justify-between items-center">
                <div className="text-2xl md:text-3xl font-bold text-sky-600">
                    <span role="img" aria-label="fork and knife with plate" className="mr-2">🍽️</span>
                    NTU Eats
                    <span className="text-slate-500 font-normal ml-2 hidden sm:inline">| 台大吃什麼</span>
                </div>
                <button 
                    onClick={onSearchClick}
                    className="p-2 rounded-full text-slate-600 hover:bg-slate-200 hover:text-sky-600 transition-colors"
                    aria-label="開啟篩選器"
                >
                    <SearchIcon className="h-6 w-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;
