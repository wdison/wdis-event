# wdis-event [![npm version](https://img.shields.io/npm/v/@wdis/event.svg?style=flat-square)](https://www.npmjs.com/package/@wdis/event) [![NPM Downloads](https://img.shields.io/npm/dm/@wdis/event.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@wdis/event&from=2023-12-01)

## Install

    npm install @wdis/event
Or

    yarn install @wdis/event

## Example

    import { wdisEvent } from "./wdis.event";
    
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
