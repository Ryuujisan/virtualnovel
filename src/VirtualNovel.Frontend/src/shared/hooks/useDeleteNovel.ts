import {useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";
import {deleteNovel} from "../../features/novelwriters/api.ts";

export function useDeleteNovel() {
    const queryClient = useQueryClient();

    return async function onDeleteNovel(id: string) {
        try {
            const deleted = await deleteNovel(id);

            if (!deleted) {
                return;
            }

            toast.success("Novel deleted");

            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["novels"]}),
                queryClient.invalidateQueries({queryKey: ["author-novels"]}),
            ]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete novel");
        }
    };
}
