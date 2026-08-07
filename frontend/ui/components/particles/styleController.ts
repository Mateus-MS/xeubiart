import { ReactiveController, ReactiveControllerHost } from 'lit';

export interface StyleConfig<PresetKey extends string = string> {
	base?: string[];
	presets?: Record<PresetKey, string>;
	defaultPreset?: PresetKey;
}

export class StyleController<PresetKey extends string = string> implements ReactiveController {
	private host: ReactiveControllerHost & HTMLElement;
	private config: StyleConfig<PresetKey>;

	constructor(host: ReactiveControllerHost & HTMLElement, config: StyleConfig<PresetKey>) {
	this.host = host;
	this.config = config;

	this.host.addController(this);
	}

	hostUpdated() {
		this.applyStyles();
	}

	private applyStyles() {
		const baseClasses = this.config.base || [];

		const variant = (this.host.getAttribute('type') || this.config.defaultPreset || 'default') as PresetKey;
		const additional = (this.host.getAttribute('additionalClasses') || '').split(' ');

		const presetClasses = (this.config.presets?.[variant] || '').split(' ');

		const uniqueClasses = Array.from(
			new Set([...baseClasses, ...presetClasses, ...additional].filter(Boolean))
		);

		this.host.className = uniqueClasses.join(' ');
	}

	public requestUpdate() {
		this.host.requestUpdate();
	}
}