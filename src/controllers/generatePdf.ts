import { Request, Response } from "express";
import puppeteer from "puppeteer";
import {
    ApiResponseType,
    handleApiClientError,
    handleApiRouteError,
    successHandler,
} from "../utils/api";

export default async function generatePdf(
    req: Request,
    res: Response<ApiResponseType>
) {
    try {
        const { data, generateSingle } = req.body;

        if (!data) {
            return handleApiClientError(res);
        }

        const browser = await puppeteer.launch();

        const page = await browser.newPage();

        const url = `${process.env.APP_URL}?data=${encodeURIComponent(
            JSON.stringify(data)
        )}&generateSingle=${encodeURIComponent(generateSingle)}&secret=${
            process.env.SECRET
        }`;

        await page.goto(url);

        let element;

        if (generateSingle) {
            element = await page.waitForSelector("#single-stream");
        } else {
            element = await page.waitForSelector("#stream-details");
        }

        const pdf = await page.pdf({
            format: "a4",
            scale: 0.8,
        });

        await browser.close();

        const base64 = pdf.toString("base64");
        const result = `data:application/pdf;base64,${base64}`;

        return res
            .status(200)
            .json(successHandler(result, "Pdf generated successfully!"));
    } catch (error) {
        console.error("generatePdf =>", error);
        return handleApiRouteError(error, res);
    }
}
