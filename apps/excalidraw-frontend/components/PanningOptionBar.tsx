import { Minus, Plus } from "lucide-react";

export const PanningOptionBar = () => {
    return (
        <div className="fixed bottom-0 left-0 p-5">
            <div className="flex items-center   bg-[#191919] cursor-pointer rounded-lg">
                <div className="text-white px-4 py-2 text-lg  hover:bg-gray-600 rounded-l-lg"><Minus className="text-white size-4"/></div>
                <div className="px-4 text-white py-2 bg-[#191919] text-sm">94%</div>
                <div className="text-white px-4 py-2 text-lg hover:bg-gray-800 rounded-r-lg"><Plus className="text-white size-4"/></div>
            </div>
        </div>
    );
};
