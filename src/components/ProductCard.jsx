import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    Chip,
    Rating,
} from "@mui/material";
import { ShoppingCart, Star } from "@mui/icons-material";

const ProductCard = ({ product }) => {
    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.15)',
                    borderColor: 'primary.main',
                }
            }}
        >
            <Box sx={{ position: 'relative', pt: 2, px: 2 }}>
                <CardMedia
                    component="img"
                    sx={{
                        height: 180,
                        objectFit: 'contain',
                        borderRadius: 2,
                        bgcolor: 'action.hover' // Use theme color for background
                    }}
                    image={product.thumbnail}
                    alt={product.title}
                />
                <Chip
                    label={product.category}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        bgcolor: 'background.paper',
                        opacity: 0.9,
                        backdropFilter: 'blur(4px)',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        boxShadow: 1
                    }}
                />
            </Box>

            <CardContent sx={{ flexGrow: 1, px: 2.5, pb: 1 }}>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating
                        value={product.rating || 0}
                        readOnly
                        size="small"
                        precision={0.5}
                        emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        ({product.rating?.toFixed(1) || '0.0'})
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                        mb: 1,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.6em', // Reserve space for 2 lines
                    }}
                >
                    {product.title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                        mb: 2,
                        minHeight: '3em' // Reserve space for 2 lines
                    }}
                >
                    {product.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                        ${product.price}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        ${(product.price * 1.2).toFixed(2)}
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2.5, pb: 2.5 }}>
                <Button
                    fullWidth
                    variant="contained"
                    disableElevation
                    startIcon={<ShoppingCart />}
                    sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1,
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        '&:hover': {
                            bgcolor: 'primary.main',
                        }
                    }}
                >
                    Add to Cart
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
