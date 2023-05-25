import {LitElement, html} from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {styles} from "../styles/buttonStyle";

@customElement('toggle-data')
export class ToggleButton extends LitElement {
    static override styles = styles;

    @property({type: String})
    key = '';

    @property({type: Object})
    value = {icon: '', description: ''};

    @property({type: Function})
    clickFunction = () => {};

    render() {
        return html`
      <button class="toggleButton" @click=${this.clickFunction}>
        <div class="buttonContent">
          ${this.value.icon ? html`<img class="icon" src="${this.value.icon}" alt="Icon for ${this.key}" width="25" height="25">` : ''}
          ${this.value.description ? html`<span class="buttonDescription">${this.value.description}</span>` : ''}
        </div>
      </button>
    `;
    }
}
