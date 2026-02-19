import {
    Typography,
    Box,
    Avatar,
    Chip,
    Paper,
    TextField,
    InputAdornment
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { useEffect, useState } from "react";
import { Person, Search } from "@mui/icons-material";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// Simple debounce hook implementation if not available
function useDebounceValue(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const fetchUsersData = async ({ paginationModel, sortModel, debouncedSearchQuery }) => {
    const { page, pageSize } = paginationModel;
    const skip = page * pageSize;
    
    let url = "https://dummyjson.com/users";
    const params = {
        limit: pageSize,
        skip: skip,
        select: "firstName,lastName,email,phone,birthDate,age,gender,image,id",
    };

    // Handle Search
    if (debouncedSearchQuery) {
        url = "https://dummyjson.com/users/search";
        params.q = debouncedSearchQuery;
    }

    // Handle Sorting
    if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        params.sortBy = field;
        params.order = sort;
    }

    const { data } = await axios.get(url, { params });
    return data;
};

const UserList = () => {
    // DataGrid State
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [sortModel, setSortModel] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    const debouncedSearchQuery = useDebounceValue(searchQuery, 500);

    const { data, isLoading } = useQuery({
        queryKey: ['users', paginationModel, sortModel, debouncedSearchQuery],
        queryFn: () => fetchUsersData({ paginationModel, sortModel, debouncedSearchQuery }),
        placeholderData: keepPreviousData,
    });
    const users = data?.users || [];
    const total = data?.total || 0;

    // Columns definition
    const columns = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 70 
        },
        {
            field: 'firstName',
            headerName: 'User',
            width: 250,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
                    <Avatar 
                        src={params.row.image} 
                        alt={params.row.firstName} 
                        sx={{ width: 32, height: 32 }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {`${params.row.firstName} ${params.row.lastName}`}
                    </Typography>
                </Box>
            ),
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: 'phone',
            headerName: 'Phone',
            width: 180,
            sortable: false, // API might not support sorting by phone easily, but let's leave it unless it breaks
        },
        {
            field: 'birthDate',
            headerName: 'Date of Birth',
            width: 150,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 100,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    color={params.value === 'male' ? 'primary' : 'secondary'}
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                />
            ),
        },
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        User Management
                    </Typography>
                </Box>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 300, bgcolor: 'background.paper' }}
                />
            </Box>

            <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    rowCount={total}
                    loading={isLoading}
                    pageSizeOptions={[5, 10, 25, 50]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={setPaginationModel}
                    sortingMode="server"
                    sortModel={sortModel}
                    onSortModelChange={setSortModel}
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            borderColor: 'divider',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'action.hover',
                            borderBottom: '2px solid',
                            borderColor: 'divider',
                            fontWeight: 700,
                        },
                    }}
                />
            </Paper>
        </Box>
    );
};

export default UserList;