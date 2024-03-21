// const { wdisEvent } = require('@wdis/event');
// import { wdisEvent } from "@wdis/event";
import { wdisEvent } from "../src/wdis.event";

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

console.log('Global EventNames '+JSON.stringify(wdisEvent.exportNames()));