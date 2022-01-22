import { useRecoilState } from "recoil";
import styled from "styled-components";
import { AutoSearchActiveState } from "../../../atoms";

const Container = styled.div``;

const RunBtn = styled.div`
  border: black 1px solid;
`;

function SearchController() {
  const [autoSearchActive, setAutoSearchActive] = useRecoilState(
    AutoSearchActiveState
  );

  const handleClick = () => {
    setAutoSearchActive((prev) => !prev);
  };

  return (
    <Container>
      <RunBtn onClick={handleClick}>{autoSearchActive ? "Run" : "Stop"}</RunBtn>
    </Container>
  );
}

export default SearchController;
