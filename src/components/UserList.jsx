import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableCell,
    Typography,
    TableRow,
    Paper,
    TablePagination,
    useTheme,
    Box,
    IconButton,
    TableFooter,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@mui/icons-material";

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handlePageChange = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        const limit = rowsPerPage;
        const skip = page * rowsPerPage;
        console.log(page, rowsPerPage); 
        axios
            .get("https://dummyjson.com/users", {
                params: {
                    limit,
                    skip,
                    select: "firstName,lastName,email,phone,birthDate,age,gender",
                },
            })
            .then((response) => {
                setUsers(response.data.users || []);
                setTotal(response.data.total || 0);
            })
            .catch((error) => console.error(error));
    }, [page, rowsPerPage]);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="user table">
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Gender</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.firstName}</TableCell>
                                <TableCell>{user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>{user.birthDate}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>{user.gender}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7}>
                                <Typography>No Data</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            colSpan={7}
                            count={total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        "aria-label": "rows per page",
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default UserList;
