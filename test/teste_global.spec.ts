// const { wdisEvent } = require('@wdis/event');
// import { wdisEvent } from "@wdis/event";
import { wdisEvent } from "../src/wdis.event";

describe('WdisEvent', () => {
    // Descreva o que um método específico deve fazer
    describe('on', () => {
        it('should add a listener to the event', () => {
            const eventName = 'test';
            const callback = jest.fn();
            wdisEvent.on(eventName, callback);
            console.log('Testando');
            expect(wdisEvent.exportNames()[0]).toEqual(eventName);
        });
        it('intercept returning promisse value', async () => {
            const eventName = 'testinterceptor';
            const itemValue = 'itemvalue';
            const callback = function (item:any){return item};
            wdisEvent.on(eventName, callback);
            console.log('Testando '+itemValue);
            const itemResult = await wdisEvent.intercept(eventName, itemValue);
            expect(itemResult).toBe(itemValue);
        });
    });
});