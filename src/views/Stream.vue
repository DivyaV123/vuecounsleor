<script setup>
import { nextTick, reactive, ref, computed, onBeforeMount, onMounted } from 'vue'
import {
  mdiBroadcast,
  mdiWeb,
  mdiWebrtc,
  mdiMonitor,
  mdiMicrophoneSettings,
  mdiWebcam,
  mdiDevices,
  mdiAccountGroup,
  mdiAccountMultipleCheck,
  mdiAccountMultipleMinus,
  mdiMessageText,
  mdiMicrophone,
  mdiMonitorShare,
  mdiExitToApp,
  mdiVolumeOff,
  mdiCastConnected,
  mdiPause,
  mdiMessageArrowRight,
  mdiSendOutline,
  mdiPlay,
  mdiChat,
  mdiBroadcastOff,
  mdiHandBackLeft,
  mdiMicrophoneOff,
  mdiCloseBox,
  mdiFullscreen,
  mdiMonitorOff,
  mdiForumRemove,
  mdiBookmarkMultiple
} from '@mdi/js'
import Icon from "@/components/Icon.vue";
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import DividerHorizontal from '@/components/DividerHorizontal.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import ButtonTextLink from '@/components/ButtonTextLink.vue'
import { sessionStore } from '@/stores/session'
import { counselorStore } from '@/stores/counselor'
import { useRoute, useRouter } from 'vue-router'
import { webrtcNewStore } from '../stores/newWebRTC'
import dayjs from 'dayjs';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import Pill from '@/components/Pill.vue'
import { themeStore } from "../stores/theme";

const webrtc = webrtcNewStore()
const mainStore = sessionStore()
const roomStore = counselorStore()
const theme = themeStore();
const route = useRoute();
const router = useRouter();
const checkRTC = computed(() => {
  return webrtc.checkRTC
})

const pageLoading = ref(false)
const loadingMessage = ref('Connecting to online classroom, please wait.')
const showBottomChat = ref(false)
const chatMessage = ref('')
const activeChatUser = reactive({})

// const roomUsers = computed(() => {
//   return webrtc.roomUsers;
// });
const isTrainer = computed(() => {
  return webrtc.trainerJoined
})

const isBroadcaster = computed(() => {
  return mainStore.isBroadcaster
})

const broadcastPause = computed(() => {
  return webrtc.broadcastPause
})

const roomBatch = computed(() => {
  return roomStore.roomBatch
})

const broadcastRoomValue = computed(() => {
  return webrtc.broadcastRoom
})

const audioValue = computed(() => {
  return webrtc.myAudio
})
const screenValue = computed(() => {
  return webrtc.myScreen
})
const chatValue = computed(() => {
  // return true
  return webrtc.chat
})

const headerClick = () => {
  showBottomChat.value = false
}
const videoTracks = computed(() => {
  return webrtc.videoTracks
})
const exitValue = ref(false)
const stopBroadcast = ref(false)
const startBroadcast = ref(false)
const searchChatUser = ref('')
// const clearSearchUsers = () => {
//   if (searchChatUser.value.length > 0) {
//     searchChatUser.value = ''
//   }
// }
const broadcastUser = new Map()
broadcastUser.set("all", {
  name: 'Broadcast',
  connected: true,
  messages: [],
}
)
const headerBroadcast = () => {
  activeChatUser.value = broadcastUser.get("all")
  activeChatUser.id = "all"
  showBottomChat.value = true
  webrtc.setNewMessage = false
}
const openChat = (id) => {
  showBottomChat.value = true
  if (webrtc.roomUsers.has(id)) {
    activeChatUser.value = webrtc.roomUsers.get(id)
    activeChatUser.id = activeChatUser.value.userID
    webrtc.getMessages(mainStore.user.uid,activeChatUser.value.userID,id)
    webrtc.setNewMessage = false
  }

}
const sendMessage = () => {
  if (activeChatUser.value.connected === true) {
    if (chatMessage.value.length > 0) {
      let message = {
        content: chatMessage.value,
        date: dayjs().format('MMM D, h:mm A'),
        from: mainStore.user.uid,
        to: activeChatUser.id
      }
      activeChatUser.value.messages.push(message)
      webrtc.sendMessage(message)
      webrtc.saveMessage(message,mainStore.user.uid,activeChatUser.id)
      chatMessage.value = ''

    }
  }
  else {
    mainStore.pushMessage(activeChatUser.value.name + " is not online.")
  }
}

