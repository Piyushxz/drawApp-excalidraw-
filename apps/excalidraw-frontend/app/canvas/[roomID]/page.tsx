import RoomCanvas from "@/components/RoomCanvas";

export default function Canvas({ params }: { params: { roomId: string } }) {
    const roomID = params.roomId;
    console.log(roomID);

    return <RoomCanvas roomId={JSON.stringify(roomID)} />;
}
