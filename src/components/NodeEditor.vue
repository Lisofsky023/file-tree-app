<template>
  <img class="action-icon" :src="editIcon" @click="enableEditing" alt="Edit">
</template>

<script>
export default {
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
    function enableEditing() {
      if (!props.isEditing) {
        emit('edit');
      }
    }

    return {
      enableEditing
    };
  }
};
</script>

<style>
.action-icon {
  width: 15px;
  margin-left: 10px;
}
</style>