const trimString = messages => {
  if (messages.length > 0) {
    let message = messages[messages.length - 1]
    let newText = message.content
    if (newText && newText.length > 150) {
      newText = newText.substring(0, 150) + '...'
    }
    return newText
  }
}

const filterType = ref('chat')

const changeFilterType = (type) => {
  filterType.value = type
}

const audioDisable = (id, status) => {
  if (status) {
    webrtc.unmuteRoomUser(id)
  } else {
    webrtc.muteRoomUser(id)
  }
}
const isVideoOnFullScreen = ref(false)
const handleFS = async (id) => {
  await nextTick()
  let videoPlayer = document.getElementById(id);
  videoPlayer.addEventListener("fullscreenchange", (e) => {
    if (videoPlayer.controls) return;
    let fullscreenElement = document.fullscreenElement;
    if (!fullscreenElement) {
      videoPlayer.style.pointerEvents = "auto";
      isVideoOnFullScreen.value = false;
    }
  });
  videoPlayer.addEventListener("webkitfullscreenchange", (e) => {
    if (videoPlayer.controls) return;
    let webkitIsFullScreen = document.webkitIsFullScreen;
    if (!webkitIsFullScreen) {
      videoPlayer.style.pointerEvents = "auto";
      isVideoOnFullScreen.value = false;
    }
  });
  if (!isVideoOnFullScreen.value) {
      if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
      } else if (videoPlayer.webkitRequestFullscreen) {
        videoPlayer.webkitRequestFullscreen();
      } else if (videoPlayer.msRequestFullscreen) {
        videoPlayer.msRequestFullscreen();
      }
      isVideoOnFullScreen.value = true;
      videoPlayer.style.pointerEvents = "none";
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      isVideoOnFullScreen.value = false;
      videoPlayer.style.pointerEvents = "auto";
    }
  videoPlayer.addEventListener("click", (e) => {
    if (videoPlayer.controls) return;
    if (isVideoOnFullScreen.value) {
       if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      isVideoOnFullScreen.value = false;
      videoPlayer.style.pointerEvents = "auto";
    }
  });
};

const createAudioMotion = async (context, id) => {
  await nextTick()
  let mdiv = document.getElementById(id)
  const audioMotion = new AudioMotionAnalyzer(mdiv, {
    source: context,
    height: 20,
    width: 80,
    overlay: true,
    showBgColor: false,
    showScaleX: false
  })
  let audioPeer = webrtc.audioTracks.get(id)
  audioPeer.audioMotion = true

}


const filterdUsers = computed(() => {
  let chatUsers = new Map([...webrtc.roomUsers].sort(function (a, b) {
    return b[1].joined - a[1].joined;
  }))
  // if(filterType.value === 'chat'){
  //   chatUsers = chatUsers
  // }
  if (filterType.value === 'audio') {
    chatUsers = new Map(
      [...chatUsers].filter(([k, v]) => v.audio === true)
    )
  }
  if (searchChatUser.value.length > 0) {
    return new Map(
      [...chatUsers].filter(([k, v]) => v.name.includes(searchChatUser.value))
    )
  }
  return chatUsers
})

const userSize = computed(() => {
  let users = webrtc.roomUsers
  let total = users.size
  let connected = new Map(
    [...users].filter(([k, v]) => v.connected == true)
  ).size
  let disconnected = new Map(
    [...users].filter(([k, v]) => v.connected == false)
  ).size
  return { total: total, connected: connected, disconnected: disconnected }
})


const muteRoomValue = computed(() => {
  return webrtc.roomMuted
})

const videoSize = computed(() => {
  return webrtc.videoTracks.size
})
// const audioSize = computed(() => {
//   return webrtc.audioTracks.size
// })

