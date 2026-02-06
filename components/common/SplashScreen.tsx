
import React from 'react';

const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-zinc-900 flex flex-col items-center justify-center z-[100] text-white">
            <i className="fas fa-bolt text-6xl mb-4 animate-pulse text-amber-400"></i>
            <h1 className="text-5xl font-extrabold tracking-wider mb-2">
                STAY RAW
            </h1>
            <p className="text-lg">Unleash Your Potential</p>
            <div className="absolute bottom-10 text-sm">
                Loading...
            </div>
        </div>
    );
};

export default SplashScreen;
