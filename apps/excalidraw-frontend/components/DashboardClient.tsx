"use client"

import { useState } from "react";
import DashboardMain from "./DashboardMain";
import { DashboardNavbar } from "./DashboardNavbar";
import { CreateRoomModal } from "./CreateRoomModal";
import { AnimatePresence } from "motion/react";
import { useGetRooms } from "@/hooks/useGetRooms";

export default function DashboardClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {roomData} = useGetRooms()

    return (    
        <div>
            <AnimatePresence>
            {isModalOpen && <CreateRoomModal setIsModalOpen={setIsModalOpen}/>}

            </AnimatePresence>
            <DashboardNavbar />
            <DashboardMain roomData={roomData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
}
