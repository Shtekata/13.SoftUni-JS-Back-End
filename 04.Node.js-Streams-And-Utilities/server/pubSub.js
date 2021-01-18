// module.exports = {
//     publish() { },
//     subscribe() { }
// };

const events = {};

export default {

    // emit, trigger
    publish(eventName, params) {
        if (events[eventName]) events[eventName].forEach(x => x(params));
    },

    // on
    subscribe(eventName, callback) {
        // if (!events[eventName]) events[eventName] = [];
        events[eventName] = events[eventName] || [];
        events[eventName].push(callback);
    },

    // off
    unsubscribe(eventName, callback) {}
};