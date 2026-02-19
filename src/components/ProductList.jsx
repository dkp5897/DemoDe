import {
    Typography,
    Box,
    CircularProgress,
    Avatar,
    Container,
    Button,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { Inventory } from "@mui/icons-material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";

const fetchProducts = async ({ pageParam = 0 }) => {
    const limit = 20;
    const { data } = await axios.get("https://dummyjson.com/products", {
        params: {
            limit: limit,
            skip: pageParam,
            select: "title,description,price,category,stock,brand,thumbnail,rating",
        }
    });
    return data;
};

const ProductList = () => {
    const { ref, inView } = useInView();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const nextSkip = lastPage.skip + lastPage.limit;
            return nextSkip < lastPage.total ? nextSkip : undefined;
        },
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage]);

    if (status === "pending") {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress size={40} color="primary" />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading products...</Typography>
            </Box>
        );
    }

    if (status === "error") {
        return (
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <Inventory fontSize="large" />
                </Avatar>
                <Box>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
                        Product Catalog
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Discover our curated collection of amazing items
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(4, 1fr)',
                        xl: 'repeat(5, 1fr)',
                    },
                    gap: 3,
                }}
            >
                {data.pages.map((page) => (
                    page.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ))}
            </Box>

            <Box ref={ref} sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                {isFetchingNextPage ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={24} thickness={5} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>Loading more products...</Typography>
                    </Box>
                ) : hasNextPage ? (
                    <Button onClick={() => fetchNextPage()} variant="outlined" sx={{ borderRadius: 10 }}>
                        Load More
                    </Button>
                ) : (
                    <Typography variant="body2" color="text.disabled">
                        You've reached the end of the list
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default ProductList;
