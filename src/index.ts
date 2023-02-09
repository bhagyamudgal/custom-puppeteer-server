import express from "express";
import dotenv from "dotenv";
import Cors from "cors";
import generatePdf from "./controllers/generatePdf";

dotenv.config();

const app = express();
const port = process.env.PORT;
let origins: any = process.env.ORIGINS;
let secret: any = process.env.SECRET;

if (origins) {
    origins = origins.split(",");
} else {
    origins = "*";
}

const cors = Cors({ origin: [origins] });

app.use(cors);
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Custom Puppeteer Server is running!" });
});

app.post("/generatePdf", (req, res) => {
    if (req.headers.authorization !== secret) {
        return res
            .status(401)
            .json({ success: false, message: "Unauthorized!" });
    }

    return generatePdf(req, res);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
