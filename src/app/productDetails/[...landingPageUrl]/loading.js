import { Flex, Spinner, Text } from "@chakra-ui/react";

export default function Loading() {
    return (
        <Flex direction="column" align="center" justify="center" height="100vh">
            <Spinner size="xl" color="purple.500" />
            <Text mt={4} fontSize="lg" color="gray.500">Loading product details...</Text>
        </Flex>
    );
}
