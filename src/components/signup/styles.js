import styled from "styled-components";

export const InputGroup = styled.div`
  position: relative;
  width: 100%;
  margin: 0.5rem 0;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.7rem 3rem;
  font-size: 0.9rem;
  background-color: var(--gray);
  border-radius: 0.5rem;
  border: 0.125rem solid var(--white);
  outline: none;

  &:focus {
    border: 0.1rem solid var(--primary-color);
  }
  &::placeholder {
    padding-right: 300rem;
  }
`;

export const Icon = styled.i`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  font-size: 1.4rem;
  color: var(--gray-2);
`;

export const SignupButton = styled.button`
  cursor: pointer;
  padding: 0.5rem 2rem;
  background-color: var(--primary-color);
  font-size: 1.2rem;
  color: var(--white);
  border-radius: 0.5rem;
  border: none;
  outline: none;
  margin-top: 0rem;
  width: 100%;
`;

export const IdCheckButton = styled.button`
  cursor: pointer;
  padding: 0.7rem 0.2rem;
  background-color: var(--primary-color);
  font-size: 0.8rem;
  color: var(--white);
  border-radius: 0.5rem;
  border: none;
  outline: none;
  margin-top: 0.1rem;
  width: auto;
`;

export const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
`;