const joinRoom = async () => {
  try {
    loadingMessage.value =
      'Joining classroom, this may take a few seconds, please wait.'
    pageLoading.value = true
    if (joined.value == false) {
      await webrtc.joinRoom(room.value)
      roomStore.add_trainer_attendance({ role: "counselor", batch: roomBatch.value.id })
      pageLoading.value = false
      mainStore.pushMessage('You have joined the classroom!')
    } else {
      mainStore.pushMessage(
        'Failed to join classroom, please check browser and permissions'
      )
      pageLoading.value = false
    }
  } catch (err) {
    pageLoading.value = false
  }
}

// const remoteMedia = computed(() => {
//   return webrtc.remoteTracks
// })
// const getAudioProducers = () => {
//   console.log("yoloooooo",Date.now())

// }
const joined = computed(() => {
  return webrtc.joined
})
const clickMuteAll = async () => {
  if (muteRoomValue.value) {
    await webrtc.unmuteRoom(room.value)
  } else {
    await webrtc.muteRoom(room.value)
  }
}
const clickBroadcast = async () => {
  startBroadcast.value = !startBroadcast.value
  await webrtc.broadcastStream("video.webm")
}
const clickPause = async () => {
  await webrtc.pauseStream()
}
const clickResume = async () => {
  await webrtc.resumeStream()
}
const clickStop = async () => {
  stopBroadcast.value = !stopBroadcast.value
  await webrtc.closeStream()

}
const clickAudio = async () => {
  if (audioValue.value) {
    await webrtc.stopAudio()
  } else {
    await webrtc.produceAudio()
  }
}
// const clickVideo = async () => {
//   if (videoValue.value) {
//     await webrtc.stopVideo()
//   } else {
//     await webrtc.produceVideo()
//   }
// }
const clickScreen = async () => {
  if (screenValue.value) {
    await webrtc.stopScreen()
  } else {
    await webrtc.produceScreen()
  }
}
// const muteUser = async userID => {
//   await webrtc.muteRoomUser(userID)
// }
// const unmuteUser = async userID => {
//   await webrtc.unmuteRoomUser(userID)
// }
const clickChat = () => {
  webrtc.chatToggle()
  webrtc.setNewMessage = false
}
const clickExit = () => {
  exitValue.value = !exitValue.value
}
const stopBroadcasting = () => {
  stopBroadcast.value = !stopBroadcast.value
}
const startBroadcasting = () => {
  startBroadcast.value = !startBroadcast.value
}
const exitRoom = () => {
  location.href = '/'
}
const animateChat = computed(() => {
  return webrtc.setNewMessage
})

const socketConnected = computed(() => {
  if (!webrtc.socketConnected) {
    loadingMessage.value = 'Trying to reconnect to server, this may take a few seconds, please wait or check your internet connection'
  }
  return webrtc.socketConnected
})

