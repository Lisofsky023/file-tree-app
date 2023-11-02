<template>
  <img class="action-icon" :src="deleteIcon" @click="deleteNode" alt="Delete">
</template>

<script>
export default {
  props: {
    deleteIcon: {
      type: String,
      required: true
    },
    nodeId: {
      type: Number,
      required: true
    }
  },
  emits: ['delete'],
  setup(props, { emit }) {
    function deleteNode() {
      emit('delete', props.nodeId);
    }

    return {
      deleteNode
    };
  }
};
</script>

<style>
</style>
