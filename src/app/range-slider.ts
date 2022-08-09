// @ts-ignore: esbuild custom loader
import styles from './styles.pcss';
import { convertRange, getNumber, roundToStep } from '../domain/math-provider';

/*
 Usage:
 ------
 <toolcool-range-slider value="0" min="0" max="100"></toolcool-range-slider>
 <toolcool-range-slider value="0" min="-100" max="100" step="1"></toolcool-range-slider>
 <toolcool-range-slider slider-width="250px" slider-height="10px" slider-radius="5px"></toolcool-range-slider>
 <toolcool-range-slider pointer-width="20px" pointer-height="20px" pointer-radius="5px"></toolcool-range-slider>
 <toolcool-range-slider slider-bg="red" pointer-bg="blue"></toolcool-range-slider>
 */
class RangeSlider extends HTMLElement {
  // ------------------------- INIT ----------------

  static get observedAttributes() {
    return [
      'value',
      'min',
      'max',
      'step',

      'slider-width',
      'slider-height',
      'slider-radius',
      'slider-bg',
      'slider-bg-hover',

      'pointer-width',
      'pointer-height',
      'pointer-radius',
      'pointer-bg',
      'pointer-bg-hover',

      'pointer-shadow',
      'pointer-shadow-hover',
      'pointer-border',
      'pointer-border-hover',
      'pointer-border-focus',
    ];
  }

  private _$slider: HTMLElement | null;
  private _$pointer: HTMLElement | null;

  private _value = 0; // [min, max]
  private _min = 0;
  private _max = 100;
  private _step: number | undefined = undefined;

  private _sliderWidth: string | undefined = undefined;
  private _sliderHeight: string | undefined = undefined;
  private _sliderRadius: string | undefined = undefined;
  private _sliderBg: string | undefined = undefined;
  private _sliderBgHover: string | undefined = undefined;

  private _pointerWidth: string | undefined = undefined;
  private _pointerHeight: string | undefined = undefined;
  private _pointerRadius: string | undefined = undefined;
  private _pointerBg: string | undefined = undefined;
  private _pointerBgHover: string | undefined = undefined;

  private _pointerShadow: string | undefined = undefined;
  private _pointerShadowHover: string | undefined = undefined;
  private _pointerBorder: string | undefined = undefined;
  private _pointerBorderHover: string | undefined = undefined;
  private _pointerBorderFocus: string | undefined = undefined;

  constructor() {
    super();

    this.attachShadow({
      mode: 'open', // 'closed', 'open',
    });

    this.pointerClicked = this.pointerClicked.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.pointerKeyDown = this.pointerKeyDown.bind(this);
    this.getSafeValues = this.getSafeValues.bind(this);
    this.render = this.render.bind(this);
  }

  // ----------- APIs ------------------------

  /**
   * value in [min, max] range
   */
  public set value(num: number) {
    const safe = this.getSafeValues(num, this.min, this.max);
    this._value = safe.value;
    this.render();
    this.sendChangeEvent();
  }

  /**
   * returns value from [min, max] range
   */
  public get value() {
    return this._value;
  }

  public set min(num: number) {
    const safe = this.getSafeValues(this.value, num, this.max);
    this._min = safe.min;
    this.render();
  }

  public get min() {
    return this._min;
  }

  public set max(num: number) {
    const safe = this.getSafeValues(this.value, this.min, num);
    this._max = safe.max;
    this.render();
  }

  public get max() {
    return this._max;
  }

  public set step(num: number | undefined) {
    const range = Math.abs(this.max - this.min);
    if (num !== undefined && num > range) {
      num = undefined;
    }
    this._step = num;
  }

  public get step() {
    return this._step;
  }

  public set sliderWidth(val: string | undefined) {
    this._sliderWidth = val;
    this.render();
  }

  public get sliderWidth() {
    return this._sliderWidth;
  }

  public set sliderHeight(val: string | undefined) {
    this._sliderHeight = val;
    this.render();
  }

  public get sliderHeight() {
    return this._sliderHeight;
  }

  public set sliderRadius(val: string | undefined) {
    this._sliderRadius = val;
    this.render();
  }

  public get sliderRadius() {
    return this._sliderRadius;
  }

