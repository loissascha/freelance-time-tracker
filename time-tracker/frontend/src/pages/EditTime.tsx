import { useParams } from "react-router"

export default function () {
    let { id } = useParams()
    return (
        <>
            <h1>Edit Time {id}</h1>
        </>
    )
}
