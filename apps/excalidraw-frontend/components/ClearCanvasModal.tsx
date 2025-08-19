import { AlertDialogContent,AlertDialog,AlertDialogTrigger ,AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./AlertDialog";
import { Dispatch, SetStateAction, useEffect } from "react";

export const ClearCanvasModal = ({setShowClearCanvasModal,showClearCanvasModal}:{setShowClearCanvasModal:Dispatch<SetStateAction<boolean>>,showClearCanvasModal:boolean}) => {
    console.log("showClearCanvasModal",showClearCanvasModal)
    
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setShowClearCanvasModal(false);
        
    };

    useEffect(()=>{
        return()=>{
            document.body.style.pointerEvents = 'auto';
            document.body.style.userSelect = 'auto';
        }
    },[])
    
    return (
    <AlertDialog open={showClearCanvasModal} onOpenChange={(open) => {
    }}>
    <AlertDialogContent 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
    >
        <AlertDialogHeader>
        <AlertDialogTitle>Clear Canvas</AlertDialogTitle>
        <AlertDialogDescription>
            This will clear the canvas and delete all elements. Are you sure?
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleClose}>Continue</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    )
};