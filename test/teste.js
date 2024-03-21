const a = require('@wdis/event');
// const a = require('../dist/cjs/wdis.event');
const wdisEvent = a.wdisEvent;
wdisEvent.on('teste', (str)=>{
    console.log(str);
});

wdisEvent.emit('teste', 'teste na str');
