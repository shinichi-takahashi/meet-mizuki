<template>
    <div id="voice-mode">
        <div class="animation-dots">
            <div id="dot1" class="dot"></div>
            <div id="dot2" class="dot"></div>
            <div id="dot3" class="dot"></div>
            <div id="dot4" class="dot"></div>
        </div>
        <img class="icon-mic-on" src="./assets/mic-on.svg" alt="mic">
        <p class="label">
            <span :class="labelClass" class="uk-label">{{label}}</span>
        </p>
    </div>
</template>

<script>
    export default {
        props: ["voiceStatus"],
        computed: {
            status() {
                return this.voiceStatus.status
            },
            label() {
                const status = this.status
                switch(status) {
                    case 'waiting':
                        return "マイクに向かってお話ください"
                    case 'error':
                        return "すみません、よく聞き取れませんでした"
                    case 'done':
                        return "送信中..."
                    default:
                        return "マイクに向かってお話ください"
                }
            },
            labelClass() {
                const status = this.status
                switch(status) {
                    case 'waiting':
                        return ""
                    case 'error':
                        return "uk-label-warning"
                    case 'done':
                        return "uk-label-success"
                    default:
                        return ""
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #voice-mode {
        padding: 20px 10px 10px;
        background-color: #333;
    }
    .icon-mic-on {
        width: 30%;
        opacity: .45;
    }
    .label {
        margin: 30px auto 20px;
        color: #fff;
    }
    .animation-dots {
        margin-bottom: 10px;
    }
    
    $velocity: 2.4s;
    $delay: 0.3s;
    $diameter: 5px;
    .dot {
        display: inline-block;
        border-radius: calc(#{$diameter}/2);
        width: $diameter;
        height: $diameter;
        margin: calc(16 * #{$diameter} / 50);
        background-color: #fff;
        transform: translateZ(0);
        animation: move $velocity infinite;
    }
    
    #dot1 {
        animation-delay: calc(#{$delay} * 1);
    }
    
    #dot2 {
        animation-delay: calc(#{$delay} * 2);
    }
    
    #dot3 {
        animation-delay: calc(#{$delay} * 3);
    }
    
    #dot4 {
        animation-delay: calc(#{$delay} * 4);
    }
    
    @keyframes move {
        50% {
            transform: translateY(calc(-48 * #{$diameter} / 50));
        }
    }
</style>