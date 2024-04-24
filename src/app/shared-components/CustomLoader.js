import styled, { keyframes } from "styled-components";

const LoaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.67);
`;

const Spin = keyframes`
  0%   { 
            
            transform: rotate(0deg);  
        }
        100% {
            
            transform: rotate(360deg);  
        }
`;

const Loader = styled.div`
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 80px;
  height: 80px;
  margin: -55px 0 0 -55px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #3498db;
  animation: ${Spin} 2s linear infinite;
  &:before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #e74c3c;
    animation: ${Spin} 3s linear infinite;
  }
  &:after {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #f9c922;
    animation: ${Spin} 1.5s linear infinite;
  }
`;

export default function CustomLoader({ isLoading }) {
  if (!isLoading) {
    return <></>;
  }
  return (
    <LoaderWrapper>
      <Loader />
    </LoaderWrapper>
  );
}
