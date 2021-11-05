import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import { getItem, setItem } from '@/utilities/storage';

export interface IBaseItem {
    label: string;
    key: string;
}

export interface IInput extends BaseItem {
    value: any;
    placeholder?: string;
    helperText?: string;
    validate?: (value: any) => {
        valid: boolean;
        result: string;
    };
}

export interface ISwitch extends BaseItem {
    checked: boolean;
}

export interface IButton extends BaseItem {
    onClick: () => void;
    color: ButtonColors;
}

export interface ICategory extends IBaseItem {
    label: string;
    key: string;
    items: MenuItem[];
    icon: OverridableComponent<SvgIconTypeMap> & { muiName: string };
    expanded: boolean;
}

export type MenuItem = IInput | ISwitch | IButton;
export type ButtonColors = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;

class BaseItem implements IBaseItem {
    constructor(
        public label: string,
        public key: string) {
    }

}

export class Input extends BaseItem implements IInput {


    private _value: unknown;


    constructor(
        public label: string,
        public key: string,
        public placeholder?: string,
        public helperText?: string,
        public validate?: (value: any) => { valid: boolean, result: string },
    ) {
        super(label, key);
        this.key = `${ this.constructor.name }::${ key }`;
    }

    set value(v) {
        this._value = v;
        setItem(this.key, v);
    }

    get value() {
        return this._value;
    }

    init() {
        getItem(this.key).then(v => {
            this._value = v;
        });
        return this;
    }
}

export class Switch extends BaseItem implements ISwitch {

    private _checked: boolean;

    constructor(
        public label: string,
        public key: string) {
        super(label, key);
        this._checked = false;
        this.key = `${ this.constructor.name }::${ key }`;
    }

    set checked(v: boolean) {
        this._checked = v;
        setItem(this.key, v);
    }

    get checked() {
        return this._checked;
    }

    init() {
        getItem(this.key).then((result) => {
            this._checked = result;
        });
        return this;
    }
}

export class Button extends BaseItem implements IButton {


    constructor(
        public label: string,
        public key: string,
        public onClick: () => void,
        public color: ButtonColors = 'primary') {
        super(label, key);
        this.key = `${ this.constructor.name }::${ key }`;
    }
}


export class Category extends BaseItem implements ICategory {
    private _expanded: boolean;

    constructor(
        public label: string,
        public key: string,
        public icon: OverridableComponent<SvgIconTypeMap> & { muiName: string },
        public items: MenuItem[] = [],
    ) {
        super(label, key);
        this._expanded = false;
        this.key = `${ this.constructor.name }::${ key }`;
    }

    set expanded(v: boolean) {
        this._expanded = v;
        setItem(this.key, v);
    }

    get expanded() {
        return this._expanded;

    }

    init() {
        getItem(this.key).then((result) => {
            this._expanded = result;
        });
        return this;
    }


}
