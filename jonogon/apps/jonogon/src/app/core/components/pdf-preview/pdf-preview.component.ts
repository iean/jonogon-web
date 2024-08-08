import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as pdfjs from 'pdfjs-dist';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LanguageWrapperService } from '../../services/language-wrapper.service';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'eino-pdf-preview',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    MenuModule,
    TooltipModule,
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
})
export class PdfPreviewComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  pdfDoc: pdfjs.PDFDocumentProxy | null = null;
  currentPage = 1;
  pageRendering = false;
  pageNumPending: number | null = null;
  scale = 1.0;
  maxScale = 5;
  minScale = 0.1;
  rotation = 0;
  totalPage = 0;
  scaleStep = 0.1;
  uiScale = '100%';

  isLoading = false;

  zoomMenu: MenuItem[] = [
    {
      label: this.languageService.getInstantTranslation(
        'pdf_viewer.page_width'
      ),
      command: () => {
        this.zoomToPageWidth(
          this.languageService.getInstantTranslation('pdf_viewer.page_width')
        );
      },
    },
    {
      label: this.languageService.getInstantTranslation(
        'pdf_viewer.page_height'
      ),
      command: () => {
        this.zoomToPageHeight(
          this.languageService.getInstantTranslation('pdf_viewer.page_height')
        );
      },
    },
    {
      label: this.languageService.getInstantTranslation('pdf_viewer.page_fit'),
      command: () => {
        this.zoomToPageFit(
          this.languageService.getInstantTranslation('pdf_viewer.page_fit')
        );
      },
    },
    {
      label: '50%',
      command: () => {
        this.zoomTo(0.5);
      },
    },
    {
      label: '75%',
      command: () => {
        this.zoomTo(0.75);
      },
    },
    {
      label: '100%',
      command: () => {
        this.zoomTo(1);
      },
    },
    {
      label: '125%',
      command: () => {
        this.zoomTo(1.25);
      },
    },
    {
      label: '150%',
      command: () => {
        this.zoomTo(1.5);
      },
    },
    {
      label: '200%',
      command: () => {
        this.zoomTo(2);
      },
    },
  ];
  mobileMenu: MenuItem[] = [
    {
      label: this.languageService.getInstantTranslation(
        'pdf_viewer.page_width'
      ),
      command: () => {
        this.zoomToPageWidth(
          this.languageService.getInstantTranslation('pdf_viewer.page_width')
        );
      },
    },
    {
      label: this.languageService.getInstantTranslation(
        'pdf_viewer.page_height'
      ),
      command: () => {
        this.zoomToPageHeight(
          this.languageService.getInstantTranslation('pdf_viewer.page_height')
        );
      },
    },
    {
      label: this.languageService.getInstantTranslation('pdf_viewer.page_fit'),
      command: () => {
        this.zoomToPageFit(
          this.languageService.getInstantTranslation('pdf_viewer.page_fit')
        );
      },
    },
    { separator: true },
    {
      label: this.languageService.getInstantTranslation(
        'pdf_viewer.rotate_clock'
      ),
      command: () => {
        this.rotateClockwise();
      },
    },
    {
      label: this.languageService.getInstantTranslation(
        'pdf_viewer.rotate_anticlock'
      ),
      command: () => {
        this.rotateAntiClockwise();
      },
    },
  ];

  @Input({ required: true }) url!: string;
  @Input() isBloackSize = true;
  constructor(private languageService: LanguageWrapperService) {}

  ngAfterViewInit(): void {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'assets/pdfjs/pdf.worker.min.js',
      import.meta.url
    ).toString();

    this.isLoading = true;
    pdfjs.getDocument(this.url).promise.then((pdf) => {
      this.isLoading = false;
      this.pdfDoc = pdf;
      this.totalPage = pdf.numPages;

      this.renderPage(this.currentPage);
    });
  }

  getPageScale() {
    const containerStyle = getComputedStyle(this.container.nativeElement);
    const containerHeight =
      this.container.nativeElement.clientHeight -
      parseFloat(containerStyle.paddingTop) -
      parseFloat(containerStyle.paddingBottom);
    const containerWidth =
      this.container.nativeElement.clientWidth -
      parseFloat(containerStyle.paddingLeft) -
      parseFloat(containerStyle.paddingRight);
    const canvasHeight = this.canvas.nativeElement.clientHeight;
    const canvasWidth = this.canvas.nativeElement.clientWidth;

    const pageWidthScale = (containerWidth / canvasWidth) * this.scale;
    const pageHeightScale = (containerHeight / canvasHeight) * this.scale;

    return [pageWidthScale, pageHeightScale] as const;
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPage) return;

    this.currentPage = pageNumber;
    this.queueRenderPage(this.currentPage);
  }

  zoomIn() {
    this.zoomTo((this.scale += this.scaleStep));
  }

  zoomOut() {
    this.zoomTo((this.scale -= this.scaleStep));
  }

  zoomTo(scale: number) {
    if (scale < this.minScale || scale > this.maxScale) return;

    this.scale = scale;
    this.uiScale = `${Math.round(this.scale * 100)}%`;
    this.queueRenderPage(this.currentPage);
  }

  zoomPage(evt: WheelEvent) {
    if (!evt.ctrlKey && !evt.metaKey) return;
    evt.preventDefault();

    const previousScale = this.scale;
    const direction = evt.deltaY < 0 ? 1 : -1;
    const newScale = this.scale + this.scaleStep * direction;

    this.zoomTo(newScale);

    if (previousScale !== this.scale) {
      const scaleCorrectionFactor = newScale / previousScale - 1;
      const top = this.container.nativeElement.offsetTop;
      const left = this.container.nativeElement.offsetLeft;
      const dx = evt.clientX - left;
      const dy = evt.clientY - top;
      this.container.nativeElement.scrollLeft += dx * scaleCorrectionFactor;
      this.container.nativeElement.scrollTop += dy * scaleCorrectionFactor;
    }
  }

  zoomToPageWidth(uiScale: string) {
    const [pageWidthScale] = this.getPageScale();
    this.scale = pageWidthScale;
    this.uiScale = uiScale;
    this.queueRenderPage(this.currentPage);
  }

  zoomToPageHeight(uiScale: string) {
    const [, pageHeightScale] = this.getPageScale();
    this.scale = pageHeightScale;
    this.uiScale = uiScale;
    this.queueRenderPage(this.currentPage);
  }

  zoomToPageFit(uiScale: string) {
    const [pageWidthScale, pageHeightScale] = this.getPageScale();
    this.scale = Math.min(pageWidthScale, pageHeightScale);
    this.uiScale = uiScale;
    this.queueRenderPage(this.currentPage);
  }

  rotateClockwise() {
    this.rotation += 90;
    if (this.rotation == 360) this.rotation = 0;
    this.queueRenderPage(this.currentPage);
  }

  rotateAntiClockwise() {
    this.rotation -= 90;
    if (this.rotation < 0) this.rotation = 270;
    this.queueRenderPage(this.currentPage);
  }

  pageChange(evt: KeyboardEvent) {
    if (evt.key === 'Enter') {
      const target = evt.target as HTMLInputElement;
      target.blur();
      const pageNumber = parseInt(target.value, 10);

      if (
        Number.isNaN(pageNumber) ||
        pageNumber < 1 ||
        pageNumber > this.totalPage
      ) {
        target.value = this.currentPage.toString();
        return;
      }

      this.goToPage(pageNumber);
    }
  }

  renderPage(pageNumber: number) {
    this.pageRendering = true;

    this.pdfDoc?.getPage(pageNumber).then((page) => {
      const viewport = page.getViewport({
        scale: this.scale,
        rotation: this.rotation,
      });
      this.canvas.nativeElement.height = viewport.height;
      this.canvas.nativeElement.width = viewport.width;

      const renderContext = {
        canvasContext: this.canvas.nativeElement.getContext('2d')!,
        viewport,
      };
      const renderTask = page.render(renderContext);
      renderTask.promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending !== null) {
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
      });
    });

    this.currentPage = pageNumber;
  }

  queueRenderPage(num: number) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }
}
