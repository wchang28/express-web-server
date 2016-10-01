/// <reference types="express-serve-static-core" />
import * as core from 'express-serve-static-core';
export interface IHTTPServerConfig {
    port?: number;
    host?: string;
}
export interface ISSLConfig {
    private_key_file: string;
    certificate_file: string;
    ca_files?: string[];
}
export interface IHTTPSServerConfig extends IHTTPServerConfig {
    ssl: ISSLConfig;
}
export interface IWebServerConfig {
    http?: IHTTPServerConfig;
    https?: IHTTPSServerConfig;
}
declare function startServer(webServerConfig: IWebServerConfig, app: core.Express, done: (secure: boolean, host: string, port: number) => void, errorCallback?: (err: any) => void): void;
export { startServer };
