import { Grid, GridItem, Box } from "@chakra-ui/react";
import ProductCard from "./ProductCard";

export default function ResponsiveGrid({productArray}) {
  return (
    <Grid bg={'red'} w={'90%'}
      templateColumns={{
        base: "repeat(2, 1fr)",   // 2 columns for small screens
        md: "repeat(3, 1fr)",     // 3 columns for medium screens
        lg: "repeat(4, 1fr)"      // 5 columns for large screens
      }}
      gap={6}  // Adjust gap between items
    >
      {productArray.map((product, i) => (
        <GridItem key={i}>
          <Box
            minH="150px"          // Minimum height for each card
            bg="teal.500"         // Background color for cards
            borderRadius="md"     // Rounded corners
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize="xl"
          >
            <ProductCard product={product} />
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
}
