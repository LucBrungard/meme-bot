import type {Config} from "jest";
// import {defaults} from "jest-config";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    // verbose: true,
    // errorOnDeprecated: true,
    // transform: {},
    // extensionsToTreatAsEsm: [
    //     ".ts"
    // ],
    // moduleFileExtensions: [...defaults.moduleFileExtensions, "mts"],
    // cache: false,
};

export default config;