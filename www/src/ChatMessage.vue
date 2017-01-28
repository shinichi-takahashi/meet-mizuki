<template>
    <div id="chat-message-module" ref="chatMessageModule">
        <div class="iphone">
            <div class="screen">
                <div v-for="message in checkedConversation" 
                :class="{me: message.isMe}" 
                class="message">
                    <span v-for="textline in message.textLines">
                        {{textline}} <br>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["conversation"],
        computed: {
            checkedConversation() {
                const conv = this.conversation
                const checkedConv = conv.map((message) => {
                    if (message.user !== 'me') {
                        message.isMe = false
                    } else {
                        message.isMe = true
                    }
                    message.textLines = message.text.split('\n')

                    return message
                })

                return checkedConv
            }
        },
        watch: {
            checkedConversation() {
                this.$nextTick(() => {
                    this.ajastMessageBox()
                })
            }
        },
        methods: {
            ajastMessageBox() {
                const el = this.$refs.chatMessageModule
                el.scrollTop = el.clientHeight
            }
        }
    }
</script>
<style lang="scss" scoped>
    #chat-message-module {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: scroll;
    }
    
    .iphone {
        padding-top: 40px;
        padding-bottom: 40px;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: 100;
    }
    
    .screen {
        background: #fff;
        border-radius: 2px;
        height: 100%;
        overflow: auto;
        padding: 20px;
        position: relative;
        z-index: 1;
        &:after {
            clear: both;
            content: " ";
            display: table;
        }
    }
    
    .message {
        border-radius: 20px;
        clear: both;
        margin: 5px 0;
        max-width: 80%;
        padding: 10px 15px;
        position: relative;
        text-align: left;
        &:after {
            border-radius: 50%;
            bottom: 0;
            content: " ";
            height: 30px;
            position: absolute;
            width: 30px;
            z-index: -1;
        }
        /* 吹き出し others */
        color: #333;
        background: #dedede;
        float: left;
        &:after {
            box-shadow: inset 1px 9px 0 4px #fff, inset -9px 0px 0 2px #dedede, 0 0 0 1px #fff;
            left: -19px;
            right: auto;
        }
        /* 吹き出し me */
        &.me {
            color: #fff;
            background: #2d8cfa;
            float: right;
            &:after {
                box-shadow: inset -1px 9px 0 4px #fff, inset 9px 1px 0 2px #2d8cfa, 0 0 0 1px #fff;
                left: auto;
                right: -19px;
            }
        }
    }
</style>