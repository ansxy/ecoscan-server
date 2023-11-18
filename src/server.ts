import express from "express";
import scanRouter from "./routes/scan.route";
import { userRoute } from "./routes/user.route";
const app = express();
const port = 3002;

// app.use("/tes");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello NOD Readers!");
});

app.use("/scan", scanRouter);
app.use("/user", userRoute);
app.listen(port, () => {
  return console.log(
    `Express server is listening at http://localhost:${port} 🚀`
  );
});

export const router = express.Router();
module.exports = router;
