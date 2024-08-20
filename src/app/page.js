"use client"


import { useState } from 'react';
import { Flex, Text, Input, Button, Box, FormControl, FormLabel, useToast, Spinner } from '@chakra-ui/react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.isLoginSuccessful) {
        toast({
          title: 'Login Successful',
          description: 'You have logged in successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Login Failed',
          description: data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Unable to login. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex w={'100%'} h={'100vh'}  justifyContent={'center'} alignItems={'center'}>
      <Box p={8} bg={'gray.500'} borderRadius={'md'} boxShadow={'md'}>
        <Text fontSize={'2xl'} mb={4} color={'rebeccapurple'}>
          Login Form
        </Text>
        <FormControl id="email" mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </FormControl>
        <FormControl id="password" mb={6}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button
          colorScheme="purple"
          width="full"
          onClick={handleSubmit}
          isDisabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : 'Login'}
        </Button>
      </Box>
    </Flex>
  );
}
