<template>
  <div>
    <div class="node">
      <img v-if="isFolder" :src="folderIcon" @click="toggleChildren" class="folder-icon" />
      <img v-if="!isFolder" :src="fileIcon" class="file-icon" />
      <input v-if="isEditing" v-model="newName" @blur="applyEdit" @keyup.enter="applyEdit" class="edit-input">
      <span v-else @click="toggleChildren">{{ item.name }}</span>
      <edit-node
       v-if="!isEditing" 
       :edit-icon="editIcon" 
       :is-editing="isEditing"
       @edit="enableEditing"
         />
      <delete-node :delete-icon="deleteIcon" :node-id="item.id" @delete="deleteNode" />
    </div>
    <div v-if="isOpen" class="children">
      <tree-node v-for="child in item.children" :key="child.id" :item="child"></tree-node>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import EditNode from './NodeEditor.vue';
import DeleteNode from './NodeDeleter.vue';

import editIconPath from '../assets/edit.png';
import deleteIconPath from '../assets/delete.png';
import folderIconPath from '../assets/folder.png';
import fileIconPath from '../assets/file.png';
import { NODE_TYPES } from '../store/constants';

export default {
  components: {
    'edit-node': EditNode,
    'delete-node': DeleteNode
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

    const isFolder = computed(() => props.item.type === NODE_TYPES.DIRECTORY);

    const handleClickOutside = (event) => {
      if (isEditing.value && !event.target.closest('.edit-input')) {
        isEditing.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      window.removeEventListener('click', handleClickOutside);
    });

    const toggleChildren = () => {
      if (isFolder.value) {
        isOpen.value = !isOpen.value;
      }
    };

    const enableEditing = (event) => {
      isEditing.value = true;
      event.stopPropagation();
    }

    const applyEdit = () => {
      if (newName.value.trim() && newName.value !== props.item.name) {
        store.dispatch('updateName', { id: props.item.id, newName: newName.value.trim() });
        isEditing.value = false;
      }
    };

    const deleteNode = (id) => {
      store.dispatch('deleteNode', id);
    };

    return {
      isOpen,
      isEditing,
      newName,
      isFolder,
      toggleChildren,
      enableEditing,
      applyEdit,
      deleteNode,
      editIcon: editIconPath,
      deleteIcon: deleteIconPath,
      folderIcon: folderIconPath,
      fileIcon: fileIconPath,
    };
  },
};
</script>

<style>
.node {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto 10px;
  max-width: 220px;
}

.folder-icon {
  cursor: pointer;
  width: 40px;
  height: auto;
}

.file-icon {
  width: 16px;
  height: 16px;
}

.action-icon {
  margin: 0 5px;
}

.children {
  margin-left: 20px;
}

input {
  margin-right: 5px;
}

span {
  margin: 0 10px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
}
</style>
