import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

const SwitchInput = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
`;

const SwitchLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  width: 50px;
  height: 25px;
  background: grey;
  border-radius: 100px;
  position: relative;
  transition: background-color 0.2s;
  margin: 0;

  &:active:after {
    width: 30px;
  }
`;

const SwitchButton = styled.span`
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 21px;
  height: 21px;
  border-radius: 45px;
  transition: 0.2s;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);

  ${SwitchInput}:checked + ${SwitchLabel} & {
    left: calc(100% - 2px);
    transform: translateX(-100%);
  }

  ${SwitchLabel}:active & {
    width: 30px;
  }
`;

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => (
  <div>
    <SwitchInput
      checked={checked}
      onChange={onChange}
      id="switch-toggle"
      type="checkbox"
    />
    <SwitchLabel htmlFor="switch-toggle">
      <SwitchButton />
    </SwitchLabel>
  </div>
);
