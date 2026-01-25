<template>
  <div class="menu-item">
    <div
        v-if="!menu.children || menu.children.length === 0"
        :class="['menu-link', { active: isActive }]"
        @click="$emit('navigate', menu.path)"
    >
      <i :class="menu.icon || 'icon-default'"></i>
      <span>{{ menu.title }}</span>
    </div>

    <div v-else class="menu-group">
      <div
          :class="['menu-parent', { expanded: isExpanded }]"
          @click="toggleExpand"
      >
        <i :class="menu.icon || 'icon-default'"></i>
        <span>{{ menu.title }}</span>
        <i class="expand-icon">{{ isExpanded ? '▼' : '▶' }}</i>
      </div>

      <div v-show="isExpanded" class="submenu">
        <menu-item
            v-for="child in menu.children"
            :key="child.id"
            :menu="child"
            @navigate="$emit('navigate', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref} from 'vue'
import {useRoute} from 'vue-router'

export default {
  name: 'MenuItem',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  emits: ['navigate'],
  setup(props) {
    const route = useRoute()
    const isExpanded = ref(false)

    const isActive = computed(() => {
      return route.path === props.menu.path
    })

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    return {
      isExpanded,
      isActive,
      toggleExpand
    }
  }
}
</script>

<style scoped>
.menu-item {
  margin-bottom: 4px;
}

.menu-link, .menu-parent {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
  margin: 0 10px;
}

.menu-link:hover, .menu-parent:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-link.active {
  background: #1890ff;
}

.menu-link i, .menu-parent i {
  margin-right: 10px;
  width: 16px;
}

.menu-parent {
  justify-content: space-between;
}

.expand-icon {
  font-size: 12px;
  transition: transform 0.3s;
}

.submenu {
  padding-left: 20px;
}

.submenu .menu-link {
  padding: 8px 20px;
  font-size: 14px;
}

.icon-default::before {
  content: '●';
}
</style>