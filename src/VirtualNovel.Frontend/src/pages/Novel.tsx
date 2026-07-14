import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {NovelDto} from "../features/novels/type.ts";
import {getNovel} from "../shared/api/api.novel.ts";
import {Container, Skeleton} from "@mui/material";
import NovelContent from "../features/novels/components/NovelContent.tsx";


export default function Novel() {
    const { id } = useParams<{ id: string }>();
    const [novel, setNovel] = useState<NovelDto>()
    const [isLoading, setLoading] = useState<boolean>(false);



    useEffect(() => {
       async function fetchNovel() {
            try {
                const n = await getNovel(id ?? "") as NovelDto;
                console.log(n);
                setNovel(n);
                setLoading(false)
                console.log(isLoading)
            } catch (e) {
                console.error(e);
            }
       }
       setLoading(true)

       fetchNovel();
    },[])
    return (
        <Container>
            {!isLoading && <NovelContent novel={novel!}/>}
            {isLoading && (
                <>
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                <Skeleton variant="circular" width={1200} height={100} />
                <Skeleton variant="rectangular" width={1200} height={60} />
                <Skeleton variant="rounded" width={1200} height={300} />
                </>
            )}
        </Container>
    )
}
