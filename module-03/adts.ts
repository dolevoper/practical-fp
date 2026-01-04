import type { AxiosRequestConfig } from "axios";
import * as _ from "remeda";
import * as Either from "./adts/either.js";
import * as Reader from "./adts/reader.js";

const safeDiv = (denominator: number) => (numerator: number) => {
    if (denominator === 0) {
        return Either.left("Dividing by 0 is illegal.");
    }

    return Either.right(numerator / denominator);
};

console.log(
    _.pipe(
        100,
        safeDiv(2),
        Either.flatMap(safeDiv(10)),
        Either.flatMap(safeDiv(0)), // Uncomment this line to see an error!
        Either.flatMap(safeDiv(5)),
        Either.unbox(
            _.identity(),
            (res) => `The result is ${res}`
        )
    )
);

type User = {
    name: string,
    age: number,
    password: string,
};

const validateUserName = (user: User) => user.name === "" ?
    Either.left("User name cannot be empty") :
    Either.right(user); // not empty

const validateUserAge = (user: User) => user.age <= 0 ?
    Either.left("Age must be a positive number") :
    Either.right(user); // positive

const validatePasswordLength = (user: User) => user.password.length < 8 ?
    Either.left("Password must have at least 8 characters") :
    Either.right(user); // at least 8 characters long

const validatePasswordCharacters = (user: User) => user.password.match(/[^a-z0-9]/i) ?
    Either.left("Password can contain only alphanumeric characters") :
    Either.right(user); // alphanumeric

type AppConfig = {
    baseURL: string;
};

const createRegisterRequestConfig = (user: User) => Reader.ask(({ baseURL }: AppConfig): AxiosRequestConfig => ({
    baseURL,
    url: "/register",
    method: "post",
    data: user,
})); // get the base url from the environment variables (procss.env.BASE_URL)

const user = { name: "", age: -34, password: "Aa123456" };

// Expected result:
// Error message if user validation failed
// or
// Request config object to pass to axios

const collectErrors = <Input, ErrorType>(...validators: ((x: Input) => Either.Either<ErrorType, Input>)[]) => (obj: Input) => {
    const results = validators.map((validator) => validator(obj));
    const errors = results.filter(({ _type }) => _type === "left");

    return errors.length ?
        Either.left(errors.map(({ value }) => value)) :
        Either.right(obj);
}; 

const app = _.pipe(
    user,
    // validateUserName,
    // Either.flatMap(validateUserAge),
    // Either.flatMap(validatePasswordLength),
    // Either.flatMap(validatePasswordCharacters),
    collectErrors(validateUserName, validateUserAge, validatePasswordCharacters, validatePasswordLength),
    Either.map(createRegisterRequestConfig),
    Either.map(Reader.map((config) => config)),
    Either.map(Reader.execWith({ baseURL: "base url" })),
);

Either.unbox(
    app,
    console.error,
    console.log,
);
