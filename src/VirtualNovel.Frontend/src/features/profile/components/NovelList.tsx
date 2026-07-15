import {Box, Skeleton, Stack, Typography} from "@mui/material";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useEffect, useRef} from "react";
import {getNovels} from "../../home/api.ts";
import NovelFeedCard from "../../home/components/NovelFeedCard.tsx";

interface Props {
    authorId: string;
}

const PAGE_SIZE = 20;

export default function NovelList({authorId}: Props) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["author-novels", authorId],
        initialPageParam: 1,
        queryFn: ({pageParam}) => getNovels({
            author: authorId,
            sort: "updatedAt",
            page: pageParam,
            pageSize: PAGE_SIZE,
        }),
        getNextPageParam: (lastPage, pages) =>
            lastPage.length === PAGE_SIZE
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
        return <Typography sx={{p: 2}}>This author has no novels yet.</Typography>;
    }

    return (
        <Stack spacing={2} sx={{p: 2}}>
            {novels.map((novel) => (
                <NovelFeedCard key={novel.id} {...novel}/>
            ))}

            <Box
                ref={loadMoreRef}
                sx={{
                    minHeight: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {isFetchingNextPage && (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={120}
                        sx={{borderRadius: 2}}
                    />
                )}
            </Box>
        </Stack>
    );
}
