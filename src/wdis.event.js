class WdisEvent {
    #wdisEvent;
    constructor() {
        this.#wdisEvent = {};
    }
    emit(eventName, param) {
        return this.trigger(eventName, param);
    }
    trigger(eventName, param) {
        if (!(typeof eventName === 'string')) {
            console.error('nome do evento deve ser do tipo string');
            return;
        }
        var events = this.#wdisEvent[eventName];
        if (events) {
            setTimeout(() => {
                events.forEach(onEventFnc => {
                    setTimeout(() => {
                        try {
                            if(arguments.length==2){
                                onEventFnc(param);
                            }else if(arguments.length==3){
                                onEventFnc(param,arguments[2]);
                            }else if(arguments.length==4){
                                onEventFnc(param,arguments[2],arguments[3]);
                            }
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

    intercept(eventName, param) {
        return new Promise(async (accept, reject)=>{
            if (!(typeof eventName === 'string')) {
                console.error('nome do evento deve ser do tipo string');
                accept();
                return;
            } else {
                var events = this.#wdisEvent[eventName];
                if (events) {
                    for(let onEventFnc of events){
                        try {
                            let excResult = undefined;
                            if(arguments.length==2){
                                excResult = onEventFnc(param);
                            }else if(arguments.length==3){
                                excResult = onEventFnc(param,arguments[2]);
                            }else if(arguments.length==4){
                                excResult = onEventFnc(param,arguments[2],arguments[3]);
                            }
                            excResult && excResult.then && await excResult;
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
                accept();
            }
        });
    }

    on(eventName, onEventFnc) {
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

const wdisEvent = new WdisEvent();
wdisEvent.WdisEvent = WdisEvent;
module.exports = wdisEvent;