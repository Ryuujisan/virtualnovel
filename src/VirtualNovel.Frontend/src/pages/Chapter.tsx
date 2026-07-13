import {useParams} from "react-router-dom";


export default function Chapter() {
    const {novelId} = useParams<{ novelId: string}>();
    const {order} = useParams<{order: string}>();

    return (
        <div>Novel ID: {novelId} Order: {order}</div>
    )
}
