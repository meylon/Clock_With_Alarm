function onReady() {
    console.log('Moshe Eylon OOP JavaScript Clock');

    var clock = new com.oopClock.Clock('clock');
    var clock2 = new com.oopClock.TextClock('clock2', -300, 'ETC');
    var clock2 = new com.oopClock.AlarmClock('clock3', 300, 'X', 20, 7);

    LiveDate.apply(clock, ['Clock 1', 'Clock 2', 'Clock 3']);
}

function LiveDate(a, b, c) {
    console.log(this, a, b, c);
}

Date.__interval = 0;
Date.__aDates = [];
Date.addToInterval = function (date) {
    this.__aDates.push(date);

    if (!Date.__interval)
        Date.__interval = setInterval(function () {
            Date.updateDates()
        }, 1000);
};
Date.updateDates = function () {
    //console.log(this.__aDates.length);
    for (var i = 0; i < this.__aDates.length; i++)
        this.__aDates[i].updateSeconds();
};


Date.prototype.updateSeconds = function () {
    this.setSeconds(this.getSeconds() + 1);
    //console.log(Date.__interval);
};

Date.prototype.autoClock = function (isAuto) {

    if (isAuto) {
        Date.addToInterval(this);
    }
};
var com = com || {};
com.oopClock = com.oopClock || {};


com.oopClock.Clock = function (id, offset, label) {
    offset = offset || 0;
    label = label || '';
    var d = new Date();
    var offset = (offset + d.getTimezoneOffset()) * 60 * 1000;
    this.d = new Date(offset + d.getTime());
    this.d.autoClock(true);
    this.id = id;
    this.label = label;

    var that = this;
    setInterval(function () {
        that.updateClock();
    }, 1000);
    this.updateClock();
};
com.oopClock.Clock.prototype.version = '1.0001';
com.oopClock.Clock.prototype.updateClock = function () {
    var date = this.d;
    //date.updateSeconds();
    var clock = document.getElementById(this.id);
    clock.innerHTML = this.formatOutput(date.getHours(), date.getMinutes(), date.getSeconds(), this.label);
};

com.oopClock.Clock.prototype.formatOutput = function (h, m, s, label) {
    return this.formatDigits(h) + ":" + this.formatDigits(m) + ":" + this.formatDigits(s) + " " + label;
};

com.oopClock.Clock.prototype.formatDigits = function (val) {
    if (val < 10) val = "0" + val;

    return val;
};

com.oopClock.TextClock = function (id, offset, label) {
    com.oopClock.Clock.apply(this, arguments);
    console.log(this.version);
};
com.oopClock.TextClock.prototype = createObject(com.oopClock.Clock.prototype, com.oopClock.TextClock);
com.oopClock.TextClock.prototype.formatOutput = function (h, m, s, label) {

    return this.formatDigits(h) + " Hour " + this.formatDigits(m) + " Minutes " + this.formatDigits(s) + " Seconds " + label;
};

com.oopClock.AlarmClock = function (id, offset, label, almH, almM) {
    com.oopClock.TextClock.apply(this, arguments);
    this.almH = almH;
    this.almM = almM;
    console.log(this.version);
};
com.oopClock.AlarmClock.prototype = createObject(com.oopClock.TextClock.prototype, com.oopClock.AlarmClock);

com.oopClock.AlarmClock.prototype.formatOutput = function (h, m, s, label) {
    var alarm;
    if (h == this.almH && m == this.almM) {
        alarm = 'ALARM WAKE UP';
        var snd = new Audio('sound/beep.mp3');
        snd.play();
    } else {
        alarm = this.formatDigits(h) + " Hour " + this.formatDigits(m) + " Minutes " + this.formatDigits(s) + " Seconds " + label;
    }
    return alarm;
};

function createObject(proto, cons) {
    function c() {
    }

    c.prototype = proto;
    c.prototype.constructor = cons;
    return new c();
}

window.onload = onReady;
