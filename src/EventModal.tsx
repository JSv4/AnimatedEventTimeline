import React from 'react';
import styled from 'styled-components';

interface Event {
  date: string;
  title: string;
  description: string;
  logoUrl?: string;
}

interface EventModalProps {
  event: Event | null;
  show: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, show }) => {
  if (!event || !show) return null;

  return (
    <Modal>
      {event.logoUrl && (
        <ModalImage
          src={event.logoUrl}
          alt={event.title}
        />
      )}
      <ModalContent>
        <ModalTitle>{event.title}</ModalTitle>
        <ModalDescription>{event.description}</ModalDescription>
      </ModalContent>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  z-index: 1000;
  width: 50%;
  height: 50%;
  max-width: 80%;
  max-height: 80%;
`;

const ModalImage = styled.img`
  width: 80px;
  height: 80px;
  margin-right: 1.5rem;
  border-radius: 8px;
`;

const ModalContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ModalDescription = styled.p`
  margin: 0;
  color: #666;
`;

export default EventModal;
