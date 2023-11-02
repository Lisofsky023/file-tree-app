import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { NODE_TYPES } from './constants';

function generateNodeName(type, ...ids) {
  const prefix = type === NODE_TYPES.FILE ? "File" : "Dir";
  return `${prefix} ${ids.join('-')}`;
}

const yourDefaultTreeStructure = [
  {
    id: 1,
    name: generateNodeName(NODE_TYPES.DIRECTORY, 1),
    type: NODE_TYPES.DIRECTORY,
    children: [
      {
        id: 2,
        name: generateNodeName(NODE_TYPES.DIRECTORY, 1, 1),
        type: NODE_TYPES.DIRECTORY,
        children: [
          { id: 3, name: generateNodeName(NODE_TYPES.FILE, 1, 1, 1), type: NODE_TYPES.FILE },
        ],
      },
      { id: 4, name: generateNodeName(NODE_TYPES.FILE, 1, 2), type: NODE_TYPES.FILE },
    ],
  },
  {
    id: 5,
    name: generateNodeName(NODE_TYPES.DIRECTORY, 2),
    type: NODE_TYPES.DIRECTORY,
    children: [
      { id: 6, name: generateNodeName(NODE_TYPES.DIRECTORY, 2, 1), type: NODE_TYPES.DIRECTORY, children: [] },
      { id: 7, name: generateNodeName(NODE_TYPES.FILE, 2, 2), type: NODE_TYPES.FILE },
    ],
  },
  { id: 8, name: generateNodeName(NODE_TYPES.FILE, 2), type: NODE_TYPES.FILE },
];

function findNode(tree, id) {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function deleteFromTree(tree, id) {
  const index = tree.findIndex(node => node.id === id);
  if (index !== -1) {
    tree.splice(index, 1);
    return true;
  }
  for (const node of tree) {
    if (node.children && deleteFromTree(node.children, id)) {
      return true;
    }
  }
  return false;
}

const store = createStore({
  state: {
    tree: yourDefaultTreeStructure,
  },
  actions: {
    loadTreeFromLocalStorage({ commit }) {
      const savedData = localStorage.getItem('treeData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          if (Array.isArray(parsedData)) {
            commit('SET_TREE', parsedData);
          }
        } catch (e) {
          console.error("Failed to parse tree data from localStorage:", e);
        }
      }
    },
    deleteNode({ commit }, id) {
      commit('DELETE_NODE', id);
    },
    updateName({ commit }, { id, newName }) {
      commit('UPDATE_NAME', { id, newName });
    },
  },
  mutations: {
    SET_TREE(state, tree) {
      if (!Array.isArray(tree)) {
        console.error('Attempted to set non-array tree structure:', tree);
      } else {
        state.tree = tree;
      }
    },
    UPDATE_NAME(state, { id, newName }) {
      const node = findNode(state.tree, id);
      if (node) node.name = newName;
    },
    DELETE_NODE(state, id) {
      deleteFromTree(state.tree, id);
    },
  },
  getters: {
    getTree: state => {
      return state.tree;
    }
  },
  plugins: [createPersistedState({
    key: 'treeData',
    storage: window.localStorage,
  })],
});

export default store;