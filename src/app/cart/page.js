"use client";

import { Box, Grid, Image, Flex, Text, Button, IconButton, useToast, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function CartPage() {
  const [products, setProducts] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null); // Track loading state for specific product
  const [loadingAction, setLoadingAction] = useState(null); // Track which action is loading (increase or decrease)
  const [isCartUpdated, setIsCartUpdated] = useState(true); // Track which action is loading (increase or decrease)


  const toast = useToast();


  const fetchCartData = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/cart/fetchCartData', {}, {
        headers: {
          'access-token': 'your-access-token',
          'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ1NzY1ODMsImV4cCI6MTcyNDY2Mjk4M30.fL-Znfd8v1NzXorFW4zIx-DNNEsyH6q-cG3Hihvyvqo'
        }
      });
      // console.log(response.data)
      setProducts(response.data.cartData.allProductsInCart);
      setIsCartUpdated(false);
      return true
    } catch (error) {
      // console.log('Error: ' + error.message);
      return false;
    }

  };

  const increaseQuantity = async (id) => {
    setLoadingProductId(id); // Set the loading state for the specific product ID
    setLoadingAction('increase'); // Set the loading action to increase
    try {
      const response = await axios.post('http://localhost:3000/api/user/cart/increaseProductQuantity', { productId: id }, {
        headers: {
          'access-token': 'your-access-token',
          'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ1NzY1ODMsImV4cCI6MTcyNDY2Mjk4M30.fL-Znfd8v1NzXorFW4zIx-DNNEsyH6q-cG3Hihvyvqo'
        }
      });
      // console.log(response.data)
      if (response.data.isProductQuantityIncreased) {
        const flag = await fetchCartData()
        if(flag){
            toast({
          title: "Success!",
          description: "Quantity increased successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        }else{
            toast({
          title: "Success!",
          description: "Failed to increase quantity",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        }

        
      } else {
        toast({
          title: "Failed!",
          description: "Failed to increase quantity",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to increase quantity-error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingProductId(null); // Reset the loading state
      setLoadingAction(null); // Reset the action state
    }
  };

  const decreaseQuantity = async (id) => {
    setLoadingProductId(id); // Set the loading state for the specific product ID
    setLoadingAction('decrease'); // Set the loading action to decrease
    try {
      const response = await axios.post('http://localhost:3000/api/user/cart/decreaseProductQuantity', { productId: id }, {
        headers: {
          'access-token': 'your-access-token',
          'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmM4ODNhYWVlZWU5YzI0ZDZkNmNhNGQiLCJpYXQiOjE3MjQ1NzY1ODMsImV4cCI6MTcyNDY2Mjk4M30.fL-Znfd8v1NzXorFW4zIx-DNNEsyH6q-cG3Hihvyvqo'
        }
      });
      // console.log(response.data)
      if (response.data.isProductQuantityDecreased) {
        const flag = await fetchCartData()
        if(flag){
            toast({
          title: "Success!",
          description: "Quantity decreased successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        }else{
            toast({
          title: "Success!",
          description: "Failed to decrease quantity",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        }
      } else {
        toast({
          title: "Failed!",
          description: "Failed to decrease quantity",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to decrease quantity",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoadingProductId(null); // Reset the loading state
      setLoadingAction(null); // Reset the action state
    }
  };

  const deleteProduct = (id) => {
    // Implement delete functionality here
  };

  

  useEffect(() => {
   
    fetchCartData();
    

  }, []);

  if (!products) {
    return (
        <Flex direction="column" align="center" justify="center" height="100vh">
            <Spinner size="xl" color="purple.500" />
            <Text mt={4} fontSize="lg" color="gray.500">Fetching cart details...</Text>
        </Flex>
    );
}

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
                    onClick={() => decreaseQuantity(product._id)}
                    aria-label="Decrease quantity"
                    isLoading={loadingProductId === product._id && loadingAction === 'decrease'} // Show loading for this product only if decreasing
                  />
                  <Text mx={2} fontWeight="bold">
                    {product.quantity}
                  </Text>
                  <IconButton
                    icon={<FaPlus />}
                    size="sm"
                    onClick={() => increaseQuantity(product._id)}
                    aria-label="Increase quantity"
                    isLoading={loadingProductId === product._id && loadingAction === 'increase'} // Show loading for this product only if increasing
                  />
                </Flex>
                <Button
                  colorScheme="red"
                  size="sm"
                  mt={4}
                  leftIcon={<FaTrash />}
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </Button>
              </Box>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
