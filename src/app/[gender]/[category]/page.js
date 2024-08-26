"use client";
import ResponsiveGrid from "@/app/components/ResponsiveGrid";
import { useSessionTimeoutModal } from "@/hooks/useSessionTimeoutModal";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
 
export default function Category({ params }) {
  const { gender, category } = params;
  const [categoryData, setCategoryData] = useState(null);

  function formatString(input) {
    // Replace '%20' with a space
    const decodedString = input.replace(/%20/g, " ");

    // Capitalize the first letter of each word
    const formattedString = decodedString
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return formattedString;
  }

  let gender_value = formatString(gender);
  let category_value = formatString(category);

  const fetchData = useSessionTimeoutModal(
    "http://localhost:3000/api/product/getPageWiseProduct",
    "POST",
    {
      gender: gender_value,
      category: category_value,
    },
    {
      'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmMwMjk0NThkYmE2ODMyMTRlNDZiMmUiLCJpYXQiOjE3MjM4ODIxODMsImV4cCI6MTcyMzg4OTM4M30.QW0PcLEjfpQSIpSYsu_RfNpRN_vjlbQwz_oPo0Si8Mc',
      'refresh-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmMwMjk0NThkYmE2ODMyMTRlNDZiMmUiLCJpYXQiOjE3MjM4ODIxODMsImV4cCI6MTcyMzg4OTM4M30.QW0PcLEjfpQSIpSYsu_RfNpRN_vjlbQwz_oPo0Si8Mc'
    }
  );
  

  useEffect(() => {
    const loadCategoryData = async () => {
      const data = await fetchData();
      if (data) {
        console.log(data)
        setCategoryData(data);
      }
    };
    loadCategoryData();
  }, [gender, category]);

  return (
    <Flex w={"100%"}>
      <Text>
        {gender_value} and {category_value}
      </Text>
      {categoryData?.products?.length > 0 ? (
        <Flex w={"90%"}>
          <ResponsiveGrid productArray={categoryData?.products} />
        </Flex>
      ) : (
        <Flex>
          <Text>Loading...</Text>
        </Flex>
      )}
    </Flex>
  );
}
