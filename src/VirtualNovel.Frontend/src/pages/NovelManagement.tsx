import {useEffect, useRef} from 'react'
import {useInfiniteQuery} from "@tanstack/react-query";
import {getNovels} from "../features/home/api.ts";
import {useUserStore} from "../store/userStore.ts";
import {Button, Container, Stack, Typography} from "@mui/material";
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {Link} from "react-router-dom";
import NovelFeedCard from "../features/home/components/NovelFeedCard.tsx";
import {useDeleteNovel} from "../shared/hooks/useDeleteNovel.ts";


export default function NovelManagement() {
    const user = useUserStore(x=>x.user);
    const onDeleteNovel = useDeleteNovel();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["author-novels", user?.firebaseUid],
        enabled: Boolean(user?.firebaseUid),
        initialPageParam: 1,
        queryFn: ({pageParam}) => getNovels({
            author: user?.firebaseUid,
            sort: "updatedAt",
            page: pageParam,
            pageSize: 10,
        }),
        getNextPageParam: (lastPage, pages) =>
            lastPage.length === 10
                ? pages.length + 1
                : undefined,
    });

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                void fetchNextPage();
            }
        }, {
            threshold: 0.1,
            rootMargin: "200px",
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const novels = data?.pages.flatMap((page) => page) ?? [];
    if (isLoading) {
        return <Typography sx={{p: 2}}>Loading novels...</Typography>;
    }

    if (isError) {
        return <Typography sx={{p: 2}}>Failed to load novels.</Typography>;
    }

    if (novels.length === 0) {
        return (
            <Container>
                <Button variant={"contained"} startIcon={<AutoStoriesIcon/>} component={Link} to={"/NovelWriter"}>Create Novel</Button>
                <Typography sx={{p: 2}}>This author has no novels yet.</Typography>
            </Container>
        );
    }

    return (
        <Container >
            <Button variant={"contained"} startIcon={<AutoStoriesIcon/>} component={Link} to={"/NovelWriter"}>Create Novel</Button>
            {isLoading && (<Typography>Loading content</Typography>)}
            <Stack spacing={2} sx={{p: 2}}>
            {novels.map(novel => (
                <NovelFeedCard onDelete={() =>void onDeleteNovel(novel.id)} key={novel.id}  data={novel} />
            ))}
            </Stack>
        </Container>
    )

}
