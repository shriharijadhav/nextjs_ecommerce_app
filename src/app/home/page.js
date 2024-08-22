"use client"


import { Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

return (<Flex>a
    
    <Button onClick={()=>{router.push('/')}}>back</Button>
    </Flex>)

}