const room = ref('')
onMounted(async () => {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    // console.log("This browser does not support desktop notification");
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        // const notification = new Notification("Notifications are enabled for this classroom");
      }
    });
  }
})
onBeforeMount(async () => {
  pageLoading.value = true
  await mainStore.checkUser();
  if (mainStore.loggedIn) {
    room.value = route.params.id
    theme.setPageTitle("Classroom");
    await roomStore.get_single_batch(room.value);
    let server = "https://v4streaming1.qspiders.com"
    // if(roomBatch.value.Server && roomBatch.value.Server.url){
    //   server = roomBatch.value.Server.url
    // }
    await webrtc.getWebRtc()
    await webrtc.connectSocket(server)
    // await webrtc.checkRoom(room.value)
  }
  else {
    router.replace("/login");
  }

  pageLoading.value = false
})
</script>
<template>
  <section class="pt-4">
    <div v-if="pageLoading || !socketConnected" wire:loading
      class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      <p class="w-1/3 text-center text-white">{{ loadingMessage }}</p>
    </div>
    <div class="flex h-stream-container">
      <div class="block w-full rounded-lg shadow-lg">
        <div class="border-b border-gray-300 px-2 flex flex-wrap md:justify-between">

          <div class="text-orange-500 text-lg font-semibold">
            <span>
              {{ room }}
            </span>
            <span v-if="joined" class="text-blue-500 text-sm font-semibold">
              <icon :path="mdiAccountGroup" class="ml-0 mx-auto" />{{ userSize.total }}
            </span>
            <span v-if="joined" class="text-green-500 text-sm font-semibold">
              <icon :path="mdiAccountMultipleCheck" class="ml-0 mx-auto" />{{ userSize.connected }}
            </span>
            <span v-if="joined" class="text-red-500 text-sm font-semibold">
              <icon :path="mdiAccountMultipleMinus" class="ml-0 mx-auto" />{{ userSize.disconnected }}
            </span>
          </div>
          <div class="flex p-1 md:p-0">
            <div v-if="roomBatch && roomBatch.coursedetails" class="text-blue-500  font-semibold uppercase">
              {{ roomBatch.coursedetails.subject.displayname }}
            </div>
          </div>
        </div>
        <div class="p-2">
          <div class="" v-if="joined">
            <div class="grid grid-flow-col grid-cols-1 md:grid-cols-6 gap-1 w-full">
              <div v-for="[key, user] in webrtc.audioTracks" :key="key" class="flex bg-gray-700 rounded-lg">
                <div class="flex font-semibold">
                  <div @click="audioDisable(user.id, false)" class="text-green-500 cursor-pointer pt-1">
                    <icon h="4" w="4" :path="mdiMicrophone" />
                  </div>
                  <div @click="openChat(user.id)" class="pt-1 pr-1 text-blue-500 cursor-pointer">
                    <icon h="4" w="4" :path="mdiChat" />
                  </div>
                  {{ user.name }}
                </div>
                <div :id="key">
                </div>
                <div v-if="user.audioMotion === false" class="hidden">
                  {{ createAudioMotion(user.audioNode, key) }}
                </div>

              </div>

            </div>
            <div id="filtered-audio" class="">
              <div v-if="videoSize === 0" class="flex items-center justify-center h-stream-container">
                    <div class="flex flex-col  items-center w-full max-w-xs p-4 bg-gray-600 rounded-3xl md:flex-row">
                      <div class="-mt-28 md:-my-16 md:-ml-32 border-green-500 rounded-full border bg-gray-600">
                        <img class="w-auto h-36" src="../assets/default_trainer.png" alt="Trainer" />
                      </div>
                      <div class="flex flex-col pl-4">
                        <div class="flex flex-col items-center md:items-start">
                          <h2 class="text-xl font-medium text-gray-100">Trainer
                            <pill
                          v-if="isTrainer"
                          type="success"
                          text="ONLINE"
                          small
                        />
                        <pill
                          v-else
                          type="danger"
                          text="OFFLINE"
                          small
                        />
                          </h2>
                          <p v-if="screenValue" class="text-base font-medium text-green-500">Screen is shared</p>
                          <p v-else class="text-base font-medium text-red-500">Screen is not shared</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="w-full grid grid-flow-col auto-cols-auto" v-else>
                    <div class="flex justify-center h-student-container" v-for="[key, video] in videoTracks" :key="key">
                      <div class="block rounded-lg">
                        <div class="bg-stone-900 py-1 px-2 font-semibold">
                          {{ video.name }}
                          <span class="float-right">
                            <BaseButton color="info" :icon="mdiFullscreen" small
                            @click="handleFS(key)" />
                          </span>
                        </div>
                        <div class="">
                          <video playsinline autoplay muted :id="key" class="h-video-container object-contain" :srcObject="video.stream" ></video>
                        </div>
                      </div>
                    </div>
                    <i class="watermark">&#169; QSpiders {{ mainStore.user.uid }}</i>
                  </div>
            </div>
          </div>
          <div v-else>
            <div class="flex justify-center">
              <div class="block w-96 rounded-lg shadow-lg bg-gray-700">
                <div class="border-b border-gray-300 py-3 text-center font-semibold">
                  Streaming Information
                </div>
                <div class="p-6">
                  <div v-if="checkRTC && checkRTC.osName" class="font-semibold">
                    <ButtonTextLink class="text-gray-400" :label="
                      checkRTC.isMobileDevice
                        ? 'Mobile(Audio will be disabled)'
                        : 'Laptop/Desktop'
                    " :icon="mdiDevices" />
                    <DividerHorizontal />
                    <ButtonTextLink class="text-gray-400" :label="checkRTC.osName" :icon="mdiMonitor" />
                    <DividerHorizontal />
                    <ButtonTextLink class="text-gray-400" :label="
                      checkRTC.browser.name +
                      ' (version: ' +
                      checkRTC.browser.version +
                      ')'
                    " :icon="mdiWeb" />
                    <DividerHorizontal />
                    <ButtonTextLink :class="
                      checkRTC.isWebRTCSupported ? 'text-gray-400' : 'text-red-600'
                    " :label="
  checkRTC.isWebRTCSupported
    ? 'Streaming supported'
    : 'Streaming not supported'
