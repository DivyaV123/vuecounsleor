import { defineStore, acceptHMRUpdate } from 'pinia'
import { sessionStore } from '@/stores/session'
import { themeStore } from '@/stores/theme'
import axios from 'axios'
import * as mediasoupClient from 'mediasoup-client'
// import Bowser from 'bowser'
import dayjs from 'dayjs'
import { io } from 'socket.io-client'
import DetectRTC from 'detectrtc'
const VIDEO_CONSTRAINS = {
  qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
  vga: { width: { ideal: 640 }, height: { ideal: 480 } },
  hd: { width: { ideal: 1280 }, height: { ideal: 720 } }
}
const PC_PROPRIETARY_CONSTRAINTS = {
  // optional: [{ googDscp: true }],
}

// Used for simulcast webcam video.
const WEBCAM_SIMULCAST_ENCODINGS = [
  { scaleResolutionDownBy: 4, maxBitrate: 500000 },
  { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
  { scaleResolutionDownBy: 1, maxBitrate: 5000000 }
]

// Used for VP9 webcam video.
const WEBCAM_KSVC_ENCODINGS = [{ scalabilityMode: 'S3T3_KEY' }]

// Used for simulcast screen sharing.
const SCREEN_SHARING_SIMULCAST_ENCODINGS = [
  { dtx: true, maxBitrate: 1500000 },
  { dtx: true, maxBitrate: 6000000 }
]

// Used for VP9 screen sharing.
const SCREEN_SHARING_SVC_ENCODINGS = [{ scalabilityMode: 'S3T3', dtx: true }]
// const browser = Bowser.getParser(window.navigator.userAgent)
const AudioContext = window.AudioContext || window.webkitAudioContext
let audioContext = null
export const webrtcNewStore = defineStore('webrtcnew', {
  state: () => ({
    room: '',
    joined: false,
    role: null,
    audio: null,
    myAudio: false,
    video: null,
    myVideo: false,
    record: false,
    screen: null,
    myScreen: false,
    muteAll: false,
    muteUser: false,
    muteRoom: false,
    roomMuted: false,
    broadcastRoom: false,
    broadcastVideo: null,
    // broadcastStream: new Map(),
    broadcastVideoPaused: false,
    bAudioID: null,
    bVideoID: null,
    trainer: false,
    chat: false,
    exit: false,
    rtpCapabilities: null,
    device: null,
    producerTransport: null,
    producerTransportId: 0,
    consumerTransports: [],
    producer: null,
    consumer: null,
    consumers: new Map(),
    producers: new Map(),
    forceH264: true,
    forceVP9: false,
    useSimulcast: false,
    useSharingSimulcast: false,
    consumerTransport: null,
    roomUsers: new Map(),
    socket: null,
    socketConnected:false,
    localAudioTrack: null,
    localVideoTrack:null,
    localStream:null,
    producerLabel: new Map(),
    remoteTracks: new Map(),
    audioTracks: new Map(),
    videoTracks: new Map(),
    screenTracks: new Map(),
    deletedAudioTracks: new Map(),
    deletedVideoTracks: new Map(),
    videoCount: 0,
    setNewMessage: false,
    checkRTC: null,
    trainerJoined: false,
    trainerAudio: false,
    trainerVideo: false,
  }),
  actions: {
    async getWebRtc () {
      var that = this
      DetectRTC.load(async function () {
        that.checkRTC = DetectRTC
      })
    },
    async socketRequest (type, data = {}) {
      return new Promise((resolve, reject) => {
        this.socket.emit(type, data, data => {
          if (data.error) {
            reject(data)
          } else {
            resolve(data)
          }
        })
      })
    },
    async socketResponses () {
      const theme = themeStore()
     
      this.socket.on('newUser', data => {
        let found = false
        if (data.value.role === 'trainer') {
          this.trainerJoined = true
        } 
        for (const [id, value] of this.roomUsers) {
          if (value.userID === data.value.userID && value.connected === false) {
            this.roomUsers.delete(id)
          }
        }
        this.roomUsers.set(data.sid, data.value)
        theme.pushMessage(`New user connected ${data.value.name}`)
        // if (this.roomUsers.has(data.id)) {
        //   let user = this.roomUsers.get(data.id)
        //   this.roomUsers.set(data.id,data.value)
        //   // user = data.value
        //   user.connected = true
        // } else {
        //   this.roomUsers.set(data.id, data.value)
        //   theme.pushMessage(`New user connected ${data.value.name}`)
        // }
      })
      this.socket.on('userDisconnected', data => {
        console.log("dced",data)
        if (this.roomUsers.has(data.sid)) {
          let user = this.roomUsers.get(data.sid)
          user.connected = false
          let anotherTrainer = false
          for (const [id, value] of this.roomUsers) {
          if (value.role === 'trainer' && value.connected === true) {
            anotherTrainer = true
          }
        }
        if(anotherTrainer === false){
          this.trainerJoined = false
        }
        }
      })
      // this.socket.on("connect", () => {
      //   this.socketConnected = true
      // });
      this.socket.on('new-producer', async producer => {
        await this.connectRecvTransport(producer)
      })
      this.socket.on('producer-closed', async data => {
        await this.removeConsumer(data)
      })
      this.socket.on('muteRoom', async() => {
        this.roomMuted = true
      })
      this.socket.on('muteUser', async() => {
        this.stopAudio()
        this.muteUser = true
      })
      this.socket.on('unmuteRoom', async() => {
        this.roomMuted = false
      })
      this.socket.on('unmuteUser', async() => {
        this.muteUser = false
      })
    
      this.socket.on('message', async message => {
        console.log("message",message)
        console.log("this.roomUsers",this.roomUsers)
        for (const [id, value] of this.roomUsers) {
          if(value.userID === message.from){
            value.messages.push(message)
            value.joined = Date.now()
          }
        }
        if (!("Notification" in window)) {
          // Check if the browser supports notifications
          // console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
          // Check whether notification permissions have already been granted;
          // if so, create a notification
          const notification = new Notification(message.content);
          // …
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              const notification = new Notification(message.content);
            }
          });
        }
        this.setNewMessage = true
      })
      this.socket.on("disconnect", () => {
        this.socketConnected = false
        // this.audioTracks = new Map()
        // this.videoTracks = new Map()
      });
    },
    async connectSocket (url) {
      try {
        this.socket = io(url, { transports: ['websocket'] })
        this.socket.on("connect",async () => {
          if(this.joined){
            this.videoTracks = new Map()
            this.audioTracks = new Map()
            await this.joinRoom(this.room)
            await this.checkTracks()
          }
          this.socketConnected = true
        });
        return true
      } catch (err) {
        return false
      }
    },

    async checkTracks() {

    if(this.localAudioTrack != null){
        try{
          const params = {
            track: this.localAudioTrack,
            codecOptions: {
              // opusStereo: 1,
              opusDtx: 1,
              opusFec: 1
            }
          }
          this.audio = await this.producerTransport.produce(params)
          this.producers.set(this.audio.id, this.audio)
          this.myAudio = true
          this.audio.on('transportclose', () => {
            this.audio = null
            this.myAudio = false
            this.localAudioTrack = null
          })
  
          this.audio.on('trackended', () => {
            this.producers.get(this.audio.id).close()
            this.producers.delete(this.audio.id)
            this.stopAudio().catch(() => {})
          })
        }catch (myAudio) {
          this.myAudio = false
          if (this.localAudioTrack) {
            this.localAudioTrack.stop()
          }
          console.log(error)
        }
    }
    if(this.localVideoTrack != null){
      if(this.myScreen){
        try {
          let encodings
          let codec
          const codecOptions = {
            videoGoogleStartBitrate: 1000
          }
          if (this.forceH264) {
            codec = this.device.rtpCapabilities.codecs.find(
              c => c.mimeType.toLowerCase() === 'video/h264'
            )
            if (!codec) {
              throw new Error('desired H264 codec+configuration is not supported')
            }
          } else if (this.forceVP9) {
            codec = this.device.rtpCapabilities.codecs.find(
              c => c.mimeType.toLowerCase() === 'video/vp9'
            )
  
            if (!codec) {
              throw new Error('desired VP9 codec+configuration is not supported')
            }
          }
  
          if (this.useSimulcast) {
            // If VP9 is the only available video codec then use SVC.
            const firstVideoCodec = this.device.rtpCapabilities.codecs.find(
              c => c.kind === 'video'
            )
  
            if (
              (this._forceVP9 && codec) ||
              firstVideoCodec.mimeType.toLowerCase() === 'video/vp9'
            ) {
              encodings = WEBCAM_KSVC_ENCODINGS
            } else {
              encodings = SCREEN_SHARING_SIMULCAST_ENCODINGS
            }
          }
          this.screen = await this.producerTransport.produce({
            track:this.localVideoTrack,
            encodings,
            codecOptions,
            codec
          })
          this.videoTracks.set(this.screen.id, {
            consumer: null,
            stream: this.localStream,
            type: "video",
            id: this.screen.id,
            name: "Me"
          })
          this.producers.set(this.screen.id, this.screen)
          this.myScreen = true
          this.screen.on('transportclose', () => {
            this.screen = null
            this.myScreen = false
            this.localVideoTrack = null
            this.localStream = null
          })
          this.screen.on('trackended', () => {
            this.producers.get(this.screen.id).close()
            this.producers.delete(this.screen.id)
            this.videoTracks.delete(this.screen.id)
            this.stopScreen().catch(() => {})
          })
        } catch (err) {
          this.myScreen = false
          this.screen = false
          this.localVideoTrack = null
          this.localStream = null
          if (this.localVideoTrack) {
            this.localVideoTrack.stop()
          }
          console.log('Error enabling screenshare', err)
        }
      }
      if(this.myVideo){
        try {
          this.localStream = await navigator.mediaDevices.getUserMedia({
            video: {
              ...VIDEO_CONSTRAINS['hd']
            }
          })
          this.localVideoTrack = this.localStream.getVideoTracks()[0]
          let encodings
          let codec
          const codecOptions = {
            videoGoogleStartBitrate: 1000
          }
          if (this.forceH264) {
            codec = this.device.rtpCapabilities.codecs.find(
              c => c.mimeType.toLowerCase() === 'video/h264'
            )
            if (!codec) {
              throw new Error('desired H264 codec+configuration is not supported')
            }
          } else if (this.forceVP9) {
            codec = this.device.rtpCapabilities.codecs.find(
              c => c.mimeType.toLowerCase() === 'video/vp9'
            )
  
            if (!codec) {
              throw new Error('desired VP9 codec+configuration is not supported')
            }
          }
  
          if (this.useSimulcast) {
            // If VP9 is the only available video codec then use SVC.
            const firstVideoCodec = this.device.rtpCapabilities.codecs.find(
              c => c.kind === 'video'
            )
  
            if (
              (this._forceVP9 && codec) ||
              firstVideoCodec.mimeType.toLowerCase() === 'video/vp9'
            ) {
              encodings = WEBCAM_KSVC_ENCODINGS
            } else {
              encodings = WEBCAM_SIMULCAST_ENCODINGS
            }
          }
          this.video = await this.producerTransport.produce({
            track:this.localVideoTrack,
            encodings,
            codecOptions,
            codec
          })
          this.producers.set(this.video.id, this.video)
          this.myVideo = true
          this.video.on('transportclose', () => {
            this.video = null
            this.myVideo = false
            this.localVideoTrack = null
            this.localStream = null
          })
  
          this.video.on('trackended', () => {
            this.producers.get(this.video.id).close()
            this.producers.delete(this.video.id)
            this.stopVideo().catch(() => {})
          })
        } catch (err) {
          this.myVideo = false
          if (this.localVideoTrack) {
            this.localVideoTrack.stop()
          }
          theme.pushMessage(`Error enabling webcam ${err}`)
        }
      }
    }
    },
    async broadcastStream (video) {
      this.socket.emit("broadcastVideo",{video:"somevideo.webm"})
    },
    async pauseStream (video) {
      this.socket.emit("broadcastPause",{video:"somevideo.webm"})
    },
    async resumeStream (video) {
      this.socket.emit("broadcastResume",{video:"somevideo.webm"})
    },
    async closeStream (video) {
      this.socket.emit("broadcastClose",{video:"somevideo.webm"})
    },
    async getWebRtc () {
      var that = this
      DetectRTC.load(async function () {
        that.checkRTC = DetectRTC
      })
    },
    async checkRoom (room) {
      const data = await this.socketRequest('checkRoom', { room })
      this.rtpCapabilities = data.rtpCapabilities
    },
    async joinRoom (room) {
      const userStore = sessionStore();
      audioContext = new AudioContext()
      const user = {
        userID: userStore.user.uid,
        userName: userStore.user.username,
        role: "counselor"
      }
      this.role = user.role
      this.room = room
      const data = await this.socketRequest('joinRoom', { room, user })
      this.rtpCapabilities = data.rtpCapabilities
      if(data.roomMuted === true){
        this.roomMuted = true
      }
      this.device = new mediasoupClient.Device()
      await this.device.load({
        routerRtpCapabilities: this.rtpCapabilities
      })
      this.socketResponses()
      await this.initProducerTransport()
      await this.initConsumerTransport()
      await this.getRoomProducers()
      this.getRoomUsers()
      this.joined = true
    },
    async getRoomUsers(){
      const data = await this.socketRequest('getRoomUsers', {room:this.room})
      for (var i = 0; i < data.length; i++) {
        let usr = data[i]
        if(usr.value.muted){
          this.muteUser = true
        }
        if(usr.value.role === 'trainer'){
          this.trainerJoined = true
        }
        this.roomUsers.set(usr.sid, usr.value)
      }
    },
    async muteRoom (room) {
      this.roomMuted = true
      const data = await this.socketRequest('muteRoom', { room })
    },
    async muteRoomUser(userID) {
      if (this.role === "trainer") {
          this.socket.emit("muteUser", { userID: userID });
          if(this.roomUsers.has(userID)){
            let peer = this.roomUsers.get(userID)
            peer.muted = true
          }
      }
  },
  async unmuteRoomUser(userID) {
    if (this.role === "trainer") {
        this.socket.emit("unmuteUser", { userID: userID });
        if(this.roomUsers.has(userID)){
          let peer = this.roomUsers.get(userID)
          peer.muted = false
        }
    }
},
async unmuteRoom (room) {
  this.roomMuted = false
  const data = await this.socketRequest('unmuteRoom', { room })
},
    async initProducerTransport () {
      const theme = themeStore()
      const { params } = await this.socketRequest('createWebRtcTransport', {
        consumer: false
      })
      if (params.error) {
        console.log(params.error)
        return
      }
      params.proprietaryConstraints = PC_PROPRIETARY_CONSTRAINTS
      this.producerTransport = await this.device.createSendTransport(params)
      this.producerTransport.on(
        'connect',
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await this.socket.emit('connect-transport', {
              dtlsParameters,
              transportid: this.producerTransport.id
            })
            callback()
          } catch (error) {
            errback(error)
          }
        }
      )

      this.producerTransport.on(
        'produce',
        async (parameters, callback, errback) => {
          try {
            const data = await this.socketRequest('transport-produce', {
              kind: parameters.kind,
              rtpParameters: parameters.rtpParameters,
              appData: parameters.appData,
              producerTransportId: this.producerTransport.id
            })
            if(data.muted === true && this.role === "student" && parameters.kind === 'audio'){
              theme.pushMessage("Classroom has been muted!")
              this.roomMuted = true
            }
            if(data.id){
              callback({
                id: data.id
              })
            }
          } catch (error) {
            errback(error)
          }
        }
      )
      this.producerTransport.on('connectionstatechange', function (state) {
        switch (state) {
          case 'connecting':
            break

          case 'connected':
            break

          case 'failed':
            this.producerTransport.close()
            break

          default:
            break
        }
      })
    },
    async initConsumerTransport () {
      var that = this
      const { params } = await this.socketRequest('createWebRtcTransport', {
        consumer: true
      })
      if (params.error) {
        console.log(params.error)
        return
      }
      try {
        this.consumerTransport = await this.device.createRecvTransport(params)
      } catch (error) {
        console.log(error)
        return
      }

      this.consumerTransport.on(
        'connect',
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await this.socket.emit('connect-transport', {
              dtlsParameters,
              transportid: this.consumerTransport.id
            })
            callback()
          } catch (error) {
            errback(error)
          }
        }
      )
      this.consumerTransport.on(
        'connectionstatechange',
        async function (state) {
          switch (state) {
            case 'connecting':
              break
            case 'connected':
              //remoteVideo.srcObject = await stream;
              //await socket.request('resume');
              break
            case 'failed':
              try {
                that.consumerTransport.close()
              } catch (err) {
                console.log('error closing consumer transport', err)
              }
              break
            default:
              break
          }
        }
      )
    },

    async produceAudio () {
      const theme = themeStore()
      // if(this.role === 'student'){
      //   if(this.roomMuted === true){
      //     theme.pushMessage(`Classroom has been muted.`)
      //     return
      //   }
      //   if(this.muteUser === true){
      //     theme.pushMessage(`You have been muted.`)
      //     return
      //   }
      // }
      if (this.producerTransport == null) {
        await this.initProducerTransport()
      }
      // if (this.audio) {
      //   this.unmuteAudio()
      //   // theme.pushMessage(`Microphone is already in use.`)
      //   return
      // }
      if (!this.device.canProduce('audio')) {
        theme.pushMessage(
          `Microphone does not exist, please check your drivers or reload the page and try again.`
        )
        return
      }
      let track
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 96000,
            channelCount: 1,
            volume: 1.0,
            sampleSize: 16,
        }
        })
        this.localAudioTrack = stream.getAudioTracks()[0]
        const params = {
          track: this.localAudioTrack,
          codecOptions: {
            // opusStereo: 1,
            opusDtx: 1,
            opusFec: 1
          }
        }
        this.audio = await this.producerTransport.produce(params)
        this.producers.set(this.audio.id, this.audio)
        this.myAudio = true
        this.audio.on('transportclose', () => {
          this.audio = null
          this.myAudio = false
          this.localAudioTrack = null
        })

        this.audio.on('trackended', () => {
          this.producers.get(this.audio.id).close()
          this.producers.delete(this.audio.id)
          this.stopAudio().catch(() => {})
        })
      } catch (myAudio) {
        this.myAudio = false
        if (this.localAudioTrack) {
          this.localAudioTrack.stop()
        }
        console.log(error)
      }
    },
    async stopAudio () {
      if (!this.audio) 
      {
        this.myAudio = false
        return
      }
    
      await this.audio.close()
      try {
        this.audioRequest = false
        this.audioAccept = false
        await this.socket.emit('producer-close', {
          producerId: this.audio.id
        })
      } catch (error) {
        console.log('Error closing server-side Producer', error)
      }
      this.audio = null
      this.myAudio = false
      this.localAudioTrack = null
    },
    async muteAudio () {
      if (this.audio) {
        if(this.producers.has(this.audio.id)){
          this.producers.get(this.audio.id).pause()
          this.myAudio = false
        }
      }
    },
    async unmuteAudio () {
      if (this.audio) {
        if(this.producers.has(this.audio.id)){
          this.producers.get(this.audio.id).resume()
          this.myAudio = true
        }
      }

    },
    async produceVideo () {
      const theme = themeStore()
      if (this.producerTransport == null) {
        await this.initProducerTransport()
      }
      if (this.video) {
        theme.pushMessage(`Webcam is already in use.`)
        return
      } else if (this.screen) {
        await this.stopScreen()
      }

      if (!this.device.canProduce('video')) {
        theme.pushMessage(
          `Webcam does not exist or diabled, please check your drivers or reload the page and try again.`
        )
        return
      }
      let track
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: {
            ...VIDEO_CONSTRAINS['hd']
          }
        })
        this.localVideoTrack = this.localStream.getVideoTracks()[0]
        let encodings
        let codec
        const codecOptions = {
          videoGoogleStartBitrate: 1000
        }
        if (this.forceVP8)
        {
          codec = this.device.rtpCapabilities.codecs
            .find((c) => c.mimeType.toLowerCase() === 'video/vp8');

          if (!codec)
          {
            throw new Error('desired VP8 codec+configuration is not supported');
          }
        }
        if (this.forceH264) {
          codec = this.device.rtpCapabilities.codecs.find(
            c => c.mimeType.toLowerCase() === 'video/h264'
          )
          if (!codec) {
            throw new Error('desired H264 codec+configuration is not supported')
          }
        } else if (this.forceVP9) {
          codec = this.device.rtpCapabilities.codecs.find(
            c => c.mimeType.toLowerCase() === 'video/vp9'
          )

          if (!codec) {
            throw new Error('desired VP9 codec+configuration is not supported')
          }
        }

        if (this.useSimulcast) {
          // If VP9 is the only available video codec then use SVC.
          const firstVideoCodec = this.device.rtpCapabilities.codecs.find(
            c => c.kind === 'video'
          )

          if (
            (this._forceVP9 && codec) ||
            firstVideoCodec.mimeType.toLowerCase() === 'video/vp9'
          ) {
            encodings = WEBCAM_KSVC_ENCODINGS
          } else {
            encodings = WEBCAM_SIMULCAST_ENCODINGS
          }
        }
        this.video = await this.producerTransport.produce({
          track:this.localVideoTrack,
          encodings,
          codecOptions,
          codec
        })
        this.producers.set(this.video.id, this.video)
        this.myVideo = true
        this.video.on('transportclose', () => {
          this.video = null
          this.myVideo = false
          this.localVideoTrack = null
          this.localStream = null
        })

        this.video.on('trackended', () => {
          this.producers.get(this.video.id).close()
          this.producers.delete(this.video.id)
          this.stopVideo().catch(() => {})
        })
      } catch (err) {
        this.myVideo = false
        if (this.localVideoTrack) {
          this.localVideoTrack.stop()
        }
        theme.pushMessage(`Error enabling webcam ${err}`)
      }
    },
    async stopVideo () {
      if (!this.video) {
        return
      }
      this.video.close()
      try {
        await this.socket.emit('producer-close', {
          producerId: this.video.id
        })
      } catch (error) {
        console.log('Error closing server-side Producer', error)
      }
      this.video = null
      this.myVideo = false
      this.localVideoTrack = null
      this.localStream = null
    },
    async produceScreen () {
      if (this.producerTransport == null) {
        await this.initProducerTransport()
      }
      if (this.screen) {
        return
      } else if (this.video) {
        await this.stopVideo()
      }
      if (!this.device.canProduce('video')) {
        theme.pushMessage(
          `Cannot share with this system, please check your drivers or reload the page and try again.`
        )
        return
      }
      this.localStream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: true,
          aspectRatio: 1.77,
          width          : { max: 1920 },
					height         : { max: 1080 },
					frameRate      : { max: 30 }
        }
      })
      if (!this.localStream) {
        theme.pushMessage(`Screen share has been cancelled`)
        return
      }
      this.localVideoTrack = this.localStream.getVideoTracks()[0]

      try {
        let encodings
        let codec
        const codecOptions = {
          videoGoogleStartBitrate: 1000
        }
        if (this.forceVP8)
        {
          codec = this.device.rtpCapabilities.codecs
            .find((c) => c.mimeType.toLowerCase() === 'video/vp8');

          if (!codec)
          {
            throw new Error('desired VP8 codec+configuration is not supported');
          }
        }
        if (this.forceH264) {
          codec = this.device.rtpCapabilities.codecs.find(
            c => c.mimeType.toLowerCase() === 'video/h264'
          )
          if (!codec) {
            throw new Error('desired H264 codec+configuration is not supported')
          }
        } else if (this.forceVP9) {
          codec = this.device.rtpCapabilities.codecs.find(
            c => c.mimeType.toLowerCase() === 'video/vp9'
          )

          if (!codec) {
            throw new Error('desired VP9 codec+configuration is not supported')
          }
        }

        if (this.useSimulcast) {
          // If VP9 is the only available video codec then use SVC.
          const firstVideoCodec = this.device.rtpCapabilities.codecs.find(
            c => c.kind === 'video'
          )

          if (
            (this._forceVP9 && codec) ||
            firstVideoCodec.mimeType.toLowerCase() === 'video/vp9'
          ) {
            encodings = WEBCAM_KSVC_ENCODINGS
          } else {
            encodings = SCREEN_SHARING_SIMULCAST_ENCODINGS
          }
        }
        this.screen = await this.producerTransport.produce({
          track:this.localVideoTrack,
          encodings,
          codecOptions,
          codec
        })
        // this.videoTracks.set(this.screen.id, {
        //   consumer: null,
        //   stream: this.localStream,
        //   type: "video",
        //   id: this.screen.id,
        //   name: "Me"
        // })
        this.producers.set(this.screen.id, this.screen)
        this.myScreen = true
        this.screen.on('transportclose', () => {
          this.screen = null
          this.myScreen = false
          this.localVideoTrack = null
          this.localStream = null
        })
        this.screen.on('trackended', () => {
          this.producers.get(this.screen.id).close()
          this.producers.delete(this.screen.id)
          this.videoTracks.delete(this.screen.id)
          this.stopScreen().catch(() => {})
        })
      } catch (err) {
        this.myScreen = false
        this.screen = false
        this.localVideoTrack = null
        this.localStream = null
        if (this.localVideoTrack) {
          this.localVideoTrack.stop()
        }
        console.log('Error enabling screenshare', err)
      }
    },
    async stopScreen () {
      if (!this.screen) {
        return
      }
      this.screen.close()
      try {
        await this.socket.emit('producer-close', {
          producerId: this.screen.id
        })
        this.videoTracks.delete(this.screen.id)
      } catch (error) {
        console.log('Error closing server-side Producer', error)
      }
      this.screen = null
      this.myScreen = false
      this.localVideoTrack = null
    },
    async getRoomProducers () {
      const roomProducers = await this.socketRequest('getProducers')
      
      for (let producer of roomProducers) {
        await this.connectRecvTransport(producer)
      }
    },
    async connectRecvTransport (producer) {
      var that = this
      this.getConsumeStream(producer.producer_id, producer.userID,  producer.socketID).then(
        async function ({ consumer, stream, kind, audioNode }) {
          if (kind === 'audio') {
            // that.audioTracks.forEach(async(audio, id) => {
            //   if(audio.id === producer.userID){
            //     await audio.stream.getTracks().forEach(function (track) {
            //       track.stop()  
            //     })
            //     that.audioTracks.delete(id)
            //   }
            // })
            that.audioTracks.set(producer.producer_id, {
              consumer: consumer,
              stream: stream,
              type: kind,
              sid:producer.socketID,
              id: producer.userID,
              name: producer.name,
              audioNode: audioNode,
              audioMotion: false
            })
          }
          if (kind === 'video') {
            // that.videoTracks.forEach(async(video, id) => {
            //   if(video.id === producer.userID){
            //     await video.stream.getTracks().forEach(function (track) {
            //       track.stop()  
            //     })
            //     that.videoTracks.delete(id)
            //   }
            // })
            that.videoTracks.set(producer.producer_id, {
              consumer: consumer,
              stream: stream,
              type: kind,
              sid:producer.socketID,
              id: producer.userID,
              name: producer.name
            })
          }
          // that.consumers.set(consumer.id, consumer)
          // that.remoteTracks.set(consumer.id, {
          //   stream: stream,
          //   type: kind,
          //   id: producer.userID
          // })

          await that.socketRequest('consumer-resume', {
            serverConsumerId: consumer.id
          })
          consumer.on(
            'trackended',
            function () {
              this.removeConsumer({
                remoteProducerId: producer.producer_id,
                userID: producer.userID,
                socketID:producer.socketID,
                kind
              })
            }.bind(this)
          )

          consumer.on(
            'transportclose',
            function () {
              this.removeConsumer({
                remoteProducerId: producer.producer_id,
                userID: producer.userID,
                socketID:producer.socketID,
                kind
              })
            }.bind(this)
          )

          // for (var i = 0; i < that.roomUsers.length; i++) {
          //   let user = that.roomUsers[i]
          //   if (user.userID == userID) {
          //     if (kind === 'audio') {
          //       user.aid = consumer.id
          //     }
          //     if (kind === 'video') {
          //       user.vid = consumer.id
          //     }

          //     break
          //   }
          // }
        }
      )
    },
    async getConsumeStream (remoteProducerId, userID, socketID) {
      const data = await this.socketRequest('consume', {
        rtpCapabilities: this.device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId: this.consumerTransport.id,
        userID: userID,
        socketID:socketID
      })
      const { params } = data
      let codecOptions = {}
      const consumer = await this.consumerTransport.consume({
        id: params.id,
        producerId: params.producerId,
        kind: params.kind,
        rtpParameters: params.rtpParameters,
        codecOptions
      })
      const { track } = consumer
      const stream = new MediaStream()
      stream.addTrack(track)
      if (params.kind === 'video') {
        // this.videoCount = this.videoCount + 1
        if (this.roomUsers.has(socketID)) {
          let user = this.roomUsers.get(socketID)
          user.video = true

        }
        return {
          consumer,
          stream,
          kind: params.kind
        }
      }
      if (params.kind === 'audio') {
        var audio = new Audio()
        audio.srcObject = stream
        audio.muted = true
        const gainNode = audioContext.createGain()
        // const analyser = audioContext.createAnalyser()
        gainNode.gain.value = 0.9
        // audio.onloadedmetadata = function () {
         const source = audioContext.createMediaStreamSource(audio.srcObject)
          audio.play()
          source.connect(gainNode)
          // gainNode.connect(analyser)
          gainNode.connect(audioContext.destination)
          audioContext.resume()
        // }
        if (this.roomUsers.has(socketID)) {
          let user = this.roomUsers.get(socketID)
          user.audio = true
        }
        return {
          consumer,
          stream,
          kind: params.kind,
          audioNode: source
        }
       
      }
    },
    async removeConsumer (data) {
      try {
        if (data.kind === 'audio') {
          this.audioTracks.forEach(async(audio, id) => {
            if(id === data.remoteProducerId){
              await audio.stream.getTracks().forEach(function (track) {
                track.stop()  
              })
              this.audioTracks.delete(id)
            }

          })

          if (this.roomUsers.has(data.socketID)) {
            this.roomUsers.get(data.socketID).audio = false
            this.roomUsers.get(data.socketID).audioNode = null
          }
          // this.deletedAudioTracks.set(data.userID,"audio")
        }
        if (data.kind === 'video') {
          this.videoTracks.forEach(async(video, id) => {
            if(id === data.remoteProducerId){
              await video.stream.getTracks().forEach(function (track) {
                track.stop()  
              })
              this.videoTracks.delete(id)
            }
          })
          // this.videoCount = this.videoCount - 1
          if (this.roomUsers.has(data.socketID)) {
            this.roomUsers.get(data.socketID).video = false
          }
        }

        return true
      } catch (err) {
        console.log('error', err)
      }
    },
    async sendMessage(message){
      this.socket.emit("message",{message})
    },
    async saveMessage(message,from_id,to_id){
      try{
        const date = new Date().toISOString()
        const response = await axios.post(
          "https://chatters.qspiders.com/add-users-chat",
          {from_id,to_id,date,message},
          {
            headers: {
              "Content-Type": "application/json", // this shows the expected content type
  
          }
          }
        );
      }catch (err) {
          console.log("saveMessage errors", err)
        }
 
    },
    async getMessages(from_id,to_id,sid){
      try{
        const date = dayjs().format('YYYY-MM-DD')
        const response = await axios.get(`https://chatters.qspiders.com/get-users-chat?fromid=${from_id}&toid=${to_id}&date=${date}`);
        let user = await this.roomUsers.get(sid)
        user.messages = response.data
        // user.value.messages = response.data

      }catch (err) {
        console.log("getMessages errors", err)
      }
    },
    async chatToggle () {
      this.chat = !this.chat
      this.setNewMessage = false
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(webrtcNewStore, import.meta.hot))
}
