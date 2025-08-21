"use client"
import { Dispatch, SetStateAction, useEffect } from "react";
import { Game } from "@/draw/Game";
import { Copy } from "lucide-react";

export const LiveCollaborationModal = ({setShowLiveCollaborationModal,showLiveCollaborationModal,game}:{setShowLiveCollaborationModal:Dispatch<SetStateAction<boolean>>,showLiveCollaborationModal:boolean,game:Game}) => {
  
  const currentPath = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentPath);
      console.log('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

    return (
    <div
      onClick={() => setShowLiveCollaborationModal(false)}
      className="fixed inset-0 flex h-screen justify-center items-center bg-black/70 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 rounded-lg w-[90vw] md:w-96 bg-gray-100 dark:bg-black h-48 border border-gray-200 dark:border-white/15 shadow-xl tracking-tight flex text-center mx-auto flex-col gap-4"
      >
        <h1 className="font-primary text-xl tracking-tighter text-black dark:text-white font-semibold">
          Live Collaboration
        </h1>

        <h3 className="text-black dark:text-white">Invite People to colloborate on your drawing</h3>
        
        <div className="flex items-stretch justify-between gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#191919]">
          <a 
            href={currentPath} 
            className="underline text-sm truncate max-w-[200px] flex items-center text-black dark:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentPath}
          </a>
          <div className="border-l border-gray-300 dark:border-gray-600 flex items-center">
            <button
              onClick={handleCopyLink}
              className="p-2  rounded transition-colors h-full w-full flex items-center justify-center"
              title="Copy link"
            >
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};