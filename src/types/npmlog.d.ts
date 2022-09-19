declare module "npmlog" {
    export interface Logger {
        sillyV2(message: string): void;
        verboseV2(message: string): void;
        infoV2(message: string): void;
        timingV2(message: string): void;
        httpV2(message: string): void;
        noticeV2(message: string): void;
        warnV2(message: string): void;
        errorV2(message: string): void;
        silentV2(message: string): void;
        commandV2(message: string): void;
        registerV2(message: string): void;
    }
}

export {};