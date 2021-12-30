/* Copyright Kang MinHyeok - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kang MinHyeok <rkdalsgur032@gmail.com>, December 2021
 */

import "dotenv/config";
import app from "./server";

const getTimeNow = () => {
  const time = new Date();
  const hour = time.getHours().toString().padStart(2, "0");
  const minute = time.getMinutes().toString().padStart(2, "0");
  const second = time.getSeconds().toString().padStart(2, "0");

  return `${hour}:${minute}:${second}`;
};

// const generatePostNum = (localPort) => {
//   const PORT = process.env.PORT || localPort;
//   return PORT;
// };

// const PORT = generatePostNum(process.env.LOCAL_PORT);
const PORT = 4000;
const handleListening = () => {
  console.log(
    `[${getTimeNow()}] Server listening on port 
      localhost:4000`
  );
};

app.listen(PORT, handleListening);
