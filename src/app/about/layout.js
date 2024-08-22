import { Flex, Text } from "@chakra-ui/react";


export default function RootLayout({ children }) {
  return (
     <Flex direction={'column'}h={'80vh'}>
     <Text>Demo header</Text>
        {children}
     <Text>Demo footer</Text>
     </Flex>
     
  );
}
