import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [connect, setConnect] = useState(false);
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:4000/api/home", { method: "GET" });
      setConnect(true);
    })();
  }, []);

  return connect ? (
    <div>
      <h1>HEllo</h1>
      <Link to={{ pathname: "/test" }}>test</Link>
    </div>
  ) : (
    <h1>Loading</h1>
  );
}
export default Home;
