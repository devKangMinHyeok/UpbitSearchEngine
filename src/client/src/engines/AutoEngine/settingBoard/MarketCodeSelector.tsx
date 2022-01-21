import { useEffect } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  AlgoDataProps,
  algoDataState,
  autoMarketCodesListState,
  MarketRawProps,
} from "../../../atoms";
import { fetchMarketCodes } from "../../../fetchs/api";

const MarketCodeTableContainer = styled.div`
  border: 1px solid black;
`;

const MarketCodesTable = styled.div`
  overflow: auto;
  height: 100%;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: #e0e0e0;
  }
  &::-webkit-scrollbar-thumb {
    background: #7c7c7c;
  }
`;

const MarketCodeBox = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  background-color: ${(props) => (props.isActive ? "orange" : "#aaaaaa")};
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

interface MarketCodeSelectorProps {
  curMarketCode: string;
  setCurMarketCode: any;
}

function MarketCodeSelector({
  curMarketCode,
  setCurMarketCode,
}: MarketCodeSelectorProps) {
  const [autoMarketCodes, setAutoMarketCodes] = useRecoilState(
    autoMarketCodesListState
  );
  const [algoData, setAlgoData] = useRecoilState(algoDataState);
  const { isLoading: marketCodesLoading, data } = useQuery<MarketRawProps[]>(
    ["marketCode"],
    () => fetchMarketCodes()
  );

  useEffect(() => {
    if (!marketCodesLoading && data) {
      setAutoMarketCodes(data);
    }
  }, [data]);

  useEffect(() => {
    setAlgoData({} as AlgoDataProps);
  }, [curMarketCode]);

  const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    setCurMarketCode(evt.currentTarget.innerText);
  };

  return (
    <MarketCodeTableContainer>
      {marketCodesLoading ? (
        "Loading"
      ) : (
        <MarketCodesTable>
          {autoMarketCodes?.map((ele) => {
            return (
              <MarketCodeBox
                key={ele.market}
                onClick={handleClick}
                isActive={curMarketCode === ele.market}
              >
                <span>{ele.market}</span>
              </MarketCodeBox>
            );
          })}
        </MarketCodesTable>
      )}
    </MarketCodeTableContainer>
  );
}

export default MarketCodeSelector;
