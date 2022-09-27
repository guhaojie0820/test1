<template>
    <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandler">
        <view class="my-search-box" :style="{'border-radius':radius+'px'}">
            <uni-icons type="search" size="17"></uni-icons>
            <text class="placeholder">搜索</text>
        </view>
    </view>
</template>

<script>
    export default {
        name: "my-search",
        data() {
            return {

            };
        },
        methods:{
            searchBoxHandler(){
                // console.log(1);
                this.$emit("myclick")
            }
        },
        props: {
            //背景颜色
            bgcolor: {
                type: String,
                default: "#c00000"
            },
            //圆角尺寸
            radius: {
                type: Number,
                default: 18
            }
        }
    }
</script>

<style lang="scss" scoped>
    .my-search-container {
        height: 50px;
        padding: 0 10px;
        display: flex;
        align-items: center;

        .my-search-box {
            height: 36px;
            background-color: #fff;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            uni-icons {
                vertical-align: middle;
            }

            .placeholder {
                font-size: 15px;
                margin-left: 5px;
            }
        }
    }
</style>
