// index.jsx
import ModalWrapper from "./components/ModalWrapper.jsx";
import ModalContent from "./components/ModalContent.jsx";

const Index = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <ModalContent data={data} />
    </ModalWrapper>
  );
};

export default Index;
