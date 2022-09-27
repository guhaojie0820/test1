<template>
    <view class="my-container">

        <!-- 用户未登录时，显示登录组件 -->
        <my-login v-if="!token"></my-login>

        <!-- 用户登录后，显示用户信息组件 -->
        <my-userinfo v-else></my-userinfo>
    </view>
</template>

<script>
    import {
        mapState
    } from "vuex"
    export default {
        data() {
            return {

            };
        },
        computed: {
            ...mapState('m_user', ['token'])
        }
    }
</script>

<style lang="scss">
.my-container {
  height: 100%;
}
</style>
