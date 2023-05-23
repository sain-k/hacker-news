<script setup>
import { defineProps } from 'vue'
import { formatDateTime } from '../../utilities/helperFunctions'

const props = defineProps({
  hit: {
    type: Object,
    required: true,
    default: () => ({})
  },
  searchTerm: {
    type: String,
    required: false,
    default: ''
  }
})

function openLink(url) {
  window.open(url, '_blank')
}

function highlightText(text) {
  const regex = new RegExp(props.searchTerm, 'gi')
  return text.replace(regex, '<span style="background-color: yellow">$&</span>')
}
</script>

<template>
  <div class="bg-white rounded-md shadow px-4 py-4 my-6 border-b border-primaryLight">
    <p class="text-xs font-light text-gray font-opensans">
      {{ formatDateTime(props.hit.created_at) }}
    </p>

    <p class="text-2xl font-semibold text-black font-oswald mt-1">
      <span v-html="highlightText(props.hit.title)"></span>
    </p>

    <div class="flex items-center mt-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4 text-gray"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>

      <p class="text-sm font-light text-gray font-opensans ml-[2px]">
        <span v-html="highlightText(props.hit.author)"></span>
      </p>

      <div class="h-4 bg-gray w-[1px] mx-2" />

      <p class="text-sm font-light text-gray font-opensans">{{ props.hit.points }} points</p>

      <div class="h-4 bg-gray w-[1px] mx-2" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4 text-gray"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>

      <p class="text-sm font-light text-gray font-opensans ml-[2px]">
        {{ props.hit.num_comments }}
      </p>
    </div>

    <button
      v-if="props.hit?.url"
      class="flex bg-primaryLight rounded px-3 py-2 outline-none mt-3"
      @click="openLink(props.hit.url)"
    >
      <p class="text-xs font-normal font-opensans text-white mr-1">Open Story</p>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        class="w-4 h-4 fill-white"
      >
        <path d="m13 3 3.293 3.293-7 7 1.414 1.414 7-7L21 11V3z"></path>
        <path
          d="M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z"
        ></path>
      </svg>
    </button>
  </div>
</template>
