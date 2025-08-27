"use client"
import { AlertDialogContent,AlertDialog,AlertDialogTrigger ,AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./AlertDialog";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Game } from "../draw/Game";

export const ClearCanvasModal = ({setShowClearCanvasModal,showClearCanvasModal,game}:{setShowClearCanvasModal:Dispatch<SetStateAction<boolean>>,showClearCanvasModal:boolean,game:Game}) => {
    
    const handleClose = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        setShowClearCanvasModal(false);
        
    };

    useEffect(()=>{
        return()=>{
            document.body.style.pointerEvents = 'auto';
        }
    },[])
    
    return (
    <AlertDialog open={showClearCanvasModal} onOpenChange={(open) => {
    }} >
    <AlertDialogContent 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        className="tracking-tight bg-gray-100 dark:bg-black border-gray-200 dark:bg-[#191919] dark:border-white/15 "
    >
        <AlertDialogHeader>
        <AlertDialogTitle>Clear Canvas</AlertDialogTitle>
        <AlertDialogDescription>
            This will clear the canvas and delete all elements. Are you sure?
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" onClick={()=>{
            game?.clearCanvas();
            handleClose();
        }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    )
};