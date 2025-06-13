//@ts-nocheck
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

type Props = {
  openModal: boolean;
  handleOpenModal: any;
  modalHeading: any;
  modalBodyContent: any;
  modalFooterContent: any;
  modalWidth?: string;
};
const CustomModal = (props: Props) => {
  const {
    openModal,
    handleOpenModal,
    modalHeading,
    modalBodyContent,
    modalFooterContent,
    modalWidth,
  } = props;

  const HandleClose = () => {
    handleOpenModal(false);
  };

  return (
    <Modal
      isOpen={openModal}
      onClose={HandleClose}
      closeOnOverlayClick={false}
      isCentered
      scrollBehavior={'inside'}
      size={modalWidth || 'md'}
    >
      <Box>
        <ModalOverlay />
      </Box>
      <ModalContent>
        <ModalHeader>{modalHeading}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{modalBodyContent}</ModalBody>

        <ModalFooter>{modalFooterContent} </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
