import {Box, CircularProgress, Stack, Typography} from "@mui/material";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useEffect, useRef} from "react";
import NovelFeedCard from "./NovelFeedCard.tsx";
import {getNovels} from "../../../shared/api/api.home.ts";

export default function LastUpdate() {
    const filters = {
        sort: "updatedAt",
        pageSize: 20,
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["novels", filters],
        initialPageParam: 1,

        queryFn: ({ pageParam }) =>
            getNovels({
                ...filters,
                page: pageParam,
            }),

        getNextPageParam: (lastPage, pages) =>
            lastPage.length === filters.pageSize
                ? pages.length + 1
                : undefined,
    });

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    void fetchNextPage();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "200px",
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    ]);

    const novels =
        data?.pages.flatMap((page) => page) ?? [];

    if (isLoading) {
        return <Typography>Loading novels...</Typography>;
    }

    if (isError) {
        return <Typography>Failed to load novels.</Typography>;
    }

    return (
        <Stack spacing={2} sx={{ flex: 1, mt: 2 }}>
            <Typography variant="h5">
                Last Update
            </Typography>

            <Stack spacing={2}>
                {novels.map((novel) => (
                    <NovelFeedCard
                        key={novel.id}
                        {...novel}
                    />
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
                        <CircularProgress size={32} />
                    )}
                </Box>
            </Stack>
        </Stack>
    );
}