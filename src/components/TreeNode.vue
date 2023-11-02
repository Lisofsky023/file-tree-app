<template>
  <div>
    <div class="node">
      <input v-if="isEditing" v-model="newName" @blur="applyEdit" @keyup.enter="applyEdit">
      <span v-else @click="toggle">{{ item.name }}</span>
      <edit-node
        v-if="!isEditing"
        :edit-icon="editIcon"
        :is-editing="isEditing"
        @edit="enableEditing"
      />
      <delete-node
        :delete-icon="deleteIcon"
        :node-id="item.id"
        @delete="deleteNode"
      />
    </div>
    <div v-if="item.children && item.children.length" class="children">
      <tree-node
        v-for="child in item.children"
        :key="child.id"
        :item="child"
      ></tree-node>
    </div>
  </div>
</template>

<script>
import EditNode from './NodeEditor.vue';
import DeleteNode from './NodeDeleter.vue';

import { ref, computed } from 'vue';
import { useStore } from 'vuex';

import editIcon from '../assets/edit.png';
import deleteIcon from '../assets/delete.png';

export default {
  components: {
    EditNode,
    DeleteNode
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isOpen = ref(false);
    const isEditing = ref(false);
    const newName = ref(props.item.name);
    const isFolder = computed(() => props.item.type === 'directory');
    
    function toggle() {
      if (isFolder.value) {
        isOpen.value = !isOpen.value;
      }
    }

    function enableEditing() {
      isEditing.value = true;
    }

    function applyEdit() {
      if (newName.value && newName.value !== props.item.name) {
        store.dispatch('updateName', { id: props.item.id, newName: newName.value });
        isEditing.value = false;
      }
    }

    function deleteNode(id) {
      store.dispatch('deleteNode', id);
    }

    return {
      isOpen,
      isFolder,
      isEditing,
      newName,
      toggle,
      enableEditing,
      applyEdit,
      deleteNode,
      editIcon,
      deleteIcon,
    };
  },
};
</script>

<style>

</style>
