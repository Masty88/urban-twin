import { LitElement, html } from 'lit';
import {styles} from "../styles/styles";
import { customElement, property } from 'lit/decorators.js';
import { Cesium3DTileset } from 'cesium';

@customElement('layer-container')
export class LayerContainer extends LitElement {
    @property({ type: Array })
    tilesetUrl: Array<{
        key: string;
        url: string;
        icon?: string;
        description?: string;
        tileset?: Cesium3DTileset;
    }> = [];

    static override styles = styles;

    override render() {
        return html`
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
    `;
    }

    toggleTileset(key: string) {
        const tilesetInfo = this.tilesetUrl.find(item => item.key === key);
        if (tilesetInfo && tilesetInfo.tileset) {
            const event = new CustomEvent('toggle-tileset', {
                detail: {
                    key: key
                }
            });
            this.dispatchEvent(event);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'layer-container': LayerContainer;
    }
}



