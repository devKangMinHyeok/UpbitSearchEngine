import { run } from "./index";

const home = async (req, res) => {
  run();
  return res.send("done");
};

export default home;
