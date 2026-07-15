import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {NovelDto} from "../features/novels/type.ts";
import {Alert, Container, Skeleton} from "@mui/material";
import NovelContent from "../features/novels/components/NovelContent.tsx";
import {getNovel} from "../features/novels/api.ts";


export default function Novel() {
    const { id } = useParams<{ id: string }>();
    const [novel, setNovel] = useState<NovelDto>();
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        let cancelled = false;

        async function fetchNovel() {
            if (!id) {
                setError("Novel identifier is missing.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(undefined);
            setNovel(undefined);

            try {
                const result = await getNovel(id);

                if (!cancelled) {
                    setNovel(result);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) {
                    setError("Failed to load novel.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchNovel();

        return () => {
            cancelled = true;
        };
    }, [id]);

    return (
        <Container>
            {isLoading && (
                <>
                    <Skeleton variant="text" sx={{fontSize: "1rem"}}/>
                    <Skeleton variant="circular" width={1200} height={100}/>
                    <Skeleton variant="rectangular" width={1200} height={60}/>
                    <Skeleton variant="rounded" width={1200} height={300}/>
                </>
            )}
            {!isLoading && error && <Alert severity="error">{error}</Alert>}
            {!isLoading && novel && <NovelContent novel={novel}/>}
        </Container>
    );
}
