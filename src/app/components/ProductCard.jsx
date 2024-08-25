import { Box, Image, Badge, Text, Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/productDetails/${product?.landingPageUrl}`);
  };

  return (
    <Flex
      direction={'column'}
      w={'100%'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="gray.400"
      justifyContent={'center'}
      alignItems={'center'}
      onClick={handleCardClick}
      cursor="pointer" // Add a pointer cursor to indicate that the card is clickable
    >
      <Box
        w={'100%'}
        h={['150px', '200px', '250px', '250px']}
        backgroundRepeat={'no-repeat'}
        backgroundSize={'cover'}
        backgroundImage={`url(${product?.searchImage})`}
      ></Box>

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          {product?.isNew && (
            <Badge borderRadius="full" px="2" colorScheme="teal">
              New
            </Badge>
          )}
        </Box>

        <Box mt="1" fontWeight="semibold" lineHeight="tight" noOfLines={1}>
          <Text>{product?.productName}</Text>
        </Box>

        <Box mt="1" fontWeight="semibold" as="h6" lineHeight="tight" noOfLines={1}>
          <Text>{product?.brand}</Text>
        </Box>

        <Flex gap={'10px'}>
          <Text>Rs. {product?.price}</Text>
          <Text textDecoration={'line-through'}>Rs. {product?.mrp}</Text>
        </Flex>

        <Flex mt="2" alignItems="center">
          <Button colorScheme="purple" size="sm">
            Add to Cart
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
