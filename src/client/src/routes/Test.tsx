import { useEffect, useState } from "react";

function Test() {
  const [connect, setConnect] = useState(false);
  useEffect(() => {
    (async () => {
      await fetch("http://localhost:4000/api/test", { method: "GET" });
      setConnect(true);
    })();
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
}
export default Test;
