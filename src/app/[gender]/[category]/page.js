"use client";
import ResponsiveGrid from "@/app/components/ResponsiveGrid";
import { useSessionTimeoutModal } from "@/hooks/useSessionTimeoutModal";
 import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
 
export default function Category({ params }) {
  const { gender, category } = params;
  const [categoryData, setCategoryData] = useState(null);

  function formatString(input) {
    const decodedString = input.replace(/%20/g, " ");
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
      'access-token': 'your-access-token',
      'refresh-token': 'your-refresh-token'
    }
  );

  useEffect(() => {
    const loadCategoryData = async () => {
      const data = await fetchData({
        gender: gender_value,
        category: category_value,
      });
      if (data) {
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
