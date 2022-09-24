import log from "npmlog";
import { getDate } from "./date-formatter";

const formatLogger = () => {
    log.enableColor();
    log.addLevel("command", 10000, { fg: "yellow" });
    log.addLevel("register", 10000, { fg: "blue" });
    
    // Define logger functions V2
    log.silentV2 = (message: string) => {
        log.silent(getDate(), message);
    };
    log.sillyV2 = (message: string) => {
        log.silly(getDate(), message);
    };
    log.verboseV2 = (message: string) => {
        log.verbose(getDate(), message);
    };
    log.infoV2 = (message: string) => {
        log.info(getDate(), message);
    };
    log.timingV2 = (message: string) => {
        log.timing(getDate(), message);
    };
    log.httpV2 = (message: string) => {
        log.http(getDate(), message);
    };
    log.noticeV2 = (message: string) => {
        log.notice(getDate(), message);
    };
    log.warnV2 = (message: string) => {
        log.warn(getDate(), message);
    };
    log.errorV2 = (message: string) => {
        log.error(getDate(), message);
    };
    log.commandV2 = (message: string) => {
        log.command(getDate(), message);
    };
    log.registerV2 = (message: string) => {
        log.register(getDate(), message);
    };
};

export { formatLogger };
