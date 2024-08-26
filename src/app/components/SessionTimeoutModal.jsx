"use client";
import { useSessionTimeout } from "@/context/SessionTimeoutContext";
import { Modal, ModalOverlay, ModalContent, ModalBody, Button, Text, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function SessionTimeoutModal() {
  const { isModalOpen, closeModal } = useSessionTimeout();
  const router = useRouter();

  const handleGoToLogin = () => {
    closeModal();
    router.push("/login");
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      isCentered
      closeOnOverlayClick={false} // Prevent closing on overlay click
      size="md" // Adjust size here
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign="center" p={6}>
            <Flex gap={'20px'} direction={'column'} w={'100%'} >
                <Text fontSize="xl" fontWeight="medium">
                Oops! 
                </Text>
                 <Text  fontSize="md">Session expired. Please log in to continue.                </Text>
            </Flex>
          <Button mt={5} colorScheme="blue" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
