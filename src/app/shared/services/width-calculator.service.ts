import { FormatValueService } from './value-formater.service';
import { TemplateField } from '../components/form/fields/template-field';

export class WidthCalculator {
  /** Returns the column width as px string or null */
  static getColumnWidth(
    col: any,
    items: any[] = [],
    fixedHeight = true
  ): string | null {
    // If width is explicitly set, use it
    if (col.width && col.width > 0) {
      return col.width + 'px';
    }

    // If height is not fixed, we cannot calculate width
    if (!fixedHeight) {
      return null;
    }

    return this.computeColumnWidthPx(col, items);
  }

  /** Safely get nested property value from item */
  private static getValueByPath(item: any, path: string): string {
    if (!item || !path) return '';
    return path
      .split('.')
      .reduce((acc, k) => (acc?.[k] != null ? acc[k] : ''), item)
      .toString()
      .trim();
  }

  /** Compute column width based on label and content */
  private static computeColumnWidthPx(col: any, items: any[]): string {
    const label = col.label.tr() || '';
    const key = col.key;
    const type = col.type || '';

    // Measure label width
    const labelWidth = this.measureTextWidth(label);

    // Find max content string for visible items
    let maxContent = '';

    if (items?.length) {
      maxContent = items
        .map((item) => {
          let value = this.getValueByPath(item, key);

          // Format based on type
          switch (type) {
            case 'datetime':
              value = FormatValueService.formatDatetimeForDisplay(value);
              break;
            case 'date':
              value = FormatValueService.formatDateForDisplay(value);
              break;
            case 'time':
              value = FormatValueService.formatTimeForDisplay
                ? FormatValueService.formatTimeForDisplay(value)
                : value;
              break;
            case 'currency':
            case 'rate':
              value = FormatValueService.formatNumber(value);
              break;
          }

          return value;
        })
        .reduce((a, b) => (a.length > b.length ? a : b), '');
    }

    // Measure max content width
    const contentWidth = this.measureTextWidth(maxContent);

    // Padding: cell + sorting icon + buffer
    const paddingPx = 40;

    // Return final width, enforce minimum width
    const widthPx = Math.max(labelWidth, contentWidth) + paddingPx;
    return `${Math.max(widthPx, 100)}px`;
  }

  /** Use canvas to measure text width accurately */
  private static measureTextWidth(
    text: string,
    font: string = '15px Arial'
  ): number {
    const canvas =
      this.canvas || (this.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    if (!context) return 100;

    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  private static canvas: HTMLCanvasElement | null = null;
}
