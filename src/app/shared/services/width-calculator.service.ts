import { FormatValueService } from './formateur-value.service';

export class WidthCalculator {
  // You must provide items and fixedHeight when calling getColumnWidth
  static getColumnWidth(
    col: any,
    items: any[] = [],
    fixedHeight = true
  ): string | null {
    if (col.width !== undefined && col.width !== null && col.width > 0) {
      return col.width + 'px';
    }

    if (!fixedHeight) {
      return null;
    }

    return WidthCalculator.computeColumnWidthPx(col, items);
  }

  private static computeColumnWidthPx(col: any, items: any[]): string {
    const label = col.label || '';
    const key = col.key;
    const type = col.type || '';

    // Measure label width in px
    const labelWidth = WidthCalculator.measureTextWidth(label.trim());

    // Find max content string in items for the key
    const maxContent =
      items && items.length > 0
        ? items
            .map((item) => {
              let content = item[key] ? item[key].toString().trim() : '';

              // Format values based on type
              switch (type) {
                case 'datetime':
                  content =
                    FormatValueService.formatDatetimeForDisplay(content);
                  break;
                case 'date':
                  content = FormatValueService.formatDateForDisplay(content);
                  break;
                case 'time':
                  content = FormatValueService.formatTimeForDisplay
                    ? FormatValueService.formatTimeForDisplay(content)
                    : content;
                  break;
                case 'currency':
                case 'rate':
                  content = FormatValueService.formatNumber(content);
                  break;
                default:
                  break;
              }
              return content;
            })
            .reduce((a, b) => (a.length > b.length ? a : b), '')
        : '';

    // Measure max content width in px
    const contentWidth = WidthCalculator.measureTextWidth(maxContent);

    // Add padding for safety
    const paddingPx = 42;

    // Return the bigger width plus padding, as a string with px unit
    const widthPx = Math.max(labelWidth, contentWidth) + paddingPx;

    return `${Math.max(widthPx, 100)}px`; // minimum 100px width
  }

  private static measureTextWidth(
    text: string,
    font: string = '16px Arial'
  ): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 100; // fallback width

    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
}
