export interface PdfConfigs {
  marginRight: number;
  marginLeft: number;
  marginBottom: number;
  marginTop: number;
  textFontSize: number;
  titleFontSize: number;
  pageOrientation: string;
  pageFormat: string;
  showHeader: boolean;
  showFooter: boolean;
  waterMark: string;
  password: boolean | null;
}
