"use client"
import { Dispatch, SetStateAction } from "react";
import { Game } from "@/draw/Game";
import { RefreshCcw, WifiOff } from "lucide-react";

export const DisconnectedModal = ({
  setShowDisconnectedModal,
  showDisconnectedModal,
  game
}: {
  setShowDisconnectedModal: Dispatch<SetStateAction<boolean>>;
  showDisconnectedModal: boolean;
  game: Game;
}) => {
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      onClick={() => setShowDisconnectedModal(false)}
      className="fixed inset-0 flex h-screen justify-center items-center bg-black/70 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 rounded-lg w-[90vw] md:w-96 bg-gray-100 dark:bg-black h-64 border border-gray-200 dark:border-white/15 shadow-xl tracking-tight flex text-center mx-auto flex-col gap-4"
      >
        <div className="flex justify-center">
          <WifiOff className="w-16 h-16 text-gray-600 dark:text-gray-400" />
        </div>

            <h1 className="font-primary text-xl tracking-tighter text-black dark:text-white font-semibold">
            You Have Been Disconnected 
            </h1>

        <h3 className="text-black dark:text-white text-sm">
          Please refresh the page to reconnect to the server
        </h3>
        
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-[#191919] hover:bg-gray-300 dark:hover:bg-gray-800 text-black dark:text-white rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>
  );
};
