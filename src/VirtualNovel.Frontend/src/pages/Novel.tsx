import {useParams} from "react-router-dom";

export default function Novel() {
    const { id } = useParams<{ id: string }>();

    return <div>Novel ID: {id}</div>;
}
