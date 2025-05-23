import RoomCanvas from "@/components/RoomCanvas";
export default async function Canvas({ params }: { params: { roomID: string } }) {

    const roomID = (await params).roomID
    console.log(roomID)
    return <RoomCanvas roomId={roomID} />;
}
