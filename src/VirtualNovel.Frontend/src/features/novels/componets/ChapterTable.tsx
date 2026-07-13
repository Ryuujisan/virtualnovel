import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ChapterFeedDto } from '../type.ts';

interface ChapterTableProps {
    novelId: string;
    chapters: ChapterFeedDto[];
}

const columns: GridColDef<ChapterFeedDto>[] = [
    {
        field: 'order',
        headerName: 'Nr',
        width: 80,
        type: 'number',
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'title',
        headerName: 'Tytuł rozdziału',
        flex: 1,
        minWidth: 180,
    },
];

type ChapterOrder = 'ascending' | 'descending';

const defaultPaginationModel: GridPaginationModel = { page: 0, pageSize: 10 };

export default function ChapterTable({ novelId, chapters }: ChapterTableProps) {
    const navigate = useNavigate();
    const [chapterOrder, setChapterOrder] = useState<ChapterOrder>('ascending');
    const [paginationModel, setPaginationModel] = useState(defaultPaginationModel);

    const orderedChapters = useMemo(() => {
        const direction = chapterOrder === 'ascending' ? 1 : -1;

        return [...chapters].sort((first, second) => {
            const orderComparison = (first.order - second.order) * direction;
            return orderComparison !== 0
                ? orderComparison
                : first.id.localeCompare(second.id);
        });
    }, [chapterOrder, chapters]);

    const openChapter = (order: ChapterFeedDto['order']) => {
        navigate(`/novels/${novelId}/chapter/${order}`);
    };

    const changeChapterOrder = (event: SelectChangeEvent<ChapterOrder>) => {
        setChapterOrder(event.target.value);
        setPaginationModel(defaultPaginationModel);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1.5,
                }}
            >
                <FormControl
                    size="small"
                    sx={{ width: { xs: '100%', sm: 260 } }}
                >
                    <InputLabel id="chapter-order-label">Kolejność</InputLabel>
                    <Select<ChapterOrder>
                        labelId="chapter-order-label"
                        id="chapter-order"
                        value={chapterOrder}
                        label="Kolejność"
                        onChange={changeChapterOrder}
                    >
                        <MenuItem value="ascending">Od pierwszego rozdziału</MenuItem>
                        <MenuItem value="descending">Od najnowszego rozdziału</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <DataGrid
                autoHeight
                rows={orderedChapters}
                columns={columns}
                getRowId={(row) => row.id}
                onRowClick={(params) => openChapter(params.row.order)}
                onCellKeyDown={(params, event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openChapter(params.row.order);
                    }
                }}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10]}
                disableColumnSorting
                disableRowSelectionOnClick
                density="comfortable"
                localeText={{ noRowsLabel: 'Brak rozdziałów' }}
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            />
        </Box>
    );
}
