"use client"

import { useState } from "react";
import DashboardMain from "./DashboardMain";
import { DashboardNavbar } from "./DashboardNavbar";
import { CreateRoomModal } from "./CreateRoomModal";

export default function DashboardClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            {isModalOpen && <CreateRoomModal />}
            <DashboardNavbar />
            <DashboardMain isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    );
}
