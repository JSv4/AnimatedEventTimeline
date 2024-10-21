import React from 'react';
import styled from 'styled-components';
import { marked } from 'marked';

interface EventCardProps {
  title: string;
  description: string;
  logoUrl: string;
  date: string;
}

const CardContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  z-index: 1000;
`;

const LogoContainer = styled.div`
  width: 35%;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  max-height: 120px;
  object-fit: contain;
`;

const ContentContainer = styled.div`
  width: 65%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
`;

const EventDate = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  display: block;
`;

const Description = styled.div`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.5;
  overflow-y: auto;
  max-height: 200px;
  
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
    margin-bottom: 0.75rem;
  }

  a {
    color: #4f46e5;
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
      ? dateString // If parsing fails, return the original string
      : parsedDate.toLocaleDateString();
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
