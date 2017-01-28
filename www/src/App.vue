<template>
  <div id="app">
    <header>chatbotpack</header>
    <main>
      <chat-message :conversation="conversation"></chat-message>
    </main>
    <footer>
      <div id="input-module">
        <div class="box-text-mode uk-flex uk-flex-middle">
          <div class="form-textarea">
            <textarea v-model="inputMessage" :style="`padding: 8px; font-size: 16px; line-height: 1.4; height: ${lineCount*22.4 + 18}px;`"
              @focus="textModeOn" @keyup.enter="checkSendKey" class="uk-textarea"></textarea>
          </div>
          <button @click="send" class="uk-button uk-button-primary uk-button-small" type="button" tabindex="-1">
            <template v-if="inputMessage === ''">
              <img class="icon-mic" src="./assets/mic.svg" alt="mic">
            </template>
            <template v-else>
              送信
            </template>
          </button>
        </div>
        <div v-if="voiceMode" class="box-voice-mode">
          <voice-mode :voice-status="voiceStatus"></voice-mode>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
  import axios from 'axios'
  import AWS from 'aws-sdk'
  import ChatMessage from './ChatMessage.vue'
  import VoiceMode from './VoiceMode.vue'
  import config from './config.json'

  axios.defaults.baseURL = config.api_gateway.base
  axios.defaults.headers.common['x-api-key'] = config.api_gateway.key

  export default {
    name: 'app',
    components: {
      "chat-message": ChatMessage,
      "voice-mode": VoiceMode
    },
    data() {
      return {
        "conversation": [],
        "inputMessage": "",
        "timerId": 0,
        "voiceMode": false,
        "voiceStatus": {
          text: "",
          status: "waiting" // [waiting, error, done]
        },
        "recognition": {},
        "polly": {}
      }
    },
    computed: {
      lineCount() {
        const text = this.inputMessage

        let matches = text.match(/\n/g)

        return (matches === null) ? 1 : matches.length + 1
      }
    },
    created() {
      this.prepare()
    },
    methods: {
      prepare() {
        this.prepareSpeech()
        this.preparePolly()
        this.prepareAudio()
      },
      preparePolly() {
        var creds = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: config.cognito.identity_pool_id
        })
        AWS.config.update({
          region: 'us-west-2',
          credentials: creds
        })
        this.polly = new AWS.Polly()
      },
      prepareAudio() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audio = new AudioContext();
      },
      prepareSpeech() {
        const self = this
        window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
        this.recognition = new webkitSpeechRecognition()
        this.recognition.lang = 'ja'
        // success
        this.recognition.onresult =  function(event) {
          self.voiceStatus.status = 'done'
          self.inputMessage = event.results.item(0).item(0).transcript
          self.send()
        }
        // failure
        this.recognition.onerror = function(event) {
          self.voiceStatus.status = 'error'
          this.speek('聞き取りに失敗しました。')
        }
      },
      send() {
        this.$nextTick(() => {
          const message = this.inputMessage
          if (message === "") {
            this.toggleMode()
            return
          }

          this.conversation.push({
            "user": "me",
            "text": message.replace(/\n+$/, "")
          })
          this.inputMessage = ""

          // response from bot.
          const self = this
          axios.post("/hello", {
              body: message
            })
            .then(function(response) {
              const text = response.data.message
              self.speak(text);
              self.conversation.push({
                "user": "bot",
                "text": text
              })
            })
        })
      },
      speak(message) {
        const self = this;
        const params = {
          OutputFormat: "mp3",
          SampleRate: "8000",
          Text: message,
          TextType: "text",
          VoiceId: "Mizuki"
        };
        this.polly.synthesizeSpeech(params, function(err, data) {
          if (err) {
            console.log(err)
          } else {
            const blob = new Blob([data.AudioStream], { "type" : data.ContentType })
            const URL = window.URL || window.webkitURL
            const audio = new Audio(URL.createObjectURL(blob))
            audio.play()
            self.voiceStatus.status = 'waiting'
            self.textModeOn()
          }
        });
      },
      checkSendKey(e) {
        if (e.shiftKey) {
          this.send()
        }
      },
      toggleMode() {
        this.voiceMode = !this.voiceMode

        if (this.voiceMode) {
          this.recognition.start();
        } else {
          this.recognition.stop();
        }

      },
      textModeOn() {
        this.voiceMode = false
        this.recognition.stop();
      }
    }
  }
</script>
<style lang="scss">
  /*
Override UIkit css
*/

  .uk-grid>* {
    padding-left: 10px;
  }
  /*
App styles
*/

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  header {
    z-index: 1000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #2c3e50;
    color: white;
  }

  footer {
    z-index: 1000;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: lightgray;
  }

  main {
    width: 100%;
    overflow: auto;
  }

  #input-module {
    .box-text-mode {
      padding: 5px 10px;
    }
    .form-textarea {
      width: 100%;
    }
    textarea {
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    button {
      width: 70px;
      min-height: 40px;
      margin-left: 10px;
    }
    .icon-mic {
      width: 20px;
      height: 20px;
    }
  }
</style>
