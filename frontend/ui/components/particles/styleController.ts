import { ReactiveControllerHost } from 'lit';

export interface StyleConfig<PresetKey extends string = string> {
    base?: string[];
    presets?: Record<PresetKey, string>;
    defaultPreset?: PresetKey;
}

export class StyleController<PresetKey extends string = string> {
    private host: ReactiveControllerHost & HTMLElement;
    private config: StyleConfig<PresetKey>;

    constructor(
        host: ReactiveControllerHost & HTMLElement,
        config: StyleConfig<PresetKey>
    ) {
        this.host = host;
        this.config = config;
    }

    public get classes(): string {
        const baseClasses = this.config.base ?? [];

        const preset = (
            this.host.getAttribute('type') ??
            this.config.defaultPreset ??
            'default'
        ) as PresetKey;

        const presetClasses =
            this.config.presets?.[preset]?.split(' ') ?? [];

        return Array.from(
            new Set(
                [...baseClasses, ...presetClasses]
                    .filter(Boolean)
            )
        ).join(' ');
    }

    public requestUpdate() {
        this.host.requestUpdate();
    }
}