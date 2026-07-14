import {useParams} from "react-router-dom";
import { CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import type {NovelDto} from "../features/novels/type.ts";
import type {ChapterDto} from "../features/chapters/type.ts";


import ChapterContent from "../features/chapters/ChapterContent.tsx";
import {getChapter} from "../features/chapters/api.ts";
import {getNovel} from "../features/novels/api.ts";



export default function Chapter() {
    const {novelId} = useParams<{ novelId: string}>();
    const {order} = useParams<{order: string}>();
    console.log(order);
    const [novel, setNovel] = useState<NovelDto>();
    const [chapter, setChapter] = useState<ChapterDto>();
    const [isLoading, setIsLoading] = useState<boolean>(true);



    useEffect(() => {
        async function fetchChapter() {
            if (!novelId || !order) {
                return;
            }

            setIsLoading(true);

            try {
                const [chapterData, novelData] = await Promise.all([
                    getChapter(novelId, order),
                    getNovel(novelId),
                ]);

                setChapter(chapterData);
                setNovel(novelData);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        void fetchChapter();
    }, [novelId, order]);

    return (
        <>
            {(!isLoading && chapter != null) && (<ChapterContent chapter={chapter} novel={novel!}/>)}
            {isLoading && (<CircularProgress />)}
        </>
    )
}
