<template>
  <div class="container">
    <div class="info">
      <span>客户端Id:</span>
      <span>{{ clientId }}</span>
    </div>
    <div class="toolbar">
      <button :disabled="connected" @click="handleConnect">连接</button>
      <button :disabled="!connected" @click="handleDisconnect">断开</button>
      <button :disabled="!connected || send" @click="handleStartSend">发送</button>
      <button :disabled="!connected || !send" @click="handleStopSend">停止</button>
    </div>
    <textarea class="msg" :value="message"></textarea>
  </div>
</template>

<script>
import mqtt from 'mqtt';

export default {
  name: 'MqttClientTalker',
  data: () => ({
    clientId: 'talker',
    connected: false,
    message: '',
    send: false,
  }),
  client: null,
  timer: null,
  mounted() {
  },
  destroyed() {
    clearInterval(this.timer);
    this.client.end();
  },
  methods: {
    handleConnect() {
      this.log('连接服务器...');
      this.client = mqtt.connect('ws://localhost', {
        port: 3333,
        clientId: this.clientId,
        clean: false,
      });
      this.client.on('connect', this.onConnectSuccess);
      this.client.on('close', this.onConnectionLost);
    },
    handleDisconnect() {
      this.log('断开服务器连接...');
      this.handleStopSend();
      this.client.end();
    },
    handleStartSend() {
      this.send = true;
      this.timer = setInterval(() => {
        const message = `[${new Date().toISOString()}]Hello!`;
        this.client.publish('MqttDemo', message, {
          qos: 1,
        });
        this.log(message);
      }, 1000);
    },
    handleStopSend() {
      this.send = false;
      clearInterval(this.timer);
    },
    onConnectSuccess() {
      this.log('已连接到服务器');
      this.connected = true;
    },
    onConnectFailure(res) {
      console.log(res);
      this.log('连接服务器失败');
      this.connected = false;
    },
    onConnectionLost() {
      this.log('与服务器的连接丢失');
      this.connected = false;
    },
    log(msg) {
      this.message += `${msg} \n`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: flex-start;
}

.info {
}

.toolbar, .msg {
  margin-top: 5px;
}

.toolbar button {
  margin-right: 10px;
}

.msg {
  width: 100%;
  flex: 1;
  border: 0.1px solid black;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
}
</style>
