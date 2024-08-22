// app/[gender]/[category]/page.js

"use client"
import ResponsiveGrid from "@/app/components/ResponsiveGrid";
import { Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Category({ params }) {
    const { gender, category } = params;

    const [categoryData,SetCategoryData] = useState(null);

    const fetchProducts = async () => {
        try {
          const response = await axios.post(
            'http://localhost:3000/api/product/getPageWiseProduct',
            {
              // Request body data
              gender: "Women",
              category: "Dresses"
            },
           
          );
      
          console.log('Response:', response.data);
          SetCategoryData(response.data)
        } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
        }
      };
      

    useEffect(() => {
      
         fetchProducts(gender,category)
      
    }, [])
    

    return (
        <Flex w={'100%'} >
            <Text>{gender} and {category}</Text>
            {
                categoryData?.products?.length>0 ?(<Flex w={'90%'}>
                    <ResponsiveGrid productArray={categoryData?.products} />
                    </Flex>):(<Flex>
                            <Text>Loading...</Text>
                        </Flex>)
            }
        </Flex>
    );
}
