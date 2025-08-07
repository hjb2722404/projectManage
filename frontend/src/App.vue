<script setup lang="ts">
// @ts-ignore
import MainLayout from './layouts/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <router-view />
  </MainLayout>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}
</style>