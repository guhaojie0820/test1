<template>
    <view class="cart-container">
        <view class="" v-if="cart.length !== 0">
            <my-address></my-address>
            <view class="cart-title">
                <!-- 左侧的图标 -->
                <uni-icons type="shop" size="18"></uni-icons>
                <!-- 描述文本 -->
                <text class="cart-title-text">购物车</text>
            </view>
            <uni-swipe-action>
                <block v-for="(goods, i) in cart" :key="i">
                    <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
                    <uni-swipe-action-item :auto-close="false" :right-options="options"
                        @click="swipeActionClickHandler(goods)">
                        <my-goods :goods="goods" :showRadio="showRadio" @radiochange="radioChangeHandler"
                            :showNum="true" @num-change="numberChangeHandler"></my-goods>
                    </uni-swipe-action-item>
                </block>
            </uni-swipe-action>
            <my-settle></my-settle>
        </view>
        <view class="empty-cart" v-else>
            <image src="/static/cart_empty@2x.png" class="empty-img"></image>
            <text class="tip-text">空空如也~</text>
        </view>
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        computed: {
            // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
            ...mapState('m_cart', ['cart']),
        },
        data() {
            return {
                showRadio: true,
                //滑动删除的配置项
                options: [{
                    text: '删除', // 显示的文本内容
                    style: {
                        backgroundColor: '#C00000' // 按钮的背景颜色
                    }
                }]
            };
        },
        onLoad() {

        },
        methods: {
            ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
            // 商品的勾选状态发生了变化
            radioChangeHandler(e) {
                this.updateGoodsState(e)
            },
            numberChangeHandler(e) {
                this.updateGoodsCount(e)
            },
            swipeActionClickHandler(e) {
                this.removeGoodsById(e.goods_id)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cart-container {
        padding-bottom: 50px;
    }

    .cart-title {
        height: 40px;
        display: flex;
        align-items: center;
        font-size: 14px;
        padding-left: 5px;
        border-bottom: 1px solid #efefef;

        .cart-title-text {
            margin-left: 10px;
        }
    }

    .empty-cart {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 150px;

        .empty-img {
            width: 90px;
            height: 90px;
        }

        .tip-text {
            font-size: 12px;
            color: gray;
            margin-top: 15px;
        }
    }
</style>
