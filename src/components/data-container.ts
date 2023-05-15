import { LitElement, html } from 'lit';
import {styles} from "../styles/styles";
import { customElement, property } from 'lit/decorators.js';
import { DataSource } from 'cesium';

@customElement('data-container')
export class DataContainer extends LitElement {
    @property({ type: Array })
    data: Array<{
        key: string;
        url: string;
        contour: boolean;
        icon?: string;
        description?: string;
        dataSource?: DataSource;
    }> = [];

    static override styles = styles;


    override render() {
        return html`
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
    `;
    }

    toggleData(key: string) {
        const data = this.data.find(item => item.key === key);
        if (data && data.dataSource) {
            const event = new CustomEvent('toggle-data', {
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
        'data-container': DataContainer;
    }
}