  public set sliderBg(val: string | undefined) {
    this._sliderBg = val;
    this.render();
  }

  public get sliderBg() {
    return this._sliderBg;
  }

  public set sliderBgHover(val: string | undefined) {
    this._sliderBgHover = val;
    this.render();
  }

  public get sliderBgHover() {
    return this._sliderBgHover;
  }

  public set pointerWidth(val: string | undefined) {
    this._pointerWidth = val;
    this.render();
  }

  public get pointerWidth() {
    return this._pointerWidth;
  }

  public set pointerHeight(val: string | undefined) {
    this._pointerHeight = val;
    this.render();
  }

  public get pointerHeight() {
    return this._pointerHeight;
  }

  public set pointerRadius(val: string | undefined) {
    this._pointerRadius = val;
    this.render();
  }

  public get pointerRadius() {
    return this._pointerRadius;
  }

  public set pointerBg(val: string | undefined) {
    this._pointerBg = val;
    this.render();
  }

  public get pointerBg() {
    return this._pointerBg;
  }

  public set pointerBgHover(val: string | undefined) {
    this._pointerBgHover = val;
    this.render();
  }

  public get pointerBgHover() {
    return this._pointerBgHover;
  }

  public set pointerShadow(val: string | undefined) {
    this._pointerShadow = val;
    this.render();
  }

  public get pointerShadow() {
    return this._pointerShadow;
  }

  public set pointerShadowHover(val: string | undefined) {
    this._pointerShadowHover = val;
    this.render();
  }

  public get pointerShadowHover() {
    return this._pointerShadowHover;
  }

  public set pointerBorder(val: string | undefined) {
    this._pointerBorder = val;
    this.render();
  }

  public get pointerBorder() {
    return this._pointerBorder;
  }

  public set pointerBorderHover(val: string | undefined) {
    this._pointerBorderHover = val;
    this.render();
  }

  public get pointerBorderHover() {
    return this._pointerBorderHover;
  }

  public set pointerBorderFocus(val: string | undefined) {
    this._pointerBorderFocus = val;
    this.render();
  }

  public get pointerBorderFocus() {
    return this._pointerBorderFocus;
  }

  // ----------------------------------------------

  sendChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this.value,
        },
      })
    );
  }

  getSafeValues(value: number, min: number, max: number) {
    const _min = min;
    let _max = max;
    let _val = value;

    if (_min > _max) {
      _max = _min + 100;
    }

    if (_val < _min) {
      _val = _min;
    }

    if (_val > _max) {
      _val = _max;
    }

    return {
      min: _min,
      max: _max,
      value: _val,
    };
  }

  render() {
    if (!this._$slider || !this._$pointer) return;

    // update the pointer position
    const percent = convertRange(this.min, this.max, 0, 100, this.value);
    this._$pointer.style.left = `${percent}%`;

    if (this.sliderWidth) {
      this.style.setProperty('--toolcool-range-slider-width', this.sliderWidth);
    }

    if (this.sliderHeight) {
      this.style.setProperty('--toolcool-range-slider-height', this.sliderHeight);
    }

    if (this.sliderRadius) {
      this.style.setProperty('--toolcool-range-slider-panel-bg-border-radius', this.sliderRadius);
    }

    if (this.sliderBg) {
      this.style.setProperty('--toolcool-range-slider-panel-bg', this.sliderBg);
    }

    if (this.sliderBgHover) {
      this.style.setProperty('--toolcool-range-slider-panel-bg-hover', this.sliderBgHover);
    }

    if (this.pointerWidth) {
      this.style.setProperty('--toolcool-range-slider-pointer-width', this.pointerWidth);
    }

    if (this.pointerHeight) {
      this.style.setProperty('--toolcool-range-slider-pointer-height', this.pointerHeight);
    }

    if (this.pointerRadius) {
      this.style.setProperty('--toolcool-range-slider-pointer-border-radius', this.pointerRadius);
    }

    if (this.pointerBg) {
      this.style.setProperty('--toolcool-range-slider-pointer-bg', this.pointerBg);
    }

    if (this.pointerBgHover) {
      this.style.setProperty('--toolcool-range-slider-pointer-bg-hover', this.pointerBgHover);
    }

    if (this.pointerShadow) {
      this.style.setProperty('--toolcool-range-slider-pointer-shadow', this.pointerShadow);
    }

    if (this.pointerShadowHover) {
      this.style.setProperty('--toolcool-range-slider-pointer-shadow-hover', this.pointerShadowHover);
    }

    if (this.pointerBorder) {
      this.style.setProperty('--toolcool-range-slider-pointer-border', this.pointerBorder);
    }

    if (this.pointerBorderHover) {
      this.style.setProperty('--toolcool-range-slider-pointer-border-hover', this.pointerBorderHover);
    }

    if (this.pointerBorderFocus) {
      this.style.setProperty('--toolcool-range-slider-pointer-border-focus', this.pointerBorderFocus);
    }
  }

  pointerClicked() {
    this._$pointer?.focus();
  }

  pointerKeyDown(evt: KeyboardEvent) {
    switch (evt.key) {
      case 'ArrowLeft': {
        const step = getNumber(this.step, 1);
        const safe = this.getSafeValues(this.value - step, this.min, this.max);
        this.value = safe.value;
        this.render();
        break;
      }

      case 'ArrowRight': {
        const step = getNumber(this.step, 1);
        const safe = this.getSafeValues(this.value + step, this.min, this.max);
        this.value = safe.value;
        this.render();
        break;
      }
    }
  }

  onMouseDown(evt: MouseEvent) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }

    this._$pointer?.focus();

    this.onValueChange(evt);
    window.addEventListener('mousemove', this.onValueChange);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp() {
    window.removeEventListener('mousemove', this.onValueChange);
    window.removeEventListener('mouseup', this.onValueChange);
  }

  onValueChange(evt: MouseEvent | TouchEvent) {
    if (!this._$slider) return;

    const { width: boxWidth, left: boxLeft } = this._$slider.getBoundingClientRect();

    let mouseX;
    if (evt.type.indexOf('mouse') !== -1) {
      mouseX = (evt as MouseEvent).clientX;
    } else {
      mouseX = (evt as TouchEvent).touches[0].clientX;
    }

    const left = Math.min(Math.max(0, mouseX - boxLeft), boxWidth);
    const percent = (left * 100) / boxWidth;

    let value = convertRange(0, 100, this.min, this.max, percent);

    if (this.step !== undefined) {
      value = roundToStep(value, this.step);
    }

    this.value = value;
    this.render();
  }

  // ------------------------- WEB COMPONENT LIFECYCLE ----------------------------

  /**
   * when the custom element connected to DOM
   */
  connectedCallback() {
    if (!this.shadowRoot) return;

    // initial values of attributes
    this.min = getNumber(this.getAttribute('min'), 0);
    this.max = getNumber(this.getAttribute('max'), 100);
    this.value = getNumber(this.getAttribute('value'), this.min);
    this.step = getNumber(this.getAttribute('step'), undefined);

    this.sliderWidth = this.getAttribute('slider-width') || undefined;
    this.sliderHeight = this.getAttribute('slider-height') || undefined;
    this.sliderRadius = this.getAttribute('slider-radius') || undefined;
    this.sliderBg = this.getAttribute('slider-bg') || undefined;
    this.sliderBgHover = this.getAttribute('slider-bg-hover') || undefined;

    this.pointerWidth = this.getAttribute('pointer-width') || undefined;
    this.pointerHeight = this.getAttribute('pointer-height') || undefined;
    this.pointerRadius = this.getAttribute('pointer-radius') || undefined;
    this.pointerBg = this.getAttribute('pointer-bg') || undefined;
    this.pointerBgHover = this.getAttribute('pointer-bg-hover') || undefined;
    this.pointerShadow = this.getAttribute('pointer-shadow') || undefined;
    this.pointerShadowHover = this.getAttribute('pointer-shadow-hover') || undefined;
    this.pointerBorder = this.getAttribute('pointer-border') || undefined;
    this.pointerBorderHover = this.getAttribute('pointer-border-hover') || undefined;
    this.pointerBorderFocus = this.getAttribute('pointer-border-focus') || undefined;

    const percent = convertRange(this.min, this.max, 0, 100, this.value);

    this.shadowRoot.innerHTML = `
        <style>
            ${styles} 
        </style>

        <div class="range-slider">
          <div class="container">
            <div class="panel"></div>
            
            <div class="container">
              <div class="pointer" tabindex="0" style="left: ${percent}%;">
                <div class="pointer-shape"></div>
              </div>
            </div>
            
          </div>
        </div>
    `;

    // init slider elements
    this._$slider = this.shadowRoot.querySelector('.range-slider');
    this._$pointer = this.shadowRoot.querySelector('.pointer');

    // init slider events
    this._$slider?.addEventListener('mousedown', this.onMouseDown);
    this._$slider?.addEventListener('mouseup', this.onMouseUp);
    this._$slider?.addEventListener('touchmove', this.onValueChange);
    this._$slider?.addEventListener('touchstart', this.onValueChange);

    // init pointer events
    this._$pointer?.addEventListener('click', this.pointerClicked);
    this._$pointer?.addEventListener('keydown', this.pointerKeyDown);

    // update the initial position of the pointer
    this.render();
  }

  /**
   * when the custom element disconnected from DOM
   */
  disconnectedCallback() {
    this._$pointer?.removeEventListener('click', this.pointerClicked);
    this._$pointer?.removeEventListener('keydown', this.pointerClicked);

    this._$slider?.removeEventListener('mousedown', this.onMouseDown);
    this._$slider?.removeEventListener('mouseup', this.onMouseUp);
    this._$slider?.removeEventListener('touchmove', this.onValueChange);
    this._$slider?.removeEventListener('touchstart', this.onValueChange);
  }

  /**
   * when attributes change
   */
  attributeChangedCallback(attrName: string) {
    switch (attrName) {
      case 'min': {
        this.min = getNumber(this.getAttribute('min'), 0);
        this.render();
        break;
      }

      case 'max': {
        this.max = getNumber(this.getAttribute('max'), 100);
        this.render();
        break;
      }

      case 'value': {
        this.value = getNumber(this.getAttribute('value'), this.min);
        this.render();
        break;
      }

      case 'step': {
        this.step = getNumber(this.getAttribute('step'), undefined);
        break;
      }

      case 'slider-width': {
        this.sliderWidth = this.getAttribute('slider-width') || undefined;
        this.render();
        break;
      }

      case 'slider-height': {
        this.sliderHeight = this.getAttribute('slider-height') || undefined;
        this.render();
        break;
      }

      case 'slider-radius': {
        this.sliderRadius = this.getAttribute('slider-radius') || undefined;
        this.render();
        break;
      }

      case 'slider-bg': {
        this.sliderBg = this.getAttribute('slider-bg') || undefined;
        this.render();
        break;
      }

      case 'slider-bg-hover': {
        this.sliderBgHover = this.getAttribute('slider-bg-hover') || undefined;
        this.render();
        break;
      }

      case 'pointer-width': {
        this.pointerWidth = this.getAttribute('pointer-width') || undefined;
        this.render();
        break;
      }

      case 'pointer-height': {
        this.pointerHeight = this.getAttribute('pointer-height') || undefined;
        this.render();
        break;
      }

      case 'pointer-radius': {
        this.pointerRadius = this.getAttribute('pointer-radius') || undefined;
        this.render();
        break;
      }

      case 'pointer-bg': {
        this.pointerBg = this.getAttribute('pointer-bg') || undefined;
        this.render();
        break;
      }

      case 'pointer-bg-hover': {
        this.pointerBgHover = this.getAttribute('pointer-bg-hover') || undefined;
        this.render();
        break;
      }

      case 'pointer-shadow': {
        this.pointerShadow = this.getAttribute('pointer-shadow') || undefined;
        this.render();
        break;
      }

      case 'pointer-shadow-hover': {
        this.pointerShadowHover = this.getAttribute('pointer-shadow-hover') || undefined;
        this.render();
        break;
      }

      case 'pointer-border': {
        this.pointerBorder = this.getAttribute('pointer-border') || undefined;
        this.render();
        break;
      }

      case 'pointer-border-hover': {
        this.pointerBorderHover = this.getAttribute('pointer-border-hover') || undefined;
        this.render();
        break;
      }

      case 'pointer-border-focus': {
        this.pointerBorderFocus = this.getAttribute('pointer-border-focus') || undefined;
        this.render();
        break;
      }
    }
  }
}

export default RangeSlider;
