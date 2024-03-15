export class WdisEvent {
    #wdisEvent:any;
    
    constructor() {
        this.#wdisEvent = {};
    }
    public emit(eventName:any, ...param:any) {
        return this.trigger(eventName, ...param);
    }
    public trigger(eventName:any, ...param:any) {
        if (!(typeof eventName === 'string')) {
            console.error('nome do evento deve ser do tipo string');
            return;
        }
        var events = this.#wdisEvent[eventName];
        if (events) {
            setTimeout(() => {
                events.forEach((onEventFnc:any) => {
                    setTimeout(() => {
                        try {
                            onEventFnc(...param);
                        } catch (error) {
                            console.error(error);
                        }
                    }, 1);
                });
            }, 20);
        }else{
            // console.log('event not found '+eventName);
        }
        return this;
    }

    public intercept(eventName:any, ...param:any) {
        return new Promise(async (accept:any, reject:any)=>{
            if (!(typeof eventName === 'string')) {
                console.error('nome do evento deve ser do tipo string');
                accept();
                return;
            } else {
                let result:any[]|any|undefined=[];
                var events = this.#wdisEvent[eventName];
                if (events) {
                    for(let onEventFnc of events){
                        try {
                            let excResult = undefined;
                            excResult = onEventFnc(...param);
                            excResult && excResult.then && await excResult;
                            result.push(excResult);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
                if(result.length==0){
                    result = undefined;
                }else if(result.length==1){
                    result = result[0];
                }
                accept(result);
            }
        });
    }

    public on(eventName:any, onEventFnc:any) {
        if (!(typeof eventName === 'string')) {
            console.error('nome do evento deve ser do tipo string');
            return;
        }
        if (!(onEventFnc && typeof onEventFnc === 'function')) {
            console.error('a funçao do evento '+eventName+' deve ser do tipo function');
            return;
        }

        var events = this.#wdisEvent[eventName];
        if (events) {
            events.push(onEventFnc);
        } else {
            this.#wdisEvent[eventName] = [onEventFnc];
        }
        return this;
    }
}
console.log('Teste wdi event');

export const wdisEvent = new WdisEvent();