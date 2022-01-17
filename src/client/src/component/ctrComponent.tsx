import styled from "styled-components";

export const ControlContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

export const ControllerBox = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

export const Parameters = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Parameter = styled.div`
  padding-left: 20px;
  display: flex;
  justify-content: flex-start;
  gap: 10px;
`;

export const CtrBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CtrBtn = styled.button`
  width: 100px;
  height: 20px;
`;
