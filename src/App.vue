<template>
  <div id="app">
    <tree-node
      v-for="item in getTree"
      :key="item.id"
      :item="item"
      v-memo="[item]"
    ></tree-node>
  </div>
</template>

<script>
import TreeNode from './components/TreeNode.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    'tree-node': TreeNode
  },
  computed: {
    ...mapGetters([
      'getTree'
    ]),
  },
  methods: {
    ...mapActions([
      'loadTreeFromLocalStorage',
      'deleteNode',
      'updateName',  
    ])
  },

  created() {
  const { loadTreeFromLocalStorage } = this;
  loadTreeFromLocalStorage()
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