" :icon="mdiWebrtc" />
                    <DividerHorizontal />
                    <ButtonTextLink :class="checkRTC.hasMicrophone ? 'text-gray-400' : 'text-red-600'" :label="
                      checkRTC.hasMicrophone
                        ? 'Microphone supported'
                        : 'Microphone not supported'
                    " :icon="mdiMicrophoneSettings" />
                    <DividerHorizontal />
                    <ButtonTextLink :class="checkRTC.hasWebcam ? 'text-gray-400' : 'text-red-600'" :label="
                      checkRTC.hasWebcam ? 'Webcam supported' : 'Webcam not supported'
                    " :icon="mdiWebcam" />
                  </div>
                </div>
                <div class="flex border-t border-gray-100 py-3 justify-center text-center">
                  <BaseLevel mobile>
                    <BaseButtons>
                      <BaseButton v-if="roomBatch.status === 1 || roomBatch.status === 3" color="info"
                        :icon="mdiCastConnected" small label="Join class" @click="joinRoom" />
                      <BaseButton v-else color="danger" :icon="mdiCastConnected" small label="Closed" />
                    </BaseButtons>
                  </BaseLevel>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div v-if="joined" class="bottom-2 absolute w-full text-center">
          <div class="block ml-1">
            <span class="px-1">

              <BaseButton v-if="audioValue" label="Audio" rounded-full color="success" :icon="mdiMicrophone" small
                @click="clickAudio" />
                <BaseButton v-else label="Audio" rounded-full color="danger" :icon="mdiMicrophoneOff" small
                @click="clickAudio" />
            </span>
            <!-- <span class="px-1">
                <BaseButton rounded-full :color="videoValue ? 'success' : 'danger'" :icon="mdiWebcam" small
                  @click="clickVideo" />
              </span> -->
            <span class="px-1">
              <BaseButton v-if="screenValue" label="Screen" rounded-full color="success" :icon="mdiMonitorShare" small
                @click="clickScreen" />
                <BaseButton v-else label="Screen" rounded-full color="danger" :icon="mdiMonitorOff" small
                @click="clickScreen" />
            </span>
            <span class="px-1">
              <BaseButton v-if="chatValue" label="Chat" :class="animateChat ? 'animate-pulse' : ''" rounded-full
                color="success" :icon="mdiMessageText" small @click="clickChat" />
                <BaseButton v-else label="Chat" :class="animateChat ? 'animate-pulse' : ''" rounded-full
                color="danger" :icon="mdiForumRemove" small @click="clickChat" />
            </span>
            <span class="px-1">
              <BaseButton rounded-full :color="exitValue ? 'info' : 'info'" :icon="mdiExitToApp" small
                @click="clickExit" />
            </span>
            <span v-if="isBroadcaster" class="px-1">
                <BaseButton v-if="broadcastRoomValue" rounded-full color="success" :icon="mdiBroadcast" small
                  @click="stopBroadcasting" />
                  <BaseButton v-else rounded-full color="danger" :icon="mdiBroadcastOff" small
                  @click="startBroadcasting" />
              </span>
              <span v-if="isBroadcaster && broadcastRoomValue" class="px-1">
                <BaseButton v-if="broadcastPause" rounded-full color="success" :icon="mdiPlay" small
                  @click="clickResume" />
                  <BaseButton v-else rounded-full color="danger" :icon="mdiPause" small
                  @click="clickPause" />
              </span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="chatValue" class="fixed bg-slate-500 bottom-[62px] right-2 md:right-2 opacity-95 md:w-[20rem]">
      <div class="w-full rounded">
        <CardBox class="h-mobile-main md:h-chat-container md:rounded-none">
          <div class="flex justify-between border-b border-gray-500 flex-wrap">
            <div class="flex gap-2">
              <div @click="headerBroadcast" class="cursor-pointer">
                <icon :path="mdiSendOutline" w="4" h="4" />
              </div>

              <div>
                <input type="text" v-model="searchChatUser"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-4 w-40"
                  placeholder="Search">
              </div>
              <div>

                <icon @click="changeFilterType('chat')" :class="filterType == 'chat' ? 'text-green-500' : ''"
                  :path="mdiChat" w="4" h="4" class="cursor-pointer" />
              </div>
              <!-- <div @click="changeFilterType('audio')" class="">
                <icon :class="filterType == 'audio' ? 'text-green-500' : ''" :path="mdiMicrophone" w="4" h="4"
                  class="cursor-pointer" />
              </div> -->
              <!-- <div @click="changeFilterType('hand')">
                       <span class="relative inline-block">
                         <icon
                           :class="filterType == 'hand'?'text-green-500':''"
                           :path="mdiHandBackLeft"
                           w="4"
                          h="4" 
                           class="cursor-pointer"
                         />
                         <span
                           class="absolute top-0 right-0 inline-flex items-center justify-center text-xs font-bold leading-none text-gray-200 transform translate-x-full -translate-y-1/2"
                           >15</span
                         >
                       </span>
                     </div> -->
            </div>

            <div class="flex gap-2 flex-wrap">

              <div class="ml-4" @click="clickChat">
                <icon :path="mdiCloseBox" class="cursor-pointer hover:text-gray-300" />
              </div>
            </div>
          </div>

          <div v-if="filterType === 'chat'" class="h-mobile-inside md:h-student-container overflow-y-auto">
            <div v-for="[key, client] in filterdUsers" :key="key" class="border-b border-gray-500 pt-1">
              <div class="flex gap-1">
                <div>
                  <icon :class="client.raised ? 'text-blue-500' : 'text-gray-500'" :path="mdiHandBackLeft" w="4" h="4"
                    class="cursor-pointer" />
                </div>
                <div @click="audioDisable(client.userID, client.muted)">
                  <icon v-if="client.muted" :path="mdiMicrophoneOff" w="4" h="4" class="cursor-pointer text-red-500" />
                  <icon v-else :path="mdiMicrophone" w="4" h="4" class="cursor-pointer text-blue-500" />
                </div>
                <div @click="openChat(key)">
                  <h6 :class="client.connected ? 'text-green-500' : 'text-red-500'"
                    class="text-sm font-semibold cursor-pointer">
                    {{ client.name }} <span v-if="client.role !== 'student'" class="italic text-2xs text-orange-500 capitalize">{{ client.role }}</span>
                  </h6>
                </div>
               
                <!-- 
                        <div>
                          <icon
                          v-if="client.shareEnabled"
                            :path="mdiMonitorShare"
                            w="4"
                            h="4"
                            class="cursor-pointer text-green-500"
                          />
                          <icon
                          v-else
                            w="4"
                            h="4"
                            :path="mdiMonitorShare"
                            class="cursor-pointer text-red-500"
                          />
                        </div> -->
              </div>

              <div @click="openChat(key)">
                <p class="text-xs text-gray-200 cursor-pointer">
                  {{ trimString(client.messages) }}
                </p>
              </div>
            </div>
          </div>
          <!-- <div v-if="filterType === 'audio'" class="mt-2 h-mobile-inside md:h-student-container overflow-y-auto">
            <div v-for="[key, client] in filterdUsers" :key="key"
              class="flex justify-between border-b border-gray-500 items-center pt-1">
              <div class="flex gap-2">
                <div @click="audioDisable(client.userID, client.muted)">
                  <icon v-if="client.muted" :path="mdiMicrophoneOff" w="4" h="4" class="cursor-pointer text-red-500" />
                  <icon v-else :path="mdiMicrophone" w="4" h="4" class="cursor-pointer text-green-500" />
                </div>
                <div @click="openChat(key)">
                  <h6 :class="client.connected ? 'text-green-500' : 'text-red-500'"
                    class="text-sm font-semibold cursor-pointer">
                    {{ client.name }} <span class="italic text-2xs">{{ client.role }}</span>
                  </h6>
                </div>
              </div>
              <div @click="openChat(key)">
                <p class="text-xs text-gray-200 cursor-pointer">
                  {{ trimString(client.messages) }}
                </p>
              </div>
            </div>
          </div> -->
        </CardBox>
      </div>
    </div>
    <!-- room user popup End-->

    <!-- first popup -->

    <div class="flex gap-3 fixed bottom-[62px] right-4">
      <div class=" bg-slate-900" :class="showBottomChat ? '' : 'hidden'">
        <div class="w-80 rounded shadow-2xl">
          <nav
            class="w-full h-8 bg-gray-800 rounded-tr rounded-tl flex justify-between items-center shadow-r-gray-900 shadow-slate-900">
            <div class="flex justify-center items-center">
              <span v-if="activeChatUser && activeChatUser.value"
                :class="activeChatUser.value.connected ? 'text-green-500' : 'text-red-500'" class="font-semibold ml-1">{{
                  activeChatUser.value.name
                }}</span>
            </div>

            <div @click="headerClick">
              <icon :path="mdiCloseBox" class="w-5 h-5 cursor-pointer hover:text-gray-300" />
            </div>
          </nav>
          <div class="overflow-auto break-all px-1 py-1 flex flex-col-reverse" style="height: 19rem">
            <div v-if="activeChatUser && activeChatUser.value">
              <div class="break-all" v-for="(message, index) in activeChatUser.value.messages" :key="index">
                <div v-if="message.from == mainStore.user.uid" class="flex justify-end pt-2 pl-10 break-all">
                  <span
                    class="bg-blue-900 break-all h-auto text-gray-200 text-xs font-normal rounded-sm p-1 items-end justify-end">{{
                      message.content }}
                    <span class="text-gray-400 italic pl-1 text-xs">{{
                      message.date
                    }}</span>
                  </span>

                </div>
                <div v-if="message.to == mainStore.user.uid" class="flex items-center pt-2 pr-10 break-all">
                  <span
                    class="break-all ml-1 h-auto bg-green-900 text-gray-200 text-xs font-normal rounded-sm px-1 p-1 items-end">
                    {{ message.content }}
                    <span class="text-gray-400 italic pl-1 text-xs">{{
                      message.date
                    }}</span>
                  </span>

                </div>
              </div>
            </div>
          </div>
          <form @submit.prevent="onSubmit">
            <div class="flex items-center p-1">
              <div class="relative">
                <input v-model="chatMessage" type="text"
                  class="py-2 focus:outline-none h-auto placeholder-gray-100 bg-gray-900 text-white text-xs w-[268px]"
                  placeholder="Type a message..." id="typemsg" />
              </div>
              <div class="w-7 h-7 rounded-full pl-4 bg-blue-300 text-center items-center flex justify-center">
                <BaseButton type="submit" color="info" :icon="mdiMessageArrowRight" @click="sendMessage"
                  class="pt-1 pb-1" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- Second popup g-talk -->
    </div>
    <CardBoxModal :modelValue="exitValue" title="Exit classroom" button-label="Exit" button="danger" has-cancel
      @confirm="exitRoom" @cancel="clickExit">
      <p>Are you sure you want to exit classroom?</p>
    </CardBoxModal>
    <CardBoxModal :modelValue="startBroadcast" title="Start broadcast" button-label="Start" button="success" has-cancel
      @confirm="clickBroadcast" @cancel="startBroadcasting">
      <p>Are you sure you want to start broadcasting?</p>
    </CardBoxModal>
    <CardBoxModal :modelValue="stopBroadcast" title="Stop broadcast" button-label="Stop" button="danger" has-cancel
      @confirm="clickStop" @cancel="stopBroadcasting">
      <p>Are you sure you want to stop broadcasting?</p>
    </CardBoxModal>
  </section>
</template>    
