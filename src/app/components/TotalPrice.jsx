"use client"

import { Flex, Text } from "@chakra-ui/react"

export const TotalPrice = ({products})=>{

    // console.log(products[0]) 
    const total = products?.reduce((total,item)=>total + (Number(item.quantity)*Number(item.price)),0)
    // console.log(total) 

    return(
    <Flex>
       {
        products.length>0 && (
            <Text>Total price : {total}</Text>
        )
       }
    </Flex>
    )
}