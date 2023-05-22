<script setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'

import FooterBar from '../components/FooterBar.vue'
import Navbar from '../components/Navbar.vue'
import NewsCard from '../components/reusable/NewsCard.vue'
import { scrollToTop } from '../utilities/helperFunctions'

const data = ref(null)
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const searchTerm = ref('')
const tags = ref('front_page')
const cancelToken = ref(null)

onMounted(() => {
  fetchData()
})

watch([currentPage, searchTerm], () => {
  fetchData()
})

watch([searchTerm], () => {
  currentPage.value = 1
})

function highlightTextContaining(pattern) {
  const regex = new RegExp(pattern, 'gi')
  const elements = document.getElementsByTagName('*')

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]

    for (let j = 0; j < element.childNodes.length; j++) {
      const node = element.childNodes[j]

      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue
        const matches = text.match(regex)

        if (matches) {
          const highlightedText = document.createElement('span')
          highlightedText.innerHTML = text.replace(regex, '<span class="highlight">$&</span>')
          element.replaceChild(highlightedText, node)
        }
      }
    }
  }
}

async function fetchData() {
  if (cancelToken.value) {
    cancelToken.value.cancel('Request canceled due to new request.')
  }

  loading.value = true
  error.value = null
  cancelToken.value = axios.CancelToken.source()

  if (searchTerm.value.length > 0) {
    tags.value = 'story'
  } else {
    tags.value = 'front_page'
  }

  try {
    const response = await axios.get('https://hn.algolia.com/api/v1/search', {
      params: {
        tags: tags.value,
        page: currentPage.value,
        query: searchTerm.value
      },
      cancelToken: cancelToken.value.token
    })
    data.value = response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
    } else {
      error.value = 'An error occurred while fetching the data.'
      console.error(error)
    }
  } finally {
    scrollToTop()
    loading.value = false
    cancelToken.value = null
  }
}
</script>

<template>
  <div class="h-screen w-full bg-white">
    <!-- navbar -->
    <navbar />
    <!-- content -->
    <div class="w-full flex flex-col items-center">
      <div class="w-4/6 py-6 min-h-[630px] flex flex-col">
        <div class="flex items-end justify-end">
          <div class="flex w-[50%] items-center relative">
            <input
              class="h-10 w-full pl-9 pr-2 rounded-md border-[1.5px] border-primary outline-none hover:ring-[1px] ring-primary font-opensans font-light text-black text-base tracking-wide placeholder:text-gray placeholder:text-base"
              v-model="searchTerm"
              placeholder="Find stories"
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-primary absolute left-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
        </div>

        <div class="text-left mt-6">
          <h3 class="text-xl font-semibold font-opensans text-primaryLight">Latest News</h3>
        </div>

        <div v-if="!loading && data?.hits.length == 0">
          <p class="text-center text-base font-light font-opensans text-gray">No News Found</p>
        </div>

        <div v-if="loading">
          <p class="text-center text-base font-light font-opensans text-gray">Fetching News...</p>
        </div>

        <div v-if="!loading && data?.hits.length > 0">
          <div v-for="(hit, index) in data?.hits" :key="index">
            <news-card :hit="hit" />
          </div>

          <div class="bg-white py-3 my-2 border-t border-primaryLight">
            <div class="flex-1 flex justify-between items-center sm:justify-end">
              <button
                class="relative outline-none inline-flex items-center px-4 py-2 border border-gray text-sm font-medium rounded-md text-black bg-white hover:text-primary hover:border-primary disabled:pointer-events-none"
                :disabled="currentPage <= 1"
                @click="currentPage--"
              >
                Previous
              </button>

              <span class="text-sm font-medium font-opensans mx-3">
                {{ currentPage }}
              </span>
              <button
                class="relative outline-none inline-flex items-center px-4 py-2 border border-gray text-sm font-medium rounded-md text-black bg-white hover:text-primary hover:border-primary"
                @click="currentPage++"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- footer -->
    <footer-bar />
  </div>
</template>
