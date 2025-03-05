import { Minus, Plus } from "lucide-react";

interface PanningOptionBarProps {
    zoom: number;
    onZoomChange: (newZoom: number) => void;
}

export const PanningOptionBar = ({ zoom, onZoomChange }: PanningOptionBarProps) => {
    const handleZoomIn = () => {
        onZoomChange(Math.min(zoom + 10, 300)); // Max zoom: 300%
    };

    const handleZoomOut = () => {
        onZoomChange(Math.max(zoom - 10, 10)); // Min zoom: 10%
    };

    return (
        <div className="fixed bottom-0 left-0 p-5">
            <div className="flex items-center bg-[#191919] cursor-pointer rounded-lg">
                <div
                    className="text-white px-4 py-2 hover:bg-gray-800 rounded-l-lg"
                    onClick={handleZoomOut}
                >
                    <Minus className="text-white size-4" />
                </div>
                <div className="px-4 text-white py-2 bg-[#191919] text-sm">
                    {zoom}%
                </div>
                <div
                    className="text-white px-4 py-2 hover:bg-gray-800 rounded-r-lg"
                    onClick={handleZoomIn}
                >
                    <Plus className="text-white size-4" />
                </div>
            </div>
        </div>
    );
};
