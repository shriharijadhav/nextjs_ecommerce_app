// app/[gender]/[category]/page.js

"use client"
import ResponsiveGrid from "@/app/components/ResponsiveGrid";
import { Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Category({ params }) {
    const { gender, category } = params;

    const [categoryData,SetCategoryData] = useState(null);

    function formatString(input) {
      // Replace '%20' with a space
      const decodedString = input.replace(/%20/g, ' ');
  
      // Capitalize the first letter of each word
      const formattedString = decodedString
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
  
      return formattedString;
  }
    let gender_value = formatString(gender)
    let category_value = formatString(category)

    const fetchProducts = async () => {
        try {
          const response = await axios.post(
            'http://localhost:3000/api/product/getPageWiseProduct',
            {
              // Request body data
              gender: gender_value,
              category: category_value
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
      
    }, [gender,category])
    

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
