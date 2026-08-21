import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LightDomMixin } from '../particles/LightDomMixin';

@customElement('ui-file-uploader')
export class FileUploader extends LightDomMixin(LitElement) {
  @property({ type: Boolean }) multiple = true;
  @property({ type: String }) accept = '.png,.jpg';

  @state()
  private files: File[] = [];

  private _handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target?.files) {
      this._addFiles(target.files);
    }
  }

  private _handleDrop(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      this._addFiles(e.dataTransfer.files);
    }
  }

  private _addFiles(fileList: FileList) {
    const incoming = Array.from(fileList);
    this.files = this.multiple ? [...this.files, ...incoming] : incoming;
    this._syncAndEmit();
  }

  private _removeFile(index: number, e: MouseEvent) {
    e.stopPropagation();
    this.files = this.files.filter((_, i) => i !== index);
    this._syncAndEmit();
  }

  private _syncAndEmit() {
    const dt = new DataTransfer();
    this.files.forEach(file => dt.items.add(file));
    
    const fileInput = this.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.files = dt.files;
    }

    this.dispatchEvent(new CustomEvent('files-changed', {
        detail: { files: this.files },
        bubbles: true,
        composed: true
    }));
  }

  render() {
    return html`
      <div 
        class="flex flex-col gap-3 cursor-pointer"
        @click="${() => (this.querySelector('input[type="file"]') as HTMLInputElement)?.click()}"
        @drop="${this._handleDrop}"
        @dragover="${(e: DragEvent) => e.preventDefault()}"
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
          <div class="p-10 border-2 border-dashed border-cherry/15 rounded-xl text-center hover:border-cherry/50 transition-colors bg-white flex flex-col items-center gap-4">
              <i class="icon-picture text-3xl bg-cherry aspect-square rounded-full p-2 text-white"></i>
              <div class="flex flex-col gap-1">
                <p class="text-2xl font-contrast text-cherry font-medium">Arraste sua arte aqui</p>
                <p class="text-sm text-muted">Ou selecione um arquivo do seu dispositivo.</p>
              </div>
              <ui-button type="heavy" additionalClasses="bg-cherry-dark w-fit">
                <i class="icon-gallery"></i>
                Selecionar arquivo
              </ui-button>
              <p class="text-xs text-gray-400 mt-1">${this.accept ? `Formatos aceitos: ${this.accept}` : 'Qualquer arquivo'}</p>
            </div>
          `
        }
      </div>
    `;
  }
}