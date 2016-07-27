import * as http from 'http';
import * as https from 'https';
import * as core from 'express-serve-static-core';
import * as express from 'express';
import * as net from 'net';
import * as fs from 'fs';

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

function startServer(webServerConfig: IWebServerConfig, app: core.Express, done:(secure: boolean, host:string, port:number) => void, errorCallback?:(err:any) => void ) : void {
	let server: net.Server = null;
	let wsConfig: IHTTPServerConfig = null;
	if (webServerConfig.https) {
		wsConfig = webServerConfig.https;
		let httpsConfig = webServerConfig.https;
		let sslConfig = httpsConfig.ssl;
		let private_key_file = sslConfig.private_key_file;
		let certificate_file = sslConfig.certificate_file;
		let ca_files = sslConfig.ca_files;
		let privateKey  = fs.readFileSync(private_key_file, 'utf8');
		let certificate = fs.readFileSync(certificate_file, 'utf8');
		let credentials:https.ServerOptions = {key: privateKey, cert: certificate};
		if (ca_files && ca_files.length > 0) {
			let ca:string[] = [];
			for (let i in ca_files)
				ca.push(fs.readFileSync(ca_files[i], 'utf8'));
			credentials.ca = ca;
		}
		server = https.createServer(credentials, app);
	} else {
		wsConfig = webServerConfig.http;
		server = http.createServer(app);
	}
	let port = (wsConfig.port ? wsConfig.port : (webServerConfig.https ? 443 : 80));
	let host = (wsConfig.host ? wsConfig.host : "0.0.0.0");	
	server.on('error', (err:any) => {
		if (typeof errorCallback === 'function') errorCallback(err);
	});
	server.listen(port, host, () => {
		let host = server.address().address;
		let port = server.address().port;
		if (typeof done === 'function') done((webServerConfig.https ? true : false), host, port);
	});
}

export {startServer};