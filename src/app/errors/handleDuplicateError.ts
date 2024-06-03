import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (error: any): TGenericErrorResponse => {

    const match = error.message.match(/"([^"]*)"/);

    // The extracted value will be in the first capturing group
    const extractedMessage = match && match[1];



    const errorSources: TErrorSources = [{
        path: " ",
        message: `${extractedMessage} is already exists`
    }];

    const statusCode = 400;
    return {
        statusCode,
        message: "Invalid Id",
        errorSources
    }
};


export default handleDuplicateError;

