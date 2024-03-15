# wdis-event [![npm version](https://img.shields.io/npm/v/@wdis/event.svg?style=flat-square)](https://www.npmjs.com/package/@wdis/event) [![NPM Downloads](https://img.shields.io/npm/dm/@wdis/event.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@wdis/event&from=2023-12-01)

## Install

    npm install @wdis/event
Or

    yarn install @wdis/event

## Example of Global Events
```js
// const { wdisEvent } = require('@wdis/event');
import { wdisEvent } from "@wdis/event";

const custonCallBack = (obj: any) => {
    console.log('on event');
    if (obj && obj.customKey_1) {
        console.log(obj.customKey_1);
    }
    if (obj && obj.customKey_2) {
        console.log(obj.customKey_2);
    }
};

wdisEvent.on('customEventGlobal', custonCallBack);
wdisEvent.on('custom:event:global2', custonCallBack);

wdisEvent.trigger('customEventGlobal', null);
setTimeout(() => {
    wdisEvent.trigger('custom:event:global2', {customKey_1: 'Test here using customKey_1'});
    setTimeout(() => {
        wdisEvent.emit('custom:event:global2', {customKey_2: 'Test here using customKey_2'});
    }, 1000);
}, 2000);

setTimeout(async () => {
    // Waiting for the end of the promise
    await wdisEvent.intercept('customEventGlobal', {customKey_1: 'Test here using customKey_1'});
}, 4000);
```

## Example of Private Object Events and One Global
```js
// const {WdisEvent, wdisEvent} = require('@wdis/event');
import { WdisEvent, wdisEvent } from "@wdis/event";

let _selfObj:ObjPrivate|null = null;
class ObjPrivate extends WdisEvent {
    public static CUSTOM_EVENT_GLOBAL       = 'objprivate:change';
    
    public static CUSTOM_EVENT_PRAIVATE     = 'customEventPrivate';
    public static CUSTOM_EVENT_PRAIVATE2    = 'custom:event:private2';
    public static CHANGE                    = 'change';
    private wdisEventGlobal: WdisEvent;
    constructor(){
        super();
        _selfObj = this;
        this.initCustomEvents();
        this.wdisEventGlobal = wdisEvent;
    }
    initCustomEvents() {
        this.on(ObjPrivate.CUSTOM_EVENT_PRAIVATE,       this.onCustomEventPrivate);
        this.on(ObjPrivate.CUSTOM_EVENT_PRAIVATE2,      this.onCustomEventPrivate2);
        this.on(ObjPrivate.CHANGE,                      this.onChange);
    }
    onChange(objChanged: {name:string}) {
        console.log(objChanged.name);
        // to external listening
        _selfObj?.wdisEventGlobal.emit('objprivate:change', objChanged);
    }
    onCustomEventPrivate() {
        console.log('onCustomEventPrivate2');
        _selfObj?.emit(ObjPrivate.CHANGE, {name: 'emited from private'});
    }
    onCustomEventPrivate2(customParam1: any, customParam2: any, customParam3: any) {
        console.log('onCustomEventPrivate with 3 custom params');
        console.log(customParam1);
        console.log(customParam2);
        console.log(customParam3);
        _selfObj?.emit(ObjPrivate.CHANGE, {name: 'emited from private2'});
    }
}

const wdisEventPrivateObj = new ObjPrivate();

const custonCallBackExternal = (obj: any) => {
    console.log('on custonCallBackExternal');
    if (obj && obj.customKey_1) {
        console.log(obj.customKey_1);
    }
    if (obj && obj.customKey_2) {
        console.log(obj.customKey_2);
    }
    return "Return from custonCallBackExternal to be used in interceptor";
};

// set new event listening 
wdisEventPrivateObj.on(ObjPrivate.CUSTOM_EVENT_PRAIVATE2,    custonCallBackExternal);
wdisEventPrivateObj.on('new:custom:event:private',          custonCallBackExternal);

// sending events with emit or trigger is the same thing
wdisEventPrivateObj.emit(ObjPrivate.CUSTOM_EVENT_PRAIVATE2, {customKey_1: 'Test here using customKey_1'}, {name:'teste to param 2'}, 'string to param 3');
setTimeout(() => {
    wdisEventPrivateObj.trigger(ObjPrivate.CUSTOM_EVENT_PRAIVATE, {customKey_1: 'Test here using customKey_1'});
    setTimeout(() => {
        wdisEventPrivateObj.emit(ObjPrivate.CUSTOM_EVENT_PRAIVATE, {customKey_2: 'Test here using customKey_2', customKey_1: 'Test here using customKey_1'});
    }, 1000);
}, 2000);

// sending events with interception can use them together with await, from the asynchronous function, to wait for success or error in an execution.
setTimeout(async () => {
    // Waiting for the end of the promise
    let result1 = await wdisEventPrivateObj.intercept('new:custom:event:private', {customKey_1: 'Test here using customKey_1 in event new:custom:event:private'});
    let result2 = await wdisEventPrivateObj.intercept(ObjPrivate.CUSTOM_EVENT_PRAIVATE2, {customKey_1: 'Test here using customKey_1'});
    console.log('result1: '+JSON.stringify(result1));
    console.log('result2: '+JSON.stringify(result2));
}, 4000);
```