import React from 'react';
import styled, { keyframes } from 'styled-components';
import { marked } from 'marked';

interface EventCardProps {
  title: string;
  description: string;
  logoUrl: string;
  date: string;
}

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const CardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  max-width: 1000px;
  height: 400px;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: row;
  z-index: 1000;
  animation: ${fadeInScale} 0.3s ease-out;
`;

const LogoContainer = styled.div`
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  position: relative;
  overflow: hidden;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  width: 55%;
  height: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  letter-spacing: -0.025em;
`;

const pulsate = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const EventDate = styled.span`
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 1.5rem;
  display: block;
  font-weight: 600;
  animation: ${pulsate} 2s ease-in-out;
`;

const Description = styled.div`
  font-size: 1.25rem;
  color: #2d3748;
  line-height: 1.7;
  overflow-y: auto;
  flex-grow: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  p {
    margin-bottom: 1.25rem;
  }

  a {
    color: #4299e1;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const EventCard: React.FC<EventCardProps> = ({ title, description, logoUrl, date }) => {
  /**
   * Formats a date string into a more readable format.
   * If parsing fails, returns the original string.
   *
   * @param {string} dateString - The date string to format.
   * @returns {string} - The formatted date string.
   */
  const formatDate = (dateString: string): string => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime())
      ? dateString
      : parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <CardContainer>
      <LogoContainer>
        <Logo src={logoUrl} alt={title} />
      </LogoContainer>
      <ContentContainer>
        <Title>{title}</Title>
        <EventDate>{formatDate(date)}</EventDate>
        <Description dangerouslySetInnerHTML={{ __html: marked(description) }} />
      </ContentContainer>
    </CardContainer>
  );
};
