import axios from "axios";
import { BACKEND_URL } from "@/config";
import RoomCanvas from "@/app/components/RoomCanvas";

// Updated getID function to accept a string
async function getID(slug: string) {
    const response = await axios.get(`http://localhost:3008/room/shape`);
    return response.data.roomId;
}

export default async function Canvas({ params }: { params: { roomId: string } }) {
    const slug = params.roomId;

    const roomID = await getID(slug);

    return <RoomCanvas roomId={roomID} />;
}
