"use client"
import { useSessionTimeoutModal } from "@/hooks/useSessionTimeoutModal";
import { Box, Grid, Image, Flex, Text, Button, IconButton, useToast, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { TotalPrice } from "../components/TotalPrice";
 
export default function CartPage() {
  const [products, setProducts] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null); // Track loading state for specific product
  const [loadingAction, setLoadingAction] = useState(null); // Track which action is loading (increase, decrease, delete)
  const toast = useToast();

  // Call the hook with endpoint and method
  const increaseQuantity = useSessionTimeoutModal('http://localhost:3000/api/user/cart/increaseProductQuantity', 'POST', {
    'access-token': 'your-access-token',
    'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ2NjQyNjEsImV4cCI6MTcyNDc1MDY2MX0.QOA2SeJRYoaePhYcDd-k9mAjPlFI2O8ynt4Wsb39PaQ'
  });

  const decreaseQuantity = useSessionTimeoutModal('http://localhost:3000/api/user/cart/decreaseProductQuantity', 'POST', {
    'access-token': 'your-access-token',
    'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ2NjQyNjEsImV4cCI6MTcyNDc1MDY2MX0.QOA2SeJRYoaePhYcDd-k9mAjPlFI2O8ynt4Wsb39PaQ'
  });

  const deleteProduct = useSessionTimeoutModal('http://localhost:3000/api/user/cart/deleteProductFromCart', 'POST', {
    'access-token': 'your-access-token',
    'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ2NjQyNjEsImV4cCI6MTcyNDc1MDY2MX0.QOA2SeJRYoaePhYcDd-k9mAjPlFI2O8ynt4Wsb39PaQ'
  });

  const fetchCartData = useSessionTimeoutModal('http://localhost:3000/api/user/cart/fetchCartData', 'POST', {
    'access-token': 'your-access-token',
    'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ2NjQyNjEsImV4cCI6MTcyNDc1MDY2MX0.QOA2SeJRYoaePhYcDd-k9mAjPlFI2O8ynt4Wsb39PaQ'
  });

  const handleFetchCartData = async () => {
    const data = await fetchCartData({});
    if (data) {
      setProducts(data.cartData.allProductsInCart);
      return true;
    }
  };

  const handleIncreaseQuantity = async (id) => {
    setLoadingProductId(id);
    setLoadingAction('increase');
    const data = await increaseQuantity({ productId: id });
    if (data.isProductQuantityIncreased) {
      const flag = await handleFetchCartData();
      if(flag){
        toast({
          variant: 'left-accent',
          description: "Quantity increased successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          variant: 'left-accent',
          description: "Failed to fetch updated cart data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        variant: 'left-accent',
        description: "Failed to increase quantity",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingProductId(null);
    setLoadingAction(null);
  };

  const handleDecreaseQuantity = async (id) => {
    setLoadingProductId(id);
    setLoadingAction('decrease');
    const data = await decreaseQuantity({ productId: id });
    if (data.isProductQuantityDecreased) {
      const flag = await handleFetchCartData();
      if(flag){
        toast({
          variant: 'left-accent',
          description: "Quantity decreased successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          variant: 'left-accent',
          description: "Failed to fetch updated cart data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        variant: 'left-accent',
        description: "Failed to decrease quantity",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingProductId(null);
    setLoadingAction(null);
  };

  const handleDeleteProduct = async (id) => {
    setLoadingProductId(id);
    setLoadingAction('delete');
    const data = await deleteProduct({ productId: id });
    if (data.isProductDeletedFromCart) {
      const flag = await handleFetchCartData();
      if(flag){
        toast({
          variant: 'left-accent',
          description: "Product deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          variant: 'left-accent',
          description: "Failed to fetch updated cart data",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        variant: 'left-accent',
        description: "Failed to delete product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingProductId(null);
    setLoadingAction(null);
  };

  useEffect(() => {
    handleFetchCartData();
  }, []);

  if (!products) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Spinner size="xl" color="purple.500" />
        <Text mt={4} fontSize="lg" color="gray.500">Fetching cart details...</Text>
      </Flex>
    );
  }

  if(products?.length>0){
    return (
      <Box p={4}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Shopping Cart
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }} gap={6}>
          {products.map((product) => (
            <Box
              key={product._id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
            >
              <Flex direction={{ base: "column", md: "row" }} align="center">
                <Image
                  src={product.searchImage}
                  alt={product.name}
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="lg"
                  mb={{ base: 4, md: 0 }}
                  mr={{ md: 4 }}
                />
                <Box flex="1">
                  <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                    {product.name}
                  </Text>
                  <Text fontSize="md" color="gray.500">
                    Rs. {product.price}
                  </Text>
                  <Flex align="center" mt={4}>
                    <IconButton
                      icon={<FaMinus />}
                      size="sm"
                      onClick={() => handleDecreaseQuantity(product._id)}
                      aria-label="Decrease quantity"
                      isLoading={loadingProductId === product._id && loadingAction === 'decrease'} // Show loading for this product only if decreasing
                    />
                    <Text mx={2} fontWeight="bold">
                      {product.quantity}
                    </Text>
                    <IconButton
                      icon={<FaPlus />}
                      size="sm"
                      onClick={() => handleIncreaseQuantity(product._id)}
                      aria-label="Increase quantity"
                      isLoading={loadingProductId === product._id && loadingAction === 'increase'} // Show loading for this product only if increasing
                    />
                  </Flex>
                  <Button
                    colorScheme="red"
                    size="sm"
                    mt={4}
                    leftIcon={<FaTrash />}
                    onClick={() => handleDeleteProduct(product._id)}
                    isLoading={loadingProductId === product._id && loadingAction === 'delete'} // Show loading for this product only if deleting
                  >
                    Delete
                  </Button>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>
        <TotalPrice products={products}/>
      </Box>
    );
  }else{
    return (
     <Flex h={'80vh'} justifyContent={'center'} alignItems={'center'}>
       <Text>Cart is empty</Text>
     </Flex>
    )
  }
  
}
