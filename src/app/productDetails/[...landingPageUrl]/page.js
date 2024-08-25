"use client";

import { Box, Image, Badge, Text, Flex, Button, Stack, HStack, VStack, useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProductDetailCard({ params }) {
    const [product, setProduct] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [loading, setLoading] = useState(true); // State for data loading
    const toast = useToast();

    const { landingPageUrl } = params;
    const formattedUrl = landingPageUrl.join('/');

    const fetchSingleProductData = async (formattedUrl) => {
        try {
            const response = await axios.post('http://localhost:3000/api/product/getSingleProductDetails', { landingPageUrl: formattedUrl });
            setProduct(response.data.product);
        } catch (error) {
            toast({
                title: "Error!",
                description: "Failed to fetch product data.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false); // Data fetching is complete
        }
    };

    const addProductToCart = async (product) => {
        setIsAddingToCart(true);
        try {
            const response = await axios.post('http://localhost:3000/api/user/cart/addProductToCart', { productFromRequest: product }, {
                headers: {
                    'access-token': 'your-access-token',
                    'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ1NTkzNTEsImV4cCI6MTcyNDY0NTc1MX0.kMA0kIcL-AouHub5DM5Xkrr534i7CE0zENH9cqc1RnE'
                }
            });
            if (response.data.isProductAddedToCart) {
                toast({
                    title: "Success!",
                    description: "Product added to cart.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Failed!",
                    description: "Failed to add product to cart.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: "Error!",
                description: "An error occurred while adding the product to cart.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsAddingToCart(false);
        }
    };

    useEffect(() => {
        fetchSingleProductData(formattedUrl);
    }, [formattedUrl]);

    if (loading) {
        return (
            <Flex direction="column" align="center" justify="center" height="100vh">
                <Spinner size="xl" color="purple.500" />
                <Text mt={4} fontSize="lg" color="gray.500">Loading product details...</Text>
            </Flex>
        );
    }

    if (!product) {
        return <Text>No product found</Text>;
    }

    return (
        <Flex direction={["column", "column", "row"]} w="100%" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg" p={5}>
            <Box flex="1" maxW={["100%", "100%", "50%"]}>
                <Image src={product?.searchImage} alt={product?.productName} w="100%" h="auto" borderRadius="lg" />
                <HStack mt={2} spacing={2}>
                    {product?.images?.length > 0 ? product.images.map((img, index) => (
                        <Image key={index} src={img.src} alt={`${product?.productName} - ${img.view}`} w="24%" borderRadius="md" boxShadow="sm" _hover={{ transform: "scale(1.05)", transition: "0.3s" }} />
                    )) : <Text>No images available</Text>}
                </HStack>
            </Box>

            <VStack flex="2" align="start" p={[2, 4, 6]} spacing={4}>
                <Text fontSize="2xl" fontWeight="bold">{product?.productName}</Text>
                <Text fontSize="lg" color="gray.600">{product?.additionalInfo}</Text>

                <HStack spacing={4} mt={4}>
                    <Text fontSize="xl" fontWeight="bold" color="teal.500">₹{product?.price}</Text>
                    <Text fontSize="lg" color="gray.500" textDecoration="line-through">₹{product?.mrp}</Text>
                    <Badge colorScheme="green" p={1}>{product?.discountLabel}</Badge>
                </HStack>

                <Stack direction={["column", "row"]} spacing={4} mt={4}>
                    <Text fontWeight="bold">Brand:</Text>
                    <Text>{product?.brand}</Text>
                </Stack>

                <Stack direction={["column", "row"]} spacing={4} mt={4}>
                    <Text fontWeight="bold">Color:</Text>
                    <Text>{product?.primaryColour}</Text>
                </Stack>

                <Stack direction={["column", "row"]} spacing={4} mt={4}>
                    <Text fontWeight="bold">Season:</Text>
                    <Text>{product?.season} {product?.year}</Text>
                </Stack>

                <Stack direction={["column", "row"]} spacing={4} mt={4}>
                    <Text fontWeight="bold">Sizes Available:</Text>
                    <Text>{product?.sizes}</Text>
                </Stack>

                <Button
                    colorScheme="purple"
                    size="lg"
                    mt={6}
                    onClick={() => addProductToCart(product)}
                    isLoading={isAddingToCart}
                >
                    Add to Cart
                </Button>
            </VStack>
        </Flex>
    );
}
