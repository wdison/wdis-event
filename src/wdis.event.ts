export class WdisEvent {
    private eventsWdis: { [key: string]: Function[] } = {};
    
    public emit(eventName:string, ...param:any):void {
        this.trigger(eventName, ...param);
    }
    public trigger(eventName:string, ...param:any):void {
        var events = this.eventsWdis[eventName];
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
    }

    public intercept(eventName:string, ...param:any):Promise<any> {
        return new Promise(async (accept:any, reject:any)=>{
            if (!(typeof eventName === 'string')) {
                console.error('nome do evento deve ser do tipo string');
                accept();
                return;
            } else {
                let result:any[]|any|undefined=[];
                var events = this.eventsWdis[eventName];
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

    public on(eventName:string, onEventFnc:Function): WdisEvent {
        if (!this.eventsWdis[eventName]) {
            this.eventsWdis[eventName] = [];
        }
        this.eventsWdis[eventName].push(onEventFnc);
        return this;
    }

    public exportNames(){
        return Object.keys(this.eventsWdis);
    }
}

class GlobalWdiEvent {
    private static wdisEvent:WdisEvent;
    private static _instance:GlobalWdiEvent|null;
    private constructor() {
        if(!GlobalWdiEvent.wdisEvent) {
            GlobalWdiEvent.wdisEvent = new WdisEvent();
        }
    }
    static getGlobal(){
        if(!GlobalWdiEvent._instance) {
            GlobalWdiEvent._instance = new GlobalWdiEvent();
        }
        return GlobalWdiEvent.wdisEvent;
    }
}

export const wdisEvent = GlobalWdiEvent.getGlobal();