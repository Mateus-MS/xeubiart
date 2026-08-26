import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LightDomMixin } from '../particles/LightDomMixin';

@customElement('ui-file-uploader')
export class FileUploader extends LightDomMixin(LitElement) {
	@property({ type: Boolean }) multiple = true;
	@property({ type: String }) accept = '.png,.jpg';

	public open() {
		this._getInput()?.click();
	}

	private _handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;

		if (input.files?.length) {
			this._emitFiles(input.files);
		}
	}

  	private _handleDrop(e: DragEvent) {
    	e.preventDefault();

		if (e.dataTransfer?.files.length) {
			this._emitFiles(e.dataTransfer.files);
		}
  	}

	private _emitFiles(fileList: FileList) {
		const files = Array.from(fileList);

		this.dispatchEvent(
			new CustomEvent('files-uploaded', {
				detail: { files },
				bubbles: true,
				composed: true,
			}),
		);
	}

  	render() {
		return html`
			<div
				class="flex flex-col gap-3 cursor-pointer hover:shadow-[0_8px_22px_rgba(139,26,43,0.18)] transition-all"
				@click="${this._handleClick}"
				@drop="${this._handleDrop}"
				@dragover="${this._handleDragOver}"
			>
				<input
					type="file"
					name="uploads[]"
					class="hidden"
					?multiple="${this.multiple}"
					accept="${this.accept}"
					@change="${this._handleFileChange}"
				>

				${this.slottedChildren.length > 0
				? this.renderSlottedChildren()
				: html`
					<div
						class="p-10 border-2 border-dashed border-cherry/15 rounded-xl
							text-center hover:border-cherry/50 transition-colors
							bg-white flex flex-col items-center gap-4"
					>
						<i
						class="icon-picture text-3xl bg-cherry aspect-square
								rounded-full p-2 text-white"
						></i>

						<div class="flex flex-col gap-1">
						<p class="text-2xl font-contrast text-cherry font-medium">
							Arraste sua arte aqui
						</p>

						<p class="text-sm text-muted">
							Ou selecione um arquivo do seu dispositivo.
						</p>
						</div>

						<ui-button
							type="heavy"
							additionalClasses="bg-cherry-dark w-fit"
							>
							<i class="icon-gallery"></i>
							Selecionar arquivo
						</ui-button>

						<p class="text-xs text-gray-400 mt-1">
							${this.accept
								? `Formatos aceitos: ${this.accept}`
								: 'Qualquer arquivo'}
						</p>
					</div>
					`}
			</div>
		`;
  	}

  	private _handleClick = (e: MouseEvent) => {
		// Don't trigger the file picker if the click originated
		// from the input itself.
		if (e.target instanceof HTMLInputElement) {
			return;
		}

    	this._getInput()?.click();
	};

  	private _handleDragOver = (e: DragEvent) => {
    	e.preventDefault();
  	};

  	private _getInput() {
    	return this.querySelector<HTMLInputElement>('input[type="file"]');
  	}
}