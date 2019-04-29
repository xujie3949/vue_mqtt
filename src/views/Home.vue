<template>
  <div class="container">
    <div class="title">MQTT消息推送演示</div>
    <div class="content">
      <MqttClientTalker></MqttClientTalker>
      <MqttClientListener></MqttClientListener>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import MqttClientTalker from '@/components/MqttClientTalker.vue';
import MqttClientListener from '@/components/MqttClientListener.vue';

export default {
  name: 'home',
  components: {
    MqttClientTalker,
    MqttClientListener,
  },
};
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .title {
    display: flex;
    justify-content: center;
    padding: 10px;
    border-bottom: 1px solid black;
  }
  .content {
    flex: 1;
    display: flex;
  }
</style>
