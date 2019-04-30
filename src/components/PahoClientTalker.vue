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
export default {
  name: 'PahoClientTalker',
  data: () => ({
    clientId: 'talker',
    connected: false,
    message: '',
    send: false,
  }),
  client: null,
  timer: null,
  mounted() {
    // Create a client instance
    this.client = new Paho.Client('localhost', 3333, this.clientId);
    this.client.onConnectionLost = this.onConnectionLost;
    this.client.onMessageArrived = this.onMessageArrived;
  },
  destroyed() {
    clearInterval(this.timer);
    this.client.disconnect();
  },
  methods: {
    handleConnect() {
      this.log('连接服务器...');
      this.client.connect({
        cleanSession: false,
        onSuccess: this.onConnectSuccess,
        onFailure: this.onConnectFailure,
      });
    },
    handleDisconnect() {
      this.log('断开服务器连接...');
      this.handleStopSend();
      this.client.disconnect();
    },
    handleStartSend() {
      this.send = true;
      this.timer = setInterval(() => {
        const message = new Paho.Message(`[${new Date().toISOString()}]Hello!`);
        message.destinationName = 'MqttDemo';
        message.qos = 1;
        this.client.send(message);
        this.log(message.payloadString);
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
    onConnectionLost(res) {
      this.log(`与服务器的连接丢失:${res.errorMessage}`);
      this.connected = false;
    },
    onMessageArrived(msg) {
      this.log(`收到消息:${msg}'`);
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
