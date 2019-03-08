/*
	A custom typings file is used to declare types that are created outside of your angular application, so the TypeScript compiler is aware of them and doesn't give you errors about unknown types. This typings file contains a declaration for the global config object that is created by webpack (see webpack.config.js below).
*/
/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var jsPDF: any;
interface Document {
    msExitFullscreen: any;
    mozCancelFullScreen: any;
    mozFullScreenElement:any;
    msFullscreenElement:any;
}
declare var L:any;