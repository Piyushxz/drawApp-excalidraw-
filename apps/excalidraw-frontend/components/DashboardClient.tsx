"use client"

import { useState } from "react";
import DashboardMain from "./DashboardMain";
import { DashboardNavbar } from "./DashboardNavbar";
import { CreateRoomModal } from "./CreateRoomModal";
import { AnimatePresence } from "motion/react";

export default function DashboardClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <AnimatePresence>
            {isModalOpen && <CreateRoomModal setIsModalOpen={setIsModalOpen}/>}

            </AnimatePresence>
            <DashboardNavbar />
            <DashboardMain isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
}
