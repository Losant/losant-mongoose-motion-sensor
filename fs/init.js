load('api_config.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_timer.js');

// Set the pin number. On the NodeMCU D1 is pin 5.
// See pinout: https://pradeepsinghblog.files.wordpress.com/2016/04/nodemcu_pins.png?
let SENSOR = 5;

// Blink built-in LED every second
GPIO.set_mode(SENSOR, GPIO.MODE_INPUT);

// Look for motion every 2 seconds.
Timer.set(2000 /* 2 sec */ , true /* repeat */ , function () {
  let motion = GPIO.read(SENSOR);
  let topic = '/losant/' + Cfg.get('device.id') + '/state';
  print('Motion:', motion);
  let message = JSON.stringify({
    data: {
      movement: motion
    }
  });
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
}, null);