import RoomCanvas from "@/components/RoomCanvas";
export default async function Canvas({ params }: { params: { roomId: string } }) {
    const slug = params.roomId;

    const roomID = (await params).roomId;
    console.log(roomID)
    return <RoomCanvas roomId={"10"} />;
}
