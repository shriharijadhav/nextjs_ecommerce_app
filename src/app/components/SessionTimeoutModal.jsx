// components/SessionTimeoutModal.js
"use client"
import { useSessionTimeout } from "@/context/SessionTimeoutContext";
import { Modal, ModalOverlay, ModalContent, ModalBody, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
 
export default function SessionTimeoutModal() {
  const { isModalOpen, closeModal } = useSessionTimeout();
  const router = useRouter();

  const handleGoToLogin = () => {
    closeModal();
    router.push("/login");
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody textAlign="center">
          <Text>Dear user, session has timed out. Please login once again.</Text>
          <Button mt={4} onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
