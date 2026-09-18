import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appInViewport]',
  standalone: true
})
export class InViewportDirective implements OnInit, OnDestroy {
	@Output() inViewport = new EventEmitter<void>();

	private observer!: IntersectionObserver;
	triggerAt: string = '200px';

	constructor(private el: ElementRef) {}

	ngOnInit() {
		this.observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				this.inViewport.emit();
			}
		}, {
			root: null,
			rootMargin: this.triggerAt,
			threshold: 0.1
		});

		this.observer.observe(this.el.nativeElement);
	}

	ngOnDestroy() {
		if (this.observer) {
			this.observer.disconnect();
		}
  }
}