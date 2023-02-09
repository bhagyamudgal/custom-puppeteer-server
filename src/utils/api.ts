import { Response } from "express";

export type ApiResponseType = {
    success: boolean;
    message: string;
    result: any;
};

export const apiResponse = ({ success, message, result }: ApiResponseType) => {
    return {
        success,
        message,
        result,
    };
};

export const errorHandler = (error: any) => {
    return apiResponse({
        success: false,
        message: error?.message ?? "Something went wrong!",
        result: null,
    });
};

export const successHandler = (result: any, message: string) => {
    return apiResponse({
        success: true,
        message,
        result,
    });
};

export const handleInvalidRoute = (res: Response) => {
    return res.status(404).end("Route Not Found!");
};

export const handleApiRouteError = (error: any, res: Response) => {
    return res.status(500).json(errorHandler(error));
};

export const handleApiClientError = (res: Response) => {
    const error = new Error("Wrong Parameters Provided!");
    return res.status(400).json(errorHandler(error));
};
