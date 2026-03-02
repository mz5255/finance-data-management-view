<template>
  <div class="menu-item">
    <div
        v-if="!menu.children || menu.children.length === 0"
        :class="['menu-link', { active: isActive }]"
        @click="$emit('navigate', menu.path)"
    >
      <i :class="menu.icon || 'icon-default'"></i>
      <span>{{ menu.menuName }}</span>
    </div>

    <div v-else class="menu-group">
      <div
          :class="['menu-parent', { expanded: isExpanded }]"
          @click="toggleExpand"
      >
        <i :class="menu.icon || 'icon-default'"
        ></i>
        <span>{{ menu.menuName }}</span>
        <i class="expand-icon">{{ isExpanded ? '▼' : '▶' }}</i>
      </div>

      <div v-show="isExpanded" class="submenu">
        <menu-item
            v-for="child in menu.children"
            :key="child.menuId"
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
      // 使用相对路径进行匹配
      return route.path === props.menu.path.replace('/dashboard', '')
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
  margin-bottom: 6px;
}

.menu-link, .menu-parent {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin: 0 16px;
  position: relative;
  overflow: hidden;
}

.menu-link::before, .menu-parent::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  transition: left 0.5s ease;
}

.menu-link:hover::before, .menu-parent:hover::before {
  left: 100%;
}

.menu-link:hover, .menu-parent:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateX(4px);
}

.menu-link.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.menu-link.active span {
  color: #3B82F6;
  font-weight: 600;
}

.menu-link i, .menu-parent i {
  margin-right: 12px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #60A5FA;
}

.menu-parent {
  justify-content: space-between;
}

.expand-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
  color: #60A5FA;
}

.menu-parent.expanded .expand-icon {
  transform: rotate(180deg);
}

.submenu {
  padding-left: 24px;
  margin-top: 4px;
}

.submenu .menu-link {
  padding: 10px 24px;
  font-size: 14px;
  margin: 0 16px;
}

.submenu .menu-link:hover {
  transform: translateX(8px);
}

/* Icon styles */
.icon-default::before {
  content: '●';
  color: #60A5FA;
}

.icon-system::before {
  content: '⚙️';
}

.icon-user::before {
  content: '👤';
}

.icon-permission::before {
  content: '🔒';
}

.icon-profile::before {
  content: '👨‍💼';
}
</style>