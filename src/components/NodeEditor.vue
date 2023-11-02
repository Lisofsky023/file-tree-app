<template>
  <img class="action-icon" :src="editIcon" @click="enableEditing" alt="Edit">
</template>

<script>
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  props: {
    editIcon: {
      type: String,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: true
    }
  },
  emits: ['edit'],
  setup(props, { emit }) {
    const { isEditing } = toRefs(props);

    function enableEditing(event) {
      if (!isEditing.value) {
        emit('edit', event);
      }
    }

    return {
      enableEditing
    };
  }
});
</script>

<style>
</style>
