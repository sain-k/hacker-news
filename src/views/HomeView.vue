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
const sortBy = ref('popular')
const showSortMenu = ref(false)

onMounted(() => {
  fetchData()
})

watch([currentPage, searchTerm, sortBy], () => {
  fetchData()
})

watch([searchTerm], () => {
  currentPage.value = 1
})

function selectSortingOptions(value) {
  currentPage.value = 1
  searchTerm.value = ''
  sortBy.value = value
  showSortMenu.value = false
}

function clearSearch() {
  searchTerm.value = ''
}

function refresh() {
  currentPage.value = 1
  fetchData()
}

async function fetchData() {
  if (cancelToken.value) {
    cancelToken.value.cancel('Request canceled due to new request.')
  }

  loading.value = true
  error.value = null
  cancelToken.value = axios.CancelToken.source()

  let url = `https://hn.algolia.com/api/v1/search`

  if (searchTerm.value.length > 0) {
    tags.value = 'story'
  } else {
    tags.value = 'front_page'
  }

  let params = {
    tags: tags.value
  }

  if (sortBy.value == 'latest') {
    url = `https://hn.algolia.com/api/v1/search_by_date`
    params = {
      tags: 'story'
    }
  }

  if (currentPage.value > 1) {
    params.page = currentPage.value
  }

  if (searchTerm.value.length > 0) {
    params.query = searchTerm.value
  }

  try {
    const response = await axios.get(url, {
      params,
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
      <div class="md:w-4/6 px-4 py-6 md:min-h-[660px] min-h-[715px] w-full flex flex-col">
        <div class="flex justify-between items-center">
          <div class="w-[40%]">
            <div class="relative inline-block text-left">
              <div>
                <button
                  class="inline-flex justify-center w-full rounded-md border-[1.5px] border-primary shadow-sm px-4 py-2 bg-white text-sm font-light font-opensans text-gray focus:outline-none focus:ring-[1px] focus:ring-primary"
                  @click="showSortMenu = !showSortMenu"
                >
                  Sort By
                  <svg
                    class="-mr-1 ml-2 h-5 w-5 fill-gray"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <div
                v-if="showSortMenu"
                class="origin-top-right absolute left-0 mt-2 w-[102px] p-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <button
                  @click="selectSortingOptions('popular')"
                  class="text-gray-700 block w-full py-2 text-sm hover:bg-gray hover:text-white rounded-md mb-[4px]"
                  :class="{
                    'bg-primaryLight text-white pointer-events-none': sortBy == 'popular'
                  }"
                >
                  Popular
                </button>
                <button
                  @click="selectSortingOptions('latest')"
                  class="text-gray-700 block w-full py-2 text-sm hover:bg-gray hover:text-white rounded-md mt-[4px]"
                  :class="{
                    'bg-primaryLight text-white pointer-events-none': sortBy == 'latest'
                  }"
                >
                  Latest
                </button>
              </div>
            </div>
          </div>

          <div class="flex w-[60%] items-center relative">
            <input
              class="h-10 w-full pl-9 pr-2 rounded-md border-[1.5px] border-primary outline-none focus:ring-[1px] ring-primary font-opensans font-light text-black text-base tracking-wide placeholder:text-gray placeholder:text-base"
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
          <h3 class="text-xl font-semibold font-opensans text-primaryLight capitalize">
            {{ sortBy }} News
          </h3>
        </div>

        <div
          v-if="!loading && data?.hits.length == 0"
          class="flex flex-col items-center justify-center"
        >
          <p class="text-center text-base font-light font-opensans text-gray">No News Found</p>

          <button
            v-if="searchTerm.length > 0"
            class="flex bg-primaryLight rounded px-2 py-1 outline-none mt-3 text-xs font-normal font-opensans text-white"
            @click="clearSearch"
          >
            Clear Search
          </button>

          <button
            v-if="data.hits.length == 0"
            class="flex bg-primaryLight rounded px-2 py-1 outline-none mt-3 text-xs font-normal font-opensans text-white"
            @click="refresh"
          >
            Reload
          </button>
        </div>

        <div v-if="loading">
          <p class="text-center text-base font-light font-opensans text-gray">Fetching News...</p>
        </div>

        <div v-if="!loading && data?.hits.length > 0">
          <div v-for="(hit, index) in data?.hits" :key="index">
            <news-card :hit="hit" :search-term="searchTerm" />
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
