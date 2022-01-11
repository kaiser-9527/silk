<template>
  <section class="p-10 flex justify-center items-center h-screen w-screen">
    <Card>
      <p>
        Hi there , I'm {{ userStore.name }}. My github is
        <a target="_blank" class="text-blue-500" :href="userStore.github">kaiser-957</a>
      </p>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
</script>
