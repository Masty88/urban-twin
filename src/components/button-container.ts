import { LitElement, html } from 'lit';
import {styles} from "../styles/styles";
import { customElement, property, queryAll } from 'lit/decorators.js';
import { Cesium3DTileset, DataSource } from 'cesium';

@customElement('button-container')
export class ButtonContainer extends LitElement {
    @property({ type: Array })
    data: Array<{
        key: string;
        url: string;
        contour: boolean;
        icon?: string;
        description?: string;
        dataSource?: DataSource;
    }> = [];

    @property({ type: Array })
    tilesetUrl: Array<{
        key: string;
        url: string;
        icon?: string;
        description?: string;
        tileset?: Cesium3DTileset;
    }> = [];

    @queryAll('.toggleButton')
    private toggleButtons!: NodeListOf<HTMLButtonElement>;

    static override styles = styles;

    override render() {
        return html`
      <div id="buttonContainer">
        <h2 class="groupTitle">Layers</h2>
        ${this.tilesetUrl.map(
            item => html`
            <button class="toggleButton" @click="${() => this.toggleTileset(item.key)}">
              <div class="buttonContent">
                ${item.icon
                ? html`<img class="icon" src="${item.icon}" alt="Icon for ${item.key}" width="25" height="25">`
                : ''}
                ${item.description ? html`<span class="buttonDescription">${item.description}</span>` : ''}
              </div>
            </button>
          `
        )}
        <h2 class="groupTitle">Data</h2>
        ${this.data.map(
            item => html`
            <button class="toggleButton" @click="${() => this.toggleData(item.key)}">
              <div class="buttonContent">
                ${item.icon
                ? html`<img class="icon" src="${item.icon}" alt="Icon for ${item.key}" width="25" height="25">`
                : ''}
                ${item.description ? html`<span class="buttonDescription">${item.description}</span>` : ''}
              </div>
            </button>
          `
        )}
      </div>
    `;
    }

    toggleData(key: string) {
        const event = new CustomEvent('toggle-data', {
            detail: {
                key: key
            }
        });
        this.dispatchEvent(event);
    }

    toggleTileset(key: string) {
        const event = new CustomEvent('toggle-tileset', {
            detail: {
                key: key
            }
        });
        this.dispatchEvent(event);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'button-container': ButtonContainer;
    }
}
