declare module 'qr-code-styling' {
  interface Options {
    width?: number;
    height?: number;
    data?: string;
    margin?: number;
    image?: string;
    qrOptions?: {
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    };
    dotsOptions?: {
      color?: string;
      type?: string;
    };
    backgroundOptions?: {
      color?: string;
    };
    imageOptions?: {
      crossOrigin?: string;
      margin?: number;
      imageSize?: number;
      borderRadius?: number;
    };
  }

  interface DownloadOptions {
    name?: string;
    extension?: 'svg' | 'png' | 'jpeg' | 'webp';
  }

  class QRCodeStyling {
    constructor(options: Options);
    append(container: HTMLElement): void;
    update(options: Partial<Options>): void;
    download(options?: DownloadOptions): void;
  }

  export default QRCodeStyling;
}
