
class Logger {

    error(message: string, meta?: any) {
        console.error(`[ERROR] ${message}`, meta);
    }

    info(message: string, meta?: any) {
        console.log(`[INFO] ${message}`, meta);
    }

    warn(message: string, meta?: any) {
        console.warn(`[WARN] ${message}`, meta);
    }

    fatal(message: string, meta?: any) {
        console.error(`[FATAL] ${message}`, meta);
    }

    debug(message: string, meta?: any) {
        console.debug(`[DEBUG] ${message}`, meta);
    }

    trace(message: string, meta?: any) {
        console.trace(`[TRACE] ${message}`, meta);
    }



}


export const logger = new Logger;
