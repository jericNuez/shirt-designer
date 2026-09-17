export type ExportTarget = '3d_mockup' | 'print_template';

export type ExportFormat = 'png' | 'jpg' | 'jpeg' | 'psd';

export type MockupBackground = 'transparent' | 'studio' | 'black' | 'white' | 'gradient';

export type ExportResolution = '1x' | '2x' | '4x' | 'print_300dpi';

export interface ExportOptions {
  target: ExportTarget;
  format: ExportFormat;
  resolution: ExportResolution;
  background: MockupBackground;
  includeMeasurements: boolean;
  fileName: string;
}
