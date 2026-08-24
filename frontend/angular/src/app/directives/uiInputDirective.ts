import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

/**
 * Angular adapter for the Lit <ui-input> Web Component.
 *
 * It exposes the Web Component's `value` and `valueChange` as
 * Angular @Input/@Output, allowing:
 *
 *     <ui-input [(value)]="title"></ui-input>
 *
 * The Lit component itself remains framework-independent.
 */
@Directive({
    selector: 'ui-input, ui-dropdown',
    standalone: true,
})
export class UiInputDirective implements OnInit, OnDestroy {

    /**
     * Angular side of the two-way binding.
     *
     * [(value)] requires:
     *   [value] + (valueChange)
     */
    @Output()
    valueChange = new EventEmitter<string>();

    /**
     * Receives the CustomEvent emitted by the Lit component and
     * forwards its detail through Angular's EventEmitter.
     */
    private listener = (event: Event) => {
        const customEvent = event as CustomEvent<string>;

        this.valueChange.emit(customEvent.detail);
    };

    /**
     * Reference to the actual <ui-input> DOM element.
     */
    constructor(
        private element: ElementRef<HTMLElement & { value: string }>
    ) {}

    /**
     * Angular side of [value].
     *
     * Forwards Angular's value to the Lit Web Component.
     */
    @Input()
    set value(value: string) {
        this.element.nativeElement.value = value;
    }

    /**
     * Start listening to the Lit Web Component's custom event.
     */
    ngOnInit() {
        this.element.nativeElement.addEventListener(
            'valueChange',
            this.listener
        );
    }

    /**
     * Remove the event listener when Angular destroys the directive.
     */
    ngOnDestroy() {
        this.element.nativeElement.removeEventListener(
            'valueChange',
            this.listener
        );
    }
}