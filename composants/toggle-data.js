var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styles } from "../styles/buttonStyle";
let ToggleButton = class ToggleButton extends LitElement {
    constructor() {
        super(...arguments);
        this.key = '';
        this.value = { icon: '', description: '' };
        this.clickFunction = () => { };
    }
    render() {
        return html `
      <button class="toggleButton" @click=${this.clickFunction}>
        <div class="buttonContent">
          ${this.value.icon ? html `<img class="icon" src="${this.value.icon}" alt="Icon for ${this.key}" width="25" height="25">` : ''}
          ${this.value.description ? html `<span class="buttonDescription">${this.value.description}</span>` : ''}
        </div>
      </button>
    `;
    }
};
ToggleButton.styles = styles;
__decorate([
    property({ type: String })
], ToggleButton.prototype, "key", void 0);
__decorate([
    property({ type: Object })
], ToggleButton.prototype, "value", void 0);
__decorate([
    property({ type: Function })
], ToggleButton.prototype, "clickFunction", void 0);
ToggleButton = __decorate([
    customElement('toggle-data')
], ToggleButton);
export { ToggleButton };
//# sourceMappingURL=toggle-data.js.map