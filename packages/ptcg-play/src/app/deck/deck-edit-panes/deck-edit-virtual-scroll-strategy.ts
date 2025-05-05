import { VirtualScrollStrategy, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/** Virtual scrolling strategy for lists with items of known fixed size. */
export class DeckEditVirtualScrollStrategy implements VirtualScrollStrategy {
  private scrolledIndexChangeSubject = new Subject<number>();

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  scrolledIndexChange: Observable<number> = this.scrolledIndexChangeSubject.pipe(distinctUntilChanged());

  /** The attached viewport. */
  private viewport: CdkVirtualScrollViewport | null = null;

  /** The minimum amount of buffer rendered beyond the viewport (in pixels). */
  private minBufferPx: number;

  /** The number of buffer items to render beyond the edge of the viewport (in pixels). */
  private maxBufferPx: number;

  /**
   * @param imageWidth The width of the items in the virtually scrolling list.
   * @param imageHeight The height of the items in the virtually scrolling list.
   */
  constructor(private itemWidth: number, private itemHeight: number) {
    const [minBufferPx, maxBufferPx] = [ itemHeight, itemHeight * 2 ];
    this.minBufferPx = minBufferPx;
    this.maxBufferPx = maxBufferPx;
  }

  private getItemsPerRow(): number {
    const width = this.viewport._contentWrapper.nativeElement.offsetWidth;
    return Math.max(1, Math.floor(width / this.itemWidth));
  }

  /**
   * Attaches this scroll strategy to a viewport.
   * @param viewport The viewport to attach this strategy to.
   */
  attach(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  /** Detaches this scroll strategy from the currently attached viewport. */
  detach() {
    this.scrolledIndexChangeSubject.complete();
    this.viewport = null;
  }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onContentScrolled() {
    this._updateRenderedRange();
  }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onDataLengthChanged() {
    this._updateTotalContentSize();
    this._updateRenderedRange();
  }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onContentRendered() { /* no-op */ }

  /** @docs-private Implemented as part of VirtualScrollStrategy. */
  onRenderedOffsetChanged() { /* no-op */ }

  /**
   * Scroll to the offset for the given index.
   * @param index The index of the element to scroll to.
   * @param behavior The ScrollBehavior to use when scrolling.
   */
  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (this.viewport) {
      const itemsPerRow = this.getItemsPerRow();
      const rowIndex = Math.ceil(index / itemsPerRow);
      this.viewport.scrollToOffset(rowIndex * this.itemHeight, behavior);
    }
  }

  /** Update the viewport's total content size. */
  private _updateTotalContentSize() {
    if (!this.viewport) {
      return;
    }

    const itemsPerRow = this.getItemsPerRow();
    const rows = Math.ceil(this.viewport.getDataLength() / itemsPerRow);
    this.viewport.setTotalContentSize(rows * this.itemHeight);
  }

  /** Update the viewport's rendered range. */
  private _updateRenderedRange() {
    if (!this.viewport) {
      return;
    }

    const itemsPerRow = this.getItemsPerRow();
    const scrollOffset = this.viewport.measureScrollOffset();
    const firstVisibleIndex = Math.floor(scrollOffset / this.itemHeight) * itemsPerRow;
    const renderedRange = this.viewport.getRenderedRange();
    const newRange = {start: renderedRange.start, end: renderedRange.end};
    const viewportSize = this.viewport.getViewportSize();
    const dataLength = this.viewport.getDataLength();

    const startBuffer = scrollOffset - Math.floor(newRange.start / itemsPerRow) * this.itemHeight;
    if (startBuffer < this.minBufferPx && newRange.start !== 0) {
      const expandStart = Math.floor((this.maxBufferPx - startBuffer) / this.itemHeight) * itemsPerRow;
      newRange.start = Math.max(0, newRange.start - expandStart);
      newRange.end = Math.min(dataLength,
          firstVisibleIndex + Math.ceil((viewportSize + this.minBufferPx) / this.itemHeight) * itemsPerRow);
    } else {
      const endBuffer = Math.ceil(newRange.end / itemsPerRow) * this.itemHeight - (scrollOffset + viewportSize);
      if (endBuffer < this.minBufferPx && newRange.end !== dataLength) {
        const expandEnd = Math.ceil((this.maxBufferPx - endBuffer) / this.itemHeight) * itemsPerRow;
        if (expandEnd > 0) {
          newRange.end = Math.min(dataLength, newRange.end + expandEnd);
          newRange.start = Math.max(0,
              firstVisibleIndex - Math.floor(this.minBufferPx / this.itemHeight) * itemsPerRow);
        }
      }
    }

    this.viewport.setRenderedRange(newRange);
    this.viewport.setRenderedContentOffset(this.itemHeight * Math.floor(newRange.start / itemsPerRow));
    this.scrolledIndexChangeSubject.next(Math.floor(firstVisibleIndex));
  }
}
