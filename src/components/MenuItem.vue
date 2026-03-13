<template>
  <div class="menu-item">
    <!-- 目录类型或有子菜单的项 - 只展开，不导航 -->
    <div
        v-if="(menu.menuType && menu.menuType.toUpperCase() === 'M') || (menu.children && menu.children.length > 0)"
        class="menu-group"
    >
      <div
          :class="['menu-parent', { expanded: isExpanded }]"
          @click="toggleExpand"
      >
        <i :class="menu.icon || 'icon-default'"></i>
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

    <!-- 菜单类型（有实际页面）- 可导航 -->
    <div
        v-else
        :class="['menu-link', { active: isActive }]"
        @click="handleClick"
    >
      <i :class="menu.icon || 'icon-default'"></i>
      <span>{{ menu.menuName }}</span>
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
  setup(props, {emit}) {
    const route = useRoute()
    const isExpanded = ref(false)

    // 调试：打印菜单数据
    console.log('MenuItem menu:', props.menu)

    const isActive = computed(() => {
      // 使用 fullPath 进行匹配
      const menuPath = props.menu.fullPath || props.menu.path
      return route.path === menuPath
    })

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    const handleClick = () => {
      const path = props.menu.fullPath || props.menu.path
      console.log('MenuItem 点击:', {
        menuName: props.menu.menuName,
        fullPath: props.menu.fullPath,
        path: props.menu.path,
        finalPath: path,
        component: props.menu.component
      })
      // 只对有实际页面的菜单项触发导航
      if (path && props.menu.component) {
        emit('navigate', path)
      } else if (!path) {
        console.warn('菜单没有 fullPath 或 path:', props.menu)
      } else if (!props.menu.component) {
        console.warn('菜单没有 component:', props.menu)
      }
    }

    return {
      isExpanded,
      isActive,
      toggleExpand,
      handleClick
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